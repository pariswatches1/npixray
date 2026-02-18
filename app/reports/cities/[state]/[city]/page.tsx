import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Home,
  ChevronRight,
  Share2,
  Stethoscope,
} from "lucide-react";
import {
  getCityStats,
  getCitySpecialties,
  getStateStats,
  slugToStateAbbr,
  stateAbbrToName,
  stateToSlug,
  cityToSlug,
  specialtyToSlug,
} from "@/lib/db-queries";
import { formatCurrency, formatNumber } from "@/lib/format";
import { calculateGrade } from "@/lib/report-utils";
import { ReportGrade } from "@/components/reports/report-grade";
import { ShareButtons } from "@/components/reports/share-buttons";
import { ScanCTA } from "@/components/seo/scan-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) return { title: "Not Found" };
  const stateName = stateAbbrToName(abbr);
  const cityName = citySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${cityName}, ${stateName} Medicare Revenue Report Card | NPIxray`,
    description: `Medicare provider analysis for ${cityName}, ${stateName}. See local provider stats, top specialties, and how this city compares to the state average.`,
    alternates: {
      canonical: `https://npixray.com/reports/cities/${stateSlug}/${citySlug}`,
    },
    openGraph: {
      title: `${cityName}, ${stateName} Medicare Report Card`,
      url: `https://npixray.com/reports/cities/${stateSlug}/${citySlug}`,
    },
  };
}

export default async function CityReportPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) notFound();

  const stateName = stateAbbrToName(abbr);
  const cityName = citySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const [cityStats, citySpecialties, stateStats] = await Promise.all([
    getCityStats(abbr, cityName),
    getCitySpecialties(abbr, cityName),
    getStateStats(abbr),
  ]);

  if (!cityStats || !stateStats) notFound();

  // Grade based on city avg payment vs state avg
  const ratio = cityStats.avgPayment / (stateStats.avgPayment || 1);
  const rate = Math.min(Math.round(ratio * 60 + 15), 95);
  const gradeInfo = calculateGrade(rate);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-gold transition-colors">
          <Home className="h-3.5 w-3.5" />
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
        <Link href="/reports" className="hover:text-gold transition-colors">
          Reports
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
        <Link
          href={`/reports/states/${stateSlug}`}
          className="hover:text-gold transition-colors"
        >
          {stateName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
        <span className="text-[var(--text-primary)]">{cityName}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
        <ReportGrade grade={gradeInfo} size="md" />
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5 text-gold" />
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              City Report Card
            </span>
          </div>
          <h1 className="text-3xl font-bold">
            {cityName}, {stateName}
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-4">
          <Users className="h-5 w-5 text-[var(--text-secondary)] mb-2" />
          <p className="text-xs text-[var(--text-secondary)] mb-1">Providers</p>
          <p className="text-xl font-bold">{formatNumber(cityStats.count)}</p>
        </div>
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-4">
          <DollarSign className="h-5 w-5 text-[var(--text-secondary)] mb-2" />
          <p className="text-xs text-[var(--text-secondary)] mb-1">Avg Payment</p>
          <p className="text-xl font-bold">{formatCurrency(cityStats.avgPayment)}</p>
        </div>
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-4">
          <DollarSign className="h-5 w-5 text-[var(--text-secondary)] mb-2" />
          <p className="text-xs text-[var(--text-secondary)] mb-1">Total Payment</p>
          <p className="text-xl font-bold">{formatCurrency(cityStats.totalPayment)}</p>
        </div>
        <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
          <TrendingUp className="h-5 w-5 text-gold mb-2" />
          <p className="text-xs text-[var(--text-secondary)] mb-1">vs State Avg</p>
          <p className={`text-xl font-bold ${ratio >= 1 ? "text-emerald-400" : "text-orange-400"}`}>
            {ratio >= 1 ? "+" : ""}
            {((ratio - 1) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Specialties */}
      {citySpecialties && citySpecialties.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-gold" />
            Top Specialties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {citySpecialties.slice(0, 10).map((s: any, i: number) => (
              <Link
                key={i}
                href={`/reports/specialties/${specialtyToSlug(s.specialty)}`}
                className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-4 hover:border-gold/20 transition-colors flex justify-between items-center"
              >
                <span className="font-medium">{s.specialty}</span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {formatNumber(s.count)} providers
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Share */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Share2 className="h-5 w-5 text-gold" />
          Share
        </h2>
        <ShareButtons
          title={`${cityName}, ${stateName} Medicare Report`}
          twitterText={`${cityName}, ${stateName} has ${formatNumber(cityStats.count)} Medicare providers with avg payment of ${formatCurrency(cityStats.avgPayment)}. See the report: https://npixray.com/reports/cities/${stateSlug}/${citySlug}`}
          linkedinText={`Medicare data for ${cityName}, ${stateName}:\n- ${formatNumber(cityStats.count)} providers\n- ${formatCurrency(cityStats.avgPayment)} avg payment\n- ${((ratio - 1) * 100).toFixed(0)}% vs state average\n\nFull report: https://npixray.com/reports/cities/${stateSlug}/${citySlug}`}
          url={`https://npixray.com/reports/cities/${stateSlug}/${citySlug}`}
        />
      </section>

      <ScanCTA />
    </div>
  );
}
