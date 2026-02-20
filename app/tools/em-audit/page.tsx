import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { EmAuditTool } from "@/components/tools/em-audit";

export const metadata: Metadata = {
  title: "E&M Coding Audit Tool — Find Revenue from Undercoding",
  description:
    "Free E&M coding audit tool. Compare your 99213, 99214, and 99215 distribution against specialty benchmarks. Find revenue lost to undercoding and see the dollar impact.",
  keywords: [
    "E&M coding audit",
    "E&M audit tool",
    "99213 vs 99214",
    "undercoding revenue",
    "E&M coding distribution",
    "medical coding audit",
    "office visit coding analysis",
    "E&M revenue gap",
  ],
  alternates: {
    canonical: "https://npixray.com/tools/em-audit",
  },
  openGraph: {
    title: "E&M Coding Audit Tool | NPIxray",
    description:
      "Compare your E&M coding distribution against specialty benchmarks. Find revenue lost to undercoding.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "E&M Coding Audit Tool",
  url: "https://npixray.com/tools/em-audit",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Free E&M coding audit tool that compares your coding distribution against specialty benchmarks.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function EmAuditPage() {
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
            { label: "E&M Coding Audit" },
          ]}
        />

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            E&M Coding{" "}
            <span className="text-[#2F5EA8]">Audit</span> Tool
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            Compare your 99213/99214/99215 distribution against specialty
            benchmarks. Find how much revenue you may be losing to undercoding.
          </p>
        </div>

        <EmAuditTool />

        <ScanCTA />
      </div>
    </>
  );
}
