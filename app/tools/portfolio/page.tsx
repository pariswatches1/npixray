import type { Metadata } from "next";
import { Briefcase, Zap } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PortfolioAnalyzer } from "@/components/acquire/portfolio-analyzer";
import { EarlyAccessCTA } from "@/components/acquire/early-access-cta";

export const metadata: Metadata = {
  title: "Practice Portfolio Analysis Tool — Multi-NPI Revenue Intelligence | NPIxray",
  description:
    "Analyze a portfolio of 2-20 medical practices. See combined acquisition scores, total missed revenue, and a prioritized optimization roadmap for PE firms and practice management groups.",
  keywords: [
    "medical practice portfolio analysis",
    "multi-NPI analysis",
    "healthcare portfolio optimization",
    "practice management group analysis",
    "PE practice portfolio",
    "medical practice ROI",
    "acquisition portfolio tool",
  ],
  alternates: {
    canonical: "https://npixray.com/tools/portfolio",
  },
  openGraph: {
    title: "Practice Portfolio Analysis | NPIxray",
    description:
      "Enter 2-20 NPIs to see combined acquisition scores, total upside revenue, and prioritized optimization actions.",
  },
};

export default function PortfolioToolPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Tools", href: "/tools" },
              { label: "Portfolio Analysis" },
            ]}
          />

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-1.5 mb-8">
              <Briefcase className="h-3.5 w-3.5 text-[#2F5EA8]" />
              <span className="text-xs font-medium text-[#2F5EA8]">
                Portfolio Analysis Tool
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Analyze Your Practice{" "}
              <span className="text-[#2F5EA8]">Portfolio</span>
            </h1>

            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Enter 2-20 NPIs to see combined acquisition scores, total missed
              revenue, and a prioritized optimization roadmap across your portfolio.
            </p>
          </div>
        </div>
      </section>

      {/* Tool */}
      <section className="pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <PortfolioAnalyzer />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 border-t border-[var(--border-light)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-10">
            How Portfolio Analysis <span className="text-[#2F5EA8]">Works</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Enter NPIs",
                description:
                  "Add the NPI numbers of practices in your portfolio or acquisition pipeline. Support for 2-20 practices.",
              },
              {
                step: "2",
                title: "Instant Scoring",
                description:
                  "Each practice is scored on upside potential, patient base value, optimization readiness, and market position.",
              },
              {
                step: "3",
                title: "Actionable Roadmap",
                description:
                  "Get a prioritized list of revenue optimization actions ranked by impact across your entire portfolio.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/15 mb-4">
                  <span className="text-sm font-bold text-[#2F5EA8]">{item.step}</span>
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 border-t border-[var(--border-light)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <EarlyAccessCTA
            title="Upgrade to Automated Portfolio Monitoring"
            subtitle="Track your portfolio's performance over time. Get alerts when optimization opportunities arise, and automated quarterly reports."
            tier="$499-999/mo"
          />
        </div>
      </section>
    </>
  );
}
