/**
 * Specialty Opportunities Grid — for state pages.
 *
 * Shows top specialties with the biggest program adoption gaps in this state.
 * Each card shows the specialty, provider count, lowest-adoption program,
 * and estimated annual opportunity.
 */

import { Heart, Activity, Brain, CalendarCheck } from "lucide-react";
import { SPECIALTY_BENCHMARKS } from "@/lib/benchmarks";
import { specialtyToSlug } from "@/lib/db-queries";
import Link from "next/link";

interface SpecialtyGap {
  specialty: string;
  providerCount: number;
  ccmRate: number;
  rpmRate: number;
  bhiRate: number;
  awvRate: number;
}

interface SpecialtyOpportunitiesGridProps {
  gaps: SpecialtyGap[];
  stateSlug: string;
  className?: string;
}

const PROGRAM_CONFIG = {
  CCM: { icon: Heart, color: "text-pink-400", rate: 66 * 12 * 15, label: "CCM (99490)" },
  RPM: { icon: Activity, color: "text-blue-400", rate: 55.72 * 12 * 20, label: "RPM (99454)" },
  BHI: { icon: Brain, color: "text-purple-400", rate: 48.56 * 12 * 10, label: "BHI (99484)" },
  AWV: { icon: CalendarCheck, color: "text-green-400", rate: 118.88 * 50, label: "AWV (G0438)" },
};

function findBiggestGap(gap: SpecialtyGap): { program: keyof typeof PROGRAM_CONFIG; localRate: number; nationalRate: number; delta: number } | null {
  const bench = SPECIALTY_BENCHMARKS[gap.specialty];
  if (!bench) return null;

  const deltas = [
    { program: "CCM" as const, localRate: gap.ccmRate, nationalRate: bench.ccmAdoptionRate, delta: bench.ccmAdoptionRate - gap.ccmRate },
    { program: "RPM" as const, localRate: gap.rpmRate, nationalRate: bench.rpmAdoptionRate, delta: bench.rpmAdoptionRate - gap.rpmRate },
    { program: "BHI" as const, localRate: gap.bhiRate, nationalRate: bench.bhiAdoptionRate, delta: bench.bhiAdoptionRate - gap.bhiRate },
    { program: "AWV" as const, localRate: gap.awvRate, nationalRate: bench.awvAdoptionRate, delta: bench.awvAdoptionRate - gap.awvRate },
  ];

  const biggest = deltas.sort((a, b) => b.delta - a.delta)[0];
  return biggest.delta > 0 ? biggest : null;
}

export function SpecialtyOpportunitiesGrid({
  gaps,
  stateSlug,
  className = "",
}: SpecialtyOpportunitiesGridProps) {
  // Filter to specialties that have benchmark data and gaps
  const withGaps = gaps
    .map((g) => ({ ...g, biggestGap: findBiggestGap(g) }))
    .filter((g) => g.biggestGap !== null)
    .sort((a, b) => {
      const aRev = (a.biggestGap!.delta * a.providerCount * PROGRAM_CONFIG[a.biggestGap!.program].rate);
      const bRev = (b.biggestGap!.delta * b.providerCount * PROGRAM_CONFIG[b.biggestGap!.program].rate);
      return bRev - aRev;
    })
    .slice(0, 5);

  if (withGaps.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
        Market Opportunities by Specialty
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {withGaps.map((g) => {
          const gap = g.biggestGap!;
          const config = PROGRAM_CONFIG[gap.program];
          const Icon = config.icon;
          const estimatedRevenue = gap.delta * g.providerCount * config.rate;
          const slug = specialtyToSlug(g.specialty);

          return (
            <Link
              key={g.specialty}
              href={`/states/${stateSlug}/specialties/${slug}`}
              className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 hover:border-[var(--accent)]/30 transition-colors"
            >
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-1 truncate" title={g.specialty}>
                {g.specialty}
              </div>
              <div className="text-xs text-[var(--text-secondary)] mb-3">
                {g.providerCount.toLocaleString()} providers
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                <span className="text-xs text-[var(--text-secondary)]">{config.label}</span>
              </div>

              <div className="text-xs text-[var(--text-secondary)] mb-1">
                {(gap.localRate * 100).toFixed(1)}% → {(gap.nationalRate * 100).toFixed(1)}% target
              </div>

              <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-[var(--accent)] rounded-full"
                  style={{ width: `${gap.nationalRate > 0 ? (gap.localRate / gap.nationalRate) * 100 : 0}%` }}
                />
              </div>

              <div className="text-sm font-bold text-[var(--accent)] font-mono">
                {formatCompact(estimatedRevenue)}
              </div>
              <div className="text-[10px] text-[var(--text-secondary)]">est. annual opportunity</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function formatCompact(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${Math.round(amount)}`;
}
