import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, MapPin, Stethoscope, ArrowRight, TrendingUp } from "lucide-react";
import {
  getScoreDistribution,
  getAverageScore,
  getStateScoreRankings,
  getSpecialtyScoreRankings,
  stateAbbrToName,
  stateToSlug,
  specialtyToSlug,
} from "@/lib/db-queries";
import { getScoreTier, SCORE_TIERS } from "@/lib/revenue-score";
import { ScoreHistogram } from "@/components/score/score-histogram";
import { ScanCTA } from "@/components/seo/scan-cta";

export const metadata: Metadata = {
  title: "Medicare Revenue Score Distribution 2026 | NPIxray",
  description:
    "National distribution of Revenue Scores across 1.175M+ Medicare providers. See how providers grade on coding, programs, and revenue efficiency.",
  openGraph: {
    title: "Medicare Revenue Score Distribution 2026",
    url: "https://npixray.com/scores",
  },
  alternates: { canonical: "https://npixray.com/scores" },
};

export default async function ScoresIndexPage() {
  const [distribution, avgScore, stateRankings, specialtyRankings] = await Promise.all([
    getScoreDistribution(),
    getAverageScore(),
    getStateScoreRankings(),
    getSpecialtyScoreRankings(),
  ]);

  const totalScored = distribution.reduce((a, d) => a + d.count, 0);
  const tierBreakdown = SCORE_TIERS.map((tier) => {
    const count = distribution
      .filter((d) => d.bucket >= tier.min && d.bucket <= tier.max)
      .reduce((a, d) => a + d.count, 0);
    return { ...tier, count, pct: totalScored > 0 ? (count / totalScored) * 100 : 0 };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5EA8]/[0.06] text-[#2F5EA8] text-sm font-semibold mb-4">
          <TrendingUp className="h-4 w-4" />
          Revenue Scores
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Medicare Revenue <span className="text-[#2F5EA8]">Scores</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Every Medicare provider graded 0-100 on revenue health. Based on E&M coding,
          program adoption, revenue efficiency, and more.
        </p>
      </div>

      {/* National Distribution */}
      {distribution.length > 0 ? (
        <section className="mb-12 rounded-2xl border border-[var(--border-light)] bg-white p-6">
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#2F5EA8]" />
            National Score Distribution
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {totalScored.toLocaleString()} scored providers
          </p>
          <ScoreHistogram data={distribution} avgScore={avgScore} />
        </section>
      ) : (
        <section className="mb-12 rounded-2xl border border-[var(--border-light)] bg-white p-6 text-center">
          <p className="text-[var(--text-secondary)]">
            Revenue Scores are being calculated. Check back soon!
          </p>
        </section>
      )}

      {/* Tier Breakdown */}
      {totalScored > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Score Tier Breakdown</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {tierBreakdown.map((t) => {
              const tierInfo = getScoreTier(t.min);
              return (
                <div
                  key={t.label}
                  className={`rounded-xl border ${tierInfo.borderColor} ${tierInfo.bgColor} p-4 text-center`}
                >
                  <p className={`text-2xl font-bold ${tierInfo.color}`}>
                    {t.pct.toFixed(1)}%
                  </p>
                  <p className="text-xs font-semibold mt-1">{t.label}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    ({t.min}-{t.max})
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {t.count.toLocaleString()} providers
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* State Rankings */}
      {stateRankings.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-6 w-6 text-[#2F5EA8]" />
            <h2 className="text-2xl font-bold">Scores by State</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {stateRankings.slice(0, 20).map((s) => {
              const tier = getScoreTier(Math.round(s.avgScore));
              return (
                <Link
                  key={s.state}
                  href={`/scores/${stateToSlug(s.state)}`}
                  className={`rounded-xl border ${tier.borderColor} ${tier.bgColor} p-3 hover:opacity-80 transition-opacity`}
                >
                  <p className="text-xs text-[var(--text-secondary)]">
                    {stateAbbrToName(s.state)}
                  </p>
                  <p className={`text-xl font-bold ${tier.color}`}>
                    {Math.round(s.avgScore)}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    {s.providerCount.toLocaleString()} providers
                  </p>
                </Link>
              );
            })}
          </div>
          {stateRankings.length > 20 && (
            <p className="text-sm text-[var(--text-secondary)] mt-3">
              + {stateRankings.length - 20} more states
            </p>
          )}
        </section>
      )}

      {/* Specialty Rankings */}
      {specialtyRankings.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Stethoscope className="h-6 w-6 text-[#2F5EA8]" />
            <h2 className="text-2xl font-bold">Scores by Specialty</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {specialtyRankings.slice(0, 15).map((s) => {
              const tier = getScoreTier(Math.round(s.avgScore));
              return (
                <Link
                  key={s.specialty}
                  href={`/scores/specialties/${specialtyToSlug(s.specialty)}`}
                  className="rounded-xl border border-[var(--border-light)] bg-white p-4 flex items-center justify-between hover:border-[#2F5EA8]/10 transition-colors"
                >
                  <div>
                    <p className="font-medium">{s.specialty}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {s.providerCount.toLocaleString()} providers
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${tier.color}`}>
                      {Math.round(s.avgScore)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[var(--text-secondary)]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="mb-8 text-center">
        <Link
          href="/tools/score-compare"
          className="inline-flex items-center gap-2 rounded-lg border border-[#2F5EA8]/15 bg-[#2F5EA8]/[0.04] px-6 py-3 text-sm font-semibold text-[#2F5EA8] hover:bg-[#264D8C]/10 transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          Compare Provider Scores
        </Link>
      </div>

      <ScanCTA />
    </div>
  );
}
