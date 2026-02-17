import { NextRequest, NextResponse } from "next/server";
import { getProvider, getBenchmarkBySpecialty, getProviderCodeCount } from "@/lib/db-queries";
import { calculateRevenueScore, estimatePercentile } from "@/lib/revenue-score";

export async function GET(request: NextRequest) {
  const npi = request.nextUrl.searchParams.get("npi");
  if (!npi || npi.length !== 10) {
    return NextResponse.json({ error: "Valid 10-digit NPI required" }, { status: 400 });
  }

  const provider = await getProvider(npi);
  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  const [benchmark, codeCount] = await Promise.all([
    getBenchmarkBySpecialty(provider.specialty),
    getProviderCodeCount(npi),
  ]);

  if (!benchmark) {
    return NextResponse.json({ error: "No benchmark for specialty" }, { status: 404 });
  }

  const score = calculateRevenueScore(provider, benchmark, codeCount);
  const percentile = estimatePercentile(score.overall);

  return NextResponse.json({
    provider: {
      npi: provider.npi,
      name: `Dr. ${provider.first_name} ${provider.last_name}`,
      specialty: provider.specialty,
      state: provider.state,
      city: provider.city,
    },
    score: {
      overall: score.overall,
      label: score.label,
      hexColor: score.hexColor,
      percentile,
      breakdown: score.breakdown,
    },
  }, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
