import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Users,
  DollarSign,
  UserCheck,
  TrendingUp,
  Heart,
  Wifi,
  Brain,
  Clipboard,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { ProviderTable } from "@/components/seo/provider-table";
import { StatCard } from "@/components/seo/stat-card";
import { ConfidenceBadge } from "@/components/seo/confidence-badge";
import { DataCoverage } from "@/components/seo/data-coverage";
import { InlineScanner } from "@/components/seo/inline-scanner";
import { AIInsight } from "@/components/seo/ai-insight";
import { TrendSignals } from "@/components/seo/trend-signals";
import { ReportCardHeader } from "@/components/reports/report-card-header";
import { AdoptionChart } from "@/components/reports/adoption-chart";
import { EMDistributionChart } from "@/components/reports/em-distribution-chart";
import { generateInsight } from "@/lib/ai-insights";
import {
  getAllBenchmarks,
  getBenchmarkBySpecialty,
  getSpecialtyProviders,
  specialtyToSlug,
  stateAbbrToName,
  stateToSlug,
  formatCurrency,
  formatNumber,
} from "@/lib/db-queries";
import {
  calculateGrade,
  calculateAdoptionRates,
  calculateEMDistribution,
  estimateMissedRevenueFromBenchmark,
  generateShareText,
} from "@/lib/report-utils";
import { SPECIALTY_LIST, BENCHMARKS } from "@/lib/benchmark-data";

export const revalidate = 86400; // ISR: cache at runtime for 24 hours

export function generateStaticParams() {
  return SPECIALTY_LIST.map((s) => ({
    specialty: specialtyToSlug(s),
  }));
}

async function findSpecialtyBySlug(slug: string) {
  const benchmarks = await getAllBenchmarks();
  return benchmarks.find((b) => specialtyToSlug(b.specialty) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ specialty: string }>;
}): Promise<Metadata> {
  const { specialty: slug } = await params;
  const benchmark = await findSpecialtyBySlug(slug);
  if (!benchmark) return { title: "Specialty Not Found | NPIxray" };

  return {
    title: `${benchmark.specialty} Medicare Revenue Report Card 2026 | NPIxray`,
    description: `${benchmark.specialty} earns its 2026 Medicare Revenue Report Card grade. ${formatNumber(benchmark.provider_count)} providers, ${formatCurrency(benchmark.avg_total_payment)} avg payment. See program adoption rates, E&M coding, and revenue gaps.`,
    alternates: {
      canonical: `https://npixray.com/reports/specialties/${slug}`,
    },
    keywords: [
      `${benchmark.specialty} Medicare report card`,
      `${benchmark.specialty} revenue analysis`,
      `${benchmark.specialty} billing data`,
      `${benchmark.specialty} Medicare providers`,
      "specialty revenue report card",
      "Medicare coding analysis",
    ],
    openGraph: {
      title: `${benchmark.specialty} Medicare Revenue Report Card 2026 | NPIxray`,
      description: `National Medicare report card for ${benchmark.specialty}: ${formatNumber(benchmark.provider_count)} providers analyzed. See the complete revenue analysis.`,
    },
  };
}

