/**
 * Revenue Opportunities — top 3 revenue opportunity cards.
 *
 * Each card shows:
 * - Rank and category icon
 * - Deterministic description using actual numbers
 * - Estimated revenue
 * - Progress bar (current → target)
 * - Confidence badge
 */

import { Heart, Activity, Brain, CalendarCheck, FileCode, Shield } from "lucide-react";
import type { RevenueOpportunity } from "@/lib/opportunity-engine";

interface RevenueOpportunitiesProps {
  opportunities: RevenueOpportunity[];
  title?: string;
  className?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: typeof Heart; color: string }> = {
  ccm: { icon: Heart, color: "text-pink-400" },
  rpm: { icon: Activity, color: "text-blue-400" },
  bhi: { icon: Brain, color: "text-purple-400" },
  awv: { icon: CalendarCheck, color: "text-green-400" },
  coding: { icon: FileCode, color: "text-[var(--accent)]" },
};

function formatRevenue(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

export function RevenueOpportunities({
  opportunities,
  title = "Top Revenue Opportunities",
  className = "",
}: RevenueOpportunitiesProps) {
  if (opportunities.length === 0) return null;

  return (
    <section className={`${className}`}>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
        {title}
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {opportunities.map((opp) => {
          const config = CATEGORY_CONFIG[opp.category] || CATEGORY_CONFIG.coding;
          const Icon = config.icon;
          const progressPct = opp.targetRate > 0
            ? Math.min((opp.currentRate / opp.targetRate) * 100, 100)
            : 0;

          return (
            <div
              key={opp.rank}
              className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 relative overflow-hidden"
            >
              {/* Rank badge */}
              <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <span className="text-[var(--accent)] font-bold text-sm">#{opp.rank}</span>
              </div>

              {/* Category icon + title */}
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`h-5 w-5 ${config.color}`} />
                <h3 className="text-sm font-semibold text-[var(--text-primary)] pr-8">
                  {opp.title}
                </h3>
              </div>

              {/* Revenue estimate */}
              <div className="text-2xl font-bold text-[var(--accent)] font-mono mb-2">
                {formatRevenue(opp.estimatedRevenue)}
              </div>
              <div className="text-xs text-[var(--text-secondary)] mb-3">
                estimated annual opportunity
              </div>

              {/* Description */}
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                {opp.description}
              </p>

              {/* Progress bar */}
              {opp.targetRate > 0 && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                    <span>Current: {(opp.currentRate * 100).toFixed(1)}%</span>
                    <span>Target: {(opp.targetRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] rounded-full transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Confidence */}
              <div className="flex items-center gap-1 mt-2">
                <Shield className="h-3 w-3 text-[var(--text-secondary)]" />
                <span className={`text-xs ${opp.confidence === "high" ? "text-green-400" : opp.confidence === "medium" ? "text-yellow-400" : "text-red-400"}`}>
                  {opp.confidence} confidence
                </span>
                {opp.affectedProviders > 0 && (
                  <span className="text-xs text-[var(--text-secondary)] ml-1">
                    · {opp.affectedProviders.toLocaleString()} providers
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
