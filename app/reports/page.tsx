import type { Metadata } from "next";
import { BarChart3, TrendingDown, Users, DollarSign } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { ReportTabs } from "@/components/reports/report-tabs";
import {
  getAllStates,
  getAllBenchmarks,
  getStateTopProviders,
  stateAbbrToName,
  stateToSlug,
  specialtyToSlug,
  formatCurrency,
  formatNumber,
} from "@/lib/db-queries";
import {
  calculateGrade,
  calculateCaptureRate,
  estimateMissedRevenueFromBenchmark,
} from "@/lib/report-utils";
import { BENCHMARKS } from "@/lib/benchmark-data";
import { STATE_LIST } from "@/lib/benchmark-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Medicare Revenue Report Cards 2026 — States, Specialties & National | NPIxray",
  description:
    "2026 Medicare Revenue Report Cards grading every U.S. state and medical specialty on revenue capture efficiency. See missed revenue estimates, program adoption rates, and E&M coding analysis from CMS data.",
  keywords: [
    "Medicare revenue report card",
    "state Medicare grading",
    "specialty revenue analysis",
    "Medicare missed revenue",
    "healthcare revenue report",
    "CMS data analysis 2026",
  ],
  openGraph: {
    title: "Medicare Revenue Report Cards 2026 | NPIxray",
    description:
      "Every state and specialty graded on Medicare revenue capture. See who's leaving money on the table.",
  },
};

export default function ReportsIndexPage() {
  const allStates = getAllStates();
  const allBenchmarks = getAllBenchmarks();

  // Build state cards with grades
  const stateCards = allStates
    .filter((s) => STATE_LIST.some((sl) => sl.abbr === s.state))
    .map((s) => {
      const providers = getStateTopProviders(s.state, 200);
      const captureRate = providers.length > 0
        ? calculateCaptureRate(providers, allBenchmarks)
        : 0.55;
      const grade = calculateGrade(captureRate);
      const missedRevenue = estimateMissedRevenueFromBenchmark(
        s.totalProviders,
        s.avgPayment
      );

      return {
        abbr: s.state,
        name: stateAbbrToName(s.state),
        slug: stateToSlug(s.state),
        grade: grade.grade,
        gradeColor: `${grade.color} ${grade.borderColor}`,
        providers: s.totalProviders,
        missedRevenue,
      };
    })
    .sort((a, b) => {
      const gradeOrder: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, F: 4 };
      return (gradeOrder[a.grade] ?? 5) - (gradeOrder[b.grade] ?? 5);
    });

  // Build specialty cards with grades
  const specialtyCards = allBenchmarks.map((b) => {
    const benchmark = BENCHMARKS[b.specialty];
    // Estimate grade from adoption rates and coding patterns
    const ccmScore = Math.min((b.ccm_adoption_rate || 0) / 0.1, 1);
    const rpmScore = Math.min((b.rpm_adoption_rate || 0) / 0.05, 1);
    const awvScore = Math.min((b.awv_adoption_rate || 0) / 0.5, 1);
    const emScore = Math.min((b.pct_99214 || 0) / 0.6, 1);
    const captureRate = (ccmScore * 0.25 + rpmScore * 0.15 + awvScore * 0.25 + emScore * 0.35) * 0.85;
    const grade = calculateGrade(captureRate);

    const missedRevenue = estimateMissedRevenueFromBenchmark(
      b.provider_count,
      b.avg_total_payment,
      b.specialty
    );

    return {
      specialty: b.specialty,
      slug: specialtyToSlug(b.specialty),
      grade: grade.grade,
      gradeColor: `${grade.color} ${grade.borderColor}`,
      providers: b.provider_count,
      avgPayment: b.avg_total_payment,
      missedRevenue,
    };
  }).sort((a, b) => {
    const gradeOrder: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, F: 4 };
    return (gradeOrder[a.grade] ?? 5) - (gradeOrder[b.grade] ?? 5);
  });

  const totalProviders = allStates.reduce((sum, s) => sum + s.totalProviders, 0);
  const totalMissedRevenue = stateCards.reduce((sum, s) => sum + s.missedRevenue, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "Report Cards" }]} />

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <BarChart3 className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                2026 CMS Data Analysis
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Medicare Revenue{" "}
              <span className="text-gold">Report Cards</span>{" "}
              2026
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Every state and specialty graded on Medicare revenue capture
              efficiency. Built from CMS public data covering{" "}
              {formatNumber(totalProviders)} providers.
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="rounded-xl border border-dark-50/50 bg-dark-300 p-4 text-center">
              <Users className="h-5 w-5 text-gold mx-auto mb-2" />
              <p className="text-xl font-bold font-mono text-gold">
                {formatNumber(totalProviders)}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Providers Analyzed
              </p>
            </div>
            <div className="rounded-xl border border-dark-50/50 bg-dark-300 p-4 text-center">
              <BarChart3 className="h-5 w-5 text-gold mx-auto mb-2" />
              <p className="text-xl font-bold font-mono text-gold">
                {stateCards.length}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                States Graded
              </p>
            </div>
            <div className="rounded-xl border border-dark-50/50 bg-dark-300 p-4 text-center">
              <DollarSign className="h-5 w-5 text-gold mx-auto mb-2" />
              <p className="text-xl font-bold font-mono text-gold">
                {specialtyCards.length}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Specialties
              </p>
            </div>
            <div className="rounded-xl border border-dark-50/50 bg-dark-300 p-4 text-center">
              <TrendingDown className="h-5 w-5 text-red-400 mx-auto mb-2" />
              <p className="text-xl font-bold font-mono text-red-400">
                {formatCurrency(totalMissedRevenue)}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Est. Missed Revenue
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs and content */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ReportTabs states={stateCards} specialties={specialtyCards} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "Medicare Revenue Report Cards 2026",
            description:
              "Annual grading of U.S. states and medical specialties on Medicare revenue capture efficiency based on CMS public data.",
            url: "https://npixray.com/reports",
            creator: {
              "@type": "Organization",
              name: "NPIxray",
              url: "https://npixray.com",
            },
            datePublished: "2026-01-15",
            license: "https://creativecommons.org/publicdomain/zero/1.0/",
            temporalCoverage: "2024/2025",
            spatialCoverage: {
              "@type": "Place",
              name: "United States",
            },
          }),
        }}
      />
    </>
  );
}
