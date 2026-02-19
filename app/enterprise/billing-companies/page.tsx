import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  BarChart3,
  Users,
  ArrowRight,
  Home,
  ChevronRight,
  Zap,
  Shield,
  Code2,
  Calendar,
  Mail,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  Eye,
  Building2,
  Clock,
} from "lucide-react";
import { DataCoverage } from "@/components/seo/data-coverage";

export const metadata: Metadata = {
  title: "Revenue Intelligence for Billing Companies | NPIxray Enterprise",
  description:
    "Manage 50\u2013500+ NPIs with automated revenue gap reports, white-label PDF exports, bulk scanning, and API access. Prove ROI to every client. Starting at $299/mo.",
  keywords: [
    "medical billing company software",
    "NPI portfolio management",
    "revenue intelligence billing company",
    "billing company ROI tool",
    "Medicare revenue gap analysis",
    "bulk NPI scanning",
    "white-label medical reports",
  ],
  alternates: { canonical: "https://npixray.com/enterprise/billing-companies" },
  openGraph: {
    title: "Revenue Intelligence for Billing Companies | NPIxray",
    description:
      "Manage 50\u2013500+ NPIs. Prove ROI to every client with automated revenue gap reports.",
  },
};

const PAIN_POINTS = [
  {
    title: "Manual Spreadsheet Tracking",
    description:
      "You track client performance in Excel. No automated benchmarking, no real-time visibility into coding gaps or missed programs.",
    icon: FileSpreadsheet,
  },
  {
    title: "Can\u2019t Prove Value to Clients",
    description:
      "Clients ask \u201cwhat\u2019s our ROI?\u201d and you don\u2019t have data-backed answers. Retention suffers when you can\u2019t quantify impact.",
    icon: Eye,
  },
  {
    title: "No Visibility Into Coding Gaps",
    description:
      "You process claims but can\u2019t see the revenue your clients are leaving on the table from undercoding and missing programs.",
    icon: TrendingUp,
  },
];

const FEATURES = [
  {
    title: "Portfolio NPI Dashboard",
    description: "Monitor Revenue Scores across all client NPIs in one view. Track improvements month over month.",
    icon: BarChart3,
  },
  {
    title: "White-Label PDF Reports",
    description: "Generate branded revenue reports for each client. Share via email or embed in your QBRs.",
    icon: FileText,
  },
  {
    title: "Client Subaccounts",
    description: "Organize NPIs by client with separate dashboards, reports, and access controls.",
    icon: Users,
  },
  {
    title: "Bulk NPI Scanning",
    description: "Upload a CSV of NPIs and get revenue gap analysis for every provider in minutes, not days.",
    icon: Zap,
  },
  {
    title: "Full API Access",
    description: "Integrate NPIxray data into your own dashboards and workflows with our RESTful API.",
    icon: Code2,
  },
  {
    title: "Automated Monthly Reports",
    description: "Schedule reports that auto-generate and email to clients on the 1st of every month.",
    icon: Clock,
  },
];

