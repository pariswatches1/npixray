import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Swords, Zap } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "NPIxray vs Competitors \u2014 Comparison Hub | NPIxray",
  description:
    "Compare NPIxray with leading healthcare analytics, CCM, RPM, and revenue intelligence platforms. See side-by-side feature and pricing comparisons.",
  keywords: [
    "NPIxray alternatives",
    "healthcare analytics comparison",
    "CCM software comparison",
    "RPM platform comparison",
    "medical practice revenue tools",
    "ChartSpan alternative",
    "Aledade alternative",
    "NPI Registry alternative",
  ],
  openGraph: {
    title: "NPIxray vs Competitors \u2014 Comparison Hub",
    description:
      "Compare NPIxray with leading healthcare analytics, CCM, RPM, and revenue intelligence platforms.",
    url: "https://npixray.com/vs",
  },
  alternates: {
    canonical: "https://npixray.com/vs",
  },
};

interface CompetitorListing {
  slug: string;
  name: string;
  focus: string;
  tagline: string;
  category: string;
}

const COMPETITOR_LISTINGS: CompetitorListing[] = [
  {
    slug: "chartspan",
    name: "ChartSpan",
    focus: "CCM Management",
    tagline: "Turnkey chronic care management services",
    category: "Care Management",
  },
  {
    slug: "signallamp",
    name: "SignalLamp Health",
    focus: "Claims Analytics",
    tagline: "Healthcare claims analytics and intelligence",
    category: "Analytics",
  },
  {
    slug: "chronic-care-iq",
    name: "Chronic Care IQ",
    focus: "CCM/RPM Software",
    tagline: "CCM and RPM software for care management programs",
    category: "Care Management",
  },
  {
    slug: "prevounce",
    name: "Prevounce Health",
    focus: "CCM, RPM & AWV",
    tagline: "CCM, RPM, and Annual Wellness Visit platform",
    category: "Care Management",
  },
  {
    slug: "care-management-suite",
    name: "Care Management Suite",
    focus: "Enterprise Care Management",
    tagline: "End-to-end care management for health systems",
    category: "Care Management",
  },
  {
    slug: "wellbox",
    name: "Wellbox",
    focus: "RPM & CCM Services",
    tagline: "RPM and CCM services with device integration",
    category: "Care Management",
  },
  {
    slug: "pcmh-plus",
    name: "PCMH Plus",
    focus: "PCMH Recognition",
    tagline: "Patient-Centered Medical Home recognition tools",
    category: "Quality & Compliance",
  },
  {
    slug: "aledade",
    name: "Aledade",
    focus: "ACO & Value-Based Care",
    tagline: "ACO management and value-based care platform",
    category: "Value-Based Care",
  },
  {
    slug: "phynd",
    name: "Phynd Technologies",
    focus: "Provider Directory",
    tagline: "Provider directory and data management platform",
    category: "Provider Data",
  },
  {
    slug: "npi-registry",
    name: "NPI Registry (NPPES)",
    focus: "NPI Lookup",
    tagline: "Official government NPI lookup tool from CMS",
    category: "Provider Data",
  },
];

const CATEGORIES = [
  "Care Management",
  "Analytics",
  "Value-Based Care",
  "Quality & Compliance",
  "Provider Data",
];

export default function VsIndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "Compare" }]} />

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <Swords className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                Competitor Comparisons
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              NPIxray vs{" "}
              <span className="text-gold">The Competition</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              See how NPIxray compares to other healthcare analytics, care
              management, and revenue intelligence platforms. Fair, detailed
              comparisons to help you choose the right tool.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Grid by Category */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {CATEGORIES.map((category) => {
            const items = COMPETITOR_LISTINGS.filter(
              (c) => c.category === category
            );
            if (items.length === 0) return null;
            return (
              <div key={category} className="mb-12 last:mb-0">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-gold">{category}</span>
                  <span className="text-xs text-[var(--text-secondary)] font-normal">
                    ({items.length}{" "}
                    {items.length === 1 ? "comparison" : "comparisons"})
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((comp) => (
                    <Link
                      key={comp.slug}
                      href={`/vs/${comp.slug}`}
                      className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="rounded-lg bg-gold/10 p-1.5">
                          <Zap className="h-4 w-4 text-gold" />
                        </div>
                        <span className="text-xs font-medium text-gold">
                          NPIxray
                        </span>
                        <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
                          vs
                        </span>
                        <span className="text-xs font-medium text-[var(--text-primary)] group-hover:text-gold transition-colors">
                          {comp.name}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mb-3 leading-relaxed line-clamp-2">
                        {comp.tagline}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] bg-dark-300 rounded-full px-2.5 py-1">
                          {comp.focus}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] group-hover:text-gold transition-colors flex items-center gap-1">
                          Compare
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gold/20 bg-gold/5 p-8 sm:p-12 text-center">
            <Zap className="h-10 w-10 text-gold mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              See NPIxray in Action
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto leading-relaxed">
              Skip the comparison charts. Enter any NPI number and see real
              Medicare revenue data, coding benchmarks, and care management
              opportunities in seconds.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gold text-dark font-semibold hover:bg-gold-300 transition-colors text-lg"
            >
              <Zap className="h-5 w-5" />
              Run Free NPI Scan
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-4 text-xs text-[var(--text-secondary)]">
              Free forever &bull; No credit card &bull; Instant results
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
