import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftRight, ArrowRight } from "lucide-react";
import {
  getAllBenchmarks,
  specialtyToSlug,
} from "@/lib/db-queries";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Medicare Specialty Comparisons | NPIxray",
  description:
    "Compare Medicare specialties side by side. See revenue, patient volumes, E&M coding distributions, and care management adoption rates for any two specialties.",
  keywords: [
    "Medicare specialty comparison",
    "compare medical specialties",
    "specialty revenue comparison",
    "E&M coding comparison",
    "healthcare specialty data",
  ],
  alternates: {
    canonical: "https://npixray.com/compare",
  },
  openGraph: {
    title: "Medicare Specialty Comparisons | NPIxray",
    description:
      "Compare Medicare specialties side by side with real CMS billing data.",
  },
};

// Pre-defined popular comparison combos
const COMPARISON_PAIRS: [string, string][] = [
  ["Internal Medicine", "Family Practice"],
  ["Cardiology", "Internal Medicine"],
  ["Orthopedic Surgery", "Physical Therapy"],
  ["Dermatology", "Family Practice"],
  ["Cardiology", "Pulmonary Disease"],
  ["Gastroenterology", "Internal Medicine"],
  ["Neurology", "Internal Medicine"],
  ["Endocrinology", "Internal Medicine"],
  ["Nephrology", "Internal Medicine"],
  ["Rheumatology", "Internal Medicine"],
  ["Urology", "General Surgery"],
  ["Ophthalmology", "Optometry"],
  ["Psychiatry", "Neurology"],
  ["Orthopedic Surgery", "Neurosurgery"],
  ["Cardiology", "General Surgery"],
  ["Pulmonary Disease", "Internal Medicine"],
  ["Hematology/Oncology", "Internal Medicine"],
  ["Dermatology", "Internal Medicine"],
  ["Family Practice", "Nurse Practitioner"],
  ["Gastroenterology", "General Surgery"],
];

function comparisonSlug(a: string, b: string): string {
  return `${specialtyToSlug(a)}-vs-${specialtyToSlug(b)}`;
}

export default async function CompareHubPage() {
  const benchmarks = await getAllBenchmarks();
  const specialtyNames = new Set(benchmarks.map((b) => b.specialty));

  // Filter pairs to only those with available benchmarks
  const availablePairs = COMPARISON_PAIRS.filter(
    ([a, b]) => specialtyNames.has(a) && specialtyNames.has(b)
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <Breadcrumbs items={[{ label: "Compare Specialties" }]} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <ArrowLeftRight className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                Side-by-Side Comparisons
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Specialty Comparisons{" "}
              <span className="text-gold">Side by Side Medicare Data</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Compare any two Medicare specialties head-to-head. See revenue,
              patient volumes, coding patterns, and care management adoption
              rates.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Cards */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {availablePairs.length} popular comparisons
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePairs.map(([a, b]) => {
              const slug = comparisonSlug(a, b);
              const benchA = benchmarks.find((bm) => bm.specialty === a);
              const benchB = benchmarks.find((bm) => bm.specialty === b);
              return (
                <Link
                  key={slug}
                  href={`/compare/${slug}`}
                  className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-semibold group-hover:text-gold transition-colors truncate">
                      {a}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)] flex-shrink-0">
                      vs
                    </span>
                    <span className="text-sm font-semibold group-hover:text-gold transition-colors truncate">
                      {b}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="rounded-lg bg-dark-500/50 p-2">
                      <p className="text-xs text-[var(--text-secondary)] mb-1 truncate">
                        {a}
                      </p>
                      <p className="text-sm font-bold font-mono text-gold">
                        {benchA
                          ? `$${(benchA.avg_total_payment / 1000).toFixed(0)}K`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-dark-500/50 p-2">
                      <p className="text-xs text-[var(--text-secondary)] mb-1 truncate">
                        {b}
                      </p>
                      <p className="text-sm font-bold font-mono text-gold">
                        {benchB
                          ? `$${(benchB.avg_total_payment / 1000).toFixed(0)}K`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-[var(--text-secondary)] group-hover:text-gold transition-colors">
                    View full comparison
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
