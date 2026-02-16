import type { Metadata } from "next";
import { Code2, Zap, Lock, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "NPIxray Public Data API — Medicare Provider Data | NPIxray",
  description:
    "Free public API for Medicare provider billing data. Look up providers by NPI, query aggregate statistics by state and specialty, and access benchmark data.",
  keywords: [
    "Medicare data API",
    "NPI lookup API",
    "healthcare data API",
    "CMS provider data API",
    "Medicare billing API",
  ],
  openGraph: {
    title: "NPIxray Public Data API — Medicare Provider Data | NPIxray",
    description:
      "Free public API for Medicare provider billing data. Look up providers by NPI and access aggregate statistics.",
  },
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-lg border border-dark-50/50 bg-[#0a0908] p-4 overflow-x-auto text-xs font-mono leading-relaxed">
      <code className="text-[var(--text-secondary)]">{children}</code>
    </pre>
  );
}

export default function ApiDocsPage() {
  const providerExample = `GET /api/cms/1234567890

Response:
{
  "npi": "1234567890",
  "first_name": "John",
  "last_name": "Smith",
  "credential": "MD",
  "specialty": "Internal Medicine",
  "state": "FL",
  "city": "Miami",
  "total_beneficiaries": 842,
  "total_services": 4210,
  "total_medicare_payment": 187432.50,
  "em_99213": 1200,
  "em_99214": 890,
  "em_99215": 120,
  "ccm_99490_services": 45,
  "rpm_99454_services": 0,
  "awv_g0438_services": 68
}`;

  const benchmarkExample = `GET /api/cms/1234567890?benchmark=1

Response:
{
  "provider": { ... },
  "benchmark": {
    "specialty": "Internal Medicine",
    "provider_count": 45230,
    "avg_medicare_patients": 412,
    "avg_total_payment": 142800,
    "avg_revenue_per_patient": 346.60,
    "pct_99213": 0.42,
    "pct_99214": 0.38,
    "pct_99215": 0.08,
    "ccm_adoption_rate": 0.06,
    "rpm_adoption_rate": 0.03,
    "awv_adoption_rate": 0.52
  }
}`;

  const aggregateExample = `GET /api/data?state=FL&specialty=Internal+Medicine

Response:
{
  "providers": 8432,
  "avgPayment": 148200.50,
  "totalPayment": 1249492614,
  "totalServices": 42108530
}`;

  const nationalExample = `GET /api/data

Response:
{
  "providers": 892410,
  "avgPayment": 112400.25,
  "totalPayment": 100318591123,
  "totalServices": 2841093210
}`;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "API Documentation" }]} />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <Code2 className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                NPIxray Public Data{" "}
                <span className="text-gold">API</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Free access to Medicare provider billing data
              </p>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-gold" />
                <p className="text-sm font-semibold">Base URL</p>
              </div>
              <code className="text-xs text-gold font-mono">
                https://npixray.com/api
              </code>
            </div>
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gold" />
                <p className="text-sm font-semibold">Rate Limit</p>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                100 requests/day (no key)
              </p>
            </div>
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-gold" />
                <p className="text-sm font-semibold">Auth</p>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                No API key required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoint 1: Provider Billing Data */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400">
                GET
              </span>
              <code className="text-lg font-mono text-gold">
                /api/cms/[npi]
              </code>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              Retrieve billing data for a specific Medicare provider by NPI
              number. Returns detailed billing information including E&M code
              distribution, care management services, and total payment data.
            </p>

            <h3 className="text-sm font-semibold mb-2">Parameters</h3>
            <div className="rounded-lg border border-dark-50/50 bg-dark-300 p-4 mb-6">
              <div className="flex items-start gap-3 text-sm">
                <code className="text-gold font-mono">npi</code>
                <span className="text-[var(--text-secondary)]">
                  (path, required) &mdash; 10-digit NPI number
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm mt-2">
                <code className="text-gold font-mono">benchmark</code>
                <span className="text-[var(--text-secondary)]">
                  (query, optional) &mdash; Set to{" "}
                  <code className="text-gold">1</code> to include specialty
                  benchmark data
                </span>
              </div>
            </div>

            <h3 className="text-sm font-semibold mb-2">Example Request</h3>
            <CodeBlock>{providerExample}</CodeBlock>

            <h3 className="text-sm font-semibold mt-6 mb-2">
              With Benchmark Data
            </h3>
            <CodeBlock>{benchmarkExample}</CodeBlock>
          </div>
        </div>
      </section>

      {/* Endpoint 2: Aggregate Stats */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400">
                GET
              </span>
              <code className="text-lg font-mono text-gold">/api/data</code>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              Retrieve aggregate Medicare statistics. Filter by state, specialty,
              or both. Returns provider count, average payment, total payment,
              and total services.
            </p>

            <h3 className="text-sm font-semibold mb-2">Query Parameters</h3>
            <div className="rounded-lg border border-dark-50/50 bg-dark-300 p-4 mb-6">
              <div className="flex items-start gap-3 text-sm">
                <code className="text-gold font-mono">state</code>
                <span className="text-[var(--text-secondary)]">
                  (optional) &mdash; Two-letter state abbreviation (e.g., FL,
                  CA, NY)
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm mt-2">
                <code className="text-gold font-mono">specialty</code>
                <span className="text-[var(--text-secondary)]">
                  (optional) &mdash; Specialty name (e.g., &quot;Internal
                  Medicine&quot;, &quot;Cardiology&quot;)
                </span>
              </div>
            </div>

            <h3 className="text-sm font-semibold mb-2">
              Example: State + Specialty
            </h3>
            <CodeBlock>{aggregateExample}</CodeBlock>

            <h3 className="text-sm font-semibold mt-6 mb-2">
              Example: National Stats
            </h3>
            <CodeBlock>{nationalExample}</CodeBlock>

            <h3 className="text-sm font-semibold mt-6 mb-2">
              Filter Combinations
            </h3>
            <div className="overflow-x-auto rounded-lg border border-dark-50/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-50/50 bg-dark-300">
                    <th className="text-left px-4 py-2 font-medium text-[var(--text-secondary)]">
                      Parameters
                    </th>
                    <th className="text-left px-4 py-2 font-medium text-[var(--text-secondary)]">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dark-50/30">
                    <td className="px-4 py-2 font-mono text-xs text-gold">
                      (none)
                    </td>
                    <td className="px-4 py-2 text-[var(--text-secondary)]">
                      National aggregate stats
                    </td>
                  </tr>
                  <tr className="border-b border-dark-50/30 bg-dark-400/30">
                    <td className="px-4 py-2 font-mono text-xs text-gold">
                      state=FL
                    </td>
                    <td className="px-4 py-2 text-[var(--text-secondary)]">
                      Florida state-level stats
                    </td>
                  </tr>
                  <tr className="border-b border-dark-50/30">
                    <td className="px-4 py-2 font-mono text-xs text-gold">
                      specialty=Cardiology
                    </td>
                    <td className="px-4 py-2 text-[var(--text-secondary)]">
                      Cardiology national stats
                    </td>
                  </tr>
                  <tr className="bg-dark-400/30">
                    <td className="px-4 py-2 font-mono text-xs text-gold">
                      state=FL&specialty=Cardiology
                    </td>
                    <td className="px-4 py-2 text-[var(--text-secondary)]">
                      Cardiology in Florida
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits & Caching */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-6">
              Rate Limits & <span className="text-gold">Caching</span>
            </h2>
            <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                  Free Tier (No API Key)
                </h3>
                <ul className="space-y-1.5">
                  <li>100 requests per day per IP address</li>
                  <li>Responses cached for 1 hour</li>
                  <li>No authentication required</li>
                </ul>
              </div>
              <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                  Need Higher Limits?
                </h3>
                <p>
                  Contact us for API key access with higher rate limits and
                  additional endpoints. Enterprise plans include real-time data
                  access and custom queries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Source */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-6">
              Data <span className="text-gold">Source</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              All data is sourced from the CMS Medicare Physician &amp; Other
              Practitioners dataset, a free public dataset published by the
              Centers for Medicare &amp; Medicaid Services. Data covers Medicare
              Part B fee-for-service claims and includes provider demographics,
              service utilization, and payment information.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
