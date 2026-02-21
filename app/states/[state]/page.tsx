import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Building2, Users, DollarSign, TrendingUp, Activity, Stethoscope } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { ProviderTable } from "@/components/seo/provider-table";
import { StatCard } from "@/components/seo/stat-card";
import { RelatedLinks } from "@/components/seo/related-links";
import { EvidenceBlocks } from "@/components/seo/evidence-blocks";
import { ConfidenceBadge } from "@/components/seo/confidence-badge";
import { StateBenchmarkComparison } from "@/components/seo/benchmark-comparison";
import { RevenueOpportunities } from "@/components/seo/revenue-opportunities";
import { SpecialtyOpportunitiesGrid } from "@/components/seo/specialty-opportunities-grid";
import { AIInsight } from "@/components/seo/ai-insight";
import { TrendSignals, computeStateTrends } from "@/components/seo/trend-signals";
import { InlineScanner } from "@/components/seo/inline-scanner";
import { generateInsight } from "@/lib/ai-insights";
import {
  getStateStats,
  getStateSpecialties,
  getStateCities,
  getStateTopProviders,
  getStateSpecialtyProgramGaps,
  getStateProgramCounts,
  getNationalStats,
  slugToStateAbbr,
  stateAbbrToName,
  specialtyToSlug,
  cityToSlug,
  formatCurrency,
  formatNumber,
} from "@/lib/db-queries";
import { getStateComparisons } from "@/lib/comparisons";
import { getStateOpportunities } from "@/lib/opportunity-engine";
import { SPECIALTY_BENCHMARKS } from "@/lib/benchmarks";
import { DataCoverage } from "@/components/seo/data-coverage";

