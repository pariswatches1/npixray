import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { NpiLookupTool } from "@/components/tools/npi-lookup";

export const metadata: Metadata = {
  title: "NPI Lookup Tool — Search 1.175M+ Medicare Providers",
  description:
    "Free NPI lookup tool. Search 1.175M+ Medicare providers by NPI number, name, specialty, or location. View billing data and revenue analysis instantly.",
  keywords: [
    "NPI lookup",
    "NPI number search",
    "find doctor NPI",
    "Medicare provider search",
    "NPPES lookup",
    "NPI registry search",
    "provider NPI finder",
  ],
  openGraph: {
    title: "NPI Lookup Tool | NPIxray",
    description:
      "Search 1.175M+ Medicare providers by NPI number, name, specialty, or location.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NPI Lookup Tool",
  url: "https://npixray.com/tools/npi-lookup",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Free NPI lookup tool. Search 1.175M+ Medicare providers by NPI number, name, specialty, or location.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function NpiLookupPage() {
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
            { label: "NPI Lookup" },
          ]}
        />

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            NPI <span className="text-gold">Lookup</span> Tool
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            Search 1.175M+ Medicare providers by NPI number, name, specialty, or
            location. View billing data and run a free revenue scan.
          </p>
        </div>

        <NpiLookupTool />

        <ScanCTA />
      </div>
    </>
  );
}
