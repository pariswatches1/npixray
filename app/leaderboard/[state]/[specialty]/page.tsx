import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, Home, ChevronRight } from "lucide-react";
import {
  slugToStateAbbr,
  stateAbbrToName,
  stateToSlug,
  specialtyToSlug,
} from "@/lib/db-queries";
import { SPECIALTY_LIST } from "@/lib/benchmark-data";
import { neon } from "@neondatabase/serverless";
import { getScoreTier } from "@/lib/revenue-score";
import { ScanCTA } from "@/components/seo/scan-cta";
import { InlineScanner } from "@/components/seo/inline-scanner";
import { DataCoverage } from "@/components/seo/data-coverage";

function slugToSpecialty(slug: string): string | null {
  return SPECIALTY_LIST.find((s) => specialtyToSlug(s) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; specialty: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, specialty: specSlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  const specName = slugToSpecialty(specSlug);
  if (!abbr || !specName) return { title: "Not Found" };
  const stateName = stateAbbrToName(abbr);
  return {
    title: `Top ${specName} Providers in ${stateName} 2026 | NPIxray Leaderboard`,
    description: `Revenue Score leaderboard for ${specName} providers in ${stateName}. See the top 20 highest-scoring ${specName} practices based on real CMS data.`,
    openGraph: {
      title: `${stateName} ${specName} Leaderboard`,
      url: `https://npixray.com/leaderboard/${stateSlug}/${specSlug}`,
    },
    alternates: { canonical: `https://npixray.com/leaderboard/${stateSlug}/${specSlug}` },
  };
}

export default async function StateSpecialtyLeaderboardPage({
  params,
}: {
  params: Promise<{ state: string; specialty: string }>;
}) {
  const { state: stateSlug, specialty: specSlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  const specName = slugToSpecialty(specSlug);
  if (!abbr || !specName) notFound();
  const stateName = stateAbbrToName(abbr);

  if (!process.env.DATABASE_URL) notFound();
  const sql = neon(process.env.DATABASE_URL);

  const providers = await sql`
    SELECT npi, city, revenue_score
    FROM providers
    WHERE state = ${abbr}
      AND specialty = ${specName}
      AND revenue_score IS NOT NULL
    ORDER BY revenue_score DESC
    LIMIT 20
  `;

  const [avgRow] = await sql`
    SELECT AVG(revenue_score) AS "avg", COUNT(*) AS "total"
    FROM providers
    WHERE state = ${abbr}
      AND specialty = ${specName}
      AND revenue_score IS NOT NULL
  `;

  const avgScore = Number(avgRow?.avg ?? 0);
  const totalProviders = Number(avgRow?.total ?? 0);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#2F5EA8] transition-colors"><Home className="h-3.5 w-3.5" /></Link>
        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <Link href="/leaderboard" className="hover:text-[#2F5EA8] transition-colors">Leaderboard</Link>
        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <Link href={`/leaderboard/${stateSlug}`} className="hover:text-[#2F5EA8] transition-colors">{stateName}</Link>
        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <span className="text-[var(--text-primary)] font-medium">{specName}</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5EA8]/[0.06] text-[#2F5EA8] text-sm font-semibold mb-4">
          <Trophy className="h-4 w-4" />
          Leaderboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Top {specName} in <span className="text-[#2F5EA8]">{stateName}</span>
        </h1>
        <p className="text-[var(--text-secondary)]">
          {totalProviders.toLocaleString()} {specName} providers in {stateName}.
          Average Revenue Score: {Math.round(avgScore)}/100.
        </p>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Scan your NPI to see where you rank on this leaderboard.
        </p>
      </div>

      {/* Leaderboard */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-light)] text-xs text-[var(--text-secondary)]">
                <th className="px-4 py-3 text-left font-medium">Rank</th>
                <th className="px-4 py-3 text-left font-medium">Provider</th>
                <th className="px-4 py-3 text-left font-medium">City</th>
                <th className="px-4 py-3 text-right font-medium">Revenue Score</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p: any, i: number) => {
                const tier = getScoreTier(p.revenue_score ?? 0);
                return (
                  <tr
                    key={p.npi}
                    className="border-b border-[var(--border-light)] hover:bg-[var(--bg)]/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className={`font-bold text-base ${i === 0 ? "text-[#2F5EA8]" : i < 3 ? "text-[#2F5EA8]" : "text-[var(--text-secondary)]"}`}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/scan/${p.npi}`}
                        className="hover:text-[#2F5EA8] transition-colors"
                      >
                        Provider #{p.npi.slice(-4)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {p.city || "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
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
        {providers.length === 0 && (
          <div className="py-12 text-center text-[var(--text-secondary)]">
            No scored providers found for {specName} in {stateName}.
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6 text-center mb-8">
        <h3 className="text-lg font-bold mb-2">Where do you rank?</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Scan your NPI to see your Revenue Score and find your position on this leaderboard.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F5EA8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all"
        >
          <Trophy className="h-4 w-4" />
          Find My Ranking
        </Link>
      </div>

      <div className="mb-8">
        <InlineScanner state={stateName} specialty={specName} />
      </div>

      <div className="mb-8">
        <DataCoverage providerCount={totalProviders} />
      </div>

      <ScanCTA />
    </div>
  );
}
