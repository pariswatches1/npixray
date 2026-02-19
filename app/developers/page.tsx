import type { Metadata } from "next";
import Link from "next/link";
import {
  Code2,
  Zap,
  Database,
  BarChart3,
  Building,
  GraduationCap,
  Stethoscope,
  ArrowRight,
  Key,
  Terminal,
  Globe,
  Users,
  TrendingUp,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Build on NPIxray — Healthcare Data API for Developers | NPIxray",
  description:
    "Build healthcare applications with NPIxray's Medicare billing data API. 1.2M+ providers, Revenue Scores, specialty benchmarks, and market intelligence. Free tier available.",
  keywords: [
    "healthcare API",
    "Medicare data for developers",
    "NPI data API",
    "medical billing data",
    "healthcare SaaS API",
    "CMS data API",
    "build with Medicare data",
  ],
  alternates: {
    canonical: "https://npixray.com/developers",
  },
  openGraph: {
    title: "Build on NPIxray — Healthcare Data API for Developers",
    description:
      "Access Medicare billing intelligence for your healthcare application. Free tier: 100 requests/day.",
  },
};

const USE_CASES = [
  {
    icon: Stethoscope,
    title: "EHR Integrations",
    description:
      "Embed Revenue Scores and benchmarks directly into electronic health record systems. Show providers how their billing compares to peers during documentation.",
    example: "Display a Revenue Score widget in your EHR sidebar",
  },
  {
    icon: Building,
    title: "Billing Software",
    description:
      "Build coding suggestions and revenue optimization into your medical billing platform. Flag undercoding patterns and missed care management revenue.",
    example: "Auto-flag 99213 visits that should be 99214 based on benchmarks",
  },
  {
    icon: GraduationCap,
    title: "Academic Research",
    description:
      "Study Medicare billing patterns at scale. Analyze specialty trends, geographic variation, and care management adoption across 1.2M+ providers.",
    example: "Compare CCM adoption rates across states and specialties",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboards",
    description:
      "Build healthcare market intelligence tools. Visualize provider performance, market opportunities, and competitive landscapes.",
    example: "Create a heatmap of Revenue Scores by state",
  },
  {
    icon: TrendingUp,
    title: "Sales Intelligence",
    description:
      "Power your healthcare sales team with data. Identify providers with low Revenue Scores as prospects for your billing services, CCM programs, or EHR platform.",
    example: "Find all Family Medicine providers in FL with score < 40",
  },
  {
    icon: Heart,
    title: "Patient Care Platforms",
    description:
      "Identify practices under-utilizing care management programs. Target providers who would benefit most from CCM, RPM, BHI, and AWV services.",
    example: "List cardiologists with 0 RPM billing but 500+ patients",
  },
];

