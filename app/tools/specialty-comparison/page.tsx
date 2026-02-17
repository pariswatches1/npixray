import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { SpecialtyComparisonTool } from "@/components/tools/specialty-comparison";

export const metadata: Metadata = {
  title: "Specialty Comparison Tool — Compare Medicare Revenue",
  description:
    "Compare two medical specialties side-by-side on Medicare revenue, patient volume, E&M coding distribution, and CCM/RPM/AWV program adoption rates.",
  keywords: [
    "specialty comparison Medicare",
    "compare medical specialties",
    "Medicare revenue by specialty",
    "E&M distribution by specialty",
    "CCM adoption rate comparison",
    "medical specialty benchmarks",
  ],
  openGraph: {
    title: "Specialty Comparison Tool | NPIxray",
    description:
      "Compare two specialties side-by-side on revenue, patient volume, E&M distribution, and program adoption.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Specialty Comparison Tool",
  url: "https://npixray.com/tools/specialty-comparison",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Compare two medical specialties on Medicare revenue, patient volume, and program adoption rates.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function SpecialtyComparisonPage() {
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
            { label: "Specialty Comparison" },
          ]}
        />

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Specialty{" "}
            <span className="text-gold">Comparison</span> Tool
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            Compare two medical specialties side-by-side on Medicare revenue,
            patient volume, E&M coding distribution, and program adoption rates.
          </p>
        </div>

        <SpecialtyComparisonTool />

        <ScanCTA />
      </div>
    </>
  );
}
