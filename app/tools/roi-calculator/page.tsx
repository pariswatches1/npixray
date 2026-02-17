import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { RoiCalculatorTool } from "@/components/tools/roi-calculator";

export const metadata: Metadata = {
  title: "Calculate Your ROI with NPIxray — Free Revenue Calculator",
  description:
    "Free ROI calculator for medical practices. Estimate missed revenue from E&M coding gaps, CCM, RPM, BHI, and AWV programs. See your potential return on investment with NPIxray.",
  keywords: [
    "ROI calculator healthcare",
    "medical practice ROI calculator",
    "CCM revenue calculator",
    "RPM revenue calculator",
    "healthcare revenue calculator",
    "NPIxray ROI",
    "billing analytics ROI",
    "practice revenue potential",
    "Medicare revenue calculator",
  ],
  openGraph: {
    title: "ROI Calculator — Estimate Your Revenue Recovery | NPIxray",
    description:
      "Calculate your potential return on investment with NPIxray. Estimate missed revenue from E&M coding, CCM, RPM, BHI, and AWV programs.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NPIxray ROI Calculator",
  url: "https://npixray.com/tools/roi-calculator",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Free ROI calculator for medical practices. Estimate missed revenue from E&M coding gaps and care management programs.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RoiCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "ROI Calculator" },
          ]}
        />

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            NPIxray ROI{" "}
            <span className="text-gold">Calculator</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            Estimate how much revenue your practice is missing and calculate
            your return on investment with NPIxray. Based on real CMS specialty
            benchmarks.
          </p>
        </div>

        <RoiCalculatorTool />

        <ScanCTA />
      </div>
    </>
  );
}
