"use client";

import {
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import { ScanResult } from "@/lib/types";

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

const DIFFICULTY_STYLES = {
  easy: { bg: "bg-green-500/10", text: "text-green-400", label: "Quick Win" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Moderate" },
  hard: { bg: "bg-red-500/10", text: "text-red-400", label: "Complex" },
};

const CATEGORY_LABELS: Record<string, string> = {
  coding: "E&M Coding",
  ccm: "CCM",
  rpm: "RPM",
  bhi: "BHI",
  awv: "AWV",
};

export function ActionPlanTab({ data }: { data: ScanResult }) {
  const { actionPlan } = data;
  const totalCapturable = actionPlan.reduce(
    (sum, item) => sum + item.estimatedRevenue,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              90-Day Revenue Capture Roadmap
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Prioritized by revenue impact and ease of implementation
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
              Total Capturable
            </p>
            <p className="text-2xl font-bold text-gold font-mono">
              {formatCurrency(totalCapturable)}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {actionPlan.map((item, i) => {
          const diffStyle = DIFFICULTY_STYLES[item.difficulty];
          const cumulative = actionPlan
            .slice(0, i + 1)
            .reduce((sum, a) => sum + a.estimatedRevenue, 0);

          return (
            <div
              key={i}
              className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 hover:border-gold/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Priority number */}
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                  <span className="text-sm font-bold text-gold font-mono">
                    {item.priority}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-semibold">{item.title}</h4>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${diffStyle.bg} ${diffStyle.text}`}
                    >
                      {diffStyle.label}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-dark-200 text-[var(--text-secondary)]">
                      {CATEGORY_LABELS[item.category]}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gold/60" />
                      <span className="text-[var(--text-secondary)]">
                        {item.timeline}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-gold/60" />
                      <span className="font-mono font-semibold text-gold">
                        +{formatCurrency(item.estimatedRevenue)}/year
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ArrowUpRight className="h-3.5 w-3.5 text-gold/60" />
                      <span className="text-[var(--text-secondary)]">
                        Cumulative: {formatCurrency(cumulative)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-dark-50/80 bg-dark-300/50 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Ready to capture this revenue?
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
          Upgrade to NPIxray Intelligence for patient-level eligibility lists,
          AI coding analysis, and implementation support.
        </p>
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
        >
          View Plans
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
