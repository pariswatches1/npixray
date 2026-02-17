import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { ScoreCompare } from "@/components/tools/score-compare";

export const metadata: Metadata = {
  title: "Revenue Score Comparison Tool | NPIxray",
  description:
    "Compare Medicare Revenue Scores for 2-5 providers side by side. See how your practice stacks up against peers in the same specialty.",
  openGraph: {
    title: "Revenue Score Comparison Tool | NPIxray",
    description: "Compare provider Revenue Scores side by side.",
    url: "https://npixray.com/tools/score-compare",
  },
  alternates: { canonical: "https://npixray.com/tools/score-compare" },
};

export default function ScoreComparePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Revenue Score Comparison Tool",
    url: "https://npixray.com/tools/score-compare",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    description: metadata.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "Score Compare" },
          ]}
        />
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-semibold mb-4">
            <BarChart3 className="h-4 w-4" />
            Score Compare
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Revenue Score <span className="text-gold">Comparison</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Enter 2-5 NPI numbers to compare Revenue Scores side by side. Great for group
            practices benchmarking their providers.
          </p>
        </div>
        <ScoreCompare />
        <div className="mt-12">
          <ScanCTA />
        </div>
      </div>
    </>
  );
}
