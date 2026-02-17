import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, Home, ChevronRight, Stethoscope, ArrowRight } from "lucide-react";
import {
  slugToStateAbbr,
  stateAbbrToName,
  stateToSlug,
  getTopScoringProviders,
  getAverageScore,
  getStateSpecialties,
  specialtyToSlug,
} from "@/lib/db-queries";
import { STATE_LIST } from "@/lib/benchmark-data";
import { getScoreTier } from "@/lib/revenue-score";
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
    title: `${name} Revenue Score Leaderboard 2026 | NPIxray`,
    description: `Top 20 highest-scoring Medicare providers in ${name} by Revenue Score. See which specialties and providers lead in billing optimization.`,
    openGraph: {
      title: `${name} Revenue Score Leaderboard`,
      url: `https://npixray.com/leaderboard/${slug}`,
    },
    alternates: { canonical: `https://npixray.com/leaderboard/${slug}` },
  };
}

export default async function StateLeaderboardPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) notFound();
  const name = stateAbbrToName(abbr);

  const [topProviders, avgScore, specialties] = await Promise.all([
    getTopScoringProviders({ state: abbr }, 20),
    getAverageScore({ state: abbr }),
    getStateSpecialties(abbr, 20),
  ]);

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
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          {name} Revenue Score <span className="text-gold">Leaderboard</span>
        </h1>
        <p className="text-[var(--text-secondary)]">
          Top 20 highest-scoring providers in {name}. Average score: {Math.round(avgScore)}/100.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl border border-dark-50/80 bg-dark-400/30 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-50/50 text-xs text-[var(--text-secondary)]">
                <th className="px-4 py-3 text-left font-medium">Rank</th>
                <th className="px-4 py-3 text-left font-medium">Provider</th>
                <th className="px-4 py-3 text-left font-medium">Specialty</th>
                <th className="px-4 py-3 text-left font-medium">City</th>
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
                      <span className={`font-bold ${i < 3 ? "text-gold" : "text-[var(--text-secondary)]"}`}>
                        #{i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/scan/${p.npi}`}
                        className="text-sm hover:text-gold transition-colors"
                      >
                        NPI {p.npi}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {p.specialty}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {p.city}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
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

      {/* Specialty links */}
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-gold" />
        Leaderboard by Specialty in {name}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {specialties.slice(0, 15).map((s) => (
          <Link
            key={s.specialty}
            href={`/leaderboard/${slug}/${specialtyToSlug(s.specialty)}`}
            className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-3 transition-all hover:border-gold/30 hover:bg-gold/5 flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-medium group-hover:text-gold transition-colors">
                {s.specialty}
              </span>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {Number(s.count).toLocaleString()} providers
              </p>
            </div>
            <ArrowRight className="h-3 w-3 text-dark-50 group-hover:text-gold" />
          </Link>
        ))}
      </div>

      <ScanCTA />
    </div>
  );
}
