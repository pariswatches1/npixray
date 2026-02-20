import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { AwvCalculatorTool } from "@/components/tools/awv-calculator";

export const metadata: Metadata = {
  title: "AWV Revenue Calculator — Annual Wellness Visit Billing",
  description:
    "Free AWV revenue calculator. Calculate Annual Wellness Visit billing potential with G0438 and G0439. See revenue at different completion rates for your Medicare patient panel.",
  keywords: [
    "AWV calculator",
    "AWV revenue calculator",
    "Annual Wellness Visit billing",
    "G0438 billing",
    "G0439 billing",
    "AWV completion rate",
    "Medicare wellness visit revenue",
  ],
  alternates: {
    canonical: "https://npixray.com/tools/awv-calculator",
  },
  openGraph: {
    title: "AWV Revenue Calculator | NPIxray",
    description:
      "Calculate your Annual Wellness Visit revenue potential with G0438 and G0439 at different completion rates.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AWV Revenue Calculator",
  url: "https://npixray.com/tools/awv-calculator",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Free AWV revenue calculator for Annual Wellness Visit billing with G0438 and G0439.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function AwvCalculatorPage() {
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
            { label: "AWV Calculator" },
          ]}
        />

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            AWV Revenue{" "}
            <span className="text-[#2F5EA8]">Calculator</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            Calculate your Annual Wellness Visit revenue potential. See how
            improving your AWV completion rate can significantly impact revenue
            with G0438 and G0439 billing.
          </p>
        </div>

        <AwvCalculatorTool />

        <ScanCTA />
      </div>
    </>
  );
}
