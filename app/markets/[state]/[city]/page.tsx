import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, TrendingUp, Home, ChevronRight, DollarSign,
  HeartPulse, Activity, Brain, CalendarCheck, Stethoscope,
} from "lucide-react";
import { neon } from "@neondatabase/serverless";
import {
  slugToStateAbbr,
  stateAbbrToName,
  stateToSlug,
  getCityNameFromDb,
  cityToSlug,
} from "@/lib/db-queries";
import { ScanCTA } from "@/components/seo/scan-cta";

function fmt$(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) return { title: "Not Found" };
  const stateName = stateAbbrToName(abbr);
  const cityName = await getCityNameFromDb(abbr, citySlug);
  if (!cityName) return { title: "Not Found" };
  return {
    title: `${cityName}, ${stateName} Medicare Market Opportunity 2026 | NPIxray`,
    description: `Medicare market analysis for ${cityName}, ${stateName}. See which specialties are underserved, CCM/RPM/AWV adoption gaps, and total revenue opportunity by specialty.`,
    openGraph: {
      title: `${cityName}, ${stateName} Market Opportunity`,
      url: `https://npixray.com/markets/${stateSlug}/${citySlug}`,
    },
    alternates: { canonical: `https://npixray.com/markets/${stateSlug}/${citySlug}` },
  };
}

interface SpecialtyOpportunity {
  specialty: string;
  providerCount: number;
  avgPayment: number;
  ccmBilling: number;
  rpmBilling: number;
  bhiBilling: number;
  awvBilling: number;
  ccmOpp: number;
  rpmOpp: number;
  awvOpp: number;
  totalOpp: number;
}

