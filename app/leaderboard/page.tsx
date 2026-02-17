import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, MapPin, Stethoscope, ArrowRight } from "lucide-react";
import { getAllStates, stateAbbrToName, stateToSlug } from "@/lib/db-queries";
import { SPECIALTY_LIST } from "@/lib/benchmark-data";
import { specialtyToSlug } from "@/lib/db-queries";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Medicare Revenue Score Leaderboard | NPIxray",
  description:
    "See the top-scoring Medicare providers by state and specialty. Anonymous leaderboard based on Revenue Scores from real CMS data.",
  openGraph: {
    title: "Medicare Revenue Score Leaderboard | NPIxray",
    url: "https://npixray.com/leaderboard",
  },
  alternates: { canonical: "https://npixray.com/leaderboard" },
};

export default async function LeaderboardIndexPage() {
  const states = await getAllStates();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Leaderboard" }]} />

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-semibold mb-4">
          <Trophy className="h-4 w-4" />
          Leaderboard
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Revenue Score <span className="text-gold">Leaderboard</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Top-performing Medicare providers ranked by Revenue Score.
          Find your ranking by state and specialty.
        </p>
      </div>

      {/* By Specialty */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-gold" />
        By Specialty
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
        {SPECIALTY_LIST.map((s) => (
          <Link
            key={s}
            href={`/leaderboard/specialties/${specialtyToSlug(s)}`}
            className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 transition-all hover:border-gold/30 hover:bg-gold/5 flex items-center justify-between"
          >
            <span className="text-sm font-medium group-hover:text-gold transition-colors">
              {s}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-dark-50 group-hover:text-gold transition-colors" />
          </Link>
        ))}
      </div>

      {/* By State */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-gold" />
        By State
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {states
          .filter((s) => s.state && s.state.length === 2)
          .sort((a, b) => stateAbbrToName(a.state).localeCompare(stateAbbrToName(b.state)))
          .map((s) => (
            <Link
              key={s.state}
              href={`/leaderboard/${stateToSlug(s.state)}`}
              className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 transition-all hover:border-gold/30 hover:bg-gold/5 flex items-center justify-between"
            >
              <span className="text-sm font-medium group-hover:text-gold transition-colors">
                {stateAbbrToName(s.state)}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-dark-50 group-hover:text-gold transition-colors" />
            </Link>
          ))}
      </div>
    </div>
  );
}
