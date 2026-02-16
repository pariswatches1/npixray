import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle2,
  DollarSign,
  BookOpen,
} from "lucide-react";
import {
  getSpecialtyBySlug,
  getAllSpecialtySlugs,
  getBenchmarkForSlug,
} from "@/lib/specialty-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ specialty: string }>;
}): Promise<Metadata> {
  const { specialty: slug } = await params;
  const specialty = getSpecialtyBySlug(slug);
  if (!specialty) return { title: "Specialty Not Found" };

  return {
    title: `${specialty.name} Revenue Benchmarks — E&M Coding, CCM, RPM, AWV Data | NPIxray`,
    description: specialty.description,
    openGraph: {
      title: `${specialty.name} Revenue Benchmarks | NPIxray`,
      description: `National Medicare revenue benchmarks for ${specialty.name}: $${(specialty.avgMissedRevenue / 1000).toFixed(0)}K average missed revenue, ${specialty.totalProviders.toLocaleString()} providers nationally.`,
    },
  };
}

export function generateStaticParams() {
  return getAllSpecialtySlugs().map((specialty) => ({ specialty }));
}

export default async function SpecialtyPage({
  params,
}: {
  params: Promise<{ specialty: string }>;
}) {
  const { specialty: slug } = await params;
  const specialty = getSpecialtyBySlug(slug);
  if (!specialty) notFound();

  const benchmark = getBenchmarkForSlug(slug);

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <nav className="mb-6">
            <Link
              href="/specialties"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Specialties
            </Link>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {specialty.name}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            {specialty.description}
          </p>

          {/* Stats Row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-center">
              <p className="text-2xl font-bold font-mono text-gold">
                ${(specialty.avgMissedRevenue / 1000).toFixed(0)}K
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Avg Missed/Year
              </p>
            </div>
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-center">
              <p className="text-2xl font-bold font-mono text-gold">
                {(specialty.totalProviders / 1000).toFixed(0)}K
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                US Providers
              </p>
            </div>
            {benchmark && (
              <>
                <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-center">
                  <p className="text-2xl font-bold font-mono text-gold">
                    {benchmark.avgMedicarePatients}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                    Avg Patients
                  </p>
                </div>
                <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-center">
                  <p className="text-2xl font-bold font-mono text-gold">
                    {benchmark.avgChronicConditions.toFixed(1)}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                    Avg Chronic Dx
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">
              Specialty <span className="text-gold">Overview</span>
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {specialty.overview}
            </p>

            {/* Key Insight Box */}
            <div className="mt-6 rounded-xl border border-gold/20 bg-gold/5 p-5">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-gold">Key Insight: </span>
                <span className="text-[var(--text-secondary)]">
                  {specialty.keyInsight}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* E&M Coding Benchmark */}
      {benchmark && (
        <section className="border-t border-dark-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              E&M Coding <span className="text-gold">Distribution</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-2xl">
              National benchmark for {specialty.name} E&M code distribution.
              Compare your practice against these targets to identify coding
              optimization opportunities.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-xl">
              {[
                { code: "99213", pct: benchmark.pct99213, rate: "$92", color: "bg-amber-500" },
                { code: "99214", pct: benchmark.pct99214, rate: "$130", color: "bg-gold" },
                { code: "99215", pct: benchmark.pct99215, rate: "$176", color: "bg-emerald-500" },
              ].map((item) => (
                <div
                  key={item.code}
                  className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 text-center"
                >
                  <p className="text-lg font-bold font-mono">{item.code}</p>
                  <div className="mt-3 w-full bg-dark-500 rounded-full h-4 mb-2">
                    <div
                      className={`${item.color} h-4 rounded-full`}
                      style={{ width: `${item.pct * 100}%` }}
                    />
                  </div>
                  <p className="text-2xl font-bold font-mono text-gold">
                    {(item.pct * 100).toFixed(0)}%
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                    {item.rate}/visit
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Revenue Gap Breakdown */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Revenue Gap <span className="text-gold">Breakdown</span>
          </h2>
          <div className="space-y-4 max-w-3xl">
            {specialty.topRevenueGaps.map((gap, i) => (
              <div
                key={gap.name}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gold/50">#{i + 1}</span>
                    <h3 className="font-semibold">{gap.name}</h3>
                  </div>
                  <span className="text-lg font-bold font-mono text-gold flex-shrink-0 ml-4">
                    ${(gap.avgGap / 1000).toFixed(1)}K/yr
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {gap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Management Adoption */}
      {benchmark && (
        <section className="border-t border-dark-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Care Management <span className="text-gold">Adoption Rates</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {[
                { label: "CCM", rate: benchmark.ccmAdoptionRate, target: 0.15 },
                { label: "RPM", rate: benchmark.rpmAdoptionRate, target: 0.10 },
                { label: "BHI", rate: benchmark.bhiAdoptionRate, target: 0.10 },
                { label: "AWV", rate: benchmark.awvAdoptionRate, target: 0.70 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 text-center"
                >
                  <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold font-mono text-gold">
                    {(item.rate * 100).toFixed(0)}%
                  </p>
                  <div className="mt-2 w-full bg-dark-500 rounded-full h-2">
                    <div
                      className="bg-gold h-2 rounded-full"
                      style={{ width: `${Math.min((item.rate / item.target) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-[var(--text-secondary)] mt-1">
                    Target: {(item.target * 100).toFixed(0)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Common Conditions */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">
            Common <span className="text-gold">Chronic Conditions</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {specialty.commonConditions.map((condition) => (
              <span
                key={condition}
                className="rounded-lg border border-dark-50/80 bg-dark-400/50 px-4 py-2.5 text-sm"
              >
                {condition}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Guides */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gold" />
            Recommended Billing Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {specialty.relatedGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-xl border border-dark-50/80 bg-dark-400/30 p-4 hover:border-gold/20 transition-colors"
              >
                <p className="text-sm font-semibold group-hover:text-gold transition-colors">
                  {guide.title}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                  Read guide
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            {specialty.name} Provider?{" "}
            <span className="text-gold">See Your Gaps</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            These are national averages. Scan your NPI to see how your billing
            compares to {specialty.name} benchmarks and get a personalized
            revenue roadmap.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
          >
            <Zap className="h-5 w-5" />
            Scan Your NPI — Free
          </Link>
        </div>
      </section>
    </>
  );
}
