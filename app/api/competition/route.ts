import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

/**
 * Competition API — returns local competitors for a scanned provider.
 * GET /api/competition?npi=1234567890
 */
export async function GET(request: NextRequest) {
  const npi = request.nextUrl.searchParams.get("npi");
  if (!npi || !/^\d{10}$/.test(npi)) {
    return NextResponse.json({ error: "Valid NPI required" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DB not configured" }, { status: 500 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Get the provider
    const [provider] = await sql`SELECT * FROM providers WHERE npi = ${npi}`;
    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    // Get all same-specialty providers in same city
    const competitors = await sql`
      SELECT npi, first_name, last_name, total_beneficiaries, total_services,
             total_medicare_payment, em_99213, em_99214, em_99215, em_total,
             ccm_99490_services, rpm_99454_services, rpm_99457_services,
             bhi_99484_services, awv_g0438_services, awv_g0439_services,
             revenue_score
      FROM providers
      WHERE specialty = ${provider.specialty}
        AND city = ${provider.city}
        AND state = ${provider.state}
      ORDER BY total_medicare_payment DESC
    `;

    if (competitors.length < 2) {
      // Fall back to state-level if city has too few
      const stateCompetitors = await sql`
        SELECT npi, first_name, last_name, city, total_beneficiaries, total_services,
               total_medicare_payment, em_99213, em_99214, em_99215, em_total,
               ccm_99490_services, rpm_99454_services, rpm_99457_services,
               bhi_99484_services, awv_g0438_services, awv_g0439_services,
               revenue_score
        FROM providers
        WHERE specialty = ${provider.specialty}
          AND state = ${provider.state}
        ORDER BY total_medicare_payment DESC
        LIMIT 50
      `;
      return NextResponse.json(buildComparison(provider, stateCompetitors, "state"), {
        headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
      });
    }

    return NextResponse.json(buildComparison(provider, competitors, "city"), {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch (err) {
    console.error("[competition] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function buildComparison(provider: any, competitors: any[], scope: "city" | "state") {
  const total = competitors.length;
  const yourNpi = provider.npi;

  // Find your rank by payment
  const sortedByPayment = [...competitors].sort(
    (a, b) => (b.total_medicare_payment || 0) - (a.total_medicare_payment || 0)
  );
  const paymentRank = sortedByPayment.findIndex((c) => c.npi === yourNpi) + 1;

  // Find your rank by revenue score
  const sortedByScore = [...competitors]
    .filter((c) => c.revenue_score != null)
    .sort((a, b) => (b.revenue_score || 0) - (a.revenue_score || 0));
  const scoreRank = sortedByScore.findIndex((c) => c.npi === yourNpi) + 1;

  // Calculate averages (excluding you)
  const others = competitors.filter((c) => c.npi !== yourNpi);
  const avg = (arr: any[], key: string) => {
    const vals = arr.map((c) => Number(c[key]) || 0);
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  };

  const avgPayment = avg(others, "total_medicare_payment");
  const avgBeneficiaries = avg(others, "total_beneficiaries");
  const avgScore = avg(
    others.filter((c) => c.revenue_score != null),
    "revenue_score"
  );

  // E&M distribution comparison
  const yourEmTotal = Number(provider.em_total) || 1;
  const your214Pct = (Number(provider.em_99214) || 0) / yourEmTotal;
  const your215Pct = (Number(provider.em_99215) || 0) / yourEmTotal;
  const your213Pct = (Number(provider.em_99213) || 0) / yourEmTotal;

  const othersEm = others.map((c) => {
    const emT = Number(c.em_total) || 1;
    return {
      pct213: (Number(c.em_99213) || 0) / emT,
      pct214: (Number(c.em_99214) || 0) / emT,
      pct215: (Number(c.em_99215) || 0) / emT,
    };
  });
  const avg213 = othersEm.length > 0 ? othersEm.reduce((a, b) => a + b.pct213, 0) / othersEm.length : 0;
  const avg214 = othersEm.length > 0 ? othersEm.reduce((a, b) => a + b.pct214, 0) / othersEm.length : 0;
  const avg215 = othersEm.length > 0 ? othersEm.reduce((a, b) => a + b.pct215, 0) / othersEm.length : 0;

  // Program adoption
  const countWith = (key: string) => others.filter((c) => Number(c[key]) > 0).length;
  const ccmCount = countWith("ccm_99490_services");
  const rpmCount = others.filter(
    (c) => Number(c.rpm_99454_services) > 0 || Number(c.rpm_99457_services) > 0
  ).length;
  const bhiCount = countWith("bhi_99484_services");
  const awvCount = others.filter(
    (c) => Number(c.awv_g0438_services) > 0 || Number(c.awv_g0439_services) > 0
  ).length;

  // Top performer stats
  const topByPayment = sortedByPayment[0];
  const topByScore = sortedByScore[0];

  return {
    scope,
    location: scope === "city" ? `${provider.city}, ${provider.state}` : provider.state,
    specialty: provider.specialty,
    totalCompetitors: total,
    you: {
      npi: provider.npi,
      payment: Number(provider.total_medicare_payment) || 0,
      beneficiaries: Number(provider.total_beneficiaries) || 0,
      score: provider.revenue_score,
      paymentRank,
      scoreRank,
      em: { pct213: your213Pct, pct214: your214Pct, pct215: your215Pct },
      hasCCM: Number(provider.ccm_99490_services) > 0,
      hasRPM: Number(provider.rpm_99454_services) > 0 || Number(provider.rpm_99457_services) > 0,
      hasBHI: Number(provider.bhi_99484_services) > 0,
      hasAWV: Number(provider.awv_g0438_services) > 0 || Number(provider.awv_g0439_services) > 0,
    },
    localAvg: {
      payment: Math.round(avgPayment),
      beneficiaries: Math.round(avgBeneficiaries),
      score: Math.round(avgScore),
      em: { pct213: avg213, pct214: avg214, pct215: avg215 },
    },
    programs: {
      ccm: { count: ccmCount, total: others.length },
      rpm: { count: rpmCount, total: others.length },
      bhi: { count: bhiCount, total: others.length },
      awv: { count: awvCount, total: others.length },
    },
    topPerformer: {
      payment: Number(topByPayment?.total_medicare_payment) || 0,
      score: topByScore?.revenue_score ?? null,
    },
  };
}
