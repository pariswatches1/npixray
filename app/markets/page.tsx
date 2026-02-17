import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, TrendingUp, ArrowRight, Building2 } from "lucide-react";
import { getAllStates, stateAbbrToName, stateToSlug } from "@/lib/db-queries";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Medicare Market Opportunities by City & State | NPIxray",
  description:
    "Discover which cities and states have the biggest Medicare revenue opportunities. See CCM, RPM, and AWV adoption gaps by market — powered by real CMS data.",
  keywords: [
    "Medicare market opportunity",
    "CCM market analysis",
    "RPM adoption by city",
    "underserved Medicare markets",
    "medical practice opportunity",
    "healthcare market intelligence",
  ],
  openGraph: {
    title: "Medicare Market Opportunities | NPIxray",
    url: "https://npixray.com/markets",
  },
  alternates: { canonical: "https://npixray.com/markets" },
};

export default async function MarketsIndexPage() {
  const states = await getAllStates();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Markets" }]} />

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-semibold mb-4">
          <TrendingUp className="h-4 w-4" />
          Market Intelligence
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Medicare Market <span className="text-gold">Opportunities</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Find which cities have the biggest revenue gaps in CCM, RPM, AWV, and E&M coding.
          Real CMS data from 1.175M+ providers.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {states
          .filter((s) => s.state && s.state.length === 2)
          .sort((a, b) => stateAbbrToName(a.state).localeCompare(stateAbbrToName(b.state)))
          .map((s) => (
            <Link
              key={s.state}
              href={`/markets/${stateToSlug(s.state)}`}
              className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 transition-all hover:border-gold/30 hover:bg-gold/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gold/60 group-hover:text-gold transition-colors" />
                <span className="text-sm font-bold group-hover:text-gold transition-colors">
                  {stateAbbrToName(s.state)}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {Number(s.totalProviders).toLocaleString()} providers
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
}
