import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Target,
  TrendingUp,
  ArrowRight,
  MapPin,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { MarketStatsGrid } from "@/components/acquire/market-stats-grid";
import { EarlyAccessCTA } from "@/components/acquire/early-access-cta";
import {
  getAllStates,
  getAllBenchmarks,
  getNationalStats,
  formatCurrency,
} from "@/lib/db-queries";
import { STATE_LIST, SPECIALTY_LIST } from "@/lib/benchmark-data";
import { stateToSlug, specialtyToSlug } from "@/lib/db-queries";

export const metadata: Metadata = {
  title: "Medical Practice Acquisition Intelligence 2026 | NPIxray",
  description:
    "Find medical practices worth acquiring. Analyze revenue optimization potential, patient base value, and ROI projections powered by CMS Medicare data for 1.175M+ providers.",
  keywords: [
    "medical practice acquisition",
    "healthcare PE",
    "practice acquisition targets",
    "medical practice valuation",
    "healthcare private equity",
    "practice aggregation",
    "medical practice ROI",
    "healthcare acquisition intelligence",
    "CMS Medicare data acquisition",
    "practice revenue optimization",
  ],
  alternates: {
    canonical: "https://npixray.com/acquire",
  },
  openGraph: {
    title: "Medical Practice Acquisition Intelligence | NPIxray",
    description:
      "Find underperforming practices with massive revenue upside. Data-driven acquisition intelligence for PE firms, hospital systems, and practice aggregators.",
  },
};

