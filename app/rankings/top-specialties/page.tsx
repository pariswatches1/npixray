import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Stethoscope, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import {
  getAllBenchmarks,
  specialtyToSlug,
  formatCurrency,
  formatNumber,
} from "@/lib/db-queries";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Top Medicare Specialties by Revenue — Rankings | NPIxray",
  description:
    "Medical specialties ranked by average Medicare revenue per provider. See provider counts, average payments, patient volumes, and care management adoption rates for every specialty.",
  keywords: [
    "Medicare specialty rankings",
    "highest paid medical specialties",
    "Medicare revenue by specialty",
    "specialty benchmarks",
    "healthcare specialty comparison",
  ],
  openGraph: {
    title: "Top Medicare Specialties by Revenue — Rankings | NPIxray",
    description:
      "Medical specialties ranked by average Medicare revenue per provider.",
  },
};

export default function TopSpecialtiesPage() {
  const benchmarks = getAllBenchmarks().sort(
    (a, b) => b.avg_total_payment - a.avg_total_payment
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Rankings", href: "/rankings" },
              { label: "Top Specialties" },
            ]}
          />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <TrendingUp className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Medicare Specialties{" "}
                <span className="text-gold">Ranked by Revenue</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {benchmarks.length} specialties sorted by avg total Medicare
                payment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings Table */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto rounded-xl border border-dark-50/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-50/50 bg-dark-300">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] w-12">
                    #
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Specialty
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">
                    Providers
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Avg Payment
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)] hidden md:table-cell">
                    Avg Patients
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)] hidden lg:table-cell">
                    Rev/Patient
                  </th>
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {benchmarks.map((b, i) => (
                  <tr
                    key={b.specialty}
                    className={`border-b border-dark-50/30 hover:bg-dark-200/50 transition-colors ${
                      i % 2 === 0 ? "bg-dark-400/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-[var(--text-secondary)]">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/specialties/${specialtyToSlug(b.specialty)}`}
                        className="text-gold hover:text-gold-300 font-medium transition-colors"
                      >
                        {b.specialty}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell">
                      {formatNumber(b.provider_count)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-gold">
                      {formatCurrency(b.avg_total_payment)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell">
                      {Math.round(b.avg_medicare_patients).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums hidden lg:table-cell">
                      {formatCurrency(b.avg_revenue_per_patient)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/specialties/${specialtyToSlug(b.specialty)}`}
                        className="text-[var(--text-secondary)] hover:text-gold transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
