import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Users, DollarSign, UserCheck, BarChart3, Heart, Activity, Brain, Clipboard } from "lucide-react";
import {
  getAllBenchmarks,
  getBenchmarkBySpecialty,
  getSpecialtyProviders,
  formatCurrency,
  formatNumber,
  specialtyToSlug,
} from "@/lib/db-queries";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StatCard } from "@/components/seo/stat-card";
import { ProviderTable } from "@/components/seo/provider-table";
import { ScanCTA } from "@/components/seo/scan-cta";
import { RelatedLinks } from "@/components/seo/related-links";
import { EvidenceBlocks } from "@/components/seo/evidence-blocks";
import { ConfidenceBadge } from "@/components/seo/confidence-badge";
import { DataCoverage } from "@/components/seo/data-coverage";
import { AIInsight } from "@/components/seo/ai-insight";
import { TrendSignals } from "@/components/seo/trend-signals";
import { InlineScanner } from "@/components/seo/inline-scanner";
import { generateInsight } from "@/lib/ai-insights";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // ISR: cache at runtime for 24 hours

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
    title: `${benchmark.specialty} Medicare Analysis — ${formatNumber(benchmark.provider_count)} Providers | NPIxray`,
    description: `Medicare revenue analysis for ${benchmark.specialty}: ${formatNumber(benchmark.provider_count)} providers, ${formatCurrency(benchmark.avg_total_payment)} avg payment, ${(benchmark.ccm_adoption_rate * 100).toFixed(0)}% CCM adoption. See E&M coding and care management data.`,
    alternates: {
      canonical: `https://npixray.com/specialties/${slug}`,
    },
    openGraph: {
      title: `${benchmark.specialty} Medicare Analysis | NPIxray`,
      description: `National Medicare data for ${benchmark.specialty}: ${formatNumber(benchmark.provider_count)} providers with ${formatCurrency(benchmark.avg_total_payment)} average total payment.`,
    },
  };
}

