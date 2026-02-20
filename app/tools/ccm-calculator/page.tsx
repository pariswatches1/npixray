import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { CcmCalculatorTool } from "@/components/tools/ccm-calculator";

export const metadata: Metadata = {
  title: "CCM Revenue Calculator — Chronic Care Management Billing",
  description:
    "Free CCM revenue calculator. Estimate Chronic Care Management billing potential with CPT 99490 and 99439. See monthly and annual revenue projections for your practice.",
  keywords: [
    "CCM calculator",
    "CCM revenue calculator",
    "Chronic Care Management billing",
    "99490 billing calculator",
    "99439 add-on billing",
    "CCM revenue potential",
    "chronic care management revenue",
  ],
  alternates: {
    canonical: "https://npixray.com/tools/ccm-calculator",
  },
  openGraph: {
    title: "CCM Revenue Calculator | NPIxray",
    description:
      "Calculate your Chronic Care Management revenue potential with CPT 99490 and 99439 billing codes.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CCM Revenue Calculator",
  url: "https://npixray.com/tools/ccm-calculator",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Free CCM revenue calculator for Chronic Care Management billing with CPT 99490 and 99439.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function CcmCalculatorPage() {
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
            { label: "CCM Calculator" },
          ]}
        />

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            CCM Revenue{" "}
            <span className="text-[#2F5EA8]">Calculator</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            Estimate your Chronic Care Management revenue potential. Calculate
            monthly and annual projections for CPT 99490 and the 99439 add-on code.
          </p>
        </div>

        <CcmCalculatorTool />

        <ScanCTA />
      </div>
    </>
  );
}
