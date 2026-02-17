import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Zap, Lock, Clock, ArrowRight, Key, Star } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ApiPlayground } from "@/components/api/playground";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "NPIxray API Documentation — Medicare Billing Data API | NPIxray",
  description:
    "Free public API for Medicare provider billing data. Look up providers by NPI, search by name, get specialty benchmarks, state stats, and market intelligence. Code examples in Python, JavaScript, R, and cURL.",
  keywords: [
    "Medicare data API",
    "NPI lookup API",
    "healthcare data API",
    "CMS provider data API",
    "Medicare billing API",
    "NPI data API",
    "CMS data API",
    "healthcare billing intelligence API",
  ],
  openGraph: {
    title: "NPIxray API — Medicare Billing Intelligence API",
    description:
      "Free API for Medicare provider data. 1.2M+ providers, Revenue Scores, benchmarks, and market intelligence.",
  },
};

function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <pre className="rounded-lg border border-dark-50/50 bg-[#0a0908] p-4 overflow-x-auto text-xs font-mono leading-relaxed">
      {language && (
        <div className="text-[10px] text-[var(--text-secondary)]/60 uppercase tracking-wider mb-2">{language}</div>
      )}
      <code className="text-[var(--text-secondary)]">{children}</code>
    </pre>
  );
}

