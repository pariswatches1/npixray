import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { CodeLookupTool } from "@/components/tools/code-lookup";

export const metadata: Metadata = {
  title: "CPT/HCPCS Code Lookup — Medicare Payment Data",
  description:
    "Free CPT and HCPCS code lookup tool. Search any billing code to see national Medicare payment data, utilization rates, and billing trends across 1.175M+ providers.",
  keywords: [
    "CPT code lookup",
    "HCPCS code search",
    "Medicare payment rates",
    "CPT code payment data",
    "billing code lookup",
    "99213 payment rate",
    "99214 payment rate",
    "G0439 payment",
  ],
  openGraph: {
    title: "CPT/HCPCS Code Lookup | NPIxray",
    description:
      "Look up any CPT or HCPCS code to see national Medicare payment data and utilization statistics.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CPT/HCPCS Code Lookup",
  url: "https://npixray.com/tools/code-lookup",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Free CPT and HCPCS code lookup tool with national Medicare payment data.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function CodeLookupPage() {
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
            { label: "Code Lookup" },
          ]}
        />

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            CPT/HCPCS Code{" "}
            <span className="text-gold">Lookup</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            Search any CPT or HCPCS billing code to view national Medicare
            payment data, utilization rates, and billing trends.
          </p>
        </div>

        <CodeLookupTool />

        <ScanCTA />
      </div>
    </>
  );
}
