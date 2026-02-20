import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { StateComparisonTool } from "@/components/tools/state-comparison";

export const metadata: Metadata = {
  title: "State Comparison Tool — Compare Medicare Data by State",
  description:
    "Compare Medicare billing data between two states. See provider counts, average payments, patient volumes, and revenue differences across all 50 states.",
  keywords: [
    "Medicare state comparison",
    "compare states Medicare",
    "Medicare data by state",
    "state provider counts",
    "Medicare payment rates by state",
    "healthcare billing by state",
  ],
  alternates: {
    canonical: "https://npixray.com/tools/state-comparison",
  },
  openGraph: {
    title: "State Comparison Tool | NPIxray",
    description:
      "Compare Medicare billing data between two states. See provider counts, payments, and revenue differences.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "State Comparison Tool",
  url: "https://npixray.com/tools/state-comparison",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Compare Medicare billing data between two states including provider counts and payment rates.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function StateComparisonPage() {
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
            { label: "State Comparison" },
          ]}
        />

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            State{" "}
            <span className="text-[#2F5EA8]">Comparison</span> Tool
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            Compare Medicare billing data between two states. See provider
            counts, average payments, patient volumes, and revenue differences.
          </p>
        </div>

        <StateComparisonTool />

        <ScanCTA />
      </div>
    </>
  );
}
