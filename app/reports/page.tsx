import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  MapPin,
  Stethoscope,
  Globe,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { getAllStates, getAllBenchmarks, stateAbbrToName, stateToSlug, specialtyToSlug } from "@/lib/db-queries";
import { formatCurrency, formatNumber } from "@/lib/format";
import { calculateGrade, estimateCaptureRate, estimatePerProviderGap } from "@/lib/report-utils";
import { SPECIALTY_LIST, STATE_LIST } from "@/lib/benchmark-data";
import { ReportGrade } from "@/components/reports/report-grade";

export const metadata: Metadata = {
  title: "Medicare Revenue Report Cards 2026 | NPIxray",
  description:
    "Free data-driven report cards grading every US state and medical specialty on Medicare revenue capture. Based on 1.175M providers and 8.15M billing records.",
  openGraph: {
    title: "Medicare Revenue Report Cards 2026 | NPIxray",
    description:
      "See how your state and specialty grade on Medicare revenue capture.",
    url: "https://npixray.com/reports",
  },
  alternates: { canonical: "https://npixray.com/reports" },
};

export default async function ReportsIndexPage() {
  const [states, benchmarks] = await Promise.all([
    getAllStates(),
    getAllBenchmarks(),
  ]);

  const stateCards = states
    .map((s) => {
      const name = stateAbbrToName(s.state);
      const gap = estimatePerProviderGap(s.avgPayment);
      // Simple capture estimate based on avg payment relative to national
      const nationalAvg = states.reduce((a, b) => a + b.avgPayment, 0) / states.length;
      const rate = Math.min(Math.round((s.avgPayment / (nationalAvg * 1.3)) * 75 + 15), 95);
      const gradeInfo = calculateGrade(rate);
      return { abbr: s.state, name, providers: s.totalProviders, avgPayment: s.avgPayment, gap, rate, ...gradeInfo };
    })
    .sort((a, b) => b.rate - a.rate);

  const specialtyCards = benchmarks
    .map((b) => {
      const rate = estimateCaptureRate(
        b.ccm_adoption_rate,
        b.rpm_adoption_rate,
        b.bhi_adoption_rate,
        b.awv_adoption_rate,
        b.pct_99214,
        b.pct_99215
      );
      const gap = estimatePerProviderGap(b.avg_total_payment);
      const gradeInfo = calculateGrade(rate);
      return { specialty: b.specialty, providers: b.provider_count, avgPayment: b.avg_total_payment, gap, rate, ...gradeInfo };
    })
    .sort((a, b) => b.rate - a.rate);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-semibold mb-4">
          <FileText className="h-4 w-4" />
          2026 Report Cards
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Medicare Revenue Report Cards
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Data-driven grades for every US state and medical specialty. Based on
          analysis of 1,175,281 Medicare providers and 8.15M billing records.
        </p>
      </div>

      {/* National Report CTA */}
      <Link
        href="/reports/national"
        className="block rounded-2xl border border-gold/30 bg-gold/5 p-6 sm:p-8 mb-12 group hover:border-gold/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Globe className="h-8 w-8 text-gold" />
            <div>
              <h2 className="text-xl font-bold group-hover:text-gold transition-colors">
                National Medicare Revenue Report 2026
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Comprehensive analysis across all 50 states and {benchmarks.length}+ specialties
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gold group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

      {/* State Report Cards */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-6 w-6 text-gold" />
          <h2 className="text-2xl font-bold">State Report Cards</h2>
          <span className="text-sm text-[var(--text-secondary)]">
            ({stateCards.length} states)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {stateCards.map((s) => (
            <Link
              key={s.abbr}
              href={`/reports/states/${stateToSlug(s.abbr)}`}
              className="group rounded-xl border border-dark-50/80 bg-dark-400/30 p-4 hover:border-gold/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold">{s.abbr}</span>
                <span
                  className={`text-lg font-bold ${s.color}`}
                >
                  {s.grade}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {s.name}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {formatNumber(s.providers)} providers
              </p>
              <p className="text-xs text-gold mt-1">
                ~{formatCurrency(s.gap)}/provider gap
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Specialty Report Cards */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Stethoscope className="h-6 w-6 text-gold" />
          <h2 className="text-2xl font-bold">Specialty Report Cards</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialtyCards.map((s) => (
            <Link
              key={s.specialty}
              href={`/reports/specialties/${specialtyToSlug(s.specialty)}`}
              className="group rounded-xl border border-dark-50/80 bg-dark-400/30 p-5 hover:border-gold/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold group-hover:text-gold transition-colors truncate mr-3">
                  {s.specialty}
                </h3>
                <span
                  className={`text-2xl font-bold ${s.color} flex-shrink-0`}
                >
                  {s.grade}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                <span>{formatNumber(s.providers)} providers</span>
                <span>Avg {formatCurrency(s.avgPayment)}</span>
              </div>
              <p className="text-xs text-gold mt-2">
                ~{formatCurrency(s.gap)} avg gap/provider
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Embed CTA */}
      <div className="rounded-2xl border border-dark-50/80 bg-dark-400/30 p-8 text-center">
        <BarChart3 className="h-8 w-8 text-gold mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">
          Embed Report Cards on Your Website
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-md mx-auto">
          Add Medicare revenue data to your blog or healthcare website with our
          free embeddable widgets.
        </p>
        <Link
          href="/reports/embed"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold text-dark font-semibold text-sm hover:bg-gold-300 transition-colors"
        >
          Get Embed Code
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
