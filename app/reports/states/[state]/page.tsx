import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Users,
  DollarSign,
  TrendingDown,
  Activity,
  BarChart3,
  Home,
  ChevronRight,
  Heart,
  Stethoscope,
  Brain,
  Calendar,
  Share2,
} from "lucide-react";
import {
  getStateStats,
  getStateSpecialties,
  getAllBenchmarks,
  getAllStates,
  stateAbbrToName,
  stateToSlug,
  slugToStateAbbr,
  specialtyToSlug,
} from "@/lib/db-queries";
import { STATE_LIST } from "@/lib/benchmark-data";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  calculateGrade,
  estimatePerProviderGap,
  estimateStateMissedRevenue,
  generateShareText,
} from "@/lib/report-utils";
import { ReportGrade } from "@/components/reports/report-grade";
import { ShareButtons } from "@/components/reports/share-buttons";
import { ScanCTA } from "@/components/seo/scan-cta";

export function generateStaticParams() {
  return STATE_LIST.map((s) => ({ state: stateToSlug(s.abbr) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) return { title: "Report Not Found" };
  const name = stateAbbrToName(abbr);

  return {
    title: `${name} Medicare Revenue Report Card 2026 | NPIxray`,
    description: `See how ${name} grades on Medicare revenue capture. Provider stats, specialty analysis, care management adoption, and estimated revenue gaps from CMS data.`,
    openGraph: {
      title: `${name} Medicare Revenue Report Card 2026`,
      description: `Data-driven grade for ${name} Medicare providers.`,
      url: `https://npixray.com/reports/states/${slug}`,
    },
    alternates: { canonical: `https://npixray.com/reports/states/${slug}` },
  };
}

export default async function StateReportPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) notFound();

  const name = stateAbbrToName(abbr);
  const [stats, specialties, benchmarks] = await Promise.all([
    getStateStats(abbr),
    getStateSpecialties(abbr, 15),
    getAllBenchmarks(),
  ]);

  if (!stats) notFound();

  // Calculate grade
  const allStates = await getAllStates();
  const nationalAvg =
    allStates.reduce((a, b) => a + b.avgPayment, 0) / allStates.length;
  const rate = Math.min(
    Math.round((stats.avgPayment / (nationalAvg * 1.3)) * 75 + 15),
    95
  );
  const gradeInfo = calculateGrade(rate);
  const gap = estimatePerProviderGap(stats.avgPayment);
  const totalMissed = estimateStateMissedRevenue(
    stats.avgPayment,
    stats.totalProviders
  );

  // National benchmarks for comparison
  const nationalBenchmarks = benchmarks.reduce(
    (acc, b) => ({
      ccm: acc.ccm + b.ccm_adoption_rate * b.provider_count,
      rpm: acc.rpm + b.rpm_adoption_rate * b.provider_count,
      bhi: acc.bhi + b.bhi_adoption_rate * b.provider_count,
      awv: acc.awv + b.awv_adoption_rate * b.provider_count,
      total: acc.total + b.provider_count,
    }),
    { ccm: 0, rpm: 0, bhi: 0, awv: 0, total: 0 }
  );
  const natCCM = (nationalBenchmarks.ccm / nationalBenchmarks.total).toFixed(1);
  const natRPM = (nationalBenchmarks.rpm / nationalBenchmarks.total).toFixed(1);
  const natBHI = (nationalBenchmarks.bhi / nationalBenchmarks.total).toFixed(1);
  const natAWV = (nationalBenchmarks.awv / nationalBenchmarks.total).toFixed(1);

  const shareText = generateShareText("state", name, {
    providers: stats.totalProviders,
    missedRevenue: formatCurrency(totalMissed),
    grade: gradeInfo.grade,
  });

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: `${name} Medicare Revenue Report Card 2026`,
    description: `Medicare revenue analysis for ${name} providers`,
    url: `https://npixray.com/reports/states/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "NPIxray",
      url: "https://npixray.com",
    },
    about: {
      "@type": "Dataset",
      name: "CMS Medicare Physician & Other Practitioners",
      description: `Analysis of ${stats.totalProviders.toLocaleString()} providers in ${name}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6 flex-wrap">
          <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
          <Link href="/reports" className="hover:text-gold transition-colors">Reports</Link>
          <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
          <span className="text-[var(--text-primary)]">{name}</span>
        </nav>

        {/* Header with Grade */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <ReportGrade captureRate={rate} />
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-5 w-5 text-gold" />
              <span className="text-sm font-semibold text-gold uppercase tracking-wider">
                State Report Card 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">{name}</h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Medicare Revenue Capture Analysis
            </p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Users, label: "Total Providers", value: formatNumber(stats.totalProviders) },
            { icon: DollarSign, label: "Total Medicare Payment", value: formatCurrency(stats.totalPayment) },
            { icon: TrendingDown, label: "Est. Missed Revenue", value: formatCurrency(totalMissed), highlight: true },
            { icon: Activity, label: "Avg Gap/Provider", value: formatCurrency(gap) },
          ].map((s, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${s.highlight ? "border-gold/30 bg-gold/5" : "border-dark-50/80 bg-dark-400/30"}`}
            >
              <s.icon className={`h-5 w-5 mb-2 ${s.highlight ? "text-gold" : "text-[var(--text-secondary)]"}`} />
              <p className="text-xs text-[var(--text-secondary)] mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.highlight ? "text-gold" : ""}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Top Specialties */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-gold" />
            Top Specialties in {name}
          </h2>
          <div className="rounded-xl border border-dark-50/80 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-dark-400/50">
                <tr>
                  <th className="text-left p-3 font-semibold">Specialty</th>
                  <th className="text-right p-3 font-semibold">Providers</th>
                  <th className="text-right p-3 font-semibold hidden sm:table-cell">
                    Avg Payment
                  </th>
                </tr>
              </thead>
              <tbody>
                {specialties.map((s: any, i: number) => (
                  <tr
                    key={i}
                    className="border-t border-dark-50/50 hover:bg-dark-400/20"
                  >
                    <td className="p-3">
                      <Link
                        href={`/reports/specialties/${specialtyToSlug(s.specialty)}`}
                        className="hover:text-gold transition-colors"
                      >
                        {s.specialty}
                      </Link>
                    </td>
                    <td className="p-3 text-right text-[var(--text-secondary)]">
                      {formatNumber(s.count)}
                    </td>
                    <td className="p-3 text-right text-gold hidden sm:table-cell">
                      {formatCurrency(s.avgPayment)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Program Adoption */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gold" />
            Care Management Adoption
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Compared to national averages (shown in parentheses)
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "CCM", icon: Heart, color: "emerald", national: natCCM },
              { name: "RPM", icon: Activity, color: "blue", national: natRPM },
              { name: "BHI", icon: Brain, color: "purple", national: natBHI },
              { name: "AWV", icon: Calendar, color: "amber", national: natAWV },
            ].map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-4 text-center"
              >
                <p.icon className="h-6 w-6 mx-auto mb-2 text-gold" />
                <p className="text-sm font-semibold mb-1">{p.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  National avg: {p.national}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Share Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-gold" />
            Share This Report
          </h2>
          <ShareButtons
            twitterText={shareText.twitter}
            linkedinText={shareText.linkedin}
            url={`https://npixray.com/reports/states/${slug}`}
          />
        </section>

        <ScanCTA />
      </div>
    </>
  );
}
