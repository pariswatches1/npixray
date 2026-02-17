import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { RpmCalculatorTool } from "@/components/tools/rpm-calculator";

export const metadata: Metadata = {
  title: "RPM Revenue Calculator — Remote Patient Monitoring Billing",
  description:
    "Free RPM revenue calculator. Estimate Remote Patient Monitoring billing potential with CPT 99453, 99454, 99457, and 99458. Factor in device costs and see annual ROI.",
  keywords: [
    "RPM calculator",
    "RPM revenue calculator",
    "Remote Patient Monitoring billing",
    "99453 billing",
    "99454 billing",
    "99457 billing",
    "99458 billing",
    "RPM ROI calculator",
  ],
  openGraph: {
    title: "RPM Revenue Calculator | NPIxray",
    description:
      "Calculate your Remote Patient Monitoring revenue potential and ROI with CPT 99453-99458.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "RPM Revenue Calculator",
  url: "https://npixray.com/tools/rpm-calculator",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Free RPM revenue calculator for Remote Patient Monitoring billing with CPT 99453-99458.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RpmCalculatorPage() {
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
            { label: "RPM Calculator" },
          ]}
        />

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            RPM Revenue{" "}
            <span className="text-gold">Calculator</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            Estimate your Remote Patient Monitoring revenue and ROI. Factor in
            device costs and see annual projections for CPT 99453-99458.
          </p>
        </div>

        <RpmCalculatorTool />

        <ScanCTA />
      </div>
    </>
  );
}
