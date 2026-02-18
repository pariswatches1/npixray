import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  GitCompareArrows,
  Heart,
  Search,
  DollarSign,
  ClipboardCheck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Alternatives — Compare NPIxray to Other Healthcare Tools",
  description:
    "Compare NPIxray to ChartSpan, SignalLamp Health, Chronic Care IQ, expensive RCM platforms, and manual billing audits. Find the right revenue intelligence tool for your practice.",
  keywords: [
    "ChartSpan alternatives",
    "SignalLamp Health alternatives",
    "Chronic Care IQ alternatives",
    "affordable RCM alternatives",
    "billing audit alternatives",
    "CCM platform comparison",
    "healthcare analytics alternatives",
    "medical billing software comparison",
  ],
  alternates: {
    canonical: "https://npixray.com/alternatives",
  },
  openGraph: {
    title: "Compare NPIxray to Alternatives | NPIxray",
    description:
      "See how NPIxray compares to other healthcare analytics, CCM, and RCM tools. Detailed feature, pricing, and use case comparisons.",
  },
};

const ALTERNATIVES_LIST = [
  {
    slug: "chartspan-alternatives",
    title: "ChartSpan Alternatives",
    description:
      "Compare turnkey CCM platforms. NPIxray vs. Chronic Care IQ, Prevounce, Wellbox, and Care Management Suite.",
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    count: 5,
  },
  {
    slug: "signallamp-alternatives",
    title: "SignalLamp Health Alternatives",
    description:
      "Compare healthcare analytics platforms. NPIxray vs. Definitive Healthcare, IQVIA, Komodo Health, and Doximity.",
    icon: Search,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    count: 5,
  },
  {
    slug: "chronic-care-iq-alternatives",
    title: "Chronic Care IQ Alternatives",
    description:
      "Compare CCM management platforms. NPIxray vs. ChartSpan, Prevounce, Wellbox, and TimeDoc Health.",
    icon: ClipboardCheck,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    count: 5,
  },
  {
    slug: "expensive-rcm-alternatives",
    title: "Affordable RCM Alternatives",
    description:
      "Compare revenue cycle tools for small practices. NPIxray vs. Kareo/Tebra, DrChrono, AdvancedMD, and CureMD.",
    icon: DollarSign,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    count: 5,
  },
  {
    slug: "manual-billing-audit-alternatives",
    title: "Manual Billing Audit Alternatives",
    description:
      "Compare automated tools to manual audits. NPIxray vs. AdvancedMD analytics, athenahealth, PracticeSuite, and traditional audits.",
    icon: ClipboardCheck,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    count: 5,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "NPIxray Alternatives Comparisons",
  description:
    "Compare NPIxray to other healthcare analytics, CCM, and revenue cycle management tools.",
  url: "https://npixray.com/alternatives",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: ALTERNATIVES_LIST.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: `https://npixray.com/alternatives/${a.slug}`,
    })),
  },
};

export default function AlternativesIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <Breadcrumbs items={[{ label: "Alternatives" }]} />

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <GitCompareArrows className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                5 Comparisons
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              NPIxray vs.{" "}
              <span className="text-gold">The Alternatives</span>
            </h1>

            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Objective comparisons of NPIxray against other healthcare
              analytics, CCM platforms, and revenue cycle tools. Find the right
              solution for your practice.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {ALTERNATIVES_LIST.map((alt) => (
              <Link
                key={alt.slug}
                href={`/alternatives/${alt.slug}`}
                className="group flex items-start gap-6 rounded-2xl border border-dark-50/80 bg-dark-400/50 p-6 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${alt.borderColor} ${alt.bgColor} flex-shrink-0`}
                >
                  <alt.icon className={`h-6 w-6 ${alt.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold mb-1 group-hover:text-gold transition-colors">
                    {alt.title}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                    {alt.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] group-hover:text-gold transition-colors">
                    Compare {alt.count} Tools
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            See NPIxray in{" "}
            <span className="text-gold">Action</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            The best way to evaluate NPIxray is to try it. Scan any NPI number
            for free and see instant revenue insights in 60 seconds.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
          >
            <Zap className="h-5 w-5" />
            Try Free NPI Scan
          </Link>
        </div>
      </section>
    </>
  );
}
