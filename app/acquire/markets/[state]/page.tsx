import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  TrendingUp,
  ArrowRight,
  MapPin,
  Target,
  DollarSign,
  Users,
  ChevronRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { MarketStatsGrid } from "@/components/acquire/market-stats-grid";
import { AcquisitionCard } from "@/components/acquire/acquisition-card";
import { EarlyAccessCTA } from "@/components/acquire/early-access-cta";
import {
  stateAbbrToName,
  slugToStateAbbr,
  stateToSlug,
  formatCurrency,
  getStateMarketStats,
  getStateSpecialtyBreakdown,
  getAcquisitionTargets,
  getAllBenchmarks,
} from "@/lib/db-queries";
import { STATE_LIST } from "@/lib/benchmark-data";
import { calculateAcquisitionScore } from "@/lib/acquisition-utils";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return STATE_LIST.map((s) => ({ state: stateToSlug(s.abbr) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) return { title: "Market Not Found" };
  const name = stateAbbrToName(abbr);

  return {
    title: `Medical Practice Acquisition Opportunities in ${name} 2026 | NPIxray`,
    description: `Find medical practices worth acquiring in ${name}. Revenue optimization analysis, acquisition scoring, and ROI projections for healthcare PE firms and practice aggregators.`,
    alternates: {
      canonical: `https://npixray.com/acquire/markets/${slug}`,
    },
    keywords: [
      `medical practice acquisition ${name}`,
      `healthcare PE ${name}`,
      `${name} medical practices for sale`,
      `practice acquisition ${abbr}`,
      `healthcare investment ${name}`,
    ],
    openGraph: {
      title: `Acquisition Opportunities in ${name} | NPIxray`,
      description: `Data-driven acquisition intelligence for ${name} medical practices. Identify underperforming practices with massive revenue upside.`,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function StateMarketPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) notFound();
  const stateName = stateAbbrToName(abbr);

  const [marketStats, specialtyBreakdown, targets, benchmarks] = await Promise.all([
    getStateMarketStats(abbr),
    getStateSpecialtyBreakdown(abbr),
    getAcquisitionTargets({ state: abbr, minPatients: 50 }, 50),
    getAllBenchmarks(),
  ]);

  if (!marketStats || marketStats.totalProviders === 0) notFound();

  // Build benchmark map
  const benchmarkMap = new Map<string, any>();
  for (const b of benchmarks) benchmarkMap.set(b.specialty, b);

  // Calculate acquisition scores for top targets
  const scoredTargets = targets
    .map((p: any) => {
      const bench = benchmarkMap.get(p.specialty);
      if (!bench) return null;
      const score = calculateAcquisitionScore(p, bench);
      return { provider: p, score };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.score.overall - a.score.overall)
    .slice(0, 12);

  // Estimate market-level missed revenue
  const estimatedMissedRevenue = Math.round(marketStats.totalRevenue * 0.35);
  const underperformingCount = Math.round(marketStats.totalProviders * 0.42);
  const primeTargetCount = Math.round(marketStats.totalProviders * 0.12);

  // Other states for navigation
  const otherStates = STATE_LIST.filter((s) => s.abbr !== abbr).slice(0, 12);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Medical Practice Acquisition Opportunities in ${stateName}`,
    description: `Find medical practices worth acquiring in ${stateName}. Revenue analysis for ${marketStats.totalProviders} providers.`,
    url: `https://npixray.com/acquire/markets/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Acquisition Intelligence", href: "/acquire" },
              { label: stateName },
            ]}
          />

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                {stateName} Market Report
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Medical Practice Acquisition{" "}
              <span className="text-gold">Opportunities in {stateName}</span>
            </h1>

            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {marketStats.totalProviders.toLocaleString()} Medicare providers with{" "}
              {formatCurrency(marketStats.totalRevenue)} in total revenue.
              Estimated {formatCurrency(estimatedMissedRevenue)} in unrealized revenue across the state.
            </p>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketStatsGrid
            totalProviders={marketStats.totalProviders}
            totalRevenue={marketStats.totalRevenue}
            avgRevenue={Math.round(marketStats.avgRevenue)}
            estimatedMissedRevenue={estimatedMissedRevenue}
            underperformingCount={underperformingCount}
            primeTargetCount={primeTargetCount}
          />
        </div>
      </section>

      {/* Specialty Breakdown */}
      <section className="py-12 border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Specialty <span className="text-gold">Hotspots</span>
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Which specialties in {stateName} have the most acquisition upside
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-50/50">
                  <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Specialty</th>
                  <th className="text-right py-3 px-4 font-medium text-[var(--text-secondary)]">Providers</th>
                  <th className="text-right py-3 px-4 font-medium text-[var(--text-secondary)]">Avg Revenue</th>
                  <th className="text-right py-3 px-4 font-medium text-[var(--text-secondary)]">Avg Patients</th>
                  <th className="text-right py-3 px-4 font-medium text-[var(--text-secondary)]">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {specialtyBreakdown.slice(0, 15).map((spec: any, i: number) => (
                  <tr
                    key={spec.specialty}
                    className="border-b border-dark-50/30 hover:bg-dark-400/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--text-secondary)] w-5">
                          {i + 1}
                        </span>
                        <span className="font-medium">{spec.specialty}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">{spec.count.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 font-medium text-emerald-400">
                      {formatCurrency(spec.avgRevenue)}
                    </td>
                    <td className="text-right py-3 px-4">
                      {Math.round(spec.avgPatients).toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 text-gold font-medium">
                      {formatCurrency(spec.totalRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Top Acquisition Targets */}
      {scoredTargets.length > 0 && (
        <section className="py-12 border-t border-dark-50/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Top Acquisition <span className="text-gold">Targets</span> in {stateName}
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Practices with the highest acquisition upside based on patient volume, revenue gaps, and optimization potential
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {scoredTargets.map((target: any, i: number) => (
                <AcquisitionCard
                  key={target.provider.npi}
                  npi={target.provider.npi}
                  name={`${target.provider.first_name || ""} ${target.provider.last_name || ""}`.trim() || `NPI ${target.provider.npi}`}
                  specialty={target.provider.specialty}
                  state={target.provider.state}
                  city={target.provider.city}
                  patients={target.provider.total_beneficiaries || 0}
                  currentRevenue={target.provider.total_medicare_payment || 0}
                  score={target.score}
                  rank={i + 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools */}
      <section className="py-12 border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/tools/portfolio"
              className="group rounded-2xl border border-dark-50/80 bg-dark-400/30 p-6 transition-all hover:border-gold/30"
            >
              <DollarSign className="h-8 w-8 text-gold mb-3" />
              <h3 className="font-bold text-lg mb-2 group-hover:text-gold transition-colors">
                Portfolio Analysis Tool
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Enter NPIs from your target practices to see combined upside and optimization roadmap.
              </p>
            </Link>
            <Link
              href="/"
              className="group rounded-2xl border border-dark-50/80 bg-dark-400/30 p-6 transition-all hover:border-gold/30"
            >
              <Target className="h-8 w-8 text-emerald-400 mb-3" />
              <h3 className="font-bold text-lg mb-2 group-hover:text-gold transition-colors">
                Scan Individual NPI
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Get a full revenue analysis and Revenue Score for any provider.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Other States */}
      <section className="py-12 border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">Other State Markets</h2>
          <div className="flex flex-wrap gap-2">
            {otherStates.map((s) => (
              <Link
                key={s.abbr}
                href={`/acquire/markets/${stateToSlug(s.abbr)}`}
                className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-all"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access CTA */}
      <section className="py-12 border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EarlyAccessCTA
            title={`Get Acquisition Intelligence for ${stateName}`}
            subtitle={`Premium analytics for ${stateName} healthcare acquisitions. Automated deal flow, real-time scoring, and portfolio optimization.`}
          />
        </div>
      </section>
    </>
  );
}