function EndpointSection({
  method,
  path,
  description,
  params,
  tier,
  example,
}: {
  method: string;
  path: string;
  description: string;
  params: { name: string; location: string; desc: string }[];
  tier: "free" | "pro";
  example: string;
}) {
  return (
    <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400">
          {method}
        </span>
        <code className="text-sm sm:text-base font-mono text-gold">{path}</code>
        {tier === "pro" && (
          <span className="rounded-full bg-gold/10 border border-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold uppercase tracking-wider">
            Pro
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{description}</p>

      {params.length > 0 && (
        <div className="rounded-lg border border-dark-50/50 bg-dark-500/50 p-3 mb-4">
          {params.map((p, i) => (
            <div key={p.name} className={`flex items-start gap-3 text-sm ${i > 0 ? "mt-2 pt-2 border-t border-dark-50/30" : ""}`}>
              <code className="text-gold font-mono text-xs shrink-0">{p.name}</code>
              <span className="text-[var(--text-secondary)] text-xs">
                <span className="text-[var(--text-secondary)]/60">({p.location})</span> {p.desc}
              </span>
            </div>
          ))}
        </div>
      )}

      <CodeBlock>{example}</CodeBlock>
    </div>
  );
}

export default function ApiDocsPage() {
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
                NPIxray <span className="text-gold">API</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Medicare billing intelligence for developers
              </p>
            </div>
          </div>

          <p className="text-[var(--text-secondary)] max-w-2xl leading-relaxed mt-4">
            Access data on 1.2M+ Medicare providers. Revenue Scores, billing code breakdowns,
            specialty benchmarks, and market intelligence — all from CMS public data.
          </p>

          {/* Quick Info Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-3xl">
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-gold" />
                <p className="text-sm font-semibold">Base URL</p>
              </div>
              <code className="text-xs text-gold font-mono">npixray.com/api/v1</code>
            </div>
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gold" />
                <p className="text-sm font-semibold">Free Tier</p>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">100 req/day, no key</p>
            </div>
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4 text-gold" />
                <p className="text-sm font-semibold">Pro Tier</p>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">10K req/day, API key</p>
            </div>
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-gold" />
                <p className="text-sm font-semibold">Auth</p>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">X-API-Key header</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Playground */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">
            API <span className="text-gold">Playground</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Try the API live — enter an NPI number and see the response.
          </p>
          <ApiPlayground />
        </div>
      </section>

      {/* Authentication */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">
              <span className="text-gold">Authentication</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              Free tier endpoints require no authentication. For Pro endpoints, include your
              API key in the request header:
            </p>
            <CodeBlock language="http">{`GET /api/v1/provider/1234567890/full
Host: npixray.com
X-API-Key: npx_your_api_key_here

# Or use the Authorization header:
Authorization: Bearer npx_your_api_key_here`}</CodeBlock>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
                <h3 className="font-semibold mb-2">Free Tier</h3>
                <ul className="text-sm text-[var(--text-secondary)] space-y-1.5">
                  <li>100 requests per day per IP</li>
                  <li>Provider lookup + Revenue Score</li>
                  <li>Provider search</li>
                  <li>Specialty benchmarks</li>
                  <li>State aggregate stats</li>
                </ul>
              </div>
              <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-gold" />
                  <h3 className="font-semibold">Pro Tier — $49/mo</h3>
                </div>
                <ul className="text-sm text-[var(--text-secondary)] space-y-1.5">
                  <li>10,000 requests per day</li>
                  <li>Full billing breakdowns</li>
                  <li>All billing codes per provider</li>
                  <li>Multi-provider comparison</li>
                  <li>Market intelligence</li>
                  <li>Score distributions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Endpoints */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">
              Free <span className="text-gold">Endpoints</span>
            </h2>

            <EndpointSection
              method="GET"
              path="/api/v1/provider/{npi}"
              description="Get basic provider info including name, specialty, location, Medicare payment totals, and Revenue Score."
              tier="free"
              params={[
                { name: "npi", location: "path, required", desc: "10-digit NPI number" },
              ]}
              example={`curl https://npixray.com/api/v1/provider/1306849450

{
  "data": {
    "npi": "1306849450",
    "name": "JAMES MARTINEZ",
    "credential": "MD",
    "specialty": "Urology",
    "state": "FL",
    "city": "MIAMI",
    "total_medicare_payment": 245832.50,
    "total_beneficiaries": 542,
    "total_services": 3210,
    "revenue_score": 42
  }
}`}
            />

            <EndpointSection
              method="GET"
              path="/api/v1/search"
              description="Search for providers by name, state, and/or specialty. Returns up to 50 results sorted by Medicare payment."
              tier="free"
              params={[
                { name: "name", location: "query", desc: "Provider name (first, last, or full)" },
                { name: "state", location: "query", desc: "Two-letter state abbreviation" },
                { name: "specialty", location: "query", desc: "Specialty name" },
                { name: "limit", location: "query", desc: "Results limit (max 50, default 20)" },
              ]}
              example={`curl "https://npixray.com/api/v1/search?name=Smith&state=FL&limit=5"

{
  "data": [
    {
      "npi": "1234567890",
      "name": "JOHN SMITH",
      "specialty": "Internal Medicine",
      "state": "FL",
      "city": "MIAMI",
      "revenue_score": 58,
      ...
    }
  ],
  "total": 5
}`}
            />

            <EndpointSection
              method="GET"
              path="/api/v1/benchmarks/{specialty?}"
              description="Get specialty benchmark data including E&M coding rates, care management adoption, and average payments. Omit specialty for all benchmarks."
              tier="free"
              params={[
                { name: "specialty", location: "path, optional", desc: "Specialty slug (e.g. 'internal-medicine') or exact name" },
              ]}
              example={`curl https://npixray.com/api/v1/benchmarks/internal-medicine

{
  "data": {
    "specialty": "Internal Medicine",
    "provider_count": 88703,
    "avg_medicare_patients": 169,
    "avg_total_payment": 77297,
    "pct_99214": 0.6073,
    "ccm_adoption_rate": 0.045,
    "awv_adoption_rate": 0.3536,
    ...
  }
}`}
            />

            <EndpointSection
              method="GET"
              path="/api/v1/stats/{state?}"
              description="Get aggregate Medicare statistics for a state, including top specialties and cities. Omit state for all states."
              tier="free"
              params={[
                { name: "state", location: "path, optional", desc: "Two-letter state abbreviation" },
              ]}
              example={`curl https://npixray.com/api/v1/stats/FL

{
  "data": {
    "state": "FL",
    "name": "Florida",
    "total_providers": 42150,
    "total_payment": 5892431000,
    "avg_payment": 139810,
    "top_specialties": [...],
    "top_cities": [...]
  }
}`}
            />
          </div>
        </div>
      </section>

      {/* Pro Endpoints */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-2">
              Pro <span className="text-gold">Endpoints</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Require a Pro API key ($49/mo). <Link href="/developers" className="text-gold hover:underline">Get your key</Link>
            </p>

            <EndpointSection
              method="GET"
              path="/api/v1/provider/{npi}/full"
              description="Complete billing breakdown including E&M distribution, all care management codes, estimated missed revenue, and specialty benchmark comparison."
              tier="pro"
              params={[
                { name: "npi", location: "path, required", desc: "10-digit NPI number" },
              ]}
              example={`curl -H "X-API-Key: npx_your_key" \\
  https://npixray.com/api/v1/provider/1306849450/full

{
  "data": {
    "npi": "1306849450",
    "name": "JAMES MARTINEZ",
    "revenue_score": 42,
    "em_distribution": {
      "em_99213": 1200, "em_99214": 890, "em_99215": 120, ...
    },
    "care_management": {
      "ccm_99490_services": 0, "rpm_99454_services": 0, ...
    },
    "estimated_missed_revenue": 563230,
    "benchmark": { ... }
  }
}`}
            />

            <EndpointSection
              method="GET"
              path="/api/v1/provider/{npi}/codes"
              description="All HCPCS/CPT codes billed by a provider with service counts and payment amounts."
              tier="pro"
              params={[
                { name: "npi", location: "path, required", desc: "10-digit NPI number" },
                { name: "limit", location: "query", desc: "Max results (default 50, max 200)" },
              ]}
              example={`curl -H "X-API-Key: npx_your_key" \\
  https://npixray.com/api/v1/provider/1306849450/codes

{
  "data": {
    "npi": "1306849450",
    "name": "JAMES MARTINEZ",
    "codes": [
      { "hcpcs_code": "99214", "services": 890, "payment": 115752 },
      { "hcpcs_code": "99213", "services": 1200, "payment": 110400 },
      ...
    ]
  }
}`}
            />

            <EndpointSection
              method="GET"
              path="/api/v1/compare"
              description="Compare 2-10 providers side by side with full billing breakdowns and Revenue Scores."
              tier="pro"
              params={[
                { name: "npis", location: "query, required", desc: "Comma-separated NPI numbers (2-10)" },
              ]}
              example={`curl -H "X-API-Key: npx_your_key" \\
  "https://npixray.com/api/v1/compare?npis=1306849450,1234567890"

{
  "data": [
    { "npi": "1306849450", "revenue_score": 42, ... },
    { "npi": "1234567890", "revenue_score": 67, ... }
  ]
}`}
            />

            <EndpointSection
              method="GET"
              path="/api/v1/market/{state}/{city?}/{specialty?}"
              description="Market intelligence for a geographic + specialty segment. Includes adoption rates, E&M distribution, missed revenue estimates, and top providers."
              tier="pro"
              params={[
                { name: "state", location: "path, required", desc: "Two-letter state code" },
                { name: "city", location: "path, optional", desc: "City name" },
                { name: "specialty", location: "path, optional", desc: "Specialty name" },
              ]}
              example={`curl -H "X-API-Key: npx_your_key" \\
  "https://npixray.com/api/v1/market/FL/Miami/Internal%20Medicine"

{
  "data": {
    "market": { "state": "FL", "city": "Miami", "specialty": "Internal Medicine" },
    "summary": {
      "providers": 342, "estimated_missed_revenue": 48200000,
      "capture_rate": 58
    },
    "adoption_rates": { "ccm": 4, "rpm": 2, "bhi": 0, "awv": 35 },
    "top_providers": [...]
  }
}`}
            />

            <EndpointSection
              method="GET"
              path="/api/v1/scores/{state}/{specialty?}"
              description="Revenue Score distribution across providers. See how scores are spread for any state/specialty segment."
              tier="pro"
              params={[
                { name: "state", location: "path, required", desc: "Two-letter state code" },
                { name: "specialty", location: "path, optional", desc: "Specialty name" },
              ]}
              example={`curl -H "X-API-Key: npx_your_key" \\
  "https://npixray.com/api/v1/scores/FL/Internal%20Medicine"

{
  "data": {
    "state": "FL",
    "specialty": "Internal Medicine",
    "distribution": [
      { "bucket": "0-20", "count": 45 },
      { "bucket": "21-40", "count": 128 },
      { "bucket": "41-60", "count": 201 },
      { "bucket": "61-80", "count": 89 },
      { "bucket": "81-100", "count": 23 }
    ],
    "total": 486
  }
}`}
            />
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">
              Code <span className="text-gold">Examples</span>
            </h2>

            <h3 className="text-sm font-semibold mb-2">Python</h3>
            <CodeBlock language="python">{`import requests

# Free tier — no key needed
response = requests.get("https://npixray.com/api/v1/provider/1306849450")
provider = response.json()["data"]
print(f"{provider['name']} — Revenue Score: {provider['revenue_score']}")

# Pro tier — with API key
headers = {"X-API-Key": "npx_your_api_key"}
response = requests.get(
    "https://npixray.com/api/v1/provider/1306849450/full",
    headers=headers
)
full = response.json()["data"]
print(f"Missed Revenue: ${full['estimated_missed_revenue']:,}")`}</CodeBlock>

            <h3 className="text-sm font-semibold mt-6 mb-2">JavaScript / Node.js</h3>
            <CodeBlock language="javascript">{`// Free tier
const res = await fetch("https://npixray.com/api/v1/provider/1306849450");
const { data } = await res.json();
console.log(\`\${data.name} — Score: \${data.revenue_score}\`);

// Pro tier
const proRes = await fetch("https://npixray.com/api/v1/provider/1306849450/full", {
  headers: { "X-API-Key": "npx_your_api_key" }
});
const { data: full } = await proRes.json();
console.log(\`Missed: $\${full.estimated_missed_revenue.toLocaleString()}\`);`}</CodeBlock>

            <h3 className="text-sm font-semibold mt-6 mb-2">R</h3>
            <CodeBlock language="r">{`library(httr)
library(jsonlite)

# Free tier
res <- GET("https://npixray.com/api/v1/provider/1306849450")
data <- content(res, as = "parsed")$data
cat(sprintf("%s — Revenue Score: %d\\n", data$name, data$revenue_score))

# Search for providers
res <- GET("https://npixray.com/api/v1/search",
           query = list(name = "Smith", state = "FL"))
providers <- content(res, as = "parsed")$data`}</CodeBlock>

            <h3 className="text-sm font-semibold mt-6 mb-2">cURL</h3>
            <CodeBlock language="bash">{`# Provider lookup
curl https://npixray.com/api/v1/provider/1306849450

# Search
curl "https://npixray.com/api/v1/search?name=Smith&state=FL"

# Benchmarks
curl https://npixray.com/api/v1/benchmarks/internal-medicine

# Pro endpoint (with API key)
curl -H "X-API-Key: npx_your_key" \\
  https://npixray.com/api/v1/provider/1306849450/full`}</CodeBlock>
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">
              Rate Limits & <span className="text-gold">Headers</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              Every response includes rate limit headers:
            </p>
            <CodeBlock>{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 2026-02-18T00:00:00.000Z`}</CodeBlock>

            <div className="mt-6 overflow-x-auto rounded-lg border border-dark-50/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-50/50 bg-dark-300">
                    <th className="text-left px-4 py-2 font-medium text-[var(--text-secondary)]">Tier</th>
                    <th className="text-left px-4 py-2 font-medium text-[var(--text-secondary)]">Daily Limit</th>
                    <th className="text-left px-4 py-2 font-medium text-[var(--text-secondary)]">Auth</th>
                    <th className="text-left px-4 py-2 font-medium text-[var(--text-secondary)]">Endpoints</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dark-50/30">
                    <td className="px-4 py-2 font-medium">Anonymous</td>
                    <td className="px-4 py-2 font-mono text-gold">100</td>
                    <td className="px-4 py-2 text-[var(--text-secondary)]">None (IP-based)</td>
                    <td className="px-4 py-2 text-[var(--text-secondary)]">Free endpoints only</td>
                  </tr>
                  <tr className="border-b border-dark-50/30 bg-dark-400/30">
                    <td className="px-4 py-2 font-medium">Free Key</td>
                    <td className="px-4 py-2 font-mono text-gold">100</td>
                    <td className="px-4 py-2 text-[var(--text-secondary)]">API Key</td>
                    <td className="px-4 py-2 text-[var(--text-secondary)]">Free endpoints only</td>
                  </tr>
                  <tr className="bg-dark-400/30">
                    <td className="px-4 py-2 font-medium text-gold">Pro Key</td>
                    <td className="px-4 py-2 font-mono text-gold">10,000</td>
                    <td className="px-4 py-2 text-[var(--text-secondary)]">API Key</td>
                    <td className="px-4 py-2 text-[var(--text-secondary)]">All endpoints</td>
                  </tr>
                </tbody>
              </table>
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
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              All data is sourced from the CMS Medicare Physician &amp; Other
              Practitioners dataset, a free public dataset published by the
              Centers for Medicare &amp; Medicaid Services. Data covers Medicare
              Part B fee-for-service claims and includes provider demographics,
              service utilization, and payment information.
            </p>
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-dark hover:bg-gold-300 transition-all"
            >
              <Code2 className="h-4 w-4" />
              Start Building
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
