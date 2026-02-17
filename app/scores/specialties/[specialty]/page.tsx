import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Stethoscope, BarChart3, Home, ChevronRight } from "lucide-react";
import {
  getScoreDistribution,
  getAverageScore,
  getTopScoringProviders,
  specialtyToSlug,
} from "@/lib/db-queries";
import { SPECIALTY_LIST } from "@/lib/benchmark-data";
import { ScoreHistogram } from "@/components/score/score-histogram";
import { ScoreLeaderboard } from "@/components/score/score-leaderboard";
import { ScanCTA } from "@/components/seo/scan-cta";

function slugToSpecialty(slug: string): string | null {
  return (
    SPECIALTY_LIST.find(
      (s) => specialtyToSlug(s) === slug
    ) ?? null
  );
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
    title: `${name} Revenue Scores 2026 | NPIxray`,
    description: `Revenue Score distribution for ${name} Medicare providers. See the average score, top performers, and how ${name} compares to other specialties.`,
    openGraph: { title: `${name} Revenue Scores`, url: `https://npixray.com/scores/specialties/${slug}` },
    alternates: { canonical: `https://npixray.com/scores/specialties/${slug}` },
  };
}

export default async function SpecialtyScorePage({
  params,
}: {
  params: Promise<{ specialty: string }>;
}) {
  const { specialty: slug } = await params;
  const name = slugToSpecialty(slug);
  if (!name) notFound();

  const [distribution, avgScore, topProviders] = await Promise.all([
    getScoreDistribution({ specialty: name }),
    getAverageScore({ specialty: name }),
    getTopScoringProviders({ specialty: name }, 50),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-gold transition-colors"><Home className="h-3.5 w-3.5" /></Link>
        <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
        <Link href="/scores" className="hover:text-gold transition-colors">Scores</Link>
        <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
        <span className="text-[var(--text-primary)]">{name}</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <Stethoscope className="h-6 w-6 text-gold" />
        <div>
          <h1 className="text-3xl font-bold">{name} Revenue Scores</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Average: <span className="font-bold text-gold">{Math.round(avgScore)}</span>
          </p>
        </div>
      </div>

      {/* Distribution */}
      {distribution.length > 0 ? (
        <section className="mb-10 rounded-2xl border border-dark-50/80 bg-dark-400/30 p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gold" />
            Score Distribution
          </h2>
          <ScoreHistogram data={distribution} avgScore={avgScore} />
        </section>
      ) : (
        <section className="mb-10 rounded-2xl border border-dark-50/80 bg-dark-400/30 p-6 text-center">
          <p className="text-[var(--text-secondary)]">Scores being calculated. Check back soon!</p>
        </section>
      )}

      {/* Leaderboard */}
      {topProviders.length > 0 && (
        <section className="mb-10">
          <ScoreLeaderboard
            entries={topProviders}
            title={`Top ${name} Providers by Revenue Score`}
          />
        </section>
      )}

      <ScanCTA />
    </div>
  );
}