const SHOWCASE = [
  {
    name: "Revenue Score Widget",
    description: "Embeddable widget showing a provider's Revenue Score and top opportunities.",
    tech: "React / JavaScript",
  },
  {
    name: "State Leaderboard",
    description: "Interactive map showing Medicare revenue metrics by state.",
    tech: "Python / Plotly",
  },
  {
    name: "Billing Audit Tool",
    description: "Upload a provider list and get batch Revenue Scores and gap analysis.",
    tech: "R / Shiny",
  },
];

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Hero */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-6">
          <Terminal className="h-3.5 w-3.5 text-gold" />
          <span className="text-xs font-medium text-gold">Developer Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-balance max-w-3xl mx-auto">
          Build on <span className="text-gold">NPIxray</span> Data
        </h1>

        <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Access Medicare billing intelligence for 1.2M+ providers. Revenue Scores,
          billing code breakdowns, specialty benchmarks, and market analysis — all
          through a simple REST API.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/api-docs"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-3.5 text-base font-semibold text-dark hover:bg-gold-300 transition-all"
          >
            <Code2 className="h-5 w-5" />
            View API Docs
          </Link>
          <a
            href="mailto:api@npixray.com?subject=Pro API Key Request"
            className="inline-flex items-center gap-2 rounded-xl border border-dark-50 px-8 py-3.5 text-base font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/30 transition-all"
          >
            <Key className="h-5 w-5" />
            Get API Key
          </a>
        </div>
      </div>

      {/* Quick start */}
      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Quick <span className="text-gold">Start</span>
        </h2>
        <div className="mx-auto max-w-2xl rounded-2xl border border-dark-50/80 bg-dark-300/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-50/50 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-mono">Terminal</span>
          </div>
          <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto">
            <code className="text-[var(--text-secondary)]">
              <span className="text-emerald-400">$</span>{" "}
              <span className="text-white">curl https://npixray.com/api/v1/provider/1306849450</span>
              {"\n\n"}
              <span className="text-[var(--text-secondary)]/60">{`{`}</span>
              {"\n  "}
              <span className="text-gold">&quot;data&quot;</span>
              <span className="text-[var(--text-secondary)]/60">: {`{`}</span>
              {"\n    "}
              <span className="text-gold">&quot;name&quot;</span>
              <span className="text-[var(--text-secondary)]/60">: </span>
              <span className="text-emerald-400">&quot;JAMES MARTINEZ&quot;</span>
              <span className="text-[var(--text-secondary)]/60">,</span>
              {"\n    "}
              <span className="text-gold">&quot;specialty&quot;</span>
              <span className="text-[var(--text-secondary)]/60">: </span>
              <span className="text-emerald-400">&quot;Urology&quot;</span>
              <span className="text-[var(--text-secondary)]/60">,</span>
              {"\n    "}
              <span className="text-gold">&quot;revenue_score&quot;</span>
              <span className="text-[var(--text-secondary)]/60">: </span>
              <span className="text-orange-400">42</span>
              <span className="text-[var(--text-secondary)]/60">,</span>
              {"\n    "}
              <span className="text-gold">&quot;total_medicare_payment&quot;</span>
              <span className="text-[var(--text-secondary)]/60">: </span>
              <span className="text-orange-400">245832.50</span>
              {"\n  "}
              <span className="text-[var(--text-secondary)]/60">{`}`}</span>
              {"\n"}
              <span className="text-[var(--text-secondary)]/60">{`}`}</span>
            </code>
          </pre>
        </div>
        <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
          No API key required for basic lookups. 100 free requests per day.
        </p>
      </div>

      {/* What you can access */}
      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          What You Can <span className="text-gold">Access</span>
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-12 max-w-lg mx-auto">
          CMS public data enriched with Revenue Scores and opportunity analysis.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Users, title: "1.2M+ Providers", desc: "Every Medicare provider in the US with billing data, specialty, and location." },
            { icon: Database, title: "10M+ Billing Records", desc: "HCPCS/CPT codes, service counts, payment amounts, and beneficiary data." },
            { icon: BarChart3, title: "Revenue Scores", desc: "0-100 score measuring how well each provider captures available revenue." },
            { icon: TrendingUp, title: "Specialty Benchmarks", desc: "E&M coding rates, care management adoption, and payment benchmarks for 20+ specialties." },
            { icon: Globe, title: "Market Intelligence", desc: "Aggregate stats by state, city, and specialty. Adoption rates and missed revenue estimates." },
            { icon: Zap, title: "Opportunity Analysis", desc: "CCM, RPM, BHI, AWV gaps and estimated missed revenue for every provider." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 hover:border-gold/20 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 border border-gold/20 mb-4">
                <item.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use cases */}
      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          What You Can <span className="text-gold">Build</span>
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-12 max-w-lg mx-auto">
          Every developer who builds on NPIxray becomes a distribution channel.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((uc) => (
            <div key={uc.title} className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 hover:border-gold/20 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 border border-gold/20 mb-4">
                <uc.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="font-bold mb-2">{uc.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{uc.description}</p>
              <div className="rounded-lg border border-dark-50/50 bg-dark-500/50 px-3 py-2">
                <p className="text-xs text-gold font-mono">{uc.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Showcase */}
      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          Built With <span className="text-gold">NPIxray</span>
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-12 max-w-lg mx-auto">
          Ideas for what you can build. Ship something cool and we&apos;ll feature it here.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SHOWCASE.map((item) => (
            <div key={item.name} className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
              <h3 className="font-bold mb-1">{item.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{item.description}</p>
              <span className="text-xs text-gold font-mono">{item.tech}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          API <span className="text-gold">Pricing</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
            <h3 className="text-xl font-bold mb-1">Free</h3>
            <p className="text-3xl font-bold font-mono text-gold mb-4">$0<span className="text-sm text-[var(--text-secondary)] font-normal">/mo</span></p>
            <ul className="text-sm text-[var(--text-secondary)] space-y-2 mb-6">
              <li>100 requests/day</li>
              <li>Provider lookup + Revenue Score</li>
              <li>Provider search</li>
              <li>Specialty benchmarks</li>
              <li>State aggregate stats</li>
            </ul>
            <Link
              href="/api-docs"
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-dark-50 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/30 transition-all"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-xl border border-gold/30 bg-gold/5 p-6 relative">
            <div className="absolute -top-3 right-4 rounded-full bg-gold px-3 py-0.5 text-xs font-bold text-dark">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-1">Pro</h3>
            <p className="text-3xl font-bold font-mono text-gold mb-4">$49<span className="text-sm text-[var(--text-secondary)] font-normal">/mo</span></p>
            <ul className="text-sm text-[var(--text-secondary)] space-y-2 mb-6">
              <li>10,000 requests/day</li>
              <li>Everything in Free +</li>
              <li>Full billing breakdowns</li>
              <li>All billing codes per provider</li>
              <li>Multi-provider comparison</li>
              <li>Market intelligence</li>
              <li>Score distributions</li>
            </ul>
            <a
              href="mailto:api@npixray.com?subject=Pro API Key Request"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold py-2.5 text-sm font-semibold text-dark hover:bg-gold-300 transition-all"
            >
              <Key className="h-4 w-4" />
              Get Pro Key
            </a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Start Building <span className="text-gold">Today</span>
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
          No API key needed for the free tier. Just start making requests.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/api-docs"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-3.5 text-base font-semibold text-dark hover:bg-gold-300 transition-all"
          >
            <Code2 className="h-5 w-5" />
            Read the Docs
          </Link>
          <Link
            href="/api-docs#playground"
            className="inline-flex items-center gap-2 rounded-xl border border-dark-50 px-8 py-3.5 text-base font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/30 transition-all"
          >
            <Terminal className="h-5 w-5" />
            Try the Playground
          </Link>
        </div>
      </div>
    </div>
  );
}
