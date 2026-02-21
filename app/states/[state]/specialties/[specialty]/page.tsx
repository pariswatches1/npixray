import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Users, DollarSign, TrendingUp, Stethoscope, Activity } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { ProviderTable } from "@/components/seo/provider-table";
import { StatCard } from "@/components/seo/stat-card";
import { EvidenceBlocks } from "@/components/seo/evidence-blocks";
import { ConfidenceBadge } from "@/components/seo/confidence-badge";
import { SpecialtyBenchmarkComparison } from "@/components/seo/benchmark-comparison";
import { RevenueOpportunities } from "@/components/seo/revenue-opportunities";
import { DataCoverage } from "@/components/seo/data-coverage";
import {
  getSpecialtyByState,
  getSpecialtyStateProviders,
  getAllBenchmarks,
  slugToStateAbbr,
  stateAbbrToName,
  stateToSlug,
  specialtyToSlug,
  slugToSpecialtyName,
  formatCurrency,
  formatNumber,
} from "@/lib/db-queries";
import { getStateSpecialtyComparisons } from "@/lib/comparisons";
import { getStateSpecialtyOpportunities } from "@/lib/opportunity-engine";
import { AIInsight } from "@/components/seo/ai-insight";
import { TrendSignals, computeSpecialtyTrends } from "@/components/seo/trend-signals";
import { InlineScanner } from "@/components/seo/inline-scanner";
import { generateInsight } from "@/lib/ai-insights";
import { SPECIALTY_BENCHMARKS } from "@/lib/benchmarks";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // ISR: cache at runtime for 24 hours

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; specialty: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, specialty: specSlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) return { title: "Not Found" };

  const specialtyName = await slugToSpecialtyName(specSlug);
  if (!specialtyName) return { title: "Not Found" };

  const stats = await getSpecialtyByState(specialtyName, abbr);
  if (!stats || !stats.count) return { title: "Not Found" };

  const stateName = stateAbbrToName(abbr);
  return {
    title: `${specialtyName} in ${stateName} — ${formatNumber(stats.count)} Providers | NPIxray`,
    description: `${specialtyName} Medicare data in ${stateName}: ${formatNumber(stats.count)} providers, ${formatCurrency(stats.totalPayment)} total payments, ${formatCurrency(stats.avgPayment)} average per provider. Compare to national benchmarks and neighboring states.`,
    alternates: {
      canonical: `https://npixray.com/states/${stateSlug}/specialties/${specSlug}`,
    },
    openGraph: {
      title: `${specialtyName} in ${stateName} | NPIxray`,
      description: `Explore ${specialtyName} Medicare billing data for ${formatNumber(stats.count)} providers in ${stateName}.`,
    },
  };
}

