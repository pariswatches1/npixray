import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { PracticeBenchmarkTool } from "@/components/tools/practice-benchmark";

export const metadata: Metadata = {
  title: "Practice Benchmark Tool — Compare to 1.175M Providers",
  description:
    "Free practice benchmarking tool. See where your Medicare revenue ranks among 1.175M+ providers in your specialty. Find your percentile and revenue gaps to the average and top performers.",
  keywords: [
    "practice benchmark tool",
    "Medicare revenue benchmark",
    "compare practice revenue",
    "medical practice percentile",
    "healthcare revenue ranking",
    "specialty revenue comparison",
    "practice performance benchmark",
  ],
  openGraph: {
    title: "Practice Benchmark Tool | NPIxray",
    description:
      "See where your practice ranks among 1.175M+ providers. Compare revenue to specialty peers.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Practice Benchmark Tool",
  url: "https://npixray.com/tools/practice-benchmark",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Free practice benchmarking tool to compare your Medicare revenue against 1.175M+ providers.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function PracticeBenchmarkPage() {
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
            { label: "Practice Benchmark" },
          ]}
        />

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Practice{" "}
            <span className="text-gold">Benchmark</span> Tool
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
            See where your practice ranks among 1.175M+ Medicare providers.
            Compare your annual revenue to your specialty average and top
            performers.
          </p>
        </div>

        <PracticeBenchmarkTool />

        <ScanCTA />
      </div>
    </>
  );
}
