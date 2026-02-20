import type { Metadata } from "next";
import { Shield, Database, BarChart3, Target, Calculator, AlertTriangle } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";

export const metadata: Metadata = {
  title: "Methodology — How NPIxray Calculates Revenue Scores | NPIxray",
  description:
    "Learn how NPIxray calculates Revenue Scores, identifies revenue gaps, and benchmarks providers using CMS Medicare public data. Transparent methodology for all metrics.",
  alternates: {
    canonical: "https://npixray.com/methodology",
  },
  openGraph: {
    title: "NPIxray Methodology — Revenue Score & Benchmark Calculations",
    description:
      "Transparent methodology behind NPIxray's revenue analysis: data sources, scoring models, confidence levels, and benchmark calculations.",
  },
};

export default function MethodologyPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "Methodology" }]} />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.06]">
              <Shield className="h-6 w-6 text-[#2F5EA8]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Methodology
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                How NPIxray calculates revenue scores and benchmarks
              </p>
            </div>
          </div>

          <p className="text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            NPIxray is built on transparency. Every metric, ranking, and revenue estimate on this site
            is derived from publicly available CMS Medicare data using deterministic calculations.
            No black boxes, no proprietary algorithms — just math applied to government data.
          </p>
        </div>
      </section>

      {/* Data Sources */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Database className="h-5 w-5 text-[#2F5EA8]" />
            <h2 className="text-2xl font-bold">Data Sources</h2>
          </div>

          <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed">
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
              <h3 className="text-[var(--text-primary)] font-semibold mb-2">
                CMS Medicare Physician &amp; Other Practitioners Dataset
              </h3>
              <p className="text-sm mb-3">
                The primary data source for all NPIxray analytics. This dataset is published annually by
                the Centers for Medicare &amp; Medicaid Services (CMS) and contains utilization and payment
                data for every Medicare-enrolled provider in the United States.
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>1.2M+ individual providers</li>
                <li>10M+ provider-service records</li>
                <li>Every CPT/HCPCS code billed to Medicare with frequency and payment amounts</li>
                <li>Provider specialty, geographic location, and patient demographics</li>
                <li>Publicly available at <span className="text-[#2F5EA8]">data.cms.gov</span></li>
              </ul>
            </div>

            <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
              <h3 className="text-[var(--text-primary)] font-semibold mb-2">
                NPPES NPI Registry
              </h3>
              <p className="text-sm">
                Used for real-time provider lookups. The National Plan and Provider Enumeration System
                (NPPES) provides NPI numbers, provider names, practice addresses, and taxonomy
                classifications for all healthcare providers in the US.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
              <h3 className="text-[var(--text-primary)] font-semibold mb-2">
                Medicare Fee Schedule
              </h3>
              <p className="text-sm">
                CMS-published payment rates for CPT/HCPCS codes used in revenue opportunity calculations.
                Key rates include CCM (99490: $66.00/month), RPM (99454: $55.72/month),
                BHI (99484: $48.56/month), and AWV (G0438: $174.79 initial, G0439: $118.88 subsequent).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Score */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-[#2F5EA8]" />
            <h2 className="text-2xl font-bold">Revenue Score Methodology</h2>
          </div>

          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm">
            <p>
              The NPIxray Revenue Score is a 0-100 composite metric that measures how effectively
              a provider captures available Medicare revenue relative to their specialty peers.
              It is calculated from four equally-weighted components:
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-[var(--border-light)] p-4">
                <h4 className="text-[var(--text-primary)] font-semibold text-sm mb-1">E&M Coding Efficiency (25%)</h4>
                <p className="text-xs">
                  Compares the provider&apos;s E&M code distribution (99213/99214/99215) against
                  their specialty benchmark. Providers whose coding mix aligns with or exceeds
                  specialty averages score higher.
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border-light)] p-4">
                <h4 className="text-[var(--text-primary)] font-semibold text-sm mb-1">CCM/RPM Adoption (25%)</h4>
                <p className="text-xs">
                  Measures whether the provider bills Chronic Care Management (99490) and
                  Remote Patient Monitoring (99454). Billing either program earns partial credit;
                  billing both at volumes above specialty median earns full marks.
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border-light)] p-4">
                <h4 className="text-[var(--text-primary)] font-semibold text-sm mb-1">BHI Adoption (25%)</h4>
                <p className="text-xs">
                  Checks for Behavioral Health Integration (99484) billing. Given the low national
                  adoption rate, any BHI billing represents significant revenue capture.
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border-light)] p-4">
                <h4 className="text-[var(--text-primary)] font-semibold text-sm mb-1">AWV Completion (25%)</h4>
                <p className="text-xs">
                  Evaluates Annual Wellness Visit (G0438/G0439) volume relative to the provider&apos;s
                  total Medicare patient panel. The target benchmark varies by specialty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Gap Estimation */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-[#2F5EA8]" />
            <h2 className="text-2xl font-bold">Revenue Gap Estimation</h2>
          </div>

          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm">
            <p>
              Revenue opportunities shown on state, specialty, and code pages are calculated using a
              straightforward gap analysis between observed adoption rates and specialty benchmarks:
            </p>

            <div className="rounded-xl border border-[var(--border-light)] bg-white p-6 font-mono text-xs">
              <div className="text-[#2F5EA8] mb-2">{/* Revenue Gap Formula */}{"// Revenue Gap Formula"}</div>
              <div>adoption_gap = national_benchmark_rate - local_adoption_rate</div>
              <div>additional_providers = adoption_gap × total_providers</div>
              <div>estimated_revenue = additional_providers × payment_rate × patients_per_provider × 12</div>
            </div>

            <p>
              For example, if a state has 10,000 Family Medicine providers with 5% CCM adoption
              vs a 12% national benchmark, the gap is 7 percentage points. This means ~700
              additional providers could adopt CCM, each potentially enrolling 15 eligible patients
              at $66/month, yielding an estimated $8.3M annual revenue opportunity.
            </p>

            <p>
              All revenue estimates are labeled as estimates and include confidence levels based on
              sample size to help users assess reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Benchmarks */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="h-5 w-5 text-[#2F5EA8]" />
            <h2 className="text-2xl font-bold">Specialty Benchmarks</h2>
          </div>

          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm">
            <p>
              NPIxray maintains benchmarks for 20+ medical specialties derived directly from
              the CMS dataset. Each benchmark includes:
            </p>

            <ul className="space-y-2 list-disc list-inside">
              <li>Average total Medicare payment per provider</li>
              <li>Average Medicare beneficiary count per provider</li>
              <li>E&M code distribution (99213/99214/99215 mix)</li>
              <li>Program adoption rates (CCM, RPM, BHI, AWV)</li>
              <li>Chronic disease prevalence in the patient population</li>
            </ul>

            <p>
              Benchmarks are recalculated annually when CMS releases updated data. The current
              dataset reflects 2024 Medicare claims data.
            </p>
          </div>
        </div>
      </section>

      {/* Confidence Levels */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-5 w-5 text-[#2F5EA8]" />
            <h2 className="text-2xl font-bold">Confidence Levels</h2>
          </div>

          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm">
            <p>
              Every data point on NPIxray includes a confidence indicator based on the underlying
              sample size:
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-green-400/20 bg-green-400/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-semibold text-sm">High Confidence</span>
                </div>
                <p className="text-xs">
                  100+ providers in the peer group. Results are statistically robust and
                  representative of the population.
                </p>
              </div>
              <div className="rounded-lg border border-yellow-400/20 bg-yellow-400/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">Medium Confidence</span>
                </div>
                <p className="text-xs">
                  20-99 providers. Results are directionally useful but may not capture
                  the full variability of the population.
                </p>
              </div>
              <div className="rounded-lg border border-red-400/20 bg-red-400/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 font-semibold text-sm">Low Confidence</span>
                </div>
                <p className="text-xs">
                  Fewer than 20 providers. Results should be interpreted with caution.
                  Pages with fewer than 10 providers show a &quot;Limited Data&quot; warning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* State Rankings */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">State &amp; Neighbor Comparisons</h2>

          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm">
            <p>
              State pages include national rankings and neighboring state comparisons. Rankings
              are determined by average Medicare payment per provider, calculated as:
            </p>

            <div className="rounded-xl border border-[var(--border-light)] bg-white p-6 font-mono text-xs">
              <div className="text-[#2F5EA8] mb-2">{"// National Rank"}</div>
              <div>state_avg_payment = SUM(all_provider_payments) / COUNT(providers_in_state)</div>
              <div>national_rank = RANK(state_avg_payment DESC) among all 50 states + DC</div>
              <div className="mt-2 text-[#2F5EA8]">{"// Delta vs National Average"}</div>
              <div>national_weighted_avg = SUM(state_avg × state_providers) / SUM(state_providers)</div>
              <div>delta_pct = ((state_avg - national_weighted_avg) / national_weighted_avg) × 100</div>
            </div>

            <p>
              Neighboring states are defined by geographic adjacency (shared borders). Each state
              page shows up to 4 neighboring states for comparison, helping users understand
              regional Medicare reimbursement patterns.
            </p>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Limitations &amp; Disclaimers</h2>

          <div className="space-y-3 text-[var(--text-secondary)] leading-relaxed text-sm">
            <div className="rounded-xl border border-orange-400/20 bg-orange-400/5 p-6">
              <ul className="space-y-3">
                <li>
                  <strong className="text-[var(--text-primary)]">Medicare Only:</strong> All data reflects Medicare
                  Fee-for-Service claims only. Commercial payer, Medicaid, and Medicare Advantage
                  data are not included.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Publicly Available Data:</strong> CMS redacts data
                  for providers with fewer than 11 beneficiaries for any single service to protect
                  patient privacy. This means some low-volume codes may be underrepresented.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Revenue Estimates:</strong> All dollar amounts
                  labeled as &quot;estimated&quot; or &quot;potential&quot; are projections based on benchmark gaps
                  and published fee schedule rates. Actual revenue will vary based on patient
                  mix, payer contracts, and practice operations.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Annual Refresh:</strong> Data is updated annually
                  when CMS publishes new datasets, typically with a 12-18 month lag from the
                  service dates.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Not Medical Advice:</strong> NPIxray provides
                  data analysis for revenue optimization purposes only. It does not constitute
                  medical, legal, or compliance advice.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
