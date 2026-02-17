import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  Search,
  FileCode2,
  GitCompareArrows,
  MapPin,
  HeartPulse,
  Activity,
  CalendarCheck,
  ClipboardCheck,
  BarChart3,
  Gauge,
  Wrench,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Free Medicare Billing Tools — Calculators & Lookups",
  description:
    "Free interactive tools for medical practices: revenue calculators, NPI lookup, CPT code search, specialty comparisons, CCM/RPM/AWV calculators, E&M audit tool, and practice benchmarking.",
  keywords: [
    "Medicare billing tools",
    "NPI lookup tool",
    "CPT code lookup",
    "CCM calculator",
    "RPM calculator",
    "AWV calculator",
    "E&M audit tool",
    "medical practice benchmarks",
    "revenue calculator healthcare",
    "specialty comparison Medicare",
  ],
  openGraph: {
    title: "Free Medicare Billing Tools | NPIxray",
    description:
      "Free interactive tools for medical practices. Revenue calculators, NPI lookup, CPT code search, and more.",
  },
};

const TOOLS = [
  {
    slug: "revenue-calculator",
    title: "Revenue Calculator",
    description:
      "Estimate total Medicare revenue by specialty, state, and patient count. See E&M breakdowns and program opportunities.",
    icon: Calculator,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    slug: "npi-lookup",
    title: "NPI Lookup",
    description:
      "Search 1.175M+ Medicare providers by NPI number, name, specialty, or location. View billing data instantly.",
    icon: Search,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    slug: "code-lookup",
    title: "Code Lookup",
    description:
      "Look up any CPT or HCPCS code to see national Medicare payment data, utilization rates, and billing trends.",
    icon: FileCode2,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
  {
    slug: "specialty-comparison",
    title: "Specialty Comparison",
    description:
      "Compare two specialties side-by-side on revenue, patient volume, E&M distribution, and program adoption.",
    icon: GitCompareArrows,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    slug: "state-comparison",
    title: "State Comparison",
    description:
      "Compare Medicare billing data between two states. See provider counts, payment rates, and utilization differences.",
    icon: MapPin,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  {
    slug: "ccm-calculator",
    title: "CCM Calculator",
    description:
      "Calculate Chronic Care Management revenue potential. See monthly and annual projections for 99490 and 99439 billing.",
    icon: HeartPulse,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
  {
    slug: "rpm-calculator",
    title: "RPM Calculator",
    description:
      "Estimate Remote Patient Monitoring revenue and ROI. Factor in device costs and see net annual projections.",
    icon: Activity,
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
  },
  {
    slug: "awv-calculator",
    title: "AWV Calculator",
    description:
      "Calculate Annual Wellness Visit revenue at different completion rates. See G0438 and G0439 billing potential.",
    icon: CalendarCheck,
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
  },
  {
    slug: "em-audit",
    title: "E&M Coding Audit",
    description:
      "Compare your 99213/99214/99215 distribution against specialty benchmarks. Find revenue lost to undercoding.",
    icon: ClipboardCheck,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    slug: "practice-benchmark",
    title: "Practice Benchmark",
    description:
      "See where your practice ranks among 1.175M+ providers. Compare revenue to your specialty and state peers.",
    icon: BarChart3,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  {
    slug: "score-compare",
    title: "Score Compare",
    description:
      "Compare Revenue Scores for 2-5 providers side by side. See how different practices stack up across all scoring dimensions.",
    icon: Gauge,
    color: "text-gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/20",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free Medicare Billing Tools",
  description:
    "Free interactive tools for medical practices including revenue calculators, NPI lookup, CPT code search, and practice benchmarking.",
  url: "https://npixray.com/tools",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: TOOLS.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.title,
      url: `https://npixray.com/tools/${tool.slug}`,
    })),
  },
};

export default function ToolsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <Breadcrumbs items={[{ label: "Tools" }]} />

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <Wrench className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                11 Free Tools
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Free Medicare Billing{" "}
              <span className="text-gold">Tools</span>
            </h1>

            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Interactive calculators, lookup tools, and benchmarking utilities
              built for medical practices. All free, no login required.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group rounded-2xl border border-dark-50/80 bg-dark-400/50 p-6 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 flex flex-col"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${tool.borderColor} ${tool.bgColor} mb-4`}
                >
                  <tool.icon className={`h-6 w-6 ${tool.color}`} />
                </div>

                <h2 className="text-lg font-bold mb-2 group-hover:text-gold transition-colors">
                  {tool.title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                  {tool.description}
                </p>

                <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] group-hover:text-gold transition-colors mt-5 pt-4 border-t border-dark-50/50">
                  Use Tool
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Want a Personalized{" "}
            <span className="text-gold">Revenue Analysis</span>?
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            These tools use national averages. Scan your NPI for a
            personalized analysis based on your actual billing data.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
          >
            <Zap className="h-5 w-5" />
            Scan Your NPI — Free
          </Link>
        </div>
      </section>
    </>
  );
}
