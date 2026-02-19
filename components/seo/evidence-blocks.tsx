/**
 * Evidence Blocks — three snippet-friendly data boxes for every page.
 *
 * 1. Key Stats — headline metrics
 * 2. How This Compares — national rank, delta, neighbors
 * 3. Top Opportunities — top 3 computed revenue gaps
 *
 * These are the primary value signal for Google. Structured for rich snippet extraction.
 */

import { TrendingUp, TrendingDown, Minus, BarChart3, Target, Award } from "lucide-react";
import type { RevenueOpportunity } from "@/lib/opportunity-engine";

interface KeyStat {
  label: string;
  value: string;
  subtext?: string;
}

interface ComparisonData {
  nationalRank: number;
  totalStates: number;
  deltaVsNational: number; // percentage
  entityLabel: string; // e.g., "California" or "Cardiology in New York"
}

interface EvidenceBlocksProps {
  keyStats: KeyStat[];
  comparison: ComparisonData | null;
  opportunities: RevenueOpportunity[];
  className?: string;
}

function DeltaIndicator({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-green-400 text-sm font-medium">
        <TrendingUp className="h-3.5 w-3.5" />
        +{delta}%
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-red-400 text-sm font-medium">
        <TrendingDown className="h-3.5 w-3.5" />
        {delta}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[var(--text-secondary)] text-sm">
      <Minus className="h-3.5 w-3.5" />
      0%
    </span>
  );
}

export function EvidenceBlocks({
  keyStats,
  comparison,
  opportunities,
  className = "",
}: EvidenceBlocksProps) {
  return (
    <div className={`grid gap-4 md:grid-cols-3 ${className}`}>
      {/* Block 1: Key Stats */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-[var(--accent)]" />
          <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
            Key Stats
          </h3>
        </div>
        <div className="space-y-3">
          {keyStats.map((stat, i) => (
            <div key={i}>
              <div className="text-lg font-bold text-[var(--text-primary)] font-mono">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {stat.label}
                {stat.subtext && (
                  <span className="ml-1 text-[var(--text-secondary)]">({stat.subtext})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Block 2: How This Compares */}
      {comparison && (
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-4 w-4 text-[var(--accent)]" />
            <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
              How This Compares
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                #{comparison.nationalRank}{" "}
                <span className="text-sm font-normal text-[var(--text-secondary)]">
                  of {comparison.totalStates}
                </span>
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                National rank by avg Medicare payment
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DeltaIndicator delta={comparison.deltaVsNational} />
                <span className="text-xs text-[var(--text-secondary)]">vs national average</span>
              </div>
            </div>
            <div className="text-xs text-[var(--text-secondary)] pt-1 border-t border-[var(--border-primary)]">
              {comparison.entityLabel}
            </div>
          </div>
        </div>
      )}

      {/* Block 3: Top Opportunities */}
      {opportunities.length > 0 && (
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-[var(--accent)]" />
            <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
              Top Opportunities
            </h3>
          </div>
          <div className="space-y-3">
            {opportunities.slice(0, 3).map((opp) => (
              <div key={opp.rank} className="flex items-start gap-2">
                <span className="text-[var(--accent)] font-bold text-sm mt-0.5">
                  #{opp.rank}
                </span>
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {opp.title}
                  </div>
                  <div className="text-xs text-[var(--accent)] font-mono font-bold">
                    {formatRevenue(opp.estimatedRevenue)} potential
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatRevenue(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}
