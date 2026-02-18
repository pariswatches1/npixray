import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Heart,
  Activity,
  Clipboard,
  Brain,
  Users,
  MapPin,
  FileText,
  ArrowRight,
  Stethoscope,
  Building2,
  UserPlus,
  Scissors,
  LineChart,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Medicare Data Insights & Reports | NPIxray",
  description:
    "15 in-depth Medicare data reports covering billing trends, specialty revenues, care management adoption, E&M coding patterns, and geographic analysis across 1.175M+ providers.",
  keywords: [
    "Medicare data insights",
    "Medicare billing reports",
    "healthcare data analysis",
    "Medicare payment trends",
    "care management adoption",
  ],
  alternates: {
    canonical: "https://npixray.com/insights",
  },
  openGraph: {
    title: "Medicare Data Insights & Reports | NPIxray",
    description:
      "Explore 15 data-driven Medicare reports covering specialties, billing codes, care management, and geographic trends.",
  },
};

const insights = [
  {
    slug: "medicare-billing-overview",
    title: "Medicare Billing Overview",
    description: "National summary of Medicare billing across all providers, specialties, and codes.",
    icon: BarChart3,
  },
  {
    slug: "highest-paying-specialties",
    title: "Highest-Paying Specialties",
    description: "Which medical specialties generate the highest Medicare payments per provider.",
    icon: DollarSign,
  },
  {
    slug: "most-common-billing-codes",
    title: "Most Common Billing Codes",
    description: "The top CPT/HCPCS codes by volume across all Medicare providers.",
    icon: FileText,
  },
  {
    slug: "ccm-adoption-rates",
    title: "CCM Adoption Rates",
    description: "Chronic Care Management (99490) adoption rates by specialty and geography.",
    icon: Heart,
  },
  {
    slug: "rpm-adoption-rates",
    title: "RPM Adoption Rates",
    description: "Remote Patient Monitoring adoption across specialties with revenue impact analysis.",
    icon: Activity,
  },
  {
    slug: "awv-completion-rates",
    title: "AWV Completion Rates",
    description: "Annual Wellness Visit completion rates by specialty and state.",
    icon: Clipboard,
  },
  {
    slug: "bhi-screening-rates",
    title: "BHI Screening Rates",
    description: "Behavioral Health Integration screening rates and adoption patterns.",
    icon: Brain,
  },
  {
    slug: "em-coding-patterns",
    title: "E&M Coding Patterns",
    description: "Evaluation and Management coding distributions across specialties.",
    icon: BarChart3,
  },
  {
    slug: "medicare-revenue-by-state",
    title: "Medicare Revenue by State",
    description: "State-by-state Medicare payment analysis and provider distribution.",
    icon: MapPin,
  },
  {
    slug: "revenue-gap-by-specialty",
    title: "Revenue Gap by Specialty",
    description: "Estimated missed revenue opportunities analyzed by medical specialty.",
    icon: TrendingUp,
  },
  {
    slug: "top-billing-providers",
    title: "Top Billing Providers",
    description: "The highest-volume Medicare providers nationally by total payment.",
    icon: Users,
  },
  {
    slug: "rural-vs-urban-billing",
    title: "Rural vs Urban Billing",
    description: "How Medicare billing patterns differ between rural and urban providers.",
    icon: Building2,
  },
  {
    slug: "new-patient-vs-established",
    title: "New Patient vs Established",
    description: "Analysis of new patient acquisition vs established patient visit patterns.",
    icon: UserPlus,
  },
  {
    slug: "procedure-vs-evaluation",
    title: "Procedure vs Evaluation",
    description: "The balance between procedural billing and evaluation/management services.",
    icon: Scissors,
  },
  {
    slug: "medicare-payment-trends",
    title: "Medicare Payment Trends",
    description: "Payment distribution patterns and high-value code utilization analysis.",
    icon: LineChart,
  },
];

export default function InsightsIndexPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "Insights", href: "/insights" }]} />

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <TrendingUp className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                {insights.length} Data Reports
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Medicare Data{" "}
              <span className="text-gold">Insights & Reports</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              In-depth analysis of Medicare billing data across specialties,
              geographies, and care management programs. All data sourced from
              CMS public datasets.
            </p>
          </div>
        </div>
      </section>

      {/* Insights Grid */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <Link
                  key={insight.slug}
                  href={`/insights/${insight.slug}`}
                  className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-gold group-hover:translate-x-0.5 transition-all mt-1" />
                  </div>
                  <h2 className="font-semibold mb-2 group-hover:text-gold transition-colors">
                    {insight.title}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {insight.description}
                  </p>
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
