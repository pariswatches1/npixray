"use client";

import { Zap, AlertTriangle, Clock } from "lucide-react";
import type { GroupScanResult } from "@/lib/types";

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount.toLocaleString()}`;
}

const DIFFICULTY_STYLES = {
  easy: { label: "Quick Win", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
  medium: { label: "Moderate", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
  hard: { label: "Complex", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30" },
};

const CATEGORY_COLORS: Record<string, string> = {
  coding: "#2F5EA8",
  ccm: "#34d399",
  rpm: "#60a5fa",
  bhi: "#f472b6",
  awv: "#a78bfa",
};

interface Props {
  data: GroupScanResult;
}

export function GroupActionPlanTab({ data }: Props) {
  const actions = data.practiceActionPlan;

  if (actions.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-[var(--border-light)] p-12 text-center">
        <Zap className="h-12 w-12 text-[#2F5EA8] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Practice is Performing Well</h3>
        <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
          No significant revenue gaps were found across your providers.
          Keep up the great work with your billing optimization!
        </p>
      </div>
    );
  }

  const totalOpportunity = actions.reduce((s, a) => s + a.totalEstimatedRevenue, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-2xl bg-[#2F5EA8]/[0.04] border border-[#2F5EA8]/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Practice Revenue Roadmap</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {actions.length} action{actions.length > 1 ? "s" : ""} identified across {data.successfulScans} providers
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]/60 uppercase tracking-wider">Total Opportunity</p>
          <p className="text-2xl font-bold font-mono text-[#2F5EA8]">
            {formatCurrency(totalOpportunity)}
            <span className="text-sm text-[var(--text-secondary)]/60 font-normal">/yr</span>
          </p>
        </div>
      </div>

      {/* Action Items */}
      <div className="space-y-4">
        {actions.map((action, i) => {
          const diff = DIFFICULTY_STYLES[action.difficulty];
          const categoryColor = CATEGORY_COLORS[action.category] || "#2F5EA8";
          const impactPct = totalOpportunity > 0
            ? Math.round((action.totalEstimatedRevenue / totalOpportunity) * 100)
            : 0;

          return (
            <div
              key={i}
              className="rounded-2xl bg-white border border-[var(--border-light)] p-6"
            >
              <div className="flex items-start gap-4">
                {/* Priority number */}
                <div
                  className="flex items-center justify-center h-10 w-10 rounded-xl text-lg font-bold shrink-0"
                  style={{
                    backgroundColor: `${categoryColor}15`,
                    color: categoryColor,
                    border: `1px solid ${categoryColor}30`,
                  }}
                >
                  {action.priority}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h4 className="text-base font-semibold text-white">{action.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diff.bg} ${diff.color} border ${diff.border}`}>
                      {diff.label}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] mb-4">{action.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-[#2F5EA8]">
                      <Zap className="h-4 w-4" />
                      <span className="font-mono font-medium">
                        {formatCurrency(action.totalEstimatedRevenue)}/yr
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      <AlertTriangle className="h-4 w-4" />
                      {action.affectedProviders} provider{action.affectedProviders > 1 ? "s" : ""}
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      <Clock className="h-4 w-4" />
                      {impactPct}% of total opportunity
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