export default async function StateSpecialtyPage({
  params,
}: {
  params: Promise<{ state: string; specialty: string }>;
}) {
  const { state: stateSlug, specialty: specSlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) notFound();

  const specialtyName = await slugToSpecialtyName(specSlug);
  if (!specialtyName) notFound();

  const stats = await getSpecialtyByState(specialtyName, abbr);
  if (!stats || !stats.count) notFound();

  const stateName = stateAbbrToName(abbr);

  // Parallel data fetching — all layers at once (including AI insight)
  const [providers, benchmarks, comparison, opportunities, insight] = await Promise.all([
    getSpecialtyStateProviders(specialtyName, abbr, 50),
    getAllBenchmarks(),
    getStateSpecialtyComparisons(specialtyName, abbr),
    getStateSpecialtyOpportunities(specialtyName, abbr),
    generateInsight({
      type: "state-specialty",
      stateName,
      stateAbbr: abbr,
      specialty: specialtyName,
      providerCount: stats.count,
      avgPayment: stats.avgPayment,
      totalPayment: stats.totalPayment,
    }),
  ]);

  const nationalBenchmark = benchmarks.find(
    (b: any) => specialtyToSlug(b.specialty) === specSlug
  );
  const nationalAvg = nationalBenchmark?.avg_total_payment ?? null;

  // National benchmark adoption rates for this specialty
  const specBenchmark = SPECIALTY_BENCHMARKS[specialtyName] || null;
  const nationalCcm = specBenchmark?.ccmAdoptionRate ?? 0;
  const nationalRpm = specBenchmark?.rpmAdoptionRate ?? 0;
  const nationalAwv = specBenchmark?.awvAdoptionRate ?? 0;

  // Compute specialty adoption rates from comparison data
  const ccmAdoption = specBenchmark?.ccmAdoptionRate ?? 0;
  const rpmAdoption = specBenchmark?.rpmAdoptionRate ?? 0;
  const awvAdoption = specBenchmark?.awvAdoptionRate ?? 0;

  // Layer 3: Trend signals for this specialty in this state
  const trendSignals = computeSpecialtyTrends({
    specialty: specialtyName,
    stateName,
    avgPayment: stats.avgPayment,
    providerCount: stats.count,
    nationalAvg: nationalAvg ?? 0,
    percentile: comparison?.percentilePosition,
    ccmAdoption,
    rpmAdoption,
    nationalCcm,
    nationalRpm,
  });

  let comparisonText = "";
  if (nationalAvg && nationalAvg > 0) {
    const diff = ((stats.avgPayment - nationalAvg) / nationalAvg) * 100;
    const direction = diff >= 0 ? "more" : "less";
    comparisonText = `${stateName} ${specialtyName} providers earn ${Math.abs(diff).toFixed(0)}% ${direction} than the national average of ${formatCurrency(nationalAvg)}.`;
  }

  // Build evidence block data
  const keyStats = [
    { label: `${specialtyName} providers in ${stateName}`, value: formatNumber(stats.count) },
    { label: "Average Medicare payment per provider", value: formatCurrency(stats.avgPayment) },
    { label: "Total Medicare payments", value: formatCurrency(stats.totalPayment) },
  ];

  const comparisonData = comparison
    ? {
        nationalRank: comparison.nationalSpecialtyRank,
        totalStates: comparison.totalStatesWithSpecialty,
        deltaVsNational: comparison.vsNationalBenchmark?.avgPaymentDelta ?? 0,
        entityLabel: `${specialtyName} in ${stateName}`,
      }
    : null;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "States", href: "/states" },
              { label: stateName, href: `/states/${stateSlug}` },
              { label: "Specialties" },
              { label: specialtyName },
            ]}
          />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.06]">
              <Stethoscope className="h-6 w-6 text-[#2F5EA8]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {specialtyName} in{" "}
                <span className="text-[#2F5EA8]">{stateName}</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                CMS Medicare Physician &amp; Other Practitioners data
              </p>
            </div>
          </div>

          {/* Comparison callout */}
          {comparisonText && (
            <div className="mt-4 rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-5">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-[#2F5EA8]">Key Insight: </span>
                <span className="text-[var(--text-secondary)]">
                  {comparisonText}
                </span>
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard
              label="Provider Count"
              value={formatNumber(stats.count)}
              icon={Users}
              sub={`${specialtyName} in ${stateName}`}
            />
            <StatCard
              label="Avg Payment / Provider"
              value={formatCurrency(stats.avgPayment)}
              icon={TrendingUp}
            />
            {nationalAvg && nationalAvg > 0 && (
              <StatCard
                label="vs National Avg"
                value={formatCurrency(nationalAvg)}
                icon={Activity}
                sub={`National benchmark for ${specialtyName}`}
              />
            )}
          </div>

          {/* Confidence Badge */}
          <ConfidenceBadge
            providerCount={stats.count}
            className="mt-6"
          />
        </div>
      </section>

      {/* Evidence Blocks — snippet-friendly data summary */}
      <section className="border-t border-[var(--border-light)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EvidenceBlocks
            keyStats={keyStats}
            comparison={comparisonData}
            opportunities={opportunities}
          />
        </div>
      </section>

      {/* ── Layer 1: AI-Generated Unique Insight ──────────── */}
      {insight && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AIInsight insight={insight} label={`${specialtyName} in ${stateName} Analysis`} />
          </div>
        </section>
      )}

      {/* ── Layer 3: Trend Signals ─────────────────────────── */}
      {trendSignals.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TrendSignals signals={trendSignals} title={`${specialtyName} in ${stateName} — Performance Signals`} />
          </div>
        </section>
      )}

      {/* Benchmark Comparison — state vs neighbors for this specialty */}
      {comparison && comparison.neighborComparisons.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SpecialtyBenchmarkComparison
              specialty={specialtyName}
              stateName={stateName}
              stateAbbr={abbr}
              neighbors={comparison.neighborComparisons}
              nationalRank={comparison.nationalSpecialtyRank}
              totalStates={comparison.totalStatesWithSpecialty}
              percentile={comparison.percentilePosition}
              avgPayment={stats.avgPayment}
              vsNational={comparison.vsNationalBenchmark}
            />
          </div>
        </section>
      )}

      {/* Revenue Opportunities — top 3 specific gaps */}
      {opportunities.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RevenueOpportunities
              opportunities={opportunities}
              title={`Top Revenue Opportunities for ${specialtyName} in ${stateName}`}
            />
          </div>
        </section>
      )}

      {/* Top Providers */}
      {providers.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Top {specialtyName} Providers in{" "}
              <span className="text-[#2F5EA8]">{stateName}</span>
            </h2>
            <ProviderTable providers={providers} showCity={true} showSpecialty={false} />
          </div>
        </section>
      )}

      {/* Data attribution */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <DataCoverage providerCount={stats.count} />
      </section>

      {/* ── Layer 5: Interactive Scanner Widget ──────────── */}
      <section className="border-t border-[var(--border-light)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <InlineScanner state={stateName} specialty={specialtyName} />
        </div>
      </section>

      {/* CTA — pre-filtered */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA state={stateName} specialty={specialtyName} />
      </section>
    </>
  );
}
