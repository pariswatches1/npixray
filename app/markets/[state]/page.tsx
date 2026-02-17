import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, TrendingUp, Home, ChevronRight, Building2, DollarSign } from "lucide-react";
import {
  slugToStateAbbr,
  stateAbbrToName,
  stateToSlug,
  getStateCities,
  cityToSlug,
} from "@/lib/db-queries";
import { STATE_LIST } from "@/lib/benchmark-data";
import { ScanCTA } from "@/components/seo/scan-cta";

export function generateStaticParams() {
  return STATE_LIST.map((s) => ({ state: stateToSlug(s.abbr) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) return { title: "Not Found" };
  const name = stateAbbrToName(abbr);
  return {
    title: `${name} Medicare Market Opportunities 2026 | NPIxray`,
    description: `Explore Medicare market opportunities across ${name} cities. See which specialties are underserved, CCM/RPM adoption gaps, and revenue potential by market.`,
    openGraph: {
      title: `${name} Market Opportunities`,
      url: `https://npixray.com/markets/${slug}`,
    },
    alternates: { canonical: `https://npixray.com/markets/${slug}` },
  };
}

export default async function StateMarketPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) notFound();
  const name = stateAbbrToName(abbr);

  const cities = await getStateCities(abbr, 100);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-gold transition-colors"><Home className="h-3.5 w-3.5" /></Link>
        <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
        <Link href="/markets" className="hover:text-gold transition-colors">Markets</Link>
        <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
        <span className="text-white font-medium">{name}</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-semibold mb-4">
          <MapPin className="h-4 w-4" />
          {name}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          {name} Medicare Market <span className="text-gold">Opportunities</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-3xl">
          Explore Medicare market opportunities across {cities.length} cities in {name}.
          Click a city to see specialty-level gaps and revenue potential.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map((city) => (
          <Link
            key={city.city}
            href={`/markets/${slug}/${cityToSlug(city.city)}`}
            className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 transition-all hover:border-gold/30 hover:bg-gold/5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gold/60 group-hover:text-gold transition-colors" />
                <h2 className="text-base font-bold group-hover:text-gold transition-colors">
                  {city.city}
                </h2>
              </div>
              <ChevronRight className="h-4 w-4 text-dark-50 group-hover:text-gold transition-colors" />
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {Number(city.count).toLocaleString()} providers
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                ${Math.round(Number(city.avgPayment)).toLocaleString()} avg
              </span>
            </div>
          </Link>
        ))}
      </div>

      {cities.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)]">No cities with enough providers found for {name}.</p>
        </div>
      )}

      <div className="mt-12">
        <ScanCTA />
      </div>
    </div>
  );
}
