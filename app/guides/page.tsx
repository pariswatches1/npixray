import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Zap,
  Clock,
  TrendingUp,
  Heart,
  Brain,
  Activity,
  Stethoscope,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Medicare Billing Guides — CPT Codes, Revenue Optimization & Best Practices",
  description:
    "Expert guides on CCM billing (99490), RPM (99453-99458), AWV (G0438/G0439), BHI (99484), and E&M coding optimization. Learn how to capture every dollar of Medicare revenue.",
  keywords: [
    "Medicare billing guides",
    "CPT code guides",
    "CCM billing 99490",
    "RPM billing guide",
    "AWV billing guide",
    "BHI billing 99484",
    "E&M coding optimization",
    "99213 vs 99214",
    "medical billing best practices",
    "Medicare revenue optimization",
  ],
  openGraph: {
    title: "Medicare Billing Guides | NPIxray",
    description:
      "Expert guides on CCM, RPM, AWV, BHI billing codes and E&M coding optimization. Capture every dollar of Medicare revenue.",
  },
};

const GUIDES = [
  {
    slug: "ccm-billing-99490",
    title: "Complete Guide to CCM Billing (CPT 99490)",
    description:
      "Master Chronic Care Management billing. Learn eligibility criteria, documentation requirements, time tracking, and how to capture $66-144 per patient per month.",
    icon: Heart,
    readTime: "8 min read",
    revenue: "$66–$144/patient/mo",
    category: "Care Management",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
  {
    slug: "rpm-billing-99453-99458",
    title: "RPM Billing Guide (CPT 99453–99458)",
    description:
      "Everything you need to know about Remote Patient Monitoring billing. Device setup, data transmission requirements, and maximizing reimbursement.",
    icon: Activity,
    readTime: "9 min read",
    revenue: "$120+/patient/mo",
    category: "Remote Monitoring",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    slug: "awv-billing-g0438-g0439",
    title: "Annual Wellness Visit Billing Guide (G0438 & G0439)",
    description:
      "Maximize AWV revenue with proper Health Risk Assessments, personalized prevention plans, and compliant documentation workflows.",
    icon: Stethoscope,
    readTime: "7 min read",
    revenue: "$118–$175/visit",
    category: "Preventive Care",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    slug: "bhi-billing-99484",
    title: "Behavioral Health Integration Billing (CPT 99484)",
    description:
      "Tap into the fastest-growing Medicare program. Learn BHI eligibility, collaborative care model requirements, and billing workflows.",
    icon: Brain,
    readTime: "7 min read",
    revenue: "$48+/patient/mo",
    category: "Behavioral Health",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    slug: "em-coding-optimization",
    title: "E&M Coding Optimization — 99213 vs 99214 vs 99215",
    description:
      "Stop leaving $15K–$40K per year on the table from undercoding. Learn the 2021 E&M guidelines, MDM-based leveling, and documentation strategies.",
    icon: TrendingUp,
    readTime: "10 min read",
    revenue: "$15K–$40K/yr uplift",
    category: "Coding & Compliance",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
];

export default function GuidesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <BookOpen className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                Expert Medicare Billing Resources
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Medicare Billing{" "}
              <span className="text-gold">Guides</span>
            </h1>

            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              In-depth guides on CPT codes, care management programs, and coding
              optimization. Written for practice managers and billing teams who
              want to capture every dollar.
            </p>
          </div>
        </div>
      </section>

      {/* Guide Cards */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-2xl border border-dark-50/80 bg-dark-400/50 p-6 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 flex flex-col"
              >
                {/* Category + Read time */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${guide.bgColor} ${guide.color} uppercase tracking-wider`}
                  >
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                    <Clock className="h-3 w-3" />
                    {guide.readTime}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${guide.borderColor} ${guide.bgColor} mb-4`}
                >
                  <guide.icon className={`h-6 w-6 ${guide.color}`} />
                </div>

                {/* Title + Description */}
                <h2 className="text-lg font-bold mb-2 group-hover:text-gold transition-colors leading-snug">
                  {guide.title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                  {guide.description}
                </p>

                {/* Revenue tag + Read more */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-dark-50/50">
                  <span className="text-xs font-mono font-semibold text-gold">
                    {guide.revenue}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] group-hover:text-gold transition-colors">
                    Read Guide
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}

            {/* Coming Soon Card */}
            <div className="rounded-2xl border border-dashed border-dark-50/60 bg-dark-400/20 p-6 flex flex-col items-center justify-center text-center min-h-[280px]">
              <FileText className="h-10 w-10 text-[var(--text-secondary)]/30 mb-4" />
              <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                More Guides Coming Soon
              </p>
              <p className="text-xs text-[var(--text-secondary)]/60">
                MIPS Quality Measures, Modifier 25, Telehealth Billing, and more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            See How These Gaps Apply to{" "}
            <span className="text-gold">Your Practice</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            Run a free NPI scan to see exactly which billing opportunities
            you&apos;re missing — personalized to your specialty and billing patterns.
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
