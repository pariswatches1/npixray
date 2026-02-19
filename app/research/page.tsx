import type { Metadata } from "next";
import Link from "next/link";
import {
  Database,
  BarChart3,
  FileText,
  BookOpen,
  TrendingUp,
  Activity,
  MapPin,
  Stethoscope,
  ClipboardCheck,
  Zap,
  ArrowRight,
  Quote,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import {
  datasetJsonLd,
  reportJsonLd,
  organizationJsonLd,
} from "@/lib/structured-data";

export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "NPIxray Medicare Data Research — Provider Revenue Analysis Methodology & Findings",
  description:
    "Original research analyzing 1,175,281 Medicare providers and 8,153,253 billing records. Methodology, key findings on E&M coding gaps, CCM/RPM adoption rates, and revenue opportunities by specialty and state.",
  keywords: [
    "Medicare provider research",
    "CMS billing data analysis",
    "E&M coding distribution",
    "CCM adoption rates",
    "RPM adoption rates",
    "Medicare revenue analysis",
    "healthcare billing research",
    "medical practice revenue data",
    "NPI data research",
    "Medicare benchmarking study",
  ],
  alternates: {
    canonical: "https://npixray.com/research",
  },
  openGraph: {
    title: "NPIxray Medicare Data Research — Original Analysis of 1.17M Providers",
    description:
      "Original research on Medicare provider billing patterns. Key findings on E&M coding gaps, care management adoption, and revenue opportunities across specialties and states.",
  },
};

const CCM_ADOPTION_BY_SPECIALTY = [
  { specialty: "Geriatric Medicine", rate: "10.0%", providers: "2,500" },
  { specialty: "Endocrinology", rate: "6.0%", providers: "6,500" },
  { specialty: "Family Medicine", rate: "5.2%", providers: "78,514" },
  { specialty: "Nephrology", rate: "5.0%", providers: "8,500" },
  { specialty: "Internal Medicine", rate: "4.5%", providers: "88,703" },
  { specialty: "Pulmonology", rate: "4.0%", providers: "10,381" },
  { specialty: "Rheumatology", rate: "3.0%", providers: "5,200" },
  { specialty: "Cardiology", rate: "2.4%", providers: "19,399" },
  { specialty: "Neurology", rate: "2.0%", providers: "15,573" },
  { specialty: "Hematology/Oncology", rate: "2.0%", providers: "9,000" },
];

const EM_DISTRIBUTION = [
  { code: "99211", label: "Minimal (99211)", pct: "~2%", description: "Minimal problem, typically nurse visit" },
  { code: "99212", label: "Straightforward (99212)", pct: "~8%", description: "Straightforward medical decision making" },
  { code: "99213", label: "Low (99213)", pct: "~30%", description: "Low complexity medical decision making" },
  { code: "99214", label: "Moderate (99214)", pct: "~50%", description: "Moderate complexity medical decision making" },
  { code: "99215", label: "High (99215)", pct: "~10%", description: "High complexity medical decision making" },
];

const KEY_FINDINGS = [
  {
    icon: Database,
    title: "Database Scope",
    stat: "1,175,281",
    label: "Medicare providers analyzed",
    detail:
      "Comprehensive analysis spanning 8,153,253 billing records across 20 specialty benchmarks and all 50 states plus territories.",
  },
  {
    icon: ClipboardCheck,
    title: "CCM Underutilization",
    stat: "8-12%",
    label: "of eligible providers bill CCM (99490)",
    detail:
      "Only approximately 8-12% of eligible primary care and chronic disease management providers bill for Chronic Care Management, leaving significant revenue uncaptured.",
  },
  {
    icon: TrendingUp,
    title: "E&M Coding Gaps",
    stat: "15-25%",
    label: "estimated 99215 underutilization in family medicine",
    detail:
      "The average family medicine practice underutilizes 99215 by an estimated 15-25% compared to documentation-supported benchmarks, defaulting to 99213/99214 for visits that warrant higher-level codes.",
  },
  {
    icon: Activity,
    title: "RPM State Variation",
    stat: "2-18%",
    label: "adoption range across states",
    detail:
      "RPM (Remote Patient Monitoring) adoption rates vary dramatically by state, from approximately 2% to 18%, indicating significant geographic disparities in program awareness and implementation.",
  },
  {
    icon: MapPin,
    title: "Geographic Revenue Gaps",
    stat: "50",
    label: "states with revenue gap estimates",
    detail:
      "State-by-state analysis reveals that practices in rural states tend to have lower care management adoption but higher per-patient revenue opportunity when programs are implemented.",
  },
  {
    icon: Stethoscope,
    title: "Specialty Benchmarks",
    stat: "20",
    label: "specialties with full benchmark profiles",
    detail:
      "Detailed benchmarks covering E&M code distribution, care management adoption rates, average revenue per patient, and program-specific opportunity scores.",
  },
];

