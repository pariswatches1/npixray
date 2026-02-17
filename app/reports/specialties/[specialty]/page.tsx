import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Stethoscope,
  Users,
  DollarSign,
  TrendingDown,
  Activity,
  Heart,
  Brain,
  Calendar,
  Home,
  ChevronRight,
  Share2,
  BarChart3,
} from "lucide-react";
import {
  getAllBenchmarks,
  getBenchmarkBySpecialty,
  specialtyToSlug,
} from "@/lib/db-queries";
import { SPECIALTY_LIST } from "@/lib/benchmark-data";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  calculateGrade,
  estimateCaptureRate,
  estimatePerProviderGap,
  generateShareText,
} from "@/lib/report-utils";
import { ReportGrade } from "@/components/reports/report-grade";
import { ShareButtons } from "@/components/reports/share-buttons";
import { ScanCTA } from "@/components/seo/scan-cta";

export function generateStaticParams() {
  return SPECIALTY_LIST.map((s) => ({ specialty: specialtyToSlug(s) }));
}

function slugToSpecialty(slug: string): string | null {
  return (
    SPECIALTY_LIST.find((s) => specialtyToSlug(s) === slug) || null
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ specialty: string }>;
}): Promise<Metadata> {
  const { specialty: slug } = await params;
  const name = slugToSpecialty(slug);
  if (!name) return { title: "Report Not Found" };

  return {
    title: `${name} Medicare Revenue Report Card 2026 | NPIxray`,
    description: `${name} revenue analysis: provider count, E&M coding distribution, care management adoption rates, and estimated revenue gaps from CMS data.`,
    openGraph: {
      title: `${name} Medicare Revenue Report Card 2026`,
      description: `Data-driven grade for ${name} Medicare providers.`,
      url: `https://npixray.com/reports/specialties/${slug}`,
    },
    alternates: {
      canonical: `https://npixray.com/reports/specialties/${slug}`,
    },
  };
}

export default async function SpecialtyReportPage({
  params,
}: {
  params: Promise<{ specialty: string }>;
}) {
  const { specialty: slug } = await params;
  const name = slugToSpecialty(slug);
  if (!name) notFound();

  const benchmark = await getBenchmarkBySpecialty(name);
  if (!benchmark) notFound();

  const rate = estimateCaptureRate(
    benchmark.ccm_adoption_rate,
    benchmark.rpm_adoption_rate,
    benchmark.bhi_adoption_rate,
    benchmark.awv_adoption_rate,
    benchmark.pct_99214,
    benchmark.pct_99215
  );
  const gradeInfo = calculateGrade(rate);
  const gap = estimatePerProviderGap(benchmark.avg_total_payment);
  const totalMissed = gap * benchmark.provider_count;

  const programs = [
    {
      name: "CCM",
      fullName: "Chronic Care Management",
      rate: benchmark.ccm_adoption_rate,
      target: 15,
      icon: Heart,
      color: "emerald",
    },
    {
      name: "RPM",
      fullName: "Remote Patient Monitoring",
      rate: benchmark.rpm_adoption_rate,
      target: 10,
      icon: Activity,
      color: "blue",
    },
    {
      name: "BHI",
      fullName: "Behavioral Health Integration",
      rate: benchmark.bhi_adoption_rate,
      target: 8,
      icon: Brain,
      color: "purple",
    },
    {
      name: "AWV",
      fullName: "Annual Wellness Visit",
      rate: benchmark.awv_adoption_rate,
      target: 50,
      icon: Calendar,
      color: "amber",
    },
  ];

  const emCodes = [
    { code: "99213", label: "Level 3", pct: benchmark.pct_99213, target: 30 },
    { code: "99214", label: "Level 4", pct: benchmark.pct_99214, target: 50 },
    { code: "99215", label: "Level 5", pct: benchmark.pct_99215, target: 15 },
  ];

  const shareText = generateShareText("specialty", name, {
    providers: benchmark.provider_count,
    missedRevenue: formatCurrency(gap),
    grade: gradeInfo.grade,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: `${name} Medicare Revenue Report Card 2026`,
    description: `Medicare revenue analysis for ${name} providers`,
    url: `https://npixray.com/reports/specialties/${slug}`,
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
          <span className="text-[var(--text-primary)]">{name}</span>
        </nav>

        {/* Header with Grade */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <ReportGrade captureRate={rate} />
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 mb-1">
              <Stethoscope className="h-5 w-5 text-gold" />
              <span className="text-sm font-semibold text-gold uppercase tracking-wider">
                Specialty Report Card 2026
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
            { icon: Users, label: "Total Providers", value: formatNumber(benchmark.provider_count) },
            { icon: DollarSign, label: "Avg Medicare Payment", value: formatCurrency(benchmark.avg_total_payment) },
            { icon: TrendingDown, label: "Est. Avg Gap", value: formatCurrency(gap), highlight: true },
            { icon: Activity, label: "Avg Patients", value: formatNumber(benchmark.avg_medicare_patients) },
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

        {/* E&M Distribution */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gold" />
            E&M Coding Distribution
          </h2>
          <div className="space-y-4">
            {emCodes.map((em) => (
              <div key={em.code} className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold">{em.code}</span>
                    <span className="text-sm text-[var(--text-secondary)] ml-2">
                      {em.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gold">
                    {em.pct.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-dark-400/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${Math.min(em.pct, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Optimal target: ~{em.target}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Program Adoption */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-gold" />
            Care Management Adoption
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {programs.map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-4"
              >
                <p.icon className="h-6 w-6 text-gold mb-2" />
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  {p.fullName}
                </p>
                <p className="text-2xl font-bold text-gold">
                  {p.rate.toFixed(1)}%
                </p>
                <div className="h-2 rounded-full bg-dark-400/80 mt-2 overflow-hidden">
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

        {/* Share */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-gold" />
            Share This Report
          </h2>
          <ShareButtons
            twitterText={shareText.twitter}
            linkedinText={shareText.linkedin}
            url={`https://npixray.com/reports/specialties/${slug}`}
          />
        </section>

        <ScanCTA />
      </div>
    </>
  );
}
