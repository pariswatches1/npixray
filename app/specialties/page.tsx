import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowRight, Stethoscope, TrendingUp } from "lucide-react";
import { getAllSpecialties } from "@/lib/specialty-data";

export const metadata: Metadata = {
  title: "Medicare Revenue Benchmarks by Specialty — 15 Specialties | NPIxray",
  description:
    "National Medicare revenue benchmarks for 15 medical specialties. See E&M coding distributions, CCM/RPM/BHI adoption rates, and average revenue gaps per specialty.",
  keywords: [
    "Medicare specialty benchmarks",
    "E&M coding by specialty",
    "CCM adoption rates",
    "RPM adoption rates",
    "medical specialty revenue",
    "healthcare billing benchmarks",
  ],
  openGraph: {
    title: "Medicare Revenue Benchmarks by Specialty | NPIxray",
    description:
      "National Medicare revenue benchmarks for 15 specialties. See how much revenue practices leave on the table by specialty.",
  },
};

export default function SpecialtiesIndexPage() {
  const specialties = getAllSpecialties();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <Stethoscope className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                15 Specialties Covered
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Revenue Benchmarks{" "}
              <span className="text-gold">by Specialty</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              National Medicare billing benchmarks for each medical specialty.
              See E&M coding distributions, care management adoption rates, and
              where the biggest revenue gaps exist.
            </p>
          </div>
        </div>
      </section>

      {/* Specialty Cards */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Revenue Gaps */}
          <div className="mb-6">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Sorted by average missed revenue per provider
            </p>
          </div>

          <div className="space-y-4">
            {specialties.map((specialty, i) => (
              <Link
                key={specialty.slug}
                href={`/specialties/${specialty.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 sm:p-6 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all"
              >
                {/* Rank */}
                <div className="flex-shrink-0">
                  <span className="text-2xl font-bold font-mono text-gold/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Name + Description */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold group-hover:text-gold transition-colors">
                    {specialty.name}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                    {specialty.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-lg font-bold font-mono text-gold">
                      ${(specialty.avgMissedRevenue / 1000).toFixed(0)}K
                    </p>
                    <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                      Avg Gap
                    </p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-lg font-bold font-mono text-[var(--text-secondary)]">
                      {(specialty.totalProviders / 1000).toFixed(0)}K
                    </p>
                    <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                      Providers
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[var(--text-secondary)] group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            See Your Specialty&apos;s Gaps{" "}
            <span className="text-gold">Personalized</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            Benchmarks show what&apos;s possible. Scan your NPI to see how your
            billing compares to your specialty peers.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
          >
            <Zap className="h-5 w-5" />
            Scan Your NPI — Free
          </Link>
        </div>
      </section>
    </>
  );
}