export default async function SpecialtyReportPage({
  params,
}: {
  params: Promise<{ specialty: string }>;
}) {
  const { specialty: slug } = await params;
  const benchmark = await findSpecialtyBySlug(slug);
  if (!benchmark) notFound();

  const [providers, allBenchmarks, insight] = await Promise.all([
    getSpecialtyProviders(benchmark.specialty, 200),
    getAllBenchmarks(),
    generateInsight({
      type: "specialty",
      specialty: benchmark.specialty,
      providerCount: benchmark.provider_count,
      avgPayment: benchmark.avg_total_payment,
      totalPayment: benchmark.avg_total_payment * benchmark.provider_count,
    }),
  ]);
  const localBenchmark = BENCHMARKS[benchmark.specialty];

  // Calculate grade from adoption rates and coding patterns
  const ccmScore = Math.min((benchmark.ccm_adoption_rate || 0) / 0.1, 1);
  const rpmScore = Math.min((benchmark.rpm_adoption_rate || 0) / 0.05, 1);
  const awvScore = Math.min((benchmark.awv_adoption_rate || 0) / 0.5, 1);
  const emScore = Math.min((benchmark.pct_99214 || 0) / 0.6, 1);
  const captureRate = (ccmScore * 0.25 + rpmScore * 0.15 + awvScore * 0.25 + emScore * 0.35) * 0.85;
  const grade = calculateGrade(captureRate);

  // Missed revenue estimate
  const missedRevenue = estimateMissedRevenueFromBenchmark(
    benchmark.provider_count,
    benchmark.avg_total_payment,
    benchmark.specialty
  );

  // Adoption rates from actual providers
  const adoption = calculateAdoptionRates(providers);
  const emDist = calculateEMDistribution(providers);

  // National average adoption rates
  const nationalAdoption = {
    ccm: allBenchmarks.length > 0
      ? allBenchmarks.reduce((s, b) => s + (b.ccm_adoption_rate || 0), 0) / allBenchmarks.length
      : 0.03,
    rpm: allBenchmarks.length > 0
      ? allBenchmarks.reduce((s, b) => s + (b.rpm_adoption_rate || 0), 0) / allBenchmarks.length
      : 0.02,
    bhi: allBenchmarks.length > 0
      ? allBenchmarks.reduce((s, b) => s + (b.bhi_adoption_rate || 0), 0) / allBenchmarks.length
      : 0.005,
    awv: allBenchmarks.length > 0
      ? allBenchmarks.reduce((s, b) => s + (b.awv_adoption_rate || 0), 0) / allBenchmarks.length
      : 0.15,
  };

  // Benchmark E&M distribution (from DB benchmark)
  const benchmarkEM = {
    pct99213: benchmark.pct_99213 || 0.3,
    pct99214: benchmark.pct_99214 || 0.55,
    pct99215: benchmark.pct_99215 || 0.08,
  };

  // Share text
  const shareText = generateShareText(
    "specialty",
    benchmark.specialty,
    formatCurrency(missedRevenue),
    grade.grade
  );
  const shareUrl = `/reports/specialties/${slug}`;

  // Adoption chart data
  const adoptionChartData = [
    { program: "CCM", actual: adoption.ccm, national: nationalAdoption.ccm },
    { program: "RPM", actual: adoption.rpm, national: nationalAdoption.rpm },
    { program: "BHI", actual: adoption.bhi, national: nationalAdoption.bhi },
    { program: "AWV", actual: adoption.awv, national: nationalAdoption.awv },
  ];

  // E&M chart data
  const emChartData = [
    { code: "99213", actual: emDist.pct99213, benchmark: benchmarkEM.pct99213 },
    { code: "99214", actual: emDist.pct99214, benchmark: benchmarkEM.pct99214 },
    { code: "99215", actual: emDist.pct99215, benchmark: benchmarkEM.pct99215 },
  ];

  // Build top states for this specialty (from providers)
  const stateMap = new Map<string, { count: number; totalPayment: number }>();
  for (const p of providers) {
    if (!p.state) continue;
    const existing = stateMap.get(p.state) || { count: 0, totalPayment: 0 };
    existing.count++;
    existing.totalPayment += p.total_medicare_payment || 0;
    stateMap.set(p.state, existing);
  }
  const topStates = Array.from(stateMap.entries())
    .map(([state, data]) => ({
      state,
      name: stateAbbrToName(state),
      slug: stateToSlug(state),
      count: data.count,
      avgPayment: data.count > 0 ? data.totalPayment / data.count : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Program details
  const programs = [
    { name: "CCM", full: "Chronic Care Management", code: "99490", rate: adoption.ccm, benchmarkRate: benchmark.ccm_adoption_rate, icon: Heart, color: "text-rose-400", target: 0.15, revenue: "$62/patient/mo" },
    { name: "RPM", full: "Remote Patient Monitoring", code: "99454/99457", rate: adoption.rpm, benchmarkRate: benchmark.rpm_adoption_rate, icon: Wifi, color: "text-blue-400", target: 0.10, revenue: "$120/patient/mo" },
    { name: "BHI", full: "Behavioral Health Integration", code: "99484", rate: adoption.bhi, benchmarkRate: benchmark.bhi_adoption_rate, icon: Brain, color: "text-purple-400", target: 0.10, revenue: "$50/patient/mo" },
    { name: "AWV", full: "Annual Wellness Visits", code: "G0438/G0439", rate: adoption.awv, benchmarkRate: benchmark.awv_adoption_rate, icon: Clipboard, color: "text-emerald-400", target: 0.70, revenue: "$175/visit" },
  ];

  // National average payment
  const nationalAvgPayment = allBenchmarks.length > 0
    ? allBenchmarks.reduce((s, b) => s + (b.avg_total_payment || 0), 0) / allBenchmarks.length
    : 0;

  // (AI insight already fetched in parallel above)

  // Trend signals using the proper TrendSignal type (needs value + delta)
  const trendSignals: { label: string; value: string; delta: number; context?: string }[] = [];
  if (nationalAvgPayment > 0) {
    const delta = ((benchmark.avg_total_payment - nationalAvgPayment) / nationalAvgPayment) * 100;
    trendSignals.push({
      label: `${benchmark.specialty} Revenue`,
      value: formatCurrency(benchmark.avg_total_payment),
      delta,
      context: `national avg ${formatCurrency(nationalAvgPayment)}`,
    });
  }
  if (nationalAdoption.ccm > 0) {
    const delta = ((adoption.ccm - nationalAdoption.ccm) / nationalAdoption.ccm) * 100;
    trendSignals.push({
      label: "CCM Adoption",
      value: `${(adoption.ccm * 100).toFixed(1)}%`,
      delta,
      context: `national ${(nationalAdoption.ccm * 100).toFixed(1)}%`,
    });
  }
  if (nationalAdoption.rpm > 0) {
    const delta = ((adoption.rpm - nationalAdoption.rpm) / nationalAdoption.rpm) * 100;
    trendSignals.push({
      label: "RPM Adoption",
      value: `${(adoption.rpm * 100).toFixed(1)}%`,
      delta,
      context: `national ${(nationalAdoption.rpm * 100).toFixed(1)}%`,
    });
  }

  // Top 20 providers for display
  const displayProviders = providers.slice(0, 20);

  return (
    <>
      {/* Hero with Grade */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Report Cards", href: "/reports" },
              { label: "Specialties", href: "/reports" },
              { label: benchmark.specialty },
            ]}
          />

          <ReportCardHeader
            grade={grade}
            entityName={benchmark.specialty}
            subtitle={`${formatNumber(benchmark.provider_count)} providers nationally`}
            reportType="specialty"
            reportId={slug}
            shareUrl={shareUrl}
            twitterText={shareText.twitter}
            linkedinText={shareText.linkedin}
          />

          {/* Key Stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Provider Count"
              value={formatNumber(benchmark.provider_count)}
              icon={Users}
            />
            <StatCard
              label="Avg Medicare Patients"
              value={formatNumber(benchmark.avg_medicare_patients)}
              icon={UserCheck}
            />
            <StatCard
              label="Avg Total Payment"
              value={formatCurrency(benchmark.avg_total_payment)}
              icon={DollarSign}
            />
            <StatCard
              label="Est. Missed Revenue"
              value={formatCurrency(missedRevenue)}
              icon={TrendingUp}
              sub="across all providers"
            />
          </div>

          <ConfidenceBadge providerCount={benchmark.provider_count} className="mt-6" />
        </div>
      </section>

      {/* Program Adoption */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">
            Care Management <span className="text-[#2F5EA8]">Program Adoption</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-2xl">
            Adoption rates for revenue-generating care management programs among {benchmark.specialty} providers
            compared to national averages.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
              <AdoptionChart data={adoptionChartData} entityLabel={benchmark.specialty} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {programs.map((p) => {
                const fillPct = Math.min((p.rate / Math.max(p.target, 0.01)) * 100, 100);
                return (
                  <div key={p.name} className="rounded-xl border border-[var(--border-light)] bg-white p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <p.icon className={`h-5 w-5 ${p.color}`} />
                      <div>
                        <p className="font-semibold text-sm">{p.name}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">{p.full}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-bold font-mono text-[#2F5EA8]">
                        {(p.rate * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        Target: {(p.target * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-[var(--bg)] rounded-full h-2 mb-2">
                      <div
                        className="bg-[#2F5EA8] h-2 rounded-full transition-all"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      {p.revenue} potential revenue
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* AI Insight */}
      {insight && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AIInsight insight={insight} label={`${benchmark.specialty} Revenue Analysis`} />
          </div>
        </section>
      )}

      {/* Trend Signals */}
      {trendSignals.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TrendSignals signals={trendSignals} title={`${benchmark.specialty} Trend Signals`} />
          </div>
        </section>
      )}

      {/* E&M Distribution */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">
            E&M Coding <span className="text-[#2F5EA8]">Distribution</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-2xl">
            How {benchmark.specialty} providers distribute their E&M visits
            across complexity levels versus the specialty benchmark.
          </p>

          <div className="max-w-2xl">
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
              <EMDistributionChart data={emChartData} entityLabel="Actual" />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { code: "99213", label: "Level 3", actual: emDist.pct99213, bench: benchmarkEM.pct99213 },
                { code: "99214", label: "Level 4", actual: emDist.pct99214, bench: benchmarkEM.pct99214 },
                { code: "99215", label: "Level 5", actual: emDist.pct99215, bench: benchmarkEM.pct99215 },
              ].map((item) => (
                <div key={item.code} className="rounded-xl border border-[var(--border-light)] bg-white p-4 text-center">
                  <p className="text-lg font-bold font-mono">{item.code}</p>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">{item.label}</p>
                  <p className="text-xl font-bold font-mono text-[#2F5EA8]">
                    {(item.actual * 100).toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    Benchmark: {(item.bench * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Revenue per Patient */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Key Revenue <span className="text-[#2F5EA8]">Metrics</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-6 text-center">
              <DollarSign className="h-6 w-6 text-[#2F5EA8] mx-auto mb-3" />
              <p className="text-3xl font-bold font-mono text-[#2F5EA8]">
                {formatCurrency(benchmark.avg_revenue_per_patient)}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Avg Revenue per Patient</p>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-6 text-center">
              <UserCheck className="h-6 w-6 text-[#2F5EA8] mx-auto mb-3" />
              <p className="text-3xl font-bold font-mono text-[#2F5EA8]">
                {formatNumber(benchmark.avg_medicare_patients)}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Avg Medicare Patients</p>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-6 text-center">
              <TrendingUp className="h-6 w-6 text-[#2F5EA8] mx-auto mb-3" />
              <p className="text-3xl font-bold font-mono text-[#2F5EA8]">
                {formatNumber(benchmark.avg_total_services)}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Avg Services per Provider</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top States */}
      {topStates.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Top States for <span className="text-[#2F5EA8]">{benchmark.specialty}</span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-[var(--border-light)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-light)] bg-white">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">#</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">State</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Providers</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Avg Payment</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {topStates.map((s, i) => (
                    <tr key={s.state} className={`border-b border-[var(--border-light)] hover:bg-white transition-colors ${i % 2 === 0 ? "bg-white" : ""}`}>
                      <td className="px-4 py-3 text-[var(--text-secondary)] font-mono text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/reports/states/${s.slug}`}
                          className="text-[#2F5EA8] hover:text-[#264D8C] font-medium transition-colors"
                        >
                          {s.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{s.count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-[#2F5EA8]">{formatCurrency(s.avgPayment)}</td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <Link
                          href={`/reports/states/${s.slug}`}
                          className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
                        >
                          View <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Top Providers */}
      {displayProviders.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">
              Top <span className="text-[#2F5EA8]">{benchmark.specialty}</span> Providers
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8">
              Top 20 {benchmark.specialty} providers by Medicare payment volume.
            </p>
            <ProviderTable providers={displayProviders} showCity={true} showSpecialty={false} />
          </div>
        </section>
      )}

      {/* Inline Scanner */}
      <section className="border-t border-[var(--border-light)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <InlineScanner specialty={benchmark.specialty} />
        </div>
      </section>

      {/* Data Coverage */}
      <section className="border-t border-[var(--border-light)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DataCoverage providerCount={benchmark.provider_count} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Report",
            name: `${benchmark.specialty} Medicare Revenue Report Card 2026`,
            description: `Annual grading of ${benchmark.specialty} on Medicare revenue capture efficiency. ${formatNumber(benchmark.provider_count)} providers analyzed nationally.`,
            url: `https://npixray.com/reports/specialties/${slug}`,
            datePublished: "2026-01-15",
            creator: {
              "@type": "Organization",
              name: "NPIxray",
              url: "https://npixray.com",
            },
            about: {
              "@type": "MedicalSpecialty",
              name: benchmark.specialty,
            },
          }),
        }}
      />
    </>
  );
}
