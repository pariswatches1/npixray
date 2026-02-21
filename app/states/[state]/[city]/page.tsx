import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Building2, Users, DollarSign, TrendingUp, Stethoscope } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { ProviderTable } from "@/components/seo/provider-table";
import { StatCard } from "@/components/seo/stat-card";
import { AIInsight } from "@/components/seo/ai-insight";
import { TrendSignals, computeStateTrends } from "@/components/seo/trend-signals";
import { InlineScanner } from "@/components/seo/inline-scanner";
import { generateInsight } from "@/lib/ai-insights";
import {
  getCityStats,
  getCityProviders,
  getCitySpecialties,
  getCityNameFromDb,
  getStateStats,
  getNationalStats,
  slugToStateAbbr,
  stateAbbrToName,
  stateToSlug,
  formatCurrency,
  formatNumber,
} from "@/lib/db-queries";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // ISR: cache at runtime for 24 hours

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) return { title: "City Not Found" };

  const cityName = await getCityNameFromDb(abbr, citySlug);
  if (!cityName) return { title: "City Not Found" };

  const stats = await getCityStats(abbr, cityName);
  if (!stats || !stats.count) return { title: "City Not Found" };

  const stateName = stateAbbrToName(abbr);
  return {
    title: `${cityName}, ${stateName} Medicare Providers — Revenue Data | NPIxray`,
    description: `${cityName}, ${abbr} Medicare provider data: ${stats.count} providers, ${formatCurrency(stats.totalPayment)} total payments, ${formatCurrency(stats.avgPayment)} average per provider. See all specialties and providers.`,
    alternates: {
      canonical: `https://npixray.com/states/${stateSlug}/${citySlug}`,
    },
    openGraph: {
      title: `${cityName}, ${stateName} Medicare Providers | NPIxray`,
      description: `Explore Medicare billing data for ${stats.count} providers in ${cityName}, ${abbr}.`,
    },
    // noindex thin city pages with fewer than 20 providers (crawl budget hygiene)
    robots: stats.count < 20 ? { index: false, follow: true } : undefined,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) notFound();

  const cityName = await getCityNameFromDb(abbr, citySlug);
  if (!cityName) notFound();

  const stats = await getCityStats(abbr, cityName);
  if (!stats || !stats.count) notFound();

  const stateName = stateAbbrToName(abbr);
  const [specialties, providers, stateStats, nationalStats, insight] = await Promise.all([
    getCitySpecialties(abbr, cityName),
    getCityProviders(abbr, cityName, 100),
    getStateStats(abbr),
    getNationalStats(),
    generateInsight({
      type: "city",
      stateName: stateAbbrToName(abbr),
      stateAbbr: abbr,
      city: cityName,
      providerCount: stats.count,
      avgPayment: stats.avgPayment,
      totalPayment: stats.totalPayment,
    }),
  ]);

  const nationalAvg = nationalStats?.totalPayment && nationalStats?.totalProviders
    ? nationalStats.totalPayment / nationalStats.totalProviders
    : 0;

  // Layer 3: Trend signals (city vs state/national)
  const trendSignals = computeStateTrends({
    stateName: `${cityName}, ${abbr}`,
    avgPayment: stats.avgPayment,
    totalProviders: stats.count,
    nationalAvg,
    nationalProviders: nationalStats?.totalProviders || 0,
  });

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "States", href: "/states" },
              { label: stateName, href: `/states/${stateSlug}` },
              { label: cityName },
            ]}
          />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.06]">
              <Building2 className="h-6 w-6 text-[#2F5EA8]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {cityName}, {abbr}{" "}
                <span className="text-[#2F5EA8]">Medicare Providers</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                CMS Medicare Physician &amp; Other Practitioners data
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard
              label="Provider Count"
              value={formatNumber(stats.count)}
              icon={Users}
              sub={`in ${cityName}, ${abbr}`}
            />
            <StatCard
              label="Avg Payment / Provider"
              value={formatCurrency(stats.avgPayment)}
              icon={TrendingUp}
            />
            <StatCard
              label="Total Medicare Payment"
              value={formatCurrency(stats.totalPayment)}
              icon={DollarSign}
            />
          </div>
        </div>
      </section>

      {/* ── Layer 1: AI-Generated Unique Insight ──────────── */}
      {insight && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AIInsight insight={insight} label={`${cityName}, ${abbr} Medicare Analysis`} />
          </div>
        </section>
      )}

      {/* ── Layer 3: Trend Signals ─────────────────────────── */}
      {trendSignals.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TrendSignals signals={trendSignals} title={`${cityName}, ${abbr} — Performance Signals`} />
          </div>
        </section>
      )}

      {/* Specialties Breakdown */}
      {specialties.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Specialties in{" "}
              <span className="text-[#2F5EA8]">{cityName}, {abbr}</span>
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
                    <tr
                      key={s.specialty}
                      className={`border-b border-[var(--border-light)] hover:bg-white transition-colors ${i % 2 === 0 ? "bg-white" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium">{s.specialty}</span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {s.count.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-[#2F5EA8]">
                        {formatCurrency(s.avgPayment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* All Providers */}
      {providers.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              All Providers in{" "}
              <span className="text-[#2F5EA8]">{cityName}, {abbr}</span>
            </h2>
            <ProviderTable providers={providers} showCity={false} showSpecialty={true} />
          </div>
        </section>
      )}

      {/* ── Layer 5: Interactive Scanner Widget ──────────── */}
      <section className="border-t border-[var(--border-light)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <InlineScanner state={stateName} city={cityName} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