export const revalidate = 86400; // ISR: revalidate every 24 hours

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) return { title: "State Not Found" };

  const stats = await getStateStats(abbr);
  if (!stats || !stats.totalProviders) return { title: "State Not Found" };

  const name = stateAbbrToName(abbr);
  return {
    title: `${name} Medicare Revenue Analysis — ${formatNumber(stats.totalProviders)} Providers | NPIxray`,
    description: `${name} Medicare billing data: ${formatNumber(stats.totalProviders)} providers, ${formatCurrency(stats.totalPayment)} total payments, ${formatCurrency(stats.avgPayment)} average per provider. See top specialties, cities, and providers.`,
    alternates: {
      canonical: `https://npixray.com/states/${slug}`,
    },
    openGraph: {
      title: `${name} Medicare Revenue Analysis | NPIxray`,
      description: `Explore Medicare billing data for ${formatNumber(stats.totalProviders)} providers in ${name}. ${formatCurrency(stats.totalPayment)} in total Medicare payments.`,
    },
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) notFound();

  const stats = await getStateStats(abbr);
  if (!stats || !stats.totalProviders) notFound();

  const stateName = stateAbbrToName(abbr);

  // Run ALL queries + AI insight in parallel for fastest possible load
  const [specialties, cities, providers, comparison, opportunities, specialtyGaps, programs, nationalStats, insight] = await Promise.all([
    getStateSpecialties(abbr, 20),
    getStateCities(abbr, 30),
    getStateTopProviders(abbr, 50),
    getStateComparisons(abbr),
    getStateOpportunities(abbr),
    getStateSpecialtyProgramGaps(abbr, 10),
    getStateProgramCounts(abbr),
    getNationalStats(),
    // AI insight runs in parallel (5s timeout) — page renders even if AI is slow
    generateInsight({
      type: "state",
      stateName,
      stateAbbr: abbr,
      providerCount: stats.totalProviders,
      avgPayment: stats.avgPayment,
      totalPayment: stats.totalPayment,
    }),
  ]);

  // Compute national benchmark averages for trend signals
  const allBenchmarks = Object.values(SPECIALTY_BENCHMARKS);
  const nationalCcm = allBenchmarks.length > 0 ? allBenchmarks.reduce((s, b: any) => s + (b.ccmAdoptionRate || 0), 0) / allBenchmarks.length : 0;
  const nationalRpm = allBenchmarks.length > 0 ? allBenchmarks.reduce((s, b: any) => s + (b.rpmAdoptionRate || 0), 0) / allBenchmarks.length : 0;
  const nationalAwv = allBenchmarks.length > 0 ? allBenchmarks.reduce((s, b: any) => s + (b.awvAdoptionRate || 0), 0) / allBenchmarks.length : 0;

  const ccmAdoption = programs?.totalProviders > 0 ? programs.ccmBillers / programs.totalProviders : 0;
  const rpmAdoption = programs?.totalProviders > 0 ? programs.rpmBillers / programs.totalProviders : 0;
  const awvAdoption = programs?.totalProviders > 0 ? programs.awvBillers / programs.totalProviders : 0;

  // Layer 3: Trend signals
  const trendSignals = computeStateTrends({
    stateName,
    avgPayment: stats.avgPayment,
    totalProviders: stats.totalProviders,
    nationalAvg: nationalStats?.totalPayment && nationalStats?.totalProviders ? nationalStats.totalPayment / nationalStats.totalProviders : 0,
    nationalProviders: nationalStats?.totalProviders || 0,
    ccmAdoption,
    rpmAdoption,
    awvAdoption,
    nationalCcm,
    nationalRpm,
    nationalAwv,
  });

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "States", href: "/states" },
              { label: stateName },
            ]}
          />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.06]">
              <MapPin className="h-6 w-6 text-[#2F5EA8]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {stateName} <span className="text-[#2F5EA8]">Medicare Revenue Analysis</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                CMS Medicare Physician &amp; Other Practitioners data
              </p>
            </div>
          </div>

          {/* State Overview — Unique data-driven intro for Google ranking */}
          <div className="mt-6 max-w-3xl text-[var(--text-secondary)] leading-relaxed space-y-3">
            <p>
              {stateName} has <span className="text-[var(--text-primary)] font-medium">{formatNumber(stats.totalProviders)} Medicare providers</span> who
              collectively received <span className="text-[#2F5EA8] font-medium">{formatCurrency(stats.totalPayment)}</span> in
              Medicare payments, averaging <span className="text-[var(--text-primary)] font-medium">{formatCurrency(stats.avgPayment)} per provider</span>.
              {stats.avgPayment > 100000
                ? ` This places ${stateName} above the national average in per-provider Medicare revenue, suggesting a competitive healthcare market with strong reimbursement patterns.`
                : stats.avgPayment > 60000
                ? ` ${stateName} providers earn moderate Medicare revenue per provider, with significant opportunity to capture additional revenue through program enrollment and coding optimization.`
                : ` With below-average per-provider Medicare revenue, ${stateName} practices may have substantial untapped potential in care management programs and E&M coding optimization.`}
            </p>
            {specialties.length > 0 && (
              <p>
                The most common specialty is{" "}
                <span className="text-[var(--text-primary)] font-medium">{specialties[0].specialty}</span>{" "}
                with {specialties[0].count.toLocaleString()} providers
                {specialties.length > 1 && (
                  <>, followed by {specialties[1].specialty} ({specialties[1].count.toLocaleString()}) and {specialties.length > 2 ? `${specialties[2].specialty} (${specialties[2].count.toLocaleString()})` : ""}</>
                )}.
                {specialties[0].avgPayment > 100000
                  ? ` ${specialties[0].specialty} providers in ${stateName} average ${formatCurrency(specialties[0].avgPayment)} in annual Medicare payments — a high-revenue specialty that often benefits from E&M coding optimization and care management program enrollment.`
                  : ` ${specialties[0].specialty} providers in ${stateName} average ${formatCurrency(specialties[0].avgPayment)} annually, with room to grow through CCM, RPM, and AWV program adoption.`}
              </p>
            )}
            {cities.length > 0 && (
              <p>
                The largest Medicare provider concentration is in{" "}
                <span className="text-[var(--text-primary)] font-medium">{cities[0].city}</span>{" "}
                ({cities[0].count.toLocaleString()} providers)
                {cities.length > 1 && (
                  <>, with {cities[1].city} and {cities.length > 2 ? cities[2].city : ""} also serving as major healthcare hubs</>
                )}.
                {" "}Practices in these areas face competitive pressure, making revenue optimization through proper coding and program enrollment critical for financial performance.
              </p>
            )}
          </div>

          <DataCoverage providerCount={stats.totalProviders} className="mt-4" />

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Total Providers"
              value={formatNumber(stats.totalProviders)}
              icon={Users}
              sub={`in ${stateName}`}
            />
            <StatCard
              label="Total Medicare Payment"
              value={formatCurrency(stats.totalPayment)}
              icon={DollarSign}
            />
            <StatCard
              label="Avg Payment / Provider"
              value={formatCurrency(stats.avgPayment)}
              icon={TrendingUp}
            />
            <StatCard
              label="Total Services"
              value={formatNumber(stats.totalServices)}
              icon={Activity}
            />
          </div>
        </div>
      </section>

      {/* ── Layer 1: AI-Generated Unique Insight ──────────── */}
      {insight && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AIInsight insight={insight} label={`${stateName} Medicare Analysis`} />
          </div>
        </section>
      )}

      {/* ── Layer 3: Trend Signals ─────────────────────────── */}
      {trendSignals.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TrendSignals signals={trendSignals} title={`${stateName} Performance Signals`} />
          </div>
        </section>
      )}

      {/* ── Differentiation Layers ─────────────────────────── */}
      <section className="border-t border-[var(--border-light)] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Layer A: Evidence Blocks — snippet-friendly data boxes */}
          <EvidenceBlocks
            keyStats={[
              { label: "Total Providers", value: formatNumber(stats.totalProviders), subtext: stateName },
              { label: "Avg Medicare Payment", value: formatCurrency(stats.avgPayment), subtext: "per provider" },
              { label: "Total Medicare Payments", value: formatCurrency(stats.totalPayment) },
              ...(specialties.length > 0
                ? [{ label: "Top Specialty", value: specialties[0].specialty, subtext: `${specialties[0].count.toLocaleString()} providers` }]
                : []),
            ]}
            comparison={comparison ? {
              nationalRank: comparison.nationalRank,
              totalStates: comparison.totalStates,
              deltaVsNational: comparison.avgPaymentDelta,
              entityLabel: `${stateName} Medicare Revenue`,
            } : null}
            opportunities={opportunities}
          />

          {/* Layer B: Confidence Badge — data trustworthiness */}
          <ConfidenceBadge providerCount={stats.totalProviders} />

          {/* Layer 2: Benchmark Comparison — neighbor bars + national rank */}
          {comparison && (
            <StateBenchmarkComparison
              stateName={stateName}
              comparison={comparison}
            />
          )}

          {/* Layer 3: Revenue Opportunities — top 3 program gaps */}
          {opportunities.length > 0 && (
            <RevenueOpportunities
              opportunities={opportunities}
              title={`Top Revenue Opportunities in ${stateName}`}
            />
          )}

          {/* Layer 4: Specialty Opportunities Grid — specialties with biggest gaps */}
          {specialtyGaps.length > 0 && (
            <SpecialtyOpportunitiesGrid
              gaps={specialtyGaps}
              stateSlug={slug}
            />
          )}
        </div>
      </section>

      {/* Top Specialties */}
      {specialties.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Top Specialties in <span className="text-[#2F5EA8]">{stateName}</span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-[var(--border-light)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-light)] bg-white">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Specialty</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Providers</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Avg Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {specialties.map((s, i) => (
                    <tr key={s.specialty} className={`border-b border-[var(--border-light)] hover:bg-white transition-colors ${i % 2 === 0 ? "bg-white" : ""}`}>
                      <td className="px-4 py-3">
                        <Link
                          href={`/states/${slug}/specialties/${specialtyToSlug(s.specialty)}`}
                          className="text-[#2F5EA8] hover:text-[#264D8C] font-medium transition-colors"
                        >
                          {s.specialty}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{s.count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-[#2F5EA8]">{formatCurrency(s.avgPayment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Top Cities */}
      {cities.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Top Cities in <span className="text-[#2F5EA8]">{stateName}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cities.map((c, i) => (
                <Link
                  key={c.city}
                  href={`/states/${slug}/${cityToSlug(c.city)}`}
                  className="group rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/10 hover:shadow-lg hover:shadow-[#2F5EA8]/[0.04] transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-[var(--text-secondary)]" />
                    <span className="text-xs text-[#4FA3D1] font-mono">#{i + 1}</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-[#2F5EA8] transition-colors mb-1">
                    {c.city}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-[#2F5EA8]">{c.count.toLocaleString()} providers</span>
                    <span className="text-[var(--text-secondary)]">{formatCurrency(c.avgPayment)} avg</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Providers */}
      {providers.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Top 50 Providers in <span className="text-[#2F5EA8]">{stateName}</span>
            </h2>
            <ProviderTable providers={providers} showCity={true} showSpecialty={true} />
          </div>
        </section>
      )}

      {/* ── Layer 5: Interactive Scanner Widget ──────────── */}
      <section className="border-t border-[var(--border-light)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <InlineScanner state={stateName} />
        </div>
      </section>

      {/* Related Links */}
      <RelatedLinks pageType="state" currentSlug={slug} context={{ state: slug }} />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA state={stateName} />
      </section>
    </>
  );
}
