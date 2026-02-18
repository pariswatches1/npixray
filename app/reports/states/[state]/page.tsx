import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Heart,
  Wifi,
  Brain,
  Clipboard,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { ProviderTable } from "@/components/seo/provider-table";
import { StatCard } from "@/components/seo/stat-card";
import { ReportCardHeader } from "@/components/reports/report-card-header";
import { AdoptionChart } from "@/components/reports/adoption-chart";
import { EMDistributionChart } from "@/components/reports/em-distribution-chart";
import {
  getStateStats,
  getStateSpecialties,
  getStateCities,
  getStateTopProviders,
  getAllBenchmarks,
  slugToStateAbbr,
  stateAbbrToName,
  stateToSlug,
  specialtyToSlug,
  cityToSlug,
  formatCurrency,
  formatNumber,
} from "@/lib/db-queries";
import {
  calculateGrade,
  calculateCaptureRate,
  calculateAdoptionRates,
  calculateEMDistribution,
  estimateMissedRevenue,
  estimateMissedRevenueFromBenchmark,
  generateShareText,
} from "@/lib/report-utils";
import { STATE_LIST } from "@/lib/benchmark-data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return STATE_LIST.map((s) => ({
    state: s.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) return { title: "State Not Found | NPIxray" };

  const stats = await getStateStats(abbr);
  if (!stats || !stats.totalProviders) return { title: "State Not Found | NPIxray" };

  const name = stateAbbrToName(abbr);
  return {
    title: `${name} Medicare Revenue Report Card 2026 | NPIxray`,
    description: `${name} earns its 2026 Medicare Revenue Report Card grade. ${formatNumber(stats.totalProviders)} providers analyzed, ${formatCurrency(stats.totalPayment)} total Medicare payments. See revenue gaps, program adoption, and E&M coding analysis.`,
    alternates: {
      canonical: `https://npixray.com/reports/states/${slug}`,
    },
    keywords: [
      `${name} Medicare report card`,
      `${name} healthcare revenue`,
      `${name} medical billing analysis`,
      `${name} Medicare providers`,
      "state Medicare grading",
      "revenue capture analysis",
    ],
    openGraph: {
      title: `${name} Medicare Revenue Report Card 2026 | NPIxray`,
      description: `${name}'s 2026 Medicare report card: ${formatNumber(stats.totalProviders)} providers, ${formatCurrency(stats.totalPayment)} in payments. See the full revenue analysis.`,
    },
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

  const stats = await getStateStats(abbr);
  if (!stats || !stats.totalProviders) notFound();

  const stateName = stateAbbrToName(abbr);
  const [specialties, cities, providers, allBenchmarks] = await Promise.all([
    getStateSpecialties(abbr, 20),
    getStateCities(abbr, 20),
    getStateTopProviders(abbr, 200),
    getAllBenchmarks(),
  ]);

  // Calculate grade
  const captureRate = providers.length > 0
    ? calculateCaptureRate(providers, allBenchmarks)
    : 0.55;
  const grade = calculateGrade(captureRate);

  // Calculate missed revenue
  const missedRevenue = providers.length > 0
    ? estimateMissedRevenue(providers, allBenchmarks)
    : estimateMissedRevenueFromBenchmark(stats.totalProviders, stats.avgPayment);

  // Calculate adoption rates
  const adoption = calculateAdoptionRates(providers);

  // Calculate E&M distribution
  const emDist = calculateEMDistribution(providers);

  // National average adoption rates (from benchmarks)
  const nationalAdoption = {
    ccm: allBenchmarks.length > 0
      ? allBenchmarks.reduce((s, b) => s + (b.ccm_adoption_rate || 0), 0) / allBenchmarks.length
      : 0.03,
    rpm: allBenchmarks.length > 0
      ? allBenchmarks.reduce((s, b) => s + (b.rpm_adoption_rate || 0), 0) / allBenchmarks.length
      : 0.02,
    bhi: allBenchmarks.length > 0
      ? allBenchmarks.reduce((s, b) => s + (b.bhi_adoption_rate || 0), 0) / allBenchmarks.length
      : 0.005,
    awv: allBenchmarks.length > 0
      ? allBenchmarks.reduce((s, b) => s + (b.awv_adoption_rate || 0), 0) / allBenchmarks.length
      : 0.15,
  };

  // National average E&M distribution
  const nationalEM = {
    pct99213: allBenchmarks.length > 0
      ? allBenchmarks.reduce((s, b) => s + (b.pct_99213 || 0), 0) / allBenchmarks.length
      : 0.3,
    pct99214: allBenchmarks.length > 0
      ? allBenchmarks.reduce((s, b) => s + (b.pct_99214 || 0), 0) / allBenchmarks.length
      : 0.55,
    pct99215: allBenchmarks.length > 0
      ? allBenchmarks.reduce((s, b) => s + (b.pct_99215 || 0), 0) / allBenchmarks.length
      : 0.08,
  };

  // Share text
  const shareText = generateShareText("state", stateName, formatCurrency(missedRevenue), grade.grade);
  const shareUrl = `/reports/states/${slug}`;

  // Program adoption chart data
  const adoptionChartData = [
    { program: "CCM", actual: adoption.ccm, national: nationalAdoption.ccm },
    { program: "RPM", actual: adoption.rpm, national: nationalAdoption.rpm },
    { program: "BHI", actual: adoption.bhi, national: nationalAdoption.bhi },
    { program: "AWV", actual: adoption.awv, national: nationalAdoption.awv },
  ];

  // E&M chart data
  const emChartData = [
    { code: "99213", actual: emDist.pct99213, benchmark: nationalEM.pct99213 },
    { code: "99214", actual: emDist.pct99214, benchmark: nationalEM.pct99214 },
    { code: "99215", actual: emDist.pct99215, benchmark: nationalEM.pct99215 },
  ];

  // Top 20 providers for display
  const displayProviders = providers.slice(0, 20);

  return (
    <>
      {/* Hero with Grade */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Report Cards", href: "/reports" },
              { label: "States", href: "/reports" },
              { label: stateName },
            ]}
          />

          <ReportCardHeader
            grade={grade}
            entityName={stateName}
            subtitle={`${formatNumber(stats.totalProviders)} Medicare providers analyzed`}
            reportType="state"
            reportId={abbr}
            shareUrl={shareUrl}
            twitterText={shareText.twitter}
            linkedinText={shareText.linkedin}
          />

          {/* Key Stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Total Providers"
              value={formatNumber(stats.totalProviders)}
              icon={Users}
              sub={`in ${stateName}`}
            />
            <StatCard
              label="Total Medicare Payment"
              value={formatCurrency(stats.totalPayment)}
              icon={DollarSign}
            />
            <StatCard
              label="Avg Payment / Provider"
              value={formatCurrency(stats.avgPayment)}
              icon={TrendingUp}
            />
            <StatCard
              label="Est. Missed Revenue"
              value={formatCurrency(missedRevenue)}
              icon={Activity}
              sub="across all providers"
            />
          </div>
        </div>
      </section>

      {/* Program Adoption Rates */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">
            Care Management <span className="text-gold">Program Adoption</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-2xl">
            How {stateName} providers compare to the national average in adopting
            revenue-generating care management programs.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="rounded-xl border border-dark-50/50 bg-dark-300 p-6">
              <AdoptionChart data={adoptionChartData} entityLabel={stateName} />
            </div>

            {/* Program cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "CCM", full: "Chronic Care Management", code: "99490", rate: adoption.ccm, national: nationalAdoption.ccm, icon: Heart, color: "text-rose-400", revenue: "$62/patient/mo" },
                { name: "RPM", full: "Remote Patient Monitoring", code: "99454/99457", rate: adoption.rpm, national: nationalAdoption.rpm, icon: Wifi, color: "text-blue-400", revenue: "$120/patient/mo" },
                { name: "BHI", full: "Behavioral Health Integration", code: "99484", rate: adoption.bhi, national: nationalAdoption.bhi, icon: Brain, color: "text-purple-400", revenue: "$50/patient/mo" },
                { name: "AWV", full: "Annual Wellness Visits", code: "G0438/G0439", rate: adoption.awv, national: nationalAdoption.awv, icon: Clipboard, color: "text-emerald-400", revenue: "$175/visit" },
              ].map((p) => {
                const gap = p.national - p.rate;
                const isAbove = gap <= 0;
                return (
                  <div
                    key={p.name}
                    className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <p.icon className={`h-5 w-5 ${p.color}`} />
                      <div>
                        <p className="font-semibold text-sm">{p.name}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">{p.full}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-bold font-mono text-gold">
                        {(p.rate * 100).toFixed(1)}%
                      </span>
                      <span className={`text-xs font-medium ${isAbove ? "text-emerald-400" : "text-red-400"}`}>
                        {isAbove ? "+" : ""}{((p.rate - p.national) * 100).toFixed(1)}% vs national
                      </span>
                    </div>
                    <div className="w-full bg-dark-500 rounded-full h-2">
                      <div
                        className="bg-gold h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(p.rate * 100 * 5, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-2">
                      {p.revenue} potential revenue
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* E&M Distribution */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">
            E&M Coding <span className="text-gold">Distribution</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-2xl">
            How {stateName} providers distribute evaluation and management visits
            compared to the national benchmark. Higher 99214/99215 rates indicate
            thorough documentation and appropriate complexity coding.
          </p>

          <div className="max-w-2xl">
            <div className="rounded-xl border border-dark-50/50 bg-dark-300 p-6">
              <EMDistributionChart data={emChartData} entityLabel={stateName} />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { code: "99213", label: "Level 3", actual: emDist.pct99213, benchmark: nationalEM.pct99213 },
                { code: "99214", label: "Level 4", actual: emDist.pct99214, benchmark: nationalEM.pct99214 },
                { code: "99215", label: "Level 5", actual: emDist.pct99215, benchmark: nationalEM.pct99215 },
              ].map((item) => (
                <div key={item.code} className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-center">
                  <p className="text-lg font-bold font-mono">{item.code}</p>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">{item.label}</p>
                  <p className="text-xl font-bold font-mono text-gold">
                    {(item.actual * 100).toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    National: {(item.benchmark * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Specialties */}
      {specialties.length > 0 && (
        <section className="border-t border-dark-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Top Specialties in <span className="text-gold">{stateName}</span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-dark-50/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-50/50 bg-dark-300">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Specialty</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Providers</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Avg Payment</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {specialties.map((s, i) => (
                    <tr key={s.specialty} className={`border-b border-dark-50/30 hover:bg-dark-200/50 transition-colors ${i % 2 === 0 ? "bg-dark-400/30" : ""}`}>
                      <td className="px-4 py-3">
                        <Link
                          href={`/reports/specialties/${specialtyToSlug(s.specialty)}`}
                          className="text-gold hover:text-gold-300 font-medium transition-colors"
                        >
                          {s.specialty}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{s.count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-gold">{formatCurrency(s.avgPayment)}</td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <Link
                          href={`/reports/specialties/${specialtyToSlug(s.specialty)}`}
                          className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-gold transition-colors"
                        >
                          View <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Top Cities */}
      {cities.length > 0 && (
        <section className="border-t border-dark-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              City Report Cards in <span className="text-gold">{stateName}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cities.map((c, i) => (
                <Link
                  key={c.city}
                  href={`/reports/cities/${slug}/${cityToSlug(c.city)}`}
                  className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-[var(--text-secondary)]" />
                    <span className="text-xs text-gold/50 font-mono">#{i + 1}</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-gold transition-colors mb-1">
                    {c.city}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-gold">{c.count.toLocaleString()} providers</span>
                    <span className="text-[var(--text-secondary)]">{formatCurrency(c.avgPayment)} avg</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Providers */}
      {displayProviders.length > 0 && (
        <section className="border-t border-dark-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">
              Top 20 Providers in <span className="text-gold">{stateName}</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8">
              Highest-volume Medicare providers by total payment.
            </p>
            <ProviderTable providers={displayProviders} showCity={true} showSpecialty={true} />
          </div>
        </section>
      )}

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
            "@type": "Report",
            name: `${stateName} Medicare Revenue Report Card 2026`,
            description: `Annual grading of ${stateName} on Medicare revenue capture efficiency based on CMS public data covering ${formatNumber(stats.totalProviders)} providers.`,
            url: `https://npixray.com/reports/states/${slug}`,
            datePublished: "2026-01-15",
            creator: {
              "@type": "Organization",
              name: "NPIxray",
              url: "https://npixray.com",
            },
            about: {
              "@type": "Place",
              name: stateName,
              address: {
                "@type": "PostalAddress",
                addressRegion: abbr,
                addressCountry: "US",
              },
            },
          }),
        }}
      />
    </>
  );
}