const PRICING_TIERS = [
  {
    name: "Starter",
    npis: "Up to 50 NPIs",
    price: "$299",
    highlight: false,
  },
  {
    name: "Growth",
    npis: "Up to 200 NPIs",
    price: "$499",
    highlight: true,
  },
  {
    name: "Enterprise",
    npis: "500+ NPIs",
    price: "$999+",
    highlight: false,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "NPIxray Enterprise for Billing Companies",
  description:
    "Revenue intelligence platform for medical billing companies managing 50\u2013500+ NPIs.",
  url: "https://npixray.com/enterprise/billing-companies",
  brand: {
    "@type": "Organization",
    name: "NPIxray",
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "299",
    highPrice: "999",
    priceCurrency: "USD",
    offerCount: "3",
  },
};

export default function BillingCompaniesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6">
          <Link href="/" className="hover:text-gold transition-colors">
            <Home className="h-3.5 w-3.5" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
          <Link href="/enterprise" className="hover:text-gold transition-colors">
            Enterprise
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
          <span className="text-[var(--text-primary)]">Billing Companies</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-6">
            <Building2 className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-medium text-gold">
              Built for billing companies managing 50\u2013500+ NPIs
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 max-w-3xl mx-auto leading-[1.1]">
            Revenue Intelligence for{" "}
            <span className="text-gold">Billing Companies</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-8">
            Manage every client NPI from one dashboard. Prove ROI with automated
            revenue gap reports. Capture more revenue for your clients — and retain
            them longer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:sales@npixray.com?subject=Billing%20Company%20Demo%20Request"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-3.5 text-sm font-semibold text-dark hover:bg-gold-300 transition-all"
            >
              <Calendar className="h-4 w-4" />
              Book a Demo
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="mailto:sales@npixray.com?subject=Request%20Sample%20Report"
              className="inline-flex items-center gap-2 rounded-xl border border-dark-50 px-8 py-3.5 text-sm font-medium text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-all"
            >
              <Mail className="h-4 w-4" />
              Request Sample Report
            </a>
          </div>
        </div>

        {/* Pain Points */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-10">
            Sound <span className="text-gold">Familiar?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((pain) => (
              <div
                key={pain.title}
                className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 mb-4">
                  <pain.icon className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="font-bold mb-2">{pain.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {pain.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-3">
            Everything You Need to{" "}
            <span className="text-gold">Prove Value</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-center mb-10 max-w-xl mx-auto">
            One platform to monitor, analyze, and report on revenue performance
            across your entire client portfolio.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="rounded-2xl border border-dark-50/80 bg-dark-400/30 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 mb-4">
                  <feat.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-bold mb-2">{feat.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16 rounded-2xl border border-dark-50/50 bg-dark-400/20 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-center mb-10">
            How It <span className="text-gold">Works</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Your NPIs",
                desc: "Import a CSV of client NPIs or add them manually. We scan every provider against CMS data.",
              },
              {
                step: "2",
                title: "Get Revenue Gap Reports",
                desc: "Each NPI gets a Revenue Score, coding gap analysis, and missed program revenue estimate.",
              },
              {
                step: "3",
                title: "Prove ROI to Clients",
                desc: "Share white-label PDF reports showing exactly how much revenue you helped capture.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/20 mx-auto mb-4">
                  <span className="text-xl font-bold text-gold">{s.step}</span>
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-3">
            Simple, <span className="text-gold">Scalable Pricing</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-center mb-10 max-w-lg mx-auto">
            Pay based on the number of NPIs you manage. All plans include full
            features — no hidden fees.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-8 text-center ${
                  tier.highlight
                    ? "border-gold/40 bg-gold/[0.03] shadow-lg shadow-gold/10"
                    : "border-dark-50/80 bg-dark-400/30"
                }`}
              >
                {tier.highlight && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold text-dark uppercase tracking-wider mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  {tier.npis}
                </p>
                <p className="text-3xl font-bold font-mono text-gold mb-1">
                  {tier.price}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mb-6">/month</p>
                <ul className="text-sm text-[var(--text-secondary)] space-y-2 mb-6 text-left">
                  {[
                    "Portfolio dashboard",
                    "White-label PDF exports",
                    "Bulk NPI scanning",
                    "API access",
                    "Monthly auto-reports",
                    "Email support",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:sales@npixray.com?subject=Enterprise%20-%20Billing%20Companies%20-%20{tier.name}"
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all w-full ${
                    tier.highlight
                      ? "bg-gold text-dark hover:bg-gold-300"
                      : "border border-dark-50 text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold"
                  }`}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Trust / Social Proof */}
        <section className="mb-16 rounded-2xl border border-dark-50/50 bg-dark-400/20 p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "Providers Analyzed", value: "1.175M+" },
              { label: "Billing Records", value: "8.1M+" },
              { label: "Specialties Covered", value: "27" },
              { label: "States Covered", value: "50" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold font-mono text-gold">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center rounded-2xl border border-gold/20 bg-gold/5 p-10 mb-8">
          <Shield className="h-10 w-10 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">
            Ready to Prove Your Value?
          </h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-lg mx-auto">
            See how NPIxray can help your billing company retain clients and
            capture more revenue. Get a personalized demo with your own NPI data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:sales@npixray.com?subject=Billing%20Company%20Demo%20Request"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-3.5 text-sm font-semibold text-dark hover:bg-gold-300 transition-all"
            >
              <Calendar className="h-4 w-4" />
              Book a Demo
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/api-docs"
              className="inline-flex items-center gap-2 rounded-xl border border-dark-50 px-8 py-3.5 text-sm font-medium text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-all"
            >
              <Code2 className="h-4 w-4" />
              View API Docs
            </Link>
          </div>
        </section>

        <DataCoverage />
      </div>
    </>
  );
}
