import type { Metadata } from "next";
import Link from "next/link";
import {
  Database,
  Globe,
  BarChart3,
  Activity,
  Stethoscope,
  ArrowRight,
  FileText,
  Code2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { datasetJsonLd } from "@/lib/structured-data";

export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "NPIxray Open Data — Medicare Provider Statistics & Benchmarks",
  description:
    "Explore aggregate Medicare provider statistics: 1,175,281 providers, 8,153,253 billing records, specialty benchmarks, program adoption rates, and E&M coding distributions. Clean, parseable data for researchers and AI systems.",
  keywords: [
    "Medicare open data",
    "healthcare data",
    "CMS provider statistics",
    "Medicare billing data",
    "specialty benchmarks",
    "CCM adoption data",
    "RPM adoption data",
    "E&M coding data",
  ],
  openGraph: {
    title: "NPIxray Open Data — Medicare Provider Statistics",
    description:
      "Aggregate Medicare provider statistics covering 1,175,281 providers. Specialty benchmarks, program adoption rates, and E&M coding distributions.",
  },
};

const NATIONAL_TOTALS = {
  totalProviders: "1,175,281",
  totalBillingRecords: "8,153,253",
  totalMedicarePayments: "$92.4B+",
  specialtiesBenchmarked: "20",
  statesCovered: "50+",
  programsTracked: "4 (CCM, RPM, BHI, AWV)",
};

const TOP_STATES = [
  { state: "California", abbr: "CA", providers: "~112,000" },
  { state: "Florida", abbr: "FL", providers: "~89,000" },
  { state: "Texas", abbr: "TX", providers: "~85,000" },
  { state: "New York", abbr: "NY", providers: "~82,000" },
  { state: "Pennsylvania", abbr: "PA", providers: "~52,000" },
  { state: "Illinois", abbr: "IL", providers: "~45,000" },
  { state: "Ohio", abbr: "OH", providers: "~42,000" },
  { state: "New Jersey", abbr: "NJ", providers: "~38,000" },
  { state: "Michigan", abbr: "MI", providers: "~35,000" },
  { state: "Georgia", abbr: "GA", providers: "~33,000" },
];

const TOP_SPECIALTIES = [
  { specialty: "Internal Medicine", providers: "88,703", avgPayment: "$77,297" },
  { specialty: "Family Medicine", providers: "78,514", avgPayment: "$55,556" },
  { specialty: "Orthopedics", providers: "20,699", avgPayment: "$102,233" },
  { specialty: "Cardiology", providers: "19,399", avgPayment: "$179,674" },
  { specialty: "Psychiatry", providers: "18,253", avgPayment: "$31,564" },
  { specialty: "OB/GYN", providers: "17,962", avgPayment: "$15,432" },
  { specialty: "Neurology", providers: "15,573", avgPayment: "$79,417" },
  { specialty: "Gastroenterology", providers: "14,124", avgPayment: "$76,335" },
  { specialty: "Dermatology", providers: "12,160", avgPayment: "$224,383" },
  { specialty: "Pulmonology", providers: "10,381", avgPayment: "$95,480" },
];

const PROGRAM_ADOPTION = [
  {
    program: "Chronic Care Management (CCM)",
    code: "99490",
    rate: "~4-6%",
    note: "Varies significantly by specialty; highest in Geriatric Medicine (~10%)",
  },
  {
    program: "Remote Patient Monitoring (RPM)",
    code: "99454/99457",
    rate: "~2-4%",
    note: "State-level variation from ~2% to ~18%; highest in Pulmonology",
  },
  {
    program: "Behavioral Health Integration (BHI)",
    code: "99484",
    rate: "~0.5-1%",
    note: "Extremely low adoption outside of Psychiatry; largest untapped opportunity",
  },
  {
    program: "Annual Wellness Visit (AWV)",
    code: "G0438/G0439",
    rate: "~30-50%",
    note: "Highest adoption program; Family Medicine leads at ~54%",
  },
];

const EM_NATIONAL = [
  { code: "99211", level: "Minimal", pct: "~2%", reimbursement: "~$25" },
  { code: "99212", level: "Straightforward", pct: "~8%", reimbursement: "~$57" },
  { code: "99213", level: "Low Complexity", pct: "~30%", reimbursement: "~$98" },
  { code: "99214", level: "Moderate Complexity", pct: "~50%", reimbursement: "~$145" },
  { code: "99215", level: "High Complexity", pct: "~10%", reimbursement: "~$207" },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-lg border border-dark-50/50 bg-[#0a0908] p-4 overflow-x-auto text-xs font-mono leading-relaxed">
      <code className="text-[var(--text-secondary)]">{children}</code>
    </pre>
  );
}

