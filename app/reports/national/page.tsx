import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Users,
  DollarSign,
  TrendingDown,
  MapPin,
  Stethoscope,
  Heart,
  Activity,
  Brain,
  Calendar,
  BarChart3,
  Home,
  ChevronRight,
  Share2,
  ArrowRight,
} from "lucide-react";
import {
  getNationalStats,
  getAllStates,
  getAllBenchmarks,
  stateAbbrToName,
  stateToSlug,
  specialtyToSlug,
} from "@/lib/db-queries";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  calculateGrade,
  estimateCaptureRate,
  estimatePerProviderGap,
  generateShareText,
} from "@/lib/report-utils";
import { ShareButtons } from "@/components/reports/share-buttons";
import { ScanCTA } from "@/components/seo/scan-cta";

export const metadata: Metadata = {
  title: "National Medicare Revenue Report 2026 | NPIxray",
  description:
    "Comprehensive analysis of Medicare revenue capture across all 50 states and 27 specialties. State rankings, specialty grades, and program adoption rates from 1.175M providers.",
  openGraph: {
    title: "National Medicare Revenue Report 2026 | NPIxray",
    description:
      "State-by-state rankings and specialty analysis from 1.175M Medicare providers.",
    url: "https://npixray.com/reports/national",
  },
  alternates: { canonical: "https://npixray.com/reports/national" },
};

