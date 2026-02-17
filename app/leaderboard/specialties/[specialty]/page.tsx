import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, Home, ChevronRight, MapPin, ArrowRight } from "lucide-react";
import {
  specialtyToSlug,
  getTopScoringProviders,
  getAverageScore,
  stateAbbrToName,
  stateToSlug,
} from "@/lib/db-queries";
import { SPECIALTY_LIST } from "@/lib/benchmark-data";
import { getScoreTier } from "@/lib/revenue-score";
import { ScanCTA } from "@/components/seo/scan-cta";

function slugToSpecialty(slug: string): string | null {
  return SPECIALTY_LIST.find((s) => specialtyToSlug(s) === slug) ?? null;
}

export function generateStaticParams() {
  return SPECIALTY_LIST.map((s) => ({ specialty: specialtyToSlug(s) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ specialty: string }>;
}): Promise<Metadata> {
  const { specialty: slug } = await params;
  const name = slugToSpecialty(slug);
  if (!name) return { title: "Not Found" };
  return {
    title: `Top ${name} Providers Nationally 2026 | NPIxray Leaderboard`,
    description: `National Revenue Score leaderboard for ${name}. See the top 20 highest-scoring ${name} providers in the country based on real CMS Medicare data.`,
    openGraph: {
      title: `National ${name} Leaderboard`,
      url: `https://npixray.com/leaderboard/specialties/${slug}`,
    },
    alternates: { canonical: `https://npixray.com/leaderboard/specialties/${slug}` },
  };
}

export default async function SpecialtyLeaderboardPage({
  params,
}: {
  params: Promise<{ specialty: string }>;
}) {
  const { specialty: slug } = await params;
  const name = slugToSpecialty(slug);
  if (!name) notFound();

  const [topProviders, avgScore] = await Promise.all([
    getTopScoringProviders({ specialty: name }, 20),
    getAverageScore({ specialty: name }),
  ]);

  // Get unique states from top providers for "by state" links
  const statesInTop: string[] = [...new Set(topProviders.map((p: any) => p.state as string))].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-gold transition-colors"><Home className="h-3.5 w-3.5" /></Link>
        <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
        <Link href="/leaderboard" className="hover:text-gold transition-colors">Leaderboard</Link>
        <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
        <span className="text-white font-medium">{name}</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-semibold mb-4">
          <Trophy className="h-4 w-4" />
          National Leaderboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Top <span className="text-gold">{name}</span> Providers
        </h1>
        <p className="text-[var(--text-secondary)]">
          National average Revenue Score for {name}: {Math.round(avgScore)}/100.
        </p>
      </div>

      <div className="rounded-2xl border border-dark-50/80 bg-dark-400/30 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-50/50 text-xs text-[var(--text-secondary)]">
                <th className="px-4 py-3 text-left font-medium">Rank</th>
                <th className="px-4 py-3 text-left font-medium">Provider</th>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-4 py-3 text-right font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {topProviders.map((p, i) => {
                const tier = getScoreTier(p.revenue_score ?? 0);
                return (
                  <tr
                    key={p.npi}
                    className="border-b border-dark-50/30 hover:bg-dark-300/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className={`font-bold ${i === 0 ? "text-gold" : i < 3 ? "text-gold/70" : "text-[var(--text-secondary)]"}`}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/scan/${p.npi}`} className="hover:text-gold transition-colors">
                        Provider #{p.npi.slice(-4)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {p.city}{p.city && p.state ? ", " : ""}{p.state}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: `${tier.color}15`,
                          color: tier.color,
                          border: `1px solid ${tier.color}30`,
                        }}
                      >
                        {p.revenue_score ?? 0}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* State-specific leaderboard links */}
      {statesInTop.length > 0 && (
        <>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gold" />
            {name} Leaderboard by State
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-8">
            {statesInTop.map((st: string) => (
              <Link
                key={st}
                href={`/leaderboard/${stateToSlug(st)}/${slug}`}
                className="group rounded-lg border border-dark-50/80 bg-dark-400/50 p-2 text-center transition-all hover:border-gold/30 hover:bg-gold/5"
              >
                <span className="text-xs group-hover:text-gold transition-colors">
                  {stateAbbrToName(st)}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 text-center mb-8">
        <h3 className="text-lg font-bold mb-2">Are you a top {name}?</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Scan your NPI to see your Revenue Score and check your national ranking.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-dark hover:bg-gold-300 transition-all"
        >
          <Trophy className="h-4 w-4" />
          Find My Ranking
        </Link>
      </div>

      <ScanCTA />
    </div>
  );
}
