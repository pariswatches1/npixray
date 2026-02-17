import type { Metadata } from "next";
import Link from "next/link";
import {
  RefreshCw,
  ArrowRight,
  FileSpreadsheet,
  Building2,
  BarChart3,
  ClipboardList,
  UserCheck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";

export const metadata: Metadata = {
  title: "Switch to NPIxray — Migration Guides | NPIxray",
  description:
    "Ready to switch to NPIxray? Step-by-step migration guides from ChartSpan, SignalLamp, spreadsheets, manual billing analysis, and revenue consultants.",
  openGraph: {
    title: "Switch to NPIxray — Migration Guides",
    description:
      "Step-by-step migration guides from ChartSpan, SignalLamp, spreadsheets, manual billing, and consultants to NPIxray.",
  },
};

const SWITCH_PAGES = [
  {
    slug: "from-chartspan",
    source: "ChartSpan",
    description:
      "See what ChartSpan's CCM-only focus is missing. Get full Medicare revenue visibility across E&M, RPM, BHI, and AWV programs.",
    icon: Building2,
    tagline: "Beyond CCM-only analytics",
  },
  {
    slug: "from-signallamp",
    source: "SignalLamp",
    description:
      "Deeper analytics, lower cost, and a free entry point. Compare NPIxray's AI-powered insights against SignalLamp's reports.",
    icon: BarChart3,
    tagline: "Better analytics, lower price",
  },
  {
    slug: "from-spreadsheets",
    source: "Spreadsheets",
    description:
      "Stop spending hours on manual data processing. NPIxray automates what takes days in Excel — with more accuracy and depth.",
    icon: FileSpreadsheet,
    tagline: "Automate hours of manual work",
  },
  {
    slug: "from-manual-billing",
    source: "Manual Billing Analysis",
    description:
      "Go from reactive EOB reviews to proactive revenue intelligence. See what you should be billing, not just what you billed.",
    icon: ClipboardList,
    tagline: "Proactive vs. reactive analysis",
  },
  {
    slug: "from-consultant",
    source: "Revenue Consultant",
    description:
      "Get the same analysis your consultant charges $10K+ for — instantly, continuously, and for 95% less. Real CMS data, AI insights.",
    icon: UserCheck,
    tagline: "95% cost reduction",
  },
];

export default function SwitchIndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "Switch to NPIxray" }]} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <RefreshCw className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                Migration Guides
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Switch to{" "}
              <span className="text-gold">NPIxray</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              No matter what you are using today — a competitor platform,
              spreadsheets, manual review, or a consultant — switching to
              NPIxray is fast, easy, and risk-free. Start with a free NPI scan.
            </p>
          </div>
        </div>
      </section>

      {/* Switch Cards */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SWITCH_PAGES.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.slug}
                  href={`/switch/${page.slug}`}
                  className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h2 className="font-semibold group-hover:text-gold transition-colors">
                        From {page.source}
                      </h2>
                      <p className="text-[10px] text-gold font-medium uppercase tracking-wider">
                        {page.tagline}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 mb-4">
                    {page.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] group-hover:text-gold transition-colors">
                    Read migration guide
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why NPIxray section */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">
              Why Practices <span className="text-gold">Choose NPIxray</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Real CMS Medicare data, AI-powered analysis, and a free entry
              point that no competitor matches.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold font-mono text-gold mb-1">
                1.2M+
              </p>
              <p className="text-sm font-semibold mb-1">Providers Benchmarked</p>
              <p className="text-xs text-[var(--text-secondary)]">
                Full CMS Medicare dataset for accurate peer comparisons
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-mono text-gold mb-1">
                30 sec
              </p>
              <p className="text-sm font-semibold mb-1">Time to First Insight</p>
              <p className="text-xs text-[var(--text-secondary)]">
                Free NPI scan — no account, no credit card, no commitment
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-mono text-gold mb-1">
                5+
              </p>
              <p className="text-sm font-semibold mb-1">Programs Analyzed</p>
              <p className="text-xs text-[var(--text-secondary)]">
                E&M, CCM, RPM, BHI, AWV — complete revenue picture
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
