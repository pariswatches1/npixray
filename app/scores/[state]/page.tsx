import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, BarChart3, Home, ChevronRight } from "lucide-react";
import {
  getScoreDistribution,
  getAverageScore,
  getTopScoringProviders,
  slugToStateAbbr,
  stateAbbrToName,
  stateToSlug,
} from "@/lib/db-queries";
import { STATE_LIST } from "@/lib/benchmark-data";
import { ScoreHistogram } from "@/components/score/score-histogram";
import { ScoreLeaderboard } from "@/components/score/score-leaderboard";
import { ScanCTA } from "@/components/seo/scan-cta";
import { InlineScanner } from "@/components/seo/inline-scanner";
import { DataCoverage } from "@/components/seo/data-coverage";

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
    title: `${name} Medicare Revenue Scores 2026 | NPIxray`,
    description: `Revenue Score distribution for Medicare providers in ${name}. See the average score, top-scoring providers, and how ${name} compares nationally.`,
    openGraph: { title: `${name} Revenue Scores`, url: `https://npixray.com/scores/${slug}` },
    alternates: { canonical: `https://npixray.com/scores/${slug}` },
  };
}

export default async function StateScorePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) notFound();
  const name = stateAbbrToName(abbr);

  const [distribution, avgScore, topProviders] = await Promise.all([
    getScoreDistribution({ state: abbr }),
    getAverageScore({ state: abbr }),
    getTopScoringProviders({ state: abbr }, 50),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#2F5EA8] transition-colors"><Home className="h-3.5 w-3.5" /></Link>
        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <Link href="/scores" className="hover:text-[#2F5EA8] transition-colors">Scores</Link>
        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <span className="text-[var(--text-primary)]">{name}</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <MapPin className="h-6 w-6 text-[#2F5EA8]" />
        <div>
          <h1 className="text-3xl font-bold">{name} Revenue Scores</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Average: <span className="font-bold text-[#2F5EA8]">{Math.round(avgScore)}</span>
          </p>
        </div>
      </div>

      {/* Distribution */}
      {distribution.length > 0 ? (
        <section className="mb-10 rounded-2xl border border-[var(--border-light)] bg-white p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#2F5EA8]" />
            Score Distribution
          </h2>
          <ScoreHistogram data={distribution} avgScore={avgScore} />
        </section>
      ) : (
        <section className="mb-10 rounded-2xl border border-[var(--border-light)] bg-white p-6 text-center">
          <p className="text-[var(--text-secondary)]">Scores being calculated. Check back soon!</p>
        </section>
      )}

      {/* Leaderboard */}
      {topProviders.length > 0 && (
        <section className="mb-10">
          <ScoreLeaderboard
            entries={topProviders.map(p => ({ ...p, revenue_score: p.revenue_score ?? 0 }))}
            title={`Top Scoring Providers in ${name}`}
          />
        </section>
      )}

      <div className="mb-8"><InlineScanner state={name} /></div>
      <div className="mb-8"><DataCoverage providerCount={topProviders.length} /></div>
      <ScanCTA />
    </div>
  );
}