export default function OpenDataPage() {
  const schema = datasetJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "Open Data" }]} />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <Database className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                NPIxray <span className="text-gold">Open Data</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Aggregate Medicare statistics for researchers &amp; AI systems
              </p>
            </div>
          </div>

          <p className="text-[var(--text-secondary)] leading-relaxed max-w-3xl mt-6">
            This page provides key aggregate statistics from NPIxray&apos;s
            analysis of the CMS Medicare Physician &amp; Other Practitioners
            dataset. Data is presented in clean, structured formats suitable
            for parsing by researchers, journalists, and AI language models.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/api/stats"
              className="inline-flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 px-4 py-2 text-sm text-gold hover:bg-gold/10 transition-colors"
            >
              <Code2 className="h-4 w-4" />
              JSON API: /api/stats
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-lg border border-dark-50 px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-colors"
            >
              <FileText className="h-4 w-4" />
              Full Research &amp; Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* National Totals */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            National <span className="text-gold">Totals</span>
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl">
            Aggregate statistics from the full NPIxray database, derived from
            the CMS Medicare Physician &amp; Other Practitioners dataset.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-3xl">
            {Object.entries(NATIONAL_TOTALS).map(([key, value]) => (
              <div
                key={key}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5"
              >
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-xl font-bold font-mono text-gold mt-1">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <CodeBlock>
{`// National Totals (JSON)
{
  "total_providers": 1175281,
  "total_billing_records": 8153253,
  "total_medicare_payments_estimated": 92400000000,
  "specialties_benchmarked": 20,
  "states_covered": 55,
  "programs_tracked": ["CCM", "RPM", "BHI", "AWV"]
}`}
          </CodeBlock>
        </div>
      </section>

      {/* Top States */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-gold" />
            Top States by{" "}
            <span className="text-gold">Provider Count</span>
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl">
            The 10 states with the most Medicare providers in the CMS dataset.
          </p>

          <div className="overflow-x-auto rounded-xl border border-dark-50/50 max-w-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-50/50 bg-dark-300">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Rank
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                    State
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Abbr
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Providers
                  </th>
                </tr>
              </thead>
              <tbody>
                {TOP_STATES.map((row, i) => (
                  <tr
                    key={row.abbr}
                    className={`border-b border-dark-50/30 ${i % 2 === 1 ? "bg-dark-400/30" : ""}`}
                  >
                    <td className="px-4 py-2.5 font-mono text-gold">
                      {i + 1}
                    </td>
                    <td className="px-4 py-2.5 font-medium">
                      <Link
                        href={`/states/${row.state.toLowerCase().replace(/\s+/g, "-")}`}
                        className="hover:text-gold transition-colors"
                      >
                        {row.state}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[var(--text-secondary)]">
                      {row.abbr}
                    </td>
                    <td className="px-4 py-2.5 text-right text-[var(--text-secondary)]">
                      {row.providers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Specialty Benchmarks */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-gold" />
            Specialty{" "}
            <span className="text-gold">Benchmarks</span>
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl">
            Top 10 specialties by provider count with average Medicare payment
            per provider.
          </p>

          <div className="overflow-x-auto rounded-xl border border-dark-50/50 max-w-3xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-50/50 bg-dark-300">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Specialty
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Providers
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Avg Medicare Payment
                  </th>
                </tr>
              </thead>
              <tbody>
                {TOP_SPECIALTIES.map((row, i) => (
                  <tr
                    key={row.specialty}
                    className={`border-b border-dark-50/30 ${i % 2 === 1 ? "bg-dark-400/30" : ""}`}
                  >
                    <td className="px-4 py-2.5 font-medium">{row.specialty}</td>
                    <td className="px-4 py-2.5 text-right text-[var(--text-secondary)]">
                      {row.providers}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-gold">
                      {row.avgPayment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <CodeBlock>
{`// Top Specialties (JSON)
[
  { "specialty": "Internal Medicine", "providers": 88703, "avg_payment": 77297 },
  { "specialty": "Family Medicine", "providers": 78514, "avg_payment": 55556 },
  { "specialty": "Orthopedics", "providers": 20699, "avg_payment": 102233 },
  { "specialty": "Cardiology", "providers": 19399, "avg_payment": 179674 },
  { "specialty": "Psychiatry", "providers": 18253, "avg_payment": 31564 },
  { "specialty": "OB/GYN", "providers": 17962, "avg_payment": 15432 },
  { "specialty": "Neurology", "providers": 15573, "avg_payment": 79417 },
  { "specialty": "Gastroenterology", "providers": 14124, "avg_payment": 76335 },
  { "specialty": "Dermatology", "providers": 12160, "avg_payment": 224383 },
  { "specialty": "Pulmonology", "providers": 10381, "avg_payment": 95480 }
]`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* Program Adoption Rates */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Activity className="h-6 w-6 text-gold" />
            Program Adoption{" "}
            <span className="text-gold">Rates</span>
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl">
            National average adoption rates for key Medicare care management
            and preventive programs.
          </p>

          <div className="space-y-4 max-w-3xl">
            {PROGRAM_ADOPTION.map((prog) => (
              <div
                key={prog.code}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{prog.program}</h3>
                  <span className="text-xs font-mono font-bold text-gold px-2 py-0.5 rounded-full bg-gold/10">
                    {prog.code}
                  </span>
                </div>
                <p className="text-2xl font-bold font-mono text-gold mb-1">
                  {prog.rate}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {prog.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 max-w-3xl">
            <CodeBlock>
{`// Program Adoption Rates (JSON)
{
  "ccm_99490": { "national_avg": "4-6%", "highest_specialty": "Geriatric Medicine (10%)" },
  "rpm_99454_99457": { "national_avg": "2-4%", "state_range": "2% to 18%" },
  "bhi_99484": { "national_avg": "0.5-1%", "highest_specialty": "Psychiatry (5%)" },
  "awv_g0438_g0439": { "national_avg": "30-50%", "highest_specialty": "Family Medicine (54%)" }
}`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* E&M Distribution */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-gold" />
            E&M Coding{" "}
            <span className="text-gold">Distribution</span>
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl">
            National average E&M code distribution for established patient
            visits (99211-99215) across all specialties.
          </p>

          <div className="overflow-x-auto rounded-xl border border-dark-50/50 max-w-3xl">
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
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Avg Reimbursement
                  </th>
                </tr>
              </thead>
              <tbody>
                {EM_NATIONAL.map((row, i) => (
                  <tr
                    key={row.code}
                    className={`border-b border-dark-50/30 ${i % 2 === 1 ? "bg-dark-400/30" : ""}`}
                  >
                    <td className="px-4 py-2.5 font-mono text-gold">
                      {row.code}
                    </td>
                    <td className="px-4 py-2.5 font-medium">{row.level}</td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {row.pct}
                    </td>
                    <td className="px-4 py-2.5 text-right text-[var(--text-secondary)]">
                      {row.reimbursement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 max-w-3xl">
            <CodeBlock>
{`// E&M Distribution (JSON)
{
  "99211": { "pct": 0.02, "avg_reimbursement": 25 },
  "99212": { "pct": 0.08, "avg_reimbursement": 57 },
  "99213": { "pct": 0.30, "avg_reimbursement": 98 },
  "99214": { "pct": 0.50, "avg_reimbursement": 145 },
  "99215": { "pct": 0.10, "avg_reimbursement": 207 }
}`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* API Endpoint */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Programmatic <span className="text-gold">Access</span>
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
              Access this data programmatically via our JSON API endpoint.
              No API key required.
            </p>

            <div className="rounded-xl border border-gold/20 bg-gold/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400">
                  GET
                </span>
                <code className="text-lg font-mono text-gold">
                  /api/stats
                </code>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                Returns JSON with national totals, top specialties, program
                adoption rates, and E&M coding distribution. Cached for 24
                hours.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/api/stats"
                  className="inline-flex items-center gap-2 rounded-lg bg-gold text-dark px-4 py-2 text-sm font-semibold hover:bg-gold-300 transition-colors"
                >
                  <Code2 className="h-4 w-4" />
                  View Live Response
                </Link>
                <Link
                  href="/api-docs"
                  className="inline-flex items-center gap-2 rounded-lg border border-dark-50 px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-colors"
                >
                  Full API Docs
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Source Attribution */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-6 max-w-3xl mx-auto">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--text-secondary)]" />
              Data Source Attribution
            </h3>
            <div className="text-xs text-[var(--text-secondary)] leading-relaxed space-y-2">
              <p>
                All data on this page is derived from the CMS Medicare Physician
                &amp; Other Practitioners dataset, a free public dataset
                published by the Centers for Medicare &amp; Medicaid Services.
                Statistics represent NPIxray aggregate calculations and
                benchmark estimates.
              </p>
              <p>
                For full methodology, see our{" "}
                <Link href="/research" className="text-gold hover:underline">
                  Research page
                </Link>
                . Revenue estimates are illustrative projections. No PHI is
                used or disclosed.
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