export default async function SpecialtyPage({
  params,
}: {
  params: Promise<{ specialty: string }>;
}) {
  const { specialty: slug } = await params;
  const benchmark = await findSpecialtyBySlug(slug);
  if (!benchmark) notFound();

  // Run providers query + AI insight in parallel for fastest load
  const [providers, insight] = await Promise.all([
    getSpecialtyProviders(benchmark.specialty, 50),
    generateInsight({
      type: "specialty",
      specialty: benchmark.specialty,
      providerCount: benchmark.provider_count,
      avgPayment: benchmark.avg_total_payment,
      totalPayment: benchmark.avg_total_payment * benchmark.provider_count,
      ccmAdoption: benchmark.ccm_adoption_rate,
      rpmAdoption: benchmark.rpm_adoption_rate,
      awvAdoption: benchmark.awv_adoption_rate,
      bhiAdoption: benchmark.bhi_adoption_rate,
    }),
  ]);

  // Layer 3: Trend signals for this specialty (vs benchmark targets)
  const trendSignals: { label: string; value: string; delta: number; context?: string }[] = [];

  // CCM adoption vs 15% target
  if (benchmark.ccm_adoption_rate !== undefined) {
    const target = 0.15;
    const delta = target > 0 ? ((benchmark.ccm_adoption_rate - target) / target) * 100 : 0;
    trendSignals.push({
      label: "CCM Adoption",
      value: `${(benchmark.ccm_adoption_rate * 100).toFixed(1)}%`,
      delta,
      context: `target ${(target * 100).toFixed(0)}%`,
    });
  }

  // RPM adoption vs 10% target
  if (benchmark.rpm_adoption_rate !== undefined) {
    const target = 0.10;
    const delta = target > 0 ? ((benchmark.rpm_adoption_rate - target) / target) * 100 : 0;
    trendSignals.push({
      label: "RPM Adoption",
      value: `${(benchmark.rpm_adoption_rate * 100).toFixed(1)}%`,
      delta,
      context: `target ${(target * 100).toFixed(0)}%`,
    });
  }

  // AWV adoption vs 70% target
  if (benchmark.awv_adoption_rate !== undefined) {
    const target = 0.70;
    const delta = target > 0 ? ((benchmark.awv_adoption_rate - target) / target) * 100 : 0;
    trendSignals.push({
      label: "AWV Completion",
      value: `${(benchmark.awv_adoption_rate * 100).toFixed(1)}%`,
      delta,
      context: `target ${(target * 100).toFixed(0)}%`,
    });
  }

  // Revenue per patient signal
  if (benchmark.avg_revenue_per_patient > 0) {
    const medianRPP = 300; // rough national median
    const delta = ((benchmark.avg_revenue_per_patient - medianRPP) / medianRPP) * 100;
    trendSignals.push({
      label: "Revenue / Patient",
      value: `$${Math.round(benchmark.avg_revenue_per_patient).toLocaleString()}`,
      delta,
      context: `median ~$${medianRPP}`,
    });
  }

  // E&M distribution data
  const emTotal = benchmark.pct_99213 + benchmark.pct_99214 + benchmark.pct_99215;
  const emData = [
    { code: "99213", pct: benchmark.pct_99213, color: "bg-amber-500", label: "Level 3" },
    { code: "99214", pct: benchmark.pct_99214, color: "bg-[#2F5EA8]", label: "Level 4" },
    { code: "99215", pct: benchmark.pct_99215, color: "bg-emerald-500", label: "Level 5" },
  ];

  // Program adoption data
  const programs = [
    { name: "CCM", fullName: "Chronic Care Management", rate: benchmark.ccm_adoption_rate, target: 0.15, icon: Heart, color: "text-rose-400" },
    { name: "RPM", fullName: "Remote Patient Monitoring", rate: benchmark.rpm_adoption_rate, target: 0.10, icon: Activity, color: "text-blue-400" },
    { name: "BHI", fullName: "Behavioral Health Integration", rate: benchmark.bhi_adoption_rate, target: 0.10, icon: Brain, color: "text-purple-400" },
    { name: "AWV", fullName: "Annual Wellness Visits", rate: benchmark.awv_adoption_rate, target: 0.70, icon: Clipboard, color: "text-emerald-400" },
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Specialties", href: "/specialties" },
              { label: benchmark.specialty },
            ]}
          />

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            {benchmark.specialty}
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Medicare Revenue Analysis
          </p>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
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
              label="Avg Revenue/Patient"
              value={formatCurrency(benchmark.avg_revenue_per_patient)}
              icon={DollarSign}
              sub="per Medicare beneficiary"
            />
          </div>
        </div>
      </section>

      {/* ── Differentiation Layers ─────────────────────────── */}
      <section className="border-t border-[var(--border-light)] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Layer A: Evidence Blocks — snippet-friendly data boxes */}
          <EvidenceBlocks
            keyStats={[
              { label: "National Provider Count", value: formatNumber(benchmark.provider_count) },
              { label: "Avg Total Medicare Payment", value: formatCurrency(benchmark.avg_total_payment), subtext: "per provider" },
              { label: "Avg Medicare Patients", value: formatNumber(benchmark.avg_medicare_patients), subtext: "per provider" },
              { label: "Avg Revenue per Patient", value: formatCurrency(benchmark.avg_revenue_per_patient) },
            ]}
            comparison={null}
            opportunities={[]}
          />

          {/* Layer B: Confidence Badge — data trustworthiness */}
          <ConfidenceBadge
            providerCount={benchmark.provider_count}
            dataSource="CMS Medicare Public Data 2024 — National Specialty Benchmarks"
          />
        </div>
      </section>

      {/* ── Layer 1: AI-Generated Unique Insight ──────────── */}
      {insight && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AIInsight insight={insight} label={`${benchmark.specialty} Medicare Analysis`} />
          </div>
        </section>
      )}

      {/* ── Layer 3: Trend Signals ─────────────────────────── */}
      {trendSignals.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TrendSignals signals={trendSignals} title={`${benchmark.specialty} — Performance Signals`} />
          </div>
        </section>
      )}

      {/* Data-Driven Specialty Intro */}
      <section className="border-t border-[var(--border-light)] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-3xl text-[var(--text-secondary)] leading-relaxed space-y-4 text-[15px]">
            <p>
              {benchmark.specialty} is one of the most active Medicare specialties in the United States
              {benchmark.provider_count >= 10000
                ? `, with ${formatNumber(benchmark.provider_count)} providers billing Medicare nationally.`
                : benchmark.provider_count >= 1000
                ? `, represented by ${formatNumber(benchmark.provider_count)} providers across the country.`
                : `, with a focused cohort of ${formatNumber(benchmark.provider_count)} providers participating in Medicare.`}
              {' '}The average {benchmark.specialty} provider treats{' '}
              {formatNumber(benchmark.avg_medicare_patients)} Medicare beneficiaries and receives{' '}
              {formatCurrency(benchmark.avg_total_payment)} in total annual Medicare payments
              {benchmark.avg_revenue_per_patient > 500
                ? `, translating to ${formatCurrency(benchmark.avg_revenue_per_patient)} per patient — a figure that signals high-acuity care and complex case management.`
                : benchmark.avg_revenue_per_patient > 200
                ? `, yielding ${formatCurrency(benchmark.avg_revenue_per_patient)} per beneficiary on average.`
                : `, averaging ${formatCurrency(benchmark.avg_revenue_per_patient)} per beneficiary — a level that may indicate room for improved reimbursement through more precise documentation and coding.`}
            </p>

            <p>
              Evaluation and Management coding patterns reveal how {benchmark.specialty} providers
              characterize visit complexity.{' '}
              {(() => {
                const pct213 = emTotal > 0 ? (benchmark.pct_99213 / emTotal) * 100 : benchmark.pct_99213 * 100;
                const pct214 = emTotal > 0 ? (benchmark.pct_99214 / emTotal) * 100 : benchmark.pct_99214 * 100;
                const pct215 = emTotal > 0 ? (benchmark.pct_99215 / emTotal) * 100 : benchmark.pct_99215 * 100;
                if (pct214 > 50) {
                  return `The dominant code is 99214 at ${pct214.toFixed(1)}% of E&M visits, reflecting moderate-to-high complexity encounters that are typical when managing established patients with multiple chronic conditions. Meanwhile, 99213 accounts for ${pct213.toFixed(1)}% and high-complexity 99215 visits represent ${pct215.toFixed(1)}% of the mix.`;
                } else if (pct213 > 50) {
                  return `The most frequently billed code is 99213 at ${pct213.toFixed(1)}%, suggesting a large share of straightforward follow-up visits. Only ${pct214.toFixed(1)}% of encounters are coded as 99214, and ${pct215.toFixed(1)}% as 99215 — which may indicate under-coding if the patient population carries significant chronic disease burden.`;
                } else if (pct215 > 20) {
                  return `Notably, 99215 makes up ${pct215.toFixed(1)}% of E&M visits — well above most specialties — indicating that ${benchmark.specialty} providers frequently manage highly complex patients. The remaining mix is ${pct214.toFixed(1)}% at 99214 and ${pct213.toFixed(1)}% at 99213.`;
                } else {
                  return `The E&M mix shows ${pct214.toFixed(1)}% of visits coded as 99214, ${pct213.toFixed(1)}% as 99213, and ${pct215.toFixed(1)}% as 99215. This distribution is worth reviewing against actual patient complexity to ensure documentation supports appropriate reimbursement levels.`;
                }
              })()}
            </p>

            <p>
              {(() => {
                const ccmPct = (benchmark.ccm_adoption_rate * 100);
                const rpmPct = (benchmark.rpm_adoption_rate * 100);
                const bhiPct = (benchmark.bhi_adoption_rate * 100);
                const awvPct = (benchmark.awv_adoption_rate * 100);
                const lowPrograms = [
                  ...(ccmPct < 10 ? [`Chronic Care Management (${ccmPct.toFixed(1)}%)`] : []),
                  ...(rpmPct < 5 ? [`Remote Patient Monitoring (${rpmPct.toFixed(1)}%)`] : []),
                  ...(bhiPct < 5 ? [`Behavioral Health Integration (${bhiPct.toFixed(1)}%)`] : []),
                ];
                const parts: string[] = [];

                if (lowPrograms.length > 0) {
                  parts.push(`Care management program adoption presents a significant revenue opportunity for ${benchmark.specialty} practices. ${lowPrograms.join(', ')} ${lowPrograms.length === 1 ? 'remains' : 'remain'} substantially underutilized relative to the eligible patient population.`);
                } else {
                  parts.push(`${benchmark.specialty} shows relatively strong adoption across care management programs compared to many specialties.`);
                }

                if (awvPct < 50) {
                  parts.push(` Annual Wellness Visit adoption sits at just ${awvPct.toFixed(1)}%, well below the 70% target — meaning a majority of eligible Medicare beneficiaries are not receiving this preventive service, and practices are missing a straightforward billing opportunity.`);
                } else if (awvPct < 70) {
                  parts.push(` Annual Wellness Visit adoption is at ${awvPct.toFixed(1)}%, approaching but still below the 70% target benchmark.`);
                } else {
                  parts.push(` Annual Wellness Visits are well-adopted at ${awvPct.toFixed(1)}%, exceeding the 70% target.`);
                }

                if (ccmPct < 10 || rpmPct < 5) {
                  parts.push(` Providers who implement these programs can unlock substantial per-patient monthly revenue while improving chronic disease outcomes — NPIxray can help identify exactly which patients qualify.`);
                }

                return parts.join('');
              })()}
            </p>
          </div>
          <DataCoverage providerCount={benchmark.provider_count} className="mt-6" />
        </div>
      </section>

      {/* E&M Distribution */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">
            E&M Coding <span className="text-[#2F5EA8]">Distribution</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-2xl">
            How {benchmark.specialty} providers distribute their E&M visits
            across complexity levels. Higher-level codes (99214, 99215)
            indicate more complex patient encounters.
          </p>

          <div className="max-w-2xl space-y-6">
            {emData.map((item) => {
              const pctDisplay = emTotal > 0
                ? ((item.pct / emTotal) * 100).toFixed(1)
                : (item.pct * 100).toFixed(1);
              const barWidth = emTotal > 0
                ? (item.pct / emTotal) * 100
                : item.pct * 100;
              return (
                <div key={item.code}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold font-mono">{item.code}</span>
                      <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                    </div>
                    <span className="text-lg font-bold font-mono text-[#2F5EA8]">
                      {pctDisplay}%
                    </span>
                  </div>
                  <div className="w-full bg-[var(--bg)] rounded-full h-4">
                    <div
                      className={`${item.color} h-4 rounded-full transition-all`}
                      style={{ width: `${Math.min(barWidth, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Program Adoption Rates */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">
            Program <span className="text-[#2F5EA8]">Adoption Rates</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-2xl">
            Care management program adoption among {benchmark.specialty} providers
            compared to target benchmarks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {programs.map((program) => {
              const ratePct = (program.rate * 100).toFixed(1);
              const targetPct = (program.target * 100).toFixed(0);
              const fillPct = Math.min((program.rate / program.target) * 100, 100);
              return (
                <div
                  key={program.name}
                  className="rounded-xl border border-[var(--border-light)] bg-white p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <program.icon className={`h-5 w-5 ${program.color}`} />
                    <div>
                      <p className="font-semibold text-sm">{program.name}</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        {program.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-[var(--bg)] rounded-full h-3 mb-2">
                    <div
                      className="bg-[#2F5EA8] h-3 rounded-full transition-all"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#2F5EA8] font-mono font-semibold">
                      {ratePct}%
                    </span>
                    <span className="text-[var(--text-secondary)]">
                      Target: {targetPct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Providers */}
      {providers.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">
              Top <span className="text-[#2F5EA8]">{benchmark.specialty}</span> Providers
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8">
              Top 50 {benchmark.specialty} providers by Medicare payment volume.
            </p>
            <ProviderTable
              providers={providers}
              showCity={true}
              showSpecialty={false}
            />
          </div>
        </section>
      )}

      {/* ── Layer 5: Interactive Scanner Widget ──────────── */}
      <section className="border-t border-[var(--border-light)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <InlineScanner specialty={benchmark.specialty} />
        </div>
      </section>

      {/* Related Links */}
      <RelatedLinks pageType="specialty" currentSlug={slug} context={{ specialty: slug }} />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA specialty={benchmark.specialty} />
      </section>
    </>
  );
}