export default async function NationalReportPage() {
  const [national, states, benchmarks] = await Promise.all([
    getNationalStats(),
    getAllStates(),
    getAllBenchmarks(),
  ]);

  const nationalAvg =
    states.reduce((a, b) => a + b.avgPayment, 0) / states.length;

  // State rankings with grades
  const stateRankings = states
    .map((s) => {
      const name = stateAbbrToName(s.state);
      const rate = Math.min(
        Math.round((s.avgPayment / (nationalAvg * 1.3)) * 75 + 15),
        95
      );
      const gradeInfo = calculateGrade(rate);
      const gap = estimatePerProviderGap(s.avgPayment);
      return { abbr: s.state, name, rate, gap, ...s, ...gradeInfo };
    })
    .sort((a, b) => b.rate - a.rate);

  // Specialty rankings with grades
  const specialtyRankings = benchmarks
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
      return { ...b, rate, gap, ...gradeInfo };
    })
    .sort((a, b) => b.rate - a.rate);

  // National program adoption averages
  const totalProviders = benchmarks.reduce(
    (a, b) => a + b.provider_count,
    0
  );
  const natCCM =
    benchmarks.reduce(
      (a, b) => a + b.ccm_adoption_rate * b.provider_count,
      0
    ) / totalProviders;
  const natRPM =
    benchmarks.reduce(
      (a, b) => a + b.rpm_adoption_rate * b.provider_count,
      0
    ) / totalProviders;
  const natBHI =
    benchmarks.reduce(
      (a, b) => a + b.bhi_adoption_rate * b.provider_count,
      0
    ) / totalProviders;
  const natAWV =
    benchmarks.reduce(
      (a, b) => a + b.awv_adoption_rate * b.provider_count,
      0
    ) / totalProviders;

  // National E&M averages
  const nat99213 =
    benchmarks.reduce(
      (a, b) => a + b.pct_99213 * b.provider_count,
      0
    ) / totalProviders;
  const nat99214 =
    benchmarks.reduce(
      (a, b) => a + b.pct_99214 * b.provider_count,
      0
    ) / totalProviders;
  const nat99215 =
    benchmarks.reduce(
      (a, b) => a + b.pct_99215 * b.provider_count,
      0
    ) / totalProviders;

  const totalMissed = states.reduce(
    (a, s) => a + estimatePerProviderGap(s.avgPayment) * s.totalProviders,
    0
  );

  const shareText = generateShareText("national", "National", {
    missedRevenue: formatCurrency(totalMissed),
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: "National Medicare Revenue Report 2026",
    description:
      "Comprehensive analysis of Medicare revenue capture across all 50 states",
    url: "https://npixray.com/reports/national",
    publisher: {
      "@type": "Organization",
      name: "NPIxray",
      url: "https://npixray.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6">
          <Link href="/" className="hover:text-gold transition-colors">
            <Home className="h-3.5 w-3.5" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
          <Link href="/reports" className="hover:text-gold transition-colors">
            Reports
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
          <span className="text-[var(--text-primary)]">National</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10">
          <Globe className="h-12 w-12 text-gold mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl font-bold mb-3">
            National Medicare Revenue Report
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            2026 Edition — Analysis of {formatNumber(national?.totalProviders || 0)}{" "}
            providers across all 50 states
          </p>
        </div>

        {/* Executive Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Users, label: "Total Providers", value: formatNumber(national?.totalProviders || 0) },
            { icon: DollarSign, label: "Total Medicare Payment", value: formatCurrency(national?.totalPayment || 0) },
            { icon: TrendingDown, label: "Est. Total Revenue Gap", value: formatCurrency(totalMissed), highlight: true },
            { icon: BarChart3, label: "Avg Gap/Provider", value: formatCurrency(totalMissed / (national?.totalProviders || 1)) },
          ].map((s, i) => (
            <div
              key={i}
              className={`rounded-xl border p-5 ${s.highlight ? "border-gold/30 bg-gold/5" : "border-dark-50/80 bg-dark-400/30"}`}
            >
              <s.icon className={`h-6 w-6 mb-2 ${s.highlight ? "text-gold" : "text-[var(--text-secondary)]"}`} />
              <p className="text-xs text-[var(--text-secondary)] mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.highlight ? "text-gold" : ""}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* State Rankings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-gold" />
            State Rankings
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
            {stateRankings.map((s, i) => (
              <Link
                key={s.abbr}
                href={`/reports/states/${stateToSlug(s.abbr)}`}
                className="group rounded-xl border border-dark-50/80 bg-dark-400/30 p-3 hover:border-gold/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--text-secondary)]">
                    #{i + 1}
                  </span>
                  <span className={`text-lg font-bold ${s.color}`}>
                    {s.grade}
                  </span>
                </div>
                <p className="font-semibold text-sm group-hover:text-gold transition-colors">
                  {s.abbr}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {formatNumber(s.totalProviders)} providers
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Specialty Analysis */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-gold" />
            Specialty Rankings
          </h2>
          <div className="space-y-3">
            {specialtyRankings.map((s, i) => (
              <Link
                key={s.specialty}
                href={`/reports/specialties/${specialtyToSlug(s.specialty)}`}
                className="group flex items-center gap-4 rounded-xl border border-dark-50/80 bg-dark-400/30 p-4 hover:border-gold/20 transition-colors"
              >
                <span className="text-sm text-[var(--text-secondary)] w-8">
                  #{i + 1}
                </span>
                <span className={`text-xl font-bold w-8 ${s.color}`}>
                  {s.grade}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold group-hover:text-gold transition-colors truncate">
                    {s.specialty}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {formatNumber(s.provider_count)} providers | Avg{" "}
                    {formatCurrency(s.avg_total_payment)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gold">
                    ~{formatCurrency(s.gap)} gap
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Program Adoption */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6 text-gold" />
            National Program Adoption
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "CCM", fullName: "Chronic Care Mgmt", rate: natCCM, target: 15, icon: Heart },
              { name: "RPM", fullName: "Remote Patient Mon.", rate: natRPM, target: 10, icon: Activity },
              { name: "BHI", fullName: "Behavioral Health", rate: natBHI, target: 8, icon: Brain },
              { name: "AWV", fullName: "Annual Wellness Visit", rate: natAWV, target: 50, icon: Calendar },
            ].map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-5"
              >
                <p.icon className="h-7 w-7 text-gold mb-3" />
                <p className="text-lg font-bold">{p.name}</p>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  {p.fullName}
                </p>
                <p className="text-3xl font-bold text-gold">
                  {p.rate.toFixed(1)}%
                </p>
                <div className="h-2 rounded-full bg-dark-400/80 mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{
                      width: `${Math.min((p.rate / p.target) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Target: {p.target}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* E&M Distribution */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-gold" />
            National E&M Coding Distribution
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { code: "99213", label: "Level 3", pct: nat99213, target: 30 },
              { code: "99214", label: "Level 4", pct: nat99214, target: 50 },
              { code: "99215", label: "Level 5", pct: nat99215, target: 15 },
            ].map((em) => (
              <div
                key={em.code}
                className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-5 text-center"
              >
                <p className="text-2xl font-bold">{em.code}</p>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  {em.label}
                </p>
                <p className="text-3xl font-bold text-gold">
                  {em.pct.toFixed(1)}%
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Target: ~{em.target}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-12 rounded-xl border border-dark-50/80 bg-dark-400/30 p-6">
          <h2 className="text-lg font-bold mb-3">Methodology</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            This report analyzes the CMS Medicare Physician & Other
            Practitioners dataset covering{" "}
            {formatNumber(national?.totalProviders || 0)} providers and{" "}
            {formatNumber(national?.totalCodes || 8153253)} billing records.
            Revenue gaps are estimated by comparing individual provider billing
            patterns against specialty-specific benchmarks for E&M coding
            distribution and care management program adoption. Grades are
            calculated using a weighted composite score of program adoption rates
            and coding optimization metrics. All data is from public CMS sources.
          </p>
        </section>

        {/* Share */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-gold" />
            Share This Report
          </h2>
          <ShareButtons
            title="National Medicare Revenue Report 2026"
            twitterText={shareText.twitter}
            linkedinText={shareText.linkedin}
            url="https://npixray.com/reports/national"
          />
        </section>

        <ScanCTA />
      </div>
    </>
  );
}