export default async function CityMarketPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) notFound();
  const stateName = stateAbbrToName(abbr);
  const cityName = await getCityNameFromDb(abbr, citySlug);
  if (!cityName) notFound();

  if (!process.env.DATABASE_URL) notFound();
  const sql = neon(process.env.DATABASE_URL);

  // Get specialty breakdown with program adoption
  const rows = await sql`
    SELECT
      specialty,
      COUNT(*) AS "providerCount",
      AVG(total_medicare_payment) AS "avgPayment",
      SUM(CASE WHEN ccm_99490_services > 0 THEN 1 ELSE 0 END) AS "ccmBilling",
      SUM(CASE WHEN rpm_99454_services > 0 OR rpm_99457_services > 0 THEN 1 ELSE 0 END) AS "rpmBilling",
      SUM(CASE WHEN bhi_99484_services > 0 THEN 1 ELSE 0 END) AS "bhiBilling",
      SUM(CASE WHEN awv_g0438_services > 0 OR awv_g0439_services > 0 THEN 1 ELSE 0 END) AS "awvBilling",
      SUM(total_beneficiaries) AS "totalPatients"
    FROM providers
    WHERE state = ${abbr} AND city ILIKE ${cityName}
      AND specialty != ''
    GROUP BY specialty
    HAVING COUNT(*) >= 2
    ORDER BY COUNT(*) DESC
  `;

  const specialties: SpecialtyOpportunity[] = rows.map((r: any) => {
    const count = Number(r.providerCount);
    const patients = Number(r.totalPatients) || count * 150;
    const ccmBilling = Number(r.ccmBilling);
    const rpmBilling = Number(r.rpmBilling);
    const awvBilling = Number(r.awvBilling);

    // Estimate CCM opportunity: 60% of patients chronic × $62/mo × 12 × non-CCM providers
    const ccmOpp = Math.round(patients * 0.6 * 62 * 12 * ((count - ccmBilling) / count) * 0.3);
    // RPM: 40% of patients × $106/mo × 12 × non-RPM
    const rpmOpp = Math.round(patients * 0.4 * 106 * 12 * ((count - rpmBilling) / count) * 0.2);
    // AWV: all patients × $125 × non-AWV
    const awvOpp = Math.round(patients * 125 * ((count - awvBilling) / count) * 0.5);

    return {
      specialty: r.specialty,
      providerCount: count,
      avgPayment: Number(r.avgPayment),
      ccmBilling,
      rpmBilling,
      bhiBilling: Number(r.bhiBilling),
      awvBilling,
      ccmOpp,
      rpmOpp,
      awvOpp,
      totalOpp: ccmOpp + rpmOpp + awvOpp,
    };
  });

  const totalProviders = specialties.reduce((a, s) => a + s.providerCount, 0);
  const totalOpp = specialties.reduce((a, s) => a + s.totalOpp, 0);

  // Top opportunities
  const topByOpp = [...specialties].sort((a, b) => b.totalOpp - a.totalOpp);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#2F5EA8] transition-colors"><Home className="h-3.5 w-3.5" /></Link>
        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <Link href="/markets" className="hover:text-[#2F5EA8] transition-colors">Markets</Link>
        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <Link href={`/markets/${stateSlug}`} className="hover:text-[#2F5EA8] transition-colors">{stateName}</Link>
        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <span className="text-white font-medium">{cityName}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          {cityName}, {stateName} Medicare{" "}
          <span className="text-[#2F5EA8]">Market Opportunity</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-3xl">
          {totalProviders.toLocaleString()} providers across {specialties.length} specialties.
          Estimated {fmt$(totalOpp)}/year in uncaptured revenue from CCM, RPM, and AWV programs.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-4">
          <p className="text-xs text-[var(--text-secondary)]">Total Providers</p>
          <p className="text-2xl font-bold mt-1">{totalProviders.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-4">
          <p className="text-xs text-[var(--text-secondary)]">Specialties</p>
          <p className="text-2xl font-bold mt-1">{specialties.length}</p>
        </div>
        <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-4">
          <p className="text-xs text-[#2F5EA8]">Total Opportunity</p>
          <p className="text-2xl font-bold text-[#2F5EA8] mt-1">{fmt$(totalOpp)}</p>
          <p className="text-[10px] text-[var(--text-secondary)]">estimated annual</p>
        </div>
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-4">
          <p className="text-xs text-[var(--text-secondary)]">Top Opportunity</p>
          <p className="text-lg font-bold mt-1 text-emerald-400">
            {topByOpp[0]?.specialty || "N/A"}
          </p>
        </div>
      </div>

      {/* Specialty Breakdown */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-[#2F5EA8]" />
        Specialty Breakdown
      </h2>

      <div className="space-y-4">
        {topByOpp.map((s) => {
          const ccmPct = s.providerCount > 0 ? (s.ccmBilling / s.providerCount * 100) : 0;
          const rpmPct = s.providerCount > 0 ? (s.rpmBilling / s.providerCount * 100) : 0;
          const awvPct = s.providerCount > 0 ? (s.awvBilling / s.providerCount * 100) : 0;

          return (
            <div
              key={s.specialty}
              className="rounded-xl border border-[var(--border-light)] bg-white p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold">{s.specialty}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {s.providerCount} providers • {fmt$(s.avgPayment)} avg revenue
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#2F5EA8]">{fmt$(s.totalOpp)}</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">annual opportunity</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-white/80 p-3 border border-[var(--border-light)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <HeartPulse className="h-3 w-3 text-rose-400" />
                    <span className="text-[10px] font-medium">CCM</span>
                  </div>
                  <p className="text-sm font-bold">
                    {s.ccmBilling}/{s.providerCount}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    {ccmPct.toFixed(0)}% adoption
                  </p>
                  {s.ccmOpp > 0 && (
                    <p className="text-[10px] text-[#2F5EA8] mt-1">{fmt$(s.ccmOpp)} gap</p>
                  )}
                </div>
                <div className="rounded-lg bg-white/80 p-3 border border-[var(--border-light)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Activity className="h-3 w-3 text-sky-400" />
                    <span className="text-[10px] font-medium">RPM</span>
                  </div>
                  <p className="text-sm font-bold">
                    {s.rpmBilling}/{s.providerCount}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    {rpmPct.toFixed(0)}% adoption
                  </p>
                  {s.rpmOpp > 0 && (
                    <p className="text-[10px] text-[#2F5EA8] mt-1">{fmt$(s.rpmOpp)} gap</p>
                  )}
                </div>
                <div className="rounded-lg bg-white/80 p-3 border border-[var(--border-light)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Brain className="h-3 w-3 text-purple-400" />
                    <span className="text-[10px] font-medium">BHI</span>
                  </div>
                  <p className="text-sm font-bold">
                    {s.bhiBilling}/{s.providerCount}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    {(s.providerCount > 0 ? (s.bhiBilling / s.providerCount * 100) : 0).toFixed(0)}% adoption
                  </p>
                </div>
                <div className="rounded-lg bg-white/80 p-3 border border-[var(--border-light)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CalendarCheck className="h-3 w-3 text-teal-400" />
                    <span className="text-[10px] font-medium">AWV</span>
                  </div>
                  <p className="text-sm font-bold">
                    {s.awvBilling}/{s.providerCount}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    {awvPct.toFixed(0)}% adoption
                  </p>
                  {s.awvOpp > 0 && (
                    <p className="text-[10px] text-[#2F5EA8] mt-1">{fmt$(s.awvOpp)} gap</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {specialties.length === 0 && (
        <p className="text-center text-[var(--text-secondary)] py-12">
          Not enough provider data for {cityName}, {stateName}.
        </p>
      )}

      <div className="mt-12">
        <ScanCTA />
      </div>
    </div>
  );
}
