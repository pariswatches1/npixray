import type { Metadata } from "next";
import Link from "next/link";
import {
  User,
  Users,
  Building2,
  TreePine,
  Hospital,
  FileText,
  Briefcase,
  Rocket,
  Sparkles,
  MapPin,
  ArrowRight,
  Zap,
  Target,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Solutions — NPIxray for Every Practice Type",
  description:
    "NPIxray provides revenue intelligence for solo practices, group practices, FQHCs, rural providers, hospital outpatient, billing companies, practice managers, and more.",
  keywords: [
    "medical practice revenue solutions",
    "billing analytics by practice type",
    "healthcare revenue intelligence",
    "FQHC revenue optimization",
    "group practice billing analytics",
    "solo practice revenue",
    "medical billing company tools",
    "practice manager analytics",
  ],
  openGraph: {
    title: "Solutions for Every Practice Type | NPIxray",
    description:
      "Revenue intelligence tailored to your practice type. From solo providers to hospital systems, NPIxray shows you the money you're missing.",
  },
};

const SOLUTIONS = [
  {
    slug: "solo-practice",
    title: "Solo Practitioners",
    description:
      "Instant billing analysis with zero staff. No consultants, no cost — just data-driven revenue insights.",
    icon: User,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    slug: "group-practice",
    title: "Group Practices",
    description:
      "Compare every provider against benchmarks. Find inconsistent coding and close revenue gaps across your group.",
    icon: Users,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    slug: "fqhc",
    title: "FQHCs & Community Health Centers",
    description:
      "Maximize every dollar to serve more patients. Identify CCM, RPM, and AWV opportunities in high-need populations.",
    icon: Building2,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
  {
    slug: "rural-practice",
    title: "Rural Practices",
    description:
      "Fewer patients means every encounter counts. Discover missed programs and benchmark against rural peers.",
    icon: TreePine,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    slug: "hospital-outpatient",
    title: "Hospital Outpatient",
    description:
      "Department-level coding analysis across all employed providers. Identify systematic downcoding at scale.",
    icon: Hospital,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
  {
    slug: "billing-companies",
    title: "Medical Billing Companies",
    description:
      "Scan prospect NPIs to show revenue gaps in proposals. Win more clients with data-driven pitches.",
    icon: FileText,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    slug: "practice-managers",
    title: "Practice Managers",
    description:
      "Prove ROI of programs, justify new hires, and make data-driven decisions without expensive BI tools.",
    icon: Briefcase,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  {
    slug: "physician-entrepreneurs",
    title: "Physician Entrepreneurs",
    description:
      "Evaluate acquisition targets, benchmark competitors, and scale revenue across your practice portfolio.",
    icon: Rocket,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    slug: "new-practices",
    title: "New Medical Practices",
    description:
      "No billing history? Benchmark against specialty peers and set revenue targets from day one.",
    icon: Sparkles,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
  },
  {
    slug: "multi-location",
    title: "Multi-Location Practices",
    description:
      "Compare performance across sites. Identify underperformers and standardize coding for maximum revenue.",
    icon: MapPin,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "NPIxray Solutions",
  description:
    "Revenue intelligence solutions for every healthcare practice type — from solo providers to hospital systems.",
  url: "https://npixray.com/solutions",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: SOLUTIONS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: `https://npixray.com/solutions/${s.slug}`,
    })),
  },
};

export default function SolutionsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <Breadcrumbs items={[{ label: "Solutions" }]} />

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <Target className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                10 Practice Types
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Revenue Intelligence for{" "}
              <span className="text-gold">Every Practice</span>
            </h1>

            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Whether you run a solo practice or a multi-location health system,
              NPIxray shows you exactly how much revenue you&apos;re leaving on
              the table.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map((solution) => (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                className="group rounded-2xl border border-dark-50/80 bg-dark-400/50 p-6 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 flex flex-col"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${solution.borderColor} ${solution.bgColor} mb-4`}
                >
                  <solution.icon className={`h-6 w-6 ${solution.color}`} />
                </div>

                <h2 className="text-lg font-bold mb-2 group-hover:text-gold transition-colors">
                  {solution.title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                  {solution.description}
                </p>

                <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] group-hover:text-gold transition-colors mt-5 pt-4 border-t border-dark-50/50">
                  Learn More
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
            Ready to See Your{" "}
            <span className="text-gold">Revenue Gap</span>?
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            No matter what type of practice you run, NPIxray reveals missed
            revenue in 60 seconds. Free, no signup required.
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
