import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ForecastTool } from "@/components/tools/forecast-tool";
import { EarlyAccessCTA } from "@/components/acquire/early-access-cta";

export const metadata: Metadata = {
  title: "Revenue Forecast Calculator — 12-Month Projection | NPIxray",
  description:
    "Project 12-month Medicare revenue growth by adding care management programs (CCM, RPM, BHI, AWV) and optimizing E&M coding. Interactive what-if scenarios with real CMS benchmarks.",
  keywords: [
    "medical revenue forecast",
    "CCM revenue projection",
    "RPM revenue calculator",
    "Medicare revenue growth",
    "care management ROI",
    "E&M coding optimization",
    "medical practice revenue forecast",
    "12-month revenue projection",
    "healthcare revenue calculator",
  ],
  alternates: {
    canonical: "https://npixray.com/tools/forecast",
  },
  openGraph: {
    title: "Revenue Forecast Calculator | NPIxray",
    description:
      "Project 12-month revenue growth for your medical practice. Toggle programs, adjust enrollment, compare scenarios.",
  },
};

export default function ForecastToolPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Tools", href: "/tools" },
              { label: "Revenue Forecast" },
            ]}
          />

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-1.5 mb-8">
              <TrendingUp className="h-3.5 w-3.5 text-[#2F5EA8]" />
              <span className="text-xs font-medium text-[#2F5EA8]">
                12-Month Forecast
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Revenue Forecast{" "}
              <span className="text-[#2F5EA8]">Calculator</span>
            </h1>

            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Project 12-month revenue growth by adding care management programs
              and optimizing E&M coding. Compare scenarios side by side.
            </p>
          </div>
        </div>
      </section>

      {/* Tool */}
      <section className="pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ForecastTool />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 border-t border-[var(--border-light)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <EarlyAccessCTA
            title="Get a Custom Forecast for Your Practice"
            subtitle="Scan your NPI for a personalized 12-month projection based on your actual CMS billing data, not estimates."
            tier="Free NPI Scan"
          />
        </div>
      </section>
    </>
  );
}