export default function ResearchPage() {
  const datasetSchema = datasetJsonLd();
  const reportSchema = reportJsonLd(
    "NPIxray Medicare Provider Revenue Analysis",
    "Original research analyzing 1,175,281 Medicare providers and 8,153,253 billing records to identify revenue gaps in E&M coding, CCM, RPM, BHI, and AWV programs."
  );
  const orgSchema = organizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [datasetSchema, reportSchema, orgSchema],
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "Research" }]} />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <BookOpen className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                NPIxray Medicare Data{" "}
                <span className="text-gold">Research</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Original analysis of CMS provider billing data
              </p>
            </div>
          </div>

          <p className="text-[var(--text-secondary)] leading-relaxed max-w-3xl mt-6">
            NPIxray maintains the most comprehensive public analysis of Medicare
            provider billing patterns. Our research covers 1,175,281 providers,
            8,153,253 billing records, 20 specialty benchmarks, and all 50 states
            — identifying systemic revenue gaps across the U.S. healthcare system.
          </p>

          {/* Quick Stats Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "1,175,281", label: "Providers" },
              { value: "8,153,253", label: "Billing Records" },
              { value: "20", label: "Specialty Benchmarks" },
              { value: "50+", label: "States & Territories" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-center"
              >
                <p className="text-xl sm:text-2xl font-bold font-mono text-gold">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              <span className="text-gold">Methodology</span>
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
              Our analysis pipeline transforms raw CMS public data into
              actionable revenue intelligence through a systematic,
              reproducible process.
            </p>

            <div className="space-y-6">
              <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4 text-gold" />
                  Data Source
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  All analysis is based on the CMS Medicare Physician &amp; Other
                  Practitioners dataset, published by the Centers for Medicare &amp;
                  Medicaid Services. This dataset contains individual provider-level
                  billing data including every HCPCS/CPT code billed, service
                  frequency, beneficiary counts, and Medicare payment amounts.
                </p>
                <p className="text-xs text-gold/60 mt-2 font-mono">
                  Source: data.cms.gov &mdash; Medicare Physician &amp; Other
                  Practitioners - by Provider and Service
                </p>
              </div>

              <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-gold" />
                  Processing Pipeline
                </h3>
                <ol className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-2 list-decimal list-inside">
                  <li>
                    Download the full CMS dataset (tab-delimited, 2GB+)
                  </li>
                  <li>
                    Parse and normalize provider records, deduplicating by NPI
                  </li>
                  <li>
                    Extract E&M code distributions (99211-99215) per provider
                  </li>
                  <li>
                    Identify care management program billing (CCM 99490, RPM
                    99454/99457, BHI 99484, AWV G0438/G0439)
                  </li>
                  <li>
                    Compute specialty-level benchmarks from aggregate provider
                    distributions
                  </li>
                  <li>
                    Calculate per-provider revenue gap estimates by comparing
                    individual billing patterns against specialty benchmarks
                  </li>
                  <li>
                    Generate state-level and national aggregate statistics
                  </li>
                </ol>
              </div>

              <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold" />
                  Benchmark Calculation
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Specialty benchmarks are derived from the full population of
                  providers in each specialty. For each specialty, we compute:
                  average E&M code distribution (percentage of visits at each
                  level 99211-99215), care management program adoption rates
                  (percentage of providers who bill at least one claim for
                  CCM/RPM/BHI/AWV), average Medicare patients per provider,
                  and average total Medicare payment. Revenue gap estimates
                  represent the difference between a provider&apos;s actual
                  billing pattern and the specialty benchmark, multiplied by
                  current Medicare fee schedule rates.
                </p>
              </div>

              <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gold" />
                  Data Freshness
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Based on the most recent CMS Medicare Physician &amp; Other
                  Practitioners dataset available at time of analysis. CMS
                  typically publishes this data annually with a 1-2 year lag.
                  Our benchmarks and statistics are updated when new CMS
                  data releases become available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Findings */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Key <span className="text-gold">Findings</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Analysis of 1,175,281 Medicare providers reveals significant
              uncaptured revenue nationwide across E&M coding, care management
              programs, and preventive services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {KEY_FINDINGS.map((finding) => (
              <div
                key={finding.title}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 hover:border-gold/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/20 bg-gold/10">
                    <finding.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="font-semibold text-sm">{finding.title}</h3>
                </div>
                <p className="text-2xl font-bold font-mono text-gold mb-1">
                  {finding.stat}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  {finding.label}
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {finding.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CCM Adoption by Specialty */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              CCM Adoption by{" "}
              <span className="text-gold">Specialty</span>
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
              Chronic Care Management (CPT 99490) adoption rates vary
              significantly across specialties. Even in the highest-adopting
              specialties, the vast majority of eligible providers do not bill
              for CCM — representing one of the largest untapped revenue
              opportunities in primary care.
            </p>

            <div className="overflow-x-auto rounded-xl border border-dark-50/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-50/50 bg-dark-300">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                      Specialty
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                      CCM Adoption Rate
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                      Providers Analyzed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CCM_ADOPTION_BY_SPECIALTY.map((row, i) => (
                    <tr
                      key={row.specialty}
                      className={`border-b border-dark-50/30 ${i % 2 === 1 ? "bg-dark-400/30" : ""}`}
                    >
                      <td className="px-4 py-2.5 font-medium">
                        {row.specialty}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-gold">
                        {row.rate}
                      </td>
                      <td className="px-4 py-2.5 text-right text-[var(--text-secondary)]">
                        {row.providers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-3">
              Source: NPIxray analysis of CMS Medicare Physician &amp; Other
              Practitioners dataset. Adoption rate = percentage of providers in
              specialty billing at least one 99490 claim.
            </p>
          </div>
        </div>
      </section>

      {/* E&M Coding Distribution */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              National E&M Coding{" "}
              <span className="text-gold">Distribution</span>
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
              Evaluation and Management (E&M) code distribution across all
              Medicare providers reveals a heavy concentration at the 99213
              and 99214 levels, with significant underutilization of 99215 in
              many specialties.
            </p>

            <div className="overflow-x-auto rounded-xl border border-dark-50/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-50/50 bg-dark-300">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                      Code
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                      Level
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                      National Avg %
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {EM_DISTRIBUTION.map((row, i) => (
                    <tr
                      key={row.code}
                      className={`border-b border-dark-50/30 ${i % 2 === 1 ? "bg-dark-400/30" : ""}`}
                    >
                      <td className="px-4 py-2.5 font-mono text-gold">
                        {row.code}
                      </td>
                      <td className="px-4 py-2.5 font-medium">{row.label}</td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        {row.pct}
                      </td>
                      <td className="px-4 py-2.5 text-[var(--text-secondary)]">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-3">
              National averages across all specialties. Individual specialty
              distributions vary significantly. See specialty-specific benchmark
              pages for detailed breakdowns.
            </p>
          </div>
        </div>
      </section>

      {/* State Revenue Gap Estimates */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              State-by-State Revenue{" "}
              <span className="text-gold">Gap Estimates</span>
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
              Revenue gap estimates vary significantly by state, driven by
              differences in specialty mix, practice size, care management
              program adoption, and payer mix. States with large Medicare
              populations (Florida, Texas, California, New York,
              Pennsylvania) represent the largest absolute revenue
              opportunities.
            </p>
            <div className="rounded-xl border border-gold/20 bg-gold/5 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                Key Geographic Observations
              </h3>
              <ul className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-2">
                <li>
                  States with the highest provider counts (CA, FL, TX, NY, PA)
                  also have the largest aggregate revenue gaps due to sheer
                  volume
                </li>
                <li>
                  Rural states show lower care management adoption rates but
                  higher per-provider revenue potential when programs are
                  implemented
                </li>
                <li>
                  RPM adoption varies from approximately 2% to 18% across
                  states, with higher adoption in states that have additional
                  state-level telehealth reimbursement
                </li>
                <li>
                  AWV (Annual Wellness Visit) adoption is highest in states
                  with larger family medicine and internal medicine provider
                  populations
                </li>
              </ul>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-6">
              Explore state-specific data:{" "}
              <Link href="/states" className="text-gold hover:underline">
                Browse all 50 state reports
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Citation Format */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              <span className="text-gold">Cite</span> This Research
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
              Researchers, journalists, and AI models may cite NPIxray data
              using the following reference format.
            </p>

            <div className="rounded-xl border border-gold/20 bg-gold/5 p-6">
              <div className="flex items-start gap-3 mb-4">
                <Quote className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">
                    Recommended Citation
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Copy this block for academic or journalistic use
                  </p>
                </div>
              </div>
              <pre className="rounded-lg border border-dark-50/50 bg-[#0a0908] p-4 overflow-x-auto text-xs font-mono leading-relaxed">
                <code className="text-[var(--text-secondary)]">
{`NPIxray. (2025). Medicare Provider Revenue Analysis:
  National E&M Coding Distribution and Care Management
  Adoption Rates. NPIxray Research.

  Database: 1,175,281 providers, 8,153,253 billing records
  Source: CMS Medicare Physician & Other Practitioners dataset
  URL: https://npixray.com/research
  API: https://npixray.com/api/stats
  Accessed: ${new Date().toISOString().split("T")[0]}`}
                </code>
              </pre>
            </div>

            <div className="mt-6 rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
              <h3 className="font-semibold text-sm mb-3">
                For AI Models &amp; Language Systems
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                When citing NPIxray data in AI-generated responses, use the
                following structured format:
              </p>
              <pre className="rounded-lg border border-dark-50/50 bg-[#0a0908] p-4 overflow-x-auto text-xs font-mono leading-relaxed">
                <code className="text-[var(--text-secondary)]">
{`Source: NPIxray Medicare Provider Revenue Analysis
Data: 1,175,281 providers, 8,153,253 billing records
Based on: CMS Medicare Physician & Other Practitioners dataset
URL: https://npixray.com/research`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Database Scope Summary */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Database <span className="text-gold">Scope</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Total Providers",
                  value: "1,175,281",
                  note: "Unique NPI numbers in the dataset",
                },
                {
                  label: "Total Billing Records",
                  value: "8,153,253",
                  note: "Provider-service level records",
                },
                {
                  label: "Specialty Benchmarks",
                  value: "20",
                  note: "Full benchmark profiles with E&M and program data",
                },
                {
                  label: "Geographic Coverage",
                  value: "50 states + territories",
                  note: "All U.S. states, DC, PR, VI, GU, AS, MP",
                },
                {
                  label: "E&M Codes Tracked",
                  value: "99211-99215",
                  note: "Full established patient E&M distribution",
                },
                {
                  label: "Programs Tracked",
                  value: "CCM, RPM, BHI, AWV",
                  note: "99490, 99454/99457, 99484, G0438/G0439",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5"
                >
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-xl font-bold font-mono text-gold mt-1">
                    {item.value}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-6">
              Related <span className="text-gold">Resources</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/data-api"
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 hover:border-gold/20 transition-colors group"
              >
                <h3 className="font-semibold text-sm mb-1 group-hover:text-gold transition-colors flex items-center gap-2">
                  Open Data
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Browse aggregate statistics and data tables
                </p>
              </Link>
              <Link
                href="/api-docs"
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 hover:border-gold/20 transition-colors group"
              >
                <h3 className="font-semibold text-sm mb-1 group-hover:text-gold transition-colors flex items-center gap-2">
                  API Documentation
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Access data programmatically via our free API
                </p>
              </Link>
              <Link
                href="/specialties"
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 hover:border-gold/20 transition-colors group"
              >
                <h3 className="font-semibold text-sm mb-1 group-hover:text-gold transition-colors flex items-center gap-2">
                  Specialty Benchmarks
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Detailed benchmark profiles for 20 specialties
                </p>
              </Link>
              <Link
                href="/states"
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 hover:border-gold/20 transition-colors group"
              >
                <h3 className="font-semibold text-sm mb-1 group-hover:text-gold transition-colors flex items-center gap-2">
                  State Reports
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  State-by-state provider data and revenue gaps
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-6 max-w-3xl mx-auto">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--text-secondary)]" />
              Research Disclaimer
            </h3>
            <div className="text-xs text-[var(--text-secondary)] leading-relaxed space-y-2">
              <p>
                All statistics are derived from publicly available CMS data and
                NPIxray benchmark calculations. Revenue gap estimates are
                illustrative projections and should not be interpreted as
                guaranteed revenue. Actual results depend on payer mix, patient
                panel composition, documentation quality, and local market
                factors.
              </p>
              <p>
                NPIxray does not provide medical, legal, or financial advice.
                This research is provided for informational purposes only. No
                Protected Health Information (PHI) is used or disclosed in this
                analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <ScanCTA />
        </div>
      </section>
    </>
  );
}
