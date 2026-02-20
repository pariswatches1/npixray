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
  Share2,
  ArrowRight,
  FileDown,
  Code,
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
import { CiteBlock } from "@/components/seo/cite-block";
import { DataCoverage } from "@/components/seo/data-coverage";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "2026 Medicare Revenue Gap Report — 50-State Analysis | NPIxray",
  description:
    "The definitive 2026 analysis of Medicare revenue gaps across all 50 states and 27 specialties. Covering 1.175M+ providers, $180B+ in Medicare payments, and billions in missed revenue from underutilized care management programs (CCM, RPM, BHI, AWV).",
  alternates: {
    canonical: "https://npixray.com/reports/2026-medicare-revenue-gap",
  },
  openGraph: {
    title: "2026 Medicare Revenue Gap Report | NPIxray",
    description:
      "50-state analysis of Medicare revenue gaps: CCM, RPM, BHI, AWV adoption rates, E&M coding patterns, and missed revenue estimates for 1.175M+ providers.",
    url: "https://npixray.com/reports/2026-medicare-revenue-gap",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 Medicare Revenue Gap Report | NPIxray",
    description:
      "The definitive analysis of Medicare revenue gaps across all 50 states and 27 specialties.",
  },
};

export default async function MedicareRevenueGapReport() {
  const [national, states, benchmarks] = await Promise.all([
    getNationalStats(),
    getAllStates(),
    getAllBenchmarks(),
  ]);

  const nationalAvg =
    states.reduce((a: number, b: any) => a + b.avgPayment, 0) / states.length;

  // State rankings with grades
  const stateRankings = states
    .map((s: any) => {
      const name = stateAbbrToName(s.state);
      const rate = Math.min(
        Math.round((s.avgPayment / (nationalAvg * 1.3)) * 75 + 15),
        95
      );
      const gradeInfo = calculateGrade(rate);
      const gap = estimatePerProviderGap(s.avgPayment);
      const totalMissed = gap * s.totalProviders;
      return { abbr: s.state, name, rate, gap, totalMissed, ...s, ...gradeInfo };
    })
    .sort((a: any, b: any) => b.totalProviders - a.totalProviders);

  // Specialty rankings
  const specialtyRankings = benchmarks
    .map((b: any) => {
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
    .sort((a: any, b: any) => b.provider_count - a.provider_count)
    .slice(0, 5);

  // National program adoption averages
  const totalProviders = benchmarks.reduce(
    (a: number, b: any) => a + b.provider_count,
    0
  );
  const natCCM =
    benchmarks.reduce(
      (a: number, b: any) => a + b.ccm_adoption_rate * b.provider_count,
      0
    ) / totalProviders;
  const natRPM =
    benchmarks.reduce(
      (a: number, b: any) => a + b.rpm_adoption_rate * b.provider_count,
      0
    ) / totalProviders;
  const natBHI =
    benchmarks.reduce(
      (a: number, b: any) => a + b.bhi_adoption_rate * b.provider_count,
      0
    ) / totalProviders;
  const natAWV =
    benchmarks.reduce(
      (a: number, b: any) => a + b.awv_adoption_rate * b.provider_count,
      0
    ) / totalProviders;

  const totalMissed = states.reduce(
    (a: number, s: any) =>
      a + estimatePerProviderGap(s.avgPayment) * s.totalProviders,
    0
  );

  // Identify top gap program
  const programGaps = [
    { name: "CCM", rate: natCCM, target: 0.15 },
    { name: "RPM", rate: natRPM, target: 0.10 },
    { name: "BHI", rate: natBHI, target: 0.08 },
    { name: "AWV", rate: natAWV, target: 0.50 },
  ];
  const topGapProgram = programGaps.sort(
    (a, b) => (b.target - b.rate) - (a.target - a.rate)
  )[0];

  const shareText = generateShareText("national", "National", {
    missedRevenue: formatCurrency(totalMissed),
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "2026 Medicare Revenue Gap Report",
    description:
      "Comprehensive analysis of Medicare revenue gaps across all 50 US states and 27 medical specialties, based on CMS Medicare Physician & Other Practitioners data.",
    url: "https://npixray.com/reports/2026-medicare-revenue-gap",
    temporalCoverage: "2024",
    spatialCoverage: {
      "@type": "Place",
      name: "United States",
    },
    publisher: {
      "@type": "Organization",
      name: "NPIxray",
      url: "https://npixray.com",
    },
    distribution: {
      "@type": "DataDownload",
      contentUrl: "https://npixray.com/api/reports/pdf?type=national",
      encodingFormat: "application/pdf",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "Medicare",
      "revenue gap",
      "CCM",
      "RPM",
      "BHI",
      "AWV",
      "E&M coding",
      "healthcare revenue",
      "CMS data",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Reports", href: "/reports" },
              { label: "2026 Medicare Revenue Gap" },
            ]}
          />

          <div className="text-center">
            <Globe className="h-14 w-14 text-[#2F5EA8] mx-auto mb-4" />
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">
              2026 Medicare Revenue Gap Report
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto mb-6">
              The definitive analysis of missed Medicare revenue across all 50
              states and {benchmarks.length} specialties — covering{" "}
              {formatNumber(national?.totalProviders || 0)} providers and{" "}
              {formatCurrency(national?.totalPayment || 0)} in Medicare payments.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/api/reports/pdf?type=national"
                className="inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-colors"
              >
                <FileDown className="h-4 w-4" /> Download PDF
              </a>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-light)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-colors"
              >
                Methodology
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="border-t border-[var(--border-light)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Executive Summary</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: Users,
                label: "Total Providers Analyzed",
                value: formatNumber(national?.totalProviders || 0),
              },
              {
                icon: DollarSign,
                label: "Total Medicare Payments",
                value: formatCurrency(national?.totalPayment || 0),
              },
              {
                icon: TrendingDown,
                label: "Estimated Total Revenue Gap",
                value: formatCurrency(totalMissed),
                highlight: true,
              },
              {
                icon: BarChart3,
                label: "Top Gap Program",
                value: topGapProgram.name,
                sub: `${(topGapProgram.rate * 100).toFixed(1)}% adoption vs ${(topGapProgram.target * 100).toFixed(0)}% target`,
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`rounded-xl border p-5 ${
                  s.highlight
                    ? "border-[#2F5EA8]/15 bg-[#2F5EA8]/[0.04]"
                    : "border-[var(--border-light)] bg-white"
                }`}
              >
                <s.icon
                  className={`h-6 w-6 mb-2 ${
                    s.highlight ? "text-[#2F5EA8]" : "text-[var(--text-secondary)]"
                  }`}
                />
                <p className="text-xs text-[var(--text-secondary)] mb-1">
                  {s.label}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    s.highlight ? "text-[#2F5EA8]" : ""
                  }`}
                >
                  {s.value}
                </p>
                {"sub" in s && s.sub && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {s.sub}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-5">
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              <span className="font-semibold text-[#2F5EA8]">Key Finding: </span>
              An estimated {formatCurrency(totalMissed)} in Medicare revenue goes
              uncaptured annually across {formatNumber(national?.totalProviders || 0)}{" "}
              providers. The largest contributor is underutilization of{" "}
              {topGapProgram.name} — with a national adoption rate of just{" "}
              {(topGapProgram.rate * 100).toFixed(1)}% against a target of{" "}
              {(topGapProgram.target * 100).toFixed(0)}%.
            </p>
          </div>
        </div>
      </section>

      {/* 50-State Comparison Table */}
      <section className="border-t border-[var(--border-light)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-[#2F5EA8]" />
            50-State Revenue Gap Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-light)] text-left text-[var(--text-secondary)]">
                  <th className="pb-3 pr-3 font-medium">Rank</th>
                  <th className="pb-3 pr-3 font-medium">State</th>
                  <th className="pb-3 pr-3 font-medium text-center">Grade</th>
                  <th className="pb-3 pr-3 font-medium text-right">
                    Providers
                  </th>
                  <th className="pb-3 pr-3 font-medium text-right">
                    Avg Payment
                  </th>
                  <th className="pb-3 pr-3 font-medium text-right">
                    Est. Missed Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50/30">
                {stateRankings.map((s: any, i: number) => (
                  <tr key={s.abbr} className="hover:bg-white">
                    <td className="py-2.5 pr-3 text-[var(--text-secondary)]">
                      {i + 1}
                    </td>
                    <td className="py-2.5 pr-3">
                      <Link
                        href={`/states/${stateToSlug(s.abbr)}`}
                        className="text-[#2F5EA8] hover:underline font-medium"
                      >
                        {s.name}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-3 text-center">
                      <span className={`font-bold ${s.color}`}>{s.grade}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-right text-[var(--text-secondary)]">
                      {formatNumber(s.totalProviders)}
                    </td>
                    <td className="py-2.5 pr-3 text-right text-[var(--text-secondary)]">
                      {formatCurrency(s.avgPayment)}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-semibold text-[var(--text-primary)]">
                      {formatCurrency(s.totalMissed)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Top 5 Specialty Breakdown */}
      <section className="border-t border-[var(--border-light)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-[#2F5EA8]" />
            Top 5 Specialties by Provider Count
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {specialtyRankings.map((s: any) => (
              <Link
                key={s.specialty}
                href={`/specialties/${specialtyToSlug(s.specialty)}`}
                className="group rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/15 transition-all"
              >
                <span className={`text-2xl font-bold ${s.color}`}>
                  {s.grade}
                </span>
                <h3 className="font-semibold text-sm mt-2 group-hover:text-[#2F5EA8] transition-colors">
                  {s.specialty}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {formatNumber(s.provider_count)} providers
                </p>
                <p className="text-xs text-[#2F5EA8] mt-2">
                  ~{formatCurrency(s.gap)} gap/provider
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/specialties"
              className="text-sm text-[#2F5EA8] hover:underline"
            >
              View all {benchmarks.length} specialties →
            </Link>
          </div>
        </div>
      </section>

      {/* Program Adoption Overview */}
      <section className="border-t border-[var(--border-light)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6 text-[#2F5EA8]" />
            National Program Adoption Rates
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "CCM",
                fullName: "Chronic Care Mgmt",
                rate: natCCM,
                target: 15,
                icon: Heart,
                href: "/programs/ccm",
              },
              {
                name: "RPM",
                fullName: "Remote Patient Mon.",
                rate: natRPM,
                target: 10,
                icon: Activity,
                href: "/programs/rpm",
              },
              {
                name: "BHI",
                fullName: "Behavioral Health",
                rate: natBHI,
                target: 8,
                icon: Brain,
                href: "/programs/bhi",
              },
              {
                name: "AWV",
                fullName: "Annual Wellness Visit",
                rate: natAWV,
                target: 50,
                icon: Calendar,
                href: "/programs/awv",
              },
            ].map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="group rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/15 transition-all"
              >
                <p.icon className="h-7 w-7 text-[#2F5EA8] mb-3" />
                <p className="text-lg font-bold group-hover:text-[#2F5EA8] transition-colors">
                  {p.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  {p.fullName}
                </p>
                <p className="text-3xl font-bold text-[#2F5EA8]">
                  {p.rate.toFixed(1)}%
                </p>
                <div className="h-2 rounded-full bg-[var(--bg)]/80 mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2F5EA8]"
                    style={{
                      width: `${Math.min((p.rate / p.target) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Target: {p.target}%
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Embeddable Chart */}
      <section className="border-t border-[var(--border-light)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code className="h-6 w-6 text-[#2F5EA8]" />
            Embed This Data
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Use the embed code below to display the national revenue gap summary
            on your website. Links back to the full report.
          </p>
          <div className="rounded-xl border border-[var(--border-light)] bg-[var(--bg)]/50 p-4 font-mono text-xs text-[var(--text-secondary)] overflow-x-auto">
            <code>
              {`<iframe src="https://npixray.com/reports/embed/national" width="100%" height="400" frameborder="0" title="2026 Medicare Revenue Gap Report - NPIxray"></iframe>`}
            </code>
          </div>
        </div>
      </section>

      {/* Citation Block */}
      <section className="border-t border-[var(--border-light)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <CiteBlock
            title="2026 Medicare Revenue Gap Report: 50-State Analysis"
            year={2026}
            url="https://npixray.com/reports/2026-medicare-revenue-gap"
          />
        </div>
      </section>

      {/* Data Coverage */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
        <DataCoverage providerCount={national?.totalProviders || 0} />
      </section>

      {/* Share */}
      <section className="border-t border-[var(--border-light)] py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-[#2F5EA8]" />
            Share This Report
          </h2>
          <ShareButtons
            title="2026 Medicare Revenue Gap Report"
            twitterText={shareText.twitter}
            linkedinText={shareText.linkedin}
            url="https://npixray.com/reports/2026-medicare-revenue-gap"
          />
        </div>
      </section>

      {/* Internal Links Grid */}
      <section className="border-t border-[var(--border-light)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Explore the Data</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* States */}
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <MapPin className="h-5 w-5 text-[#2F5EA8] mb-3" />
              <h3 className="font-semibold text-sm mb-3">Browse by State</h3>
              <div className="flex flex-wrap gap-1.5">
                {stateRankings.slice(0, 10).map((s: any) => (
                  <Link
                    key={s.abbr}
                    href={`/states/${stateToSlug(s.abbr)}`}
                    className="text-xs rounded-md border border-[var(--border-light)] px-2 py-1 text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all"
                  >
                    {s.abbr}
                  </Link>
                ))}
                <Link
                  href="/states"
                  className="text-xs rounded-md border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-2 py-1 text-[#2F5EA8]"
                >
                  All 50 →
                </Link>
              </div>
            </div>

            {/* Specialties */}
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <Stethoscope className="h-5 w-5 text-[#2F5EA8] mb-3" />
              <h3 className="font-semibold text-sm mb-3">
                Browse by Specialty
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {benchmarks.slice(0, 8).map((b: any) => (
                  <Link
                    key={b.specialty}
                    href={`/specialties/${specialtyToSlug(b.specialty)}`}
                    className="text-xs rounded-md border border-[var(--border-light)] px-2 py-1 text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all"
                  >
                    {b.specialty}
                  </Link>
                ))}
                <Link
                  href="/specialties"
                  className="text-xs rounded-md border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-2 py-1 text-[#2F5EA8]"
                >
                  All →
                </Link>
              </div>
            </div>

            {/* Programs */}
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <Heart className="h-5 w-5 text-[#2F5EA8] mb-3" />
              <h3 className="font-semibold text-sm mb-3">
                Revenue Programs
              </h3>
              <ul className="space-y-1.5">
                {[
                  { label: "Chronic Care Management (CCM)", href: "/programs/ccm" },
                  { label: "Remote Patient Monitoring (RPM)", href: "/programs/rpm" },
                  { label: "Annual Wellness Visit (AWV)", href: "/programs/awv" },
                  { label: "Behavioral Health Integration (BHI)", href: "/programs/bhi" },
                  { label: "E&M Coding Optimization", href: "/programs/em-coding" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors flex items-center gap-1"
                    >
                      <ArrowRight className="h-3 w-3" /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
