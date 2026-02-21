import type { Metadata } from "next";
import Link from "next/link";
import { Stethoscope, ArrowRight, Users, DollarSign, Heart, Activity, Brain, Clipboard } from "lucide-react";
import { getAllBenchmarks, formatCurrency, formatNumber, specialtyToSlug } from "@/lib/db-queries";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // ISR: cache at runtime for 24 hours

export const metadata: Metadata = {
  title: "Medicare Revenue by Specialty â€” 20 Specialties Analyzed | NPIxray",
  description:
    "Medicare revenue analysis for 20+ medical specialties. See provider counts, average payments, E&M coding distributions, and CCM/RPM/AWV adoption rates by specialty.",
  keywords: [
    "Medicare specialty benchmarks",
    "E&M coding by specialty",
    "CCM adoption rates",
    "RPM adoption rates",
    "medical specialty revenue",
    "healthcare billing benchmarks",
  ],
  alternates: {
    canonical: "https://npixray.com/specialties",
  },
  openGraph: {
    title: "Medicare Revenue Analysis by Specialty | NPIxray",
    description:
      "National Medicare revenue benchmarks for 20+ specialties. See provider counts, average payments, and care management adoption rates.",
  },
};

export default async function SpecialtiesIndexPage() {
  const benchmarks = await getAllBenchmarks();

  const totalProviders = benchmarks.reduce((sum, b) => sum + b.provider_count, 0);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "Specialties", href: "/specialties" }]} />

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-1.5 mb-8">
              <Stethoscope className="h-3.5 w-3.5 text-[#2F5EA8]" />
              <span className="text-xs font-medium text-[#2F5EA8]">
                {benchmarks.length} Specialties Analyzed
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Medicare Revenue Analysis{" "}
              <span className="text-[#2F5EA8]">by Specialty</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              National Medicare billing benchmarks for each medical specialty.
              See provider counts, average payments, E&M coding patterns, and
              care management adoption rates.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-12">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-[#2F5EA8]">
                {benchmarks.length}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Specialties
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-[#2F5EA8]">
                {formatNumber(totalProviders)}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Providers
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-[#2F5EA8]">
                CMS Data
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Source
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Cards Grid */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benchmarks.map((b) => {
              const slug = specialtyToSlug(b.specialty);
              return (
                <Link
                  key={b.specialty}
                  href={`/specialties/${slug}`}
                  className="group rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/15 hover:shadow-lg hover:shadow-[#2F5EA8]/[0.04] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="font-semibold group-hover:text-[#2F5EA8] transition-colors leading-tight">
                      {b.specialty}
                    </h2>
                    <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[#2F5EA8] group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
                  </div>

                  {/* Key metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="rounded-lg bg-[var(--bg)]/50 p-2 text-center">
                      <p className="text-sm font-bold font-mono text-[#2F5EA8]">
                        {formatNumber(b.provider_count)}
                      </p>
                      <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                        Providers
                      </p>
                    </div>
                    <div className="rounded-lg bg-[var(--bg)]/50 p-2 text-center">
                      <p className="text-sm font-bold font-mono text-[#2F5EA8]">
                        {formatCurrency(b.avg_total_payment)}
                      </p>
                      <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                        Avg Payment
                      </p>
                    </div>
                  </div>

                  {/* Adoption rates */}
                  <div className="flex gap-2 text-[10px]">
                    <span className="rounded bg-[var(--bg)]/80 px-2 py-1 text-[var(--text-secondary)]">
                      CCM {(b.ccm_adoption_rate * 100).toFixed(0)}%
                    </span>
                    <span className="rounded bg-[var(--bg)]/80 px-2 py-1 text-[var(--text-secondary)]">
                      RPM {(b.rpm_adoption_rate * 100).toFixed(0)}%
                    </span>
                    <span className="rounded bg-[var(--bg)]/80 px-2 py-1 text-[var(--text-secondary)]">
                      AWV {(b.awv_adoption_rate * 100).toFixed(0)}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
