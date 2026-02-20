import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { RevenueCalculatorTool } from "@/components/tools/revenue-calculator";

export const metadata: Metadata = {
  title: "Medicare Revenue Calculator — Estimate Practice Revenue",
  description:
    "Free Medicare revenue calculator for medical practices. Estimate total revenue by specialty, state, and patient count. See E&M breakdowns and CCM/RPM/AWV opportunities.",
  keywords: [
    "Medicare revenue calculator",
    "medical practice revenue estimate",
    "E&M revenue calculator",
    "CCM revenue estimate",
    "RPM revenue calculator",
    "healthcare billing calculator",
  ],
  alternates: {
    canonical: "https://npixray.com/tools/revenue-calculator",
  },
  openGraph: {
    title: "Medicare Revenue Calculator | NPIxray",
    description:
      "Estimate your practice's Medicare revenue by specialty, state, and patient count. See E&M breakdowns and program opportunities.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Medicare Revenue Calculator",
  url: "https://npixray.com/tools/revenue-calculator",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Free Medicare revenue calculator. Estimate total revenue by specialty, state, and patient count.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RevenueCalculatorPage() {
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
            { label: "Revenue Calculator" },
          ]}
        />

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Medicare Revenue{" "}
            <span className="text-[#2F5EA8]">Calculator</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            Estimate your practice&apos;s Medicare revenue potential based on
            specialty benchmarks, patient volume, and care management programs.
          </p>
        </div>

        <RevenueCalculatorTool />

        <ScanCTA />
      </div>
    </>
  );
}