export default async function AcquirePage() {
  const [states, benchmarks, national] = await Promise.all([
    getAllStates(),
    getAllBenchmarks(),
    getNationalStats(),
  ]);

  const totalProviders = national?.totalProviders ?? 1_175_281;
  const totalPayment = national?.totalPayment ?? 92_000_000_000;
  const avgPayment = totalProviders > 0 ? totalPayment / totalProviders : 78_000;

  // Estimate market-level opportunity
  const estimatedMissedRevenue = Math.round(totalPayment * 0.35); // ~35% of revenue is unrealized
  const estimatedUnderperforming = Math.round(totalProviders * 0.42); // ~42% score below 60
  const estimatedPrimeTargets = Math.round(totalProviders * 0.12); // ~12% are prime acquisition targets

  // Sort states by provider count
  const topStates = states
    .sort((a: any, b: any) => b.totalProviders - a.totalProviders)
    .slice(0, 12);

  // Top specialties from benchmarks by provider count
  const topSpecialties = benchmarks
    .sort((a: any, b: any) => b.provider_count - a.provider_count)
    .slice(0, 12);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Medical Practice Acquisition Intelligence",
    description:
      "Data-driven acquisition intelligence for healthcare investors, PE firms, and practice aggregators.",
    url: "https://npixray.com/acquire",
    publisher: {
      "@type": "Organization",
      name: "NPIxray",
      url: "https://npixray.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gold/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <Breadcrumbs items={[{ label: "Acquisition Intelligence" }]} />

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <Target className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                Acquisition Intelligence
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Find Medical Practices{" "}
              <span className="text-gold">Worth Acquiring</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
              Analyze {totalProviders.toLocaleString()} Medicare providers for revenue
              optimization potential. Identify underperforming practices with high
              patient volume and massive revenue upside.
            </p>
          </div>
        </div>
      </section>

      {/* National Market Stats */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketStatsGrid
            totalProviders={totalProviders}
            totalRevenue={totalPayment}
            avgRevenue={Math.round(avgPayment)}
            estimatedMissedRevenue={estimatedMissedRevenue}
            underperformingCount={estimatedUnderperforming}
            primeTargetCount={estimatedPrimeTargets}
          />
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-12">
            Why <span className="text-gold">Acquisition Intelligence</span> Matters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Identify Hidden Gems",
                description:
                  "Practices with 500+ patients but Revenue Scores below 40 represent massive upside. Our scoring pinpoints these opportunities across every state and specialty.",
                color: "text-gold",
                borderColor: "border-gold/20",
                bgColor: "bg-gold/5",
              },
              {
                icon: TrendingUp,
                title: "Quantify the Upside",
                description:
                  "Every acquisition target comes with projected optimized revenue, estimated upside, and a specific optimization roadmap. Know the ROI before you make an offer.",
                color: "text-emerald-400",
                borderColor: "border-emerald-500/20",
                bgColor: "bg-emerald-500/5",
              },
              {
                icon: Briefcase,
                title: "Portfolio-Level Analysis",
                description:
                  "Enter your existing portfolio of NPIs and see combined missed revenue, prioritized optimization actions, and practice-by-practice scoring.",
                color: "text-blue-400",
                borderColor: "border-blue-500/20",
                bgColor: "bg-blue-500/5",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border ${item.borderColor} ${item.bgColor} p-8`}
              >
                <item.icon className={`h-8 w-8 ${item.color} mb-4`} />
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="py-12 sm:py-16 border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Acquisition Markets by{" "}
                <span className="text-gold">State</span>
              </h2>
              <p className="mt-2 text-[var(--text-secondary)]">
                Browse acquisition opportunities in {STATE_LIST.length} states
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {topStates.map((state: any) => (
              <Link
                key={state.state}
                href={`/acquire/markets/${stateToSlug(state.state)}`}
                className="group rounded-xl border border-dark-50/80 bg-dark-400/30 p-4 transition-all hover:border-gold/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-3.5 w-3.5 text-[var(--text-secondary)] group-hover:text-gold transition-colors" />
                  <span className="font-bold text-sm group-hover:text-gold transition-colors">
                    {state.state}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {Number(state.totalProviders).toLocaleString()} practices
                </p>
                <p className="text-xs text-gold font-medium">
                  {formatCurrency(state.totalPayment)} revenue
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              View all {STATE_LIST.length} state markets:{" "}
              {STATE_LIST.filter((s) => !topStates.find((ts: any) => ts.state === s.abbr))
                .slice(0, 20)
                .map((s) => (
                  <Link
                    key={s.abbr}
                    href={`/acquire/markets/${stateToSlug(s.abbr)}`}
                    className="text-gold hover:underline"
                  >
                    {s.abbr}
                  </Link>
                ))
                .reduce<React.ReactNode[]>(
                  (acc, el, i) => (i === 0 ? [el] : [...acc, ", ", el]),
                  []
                )}
              {STATE_LIST.length > topStates.length + 20 && ", ..."}
            </p>
          </div>
        </div>
      </section>

      {/* Browse by Specialty */}
      <section className="py-12 sm:py-16 border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Opportunity by{" "}
              <span className="text-gold">Specialty</span>
            </h2>
            <p className="mt-2 text-[var(--text-secondary)]">
              Some specialties have significantly more acquisition upside than others
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topSpecialties.map((spec: any) => (
              <div
                key={spec.specialty}
                className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-sm">{spec.specialty}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {Number(spec.provider_count).toLocaleString()} providers nationally
                    </p>
                  </div>
                  <Building2 className="h-4 w-4 text-[var(--text-secondary)]" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">
                    Avg Revenue: {formatCurrency(spec.avg_total_payment || 0)}
                  </span>
                  <Link
                    href={`/reports/specialties/${specialtyToSlug(spec.specialty)}`}
                    className="flex items-center gap-1 text-gold hover:underline"
                  >
                    Analyze
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools CTA */}
      <section className="py-12 sm:py-16 border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/tools/portfolio"
              className="group rounded-2xl border border-dark-50/80 bg-dark-400/30 p-8 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
            >
              <Briefcase className="h-10 w-10 text-gold mb-4" />
              <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">
                Portfolio Analysis Tool
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Enter 2-20 NPIs to see combined acquisition scores, total upside
                revenue, and a prioritized optimization roadmap.
              </p>
              <span className="flex items-center gap-1 text-sm font-medium text-gold">
                Try it free
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              href="/"
              className="group rounded-2xl border border-dark-50/80 bg-dark-400/30 p-8 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
            >
              <Target className="h-10 w-10 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">
                Individual Practice Scanner
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Scan any NPI to see a full revenue analysis, Revenue Score,
                care management gaps, and optimization recommendations.
              </p>
              <span className="flex items-center gap-1 text-sm font-medium text-gold">
                Scan NPI free
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Early Access CTA */}
      <section className="py-12 sm:py-16 border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EarlyAccessCTA />
        </div>
      </section>
    </>
  );
}
