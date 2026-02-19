/**
 * Code Revenue Impact — for code pages.
 *
 * Shows:
 * - Avg payment per service for this code
 * - Related codes comparison table (e.g., 99213 vs 99214 vs 99215 side by side)
 * - Revenue impact scenario
 */

import { DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

interface RelatedCode {
  hcpcs_code: string;
  totalProviders: number;
  avgPayment: number;
}

interface CodeRevenueImpactProps {
  currentCode: string;
  currentAvgPayment: number;
  currentTotalProviders: number;
  relatedCodes: RelatedCode[];
  className?: string;
}

export function CodeRevenueImpact({
  currentCode,
  currentAvgPayment,
  currentTotalProviders,
  relatedCodes,
  className = "",
}: CodeRevenueImpactProps) {
  if (relatedCodes.length === 0) return null;

  // Find the highest-paying related code for the scenario
  const highestPaying = [...relatedCodes].sort((a, b) => b.avgPayment - a.avgPayment)[0];
  const uplift = highestPaying && highestPaying.avgPayment > currentAvgPayment
    ? highestPaying.avgPayment - currentAvgPayment
    : null;

  // All codes for comparison (current + related)
  const allCodes = [
    { code: currentCode, avgPayment: currentAvgPayment, providers: currentTotalProviders, isCurrent: true },
    ...relatedCodes.map((r) => ({ code: r.hcpcs_code, avgPayment: r.avgPayment, providers: r.totalProviders, isCurrent: false })),
  ].sort((a, b) => a.avgPayment - b.avgPayment);

  const maxPayment = Math.max(...allCodes.map((c) => c.avgPayment));

  return (
    <section className={`rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 ${className}`}>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-[var(--accent)]" />
        Revenue Impact: {currentCode} vs Related Codes
      </h2>

      {/* Comparison Bars */}
      <div className="space-y-2 mb-6">
        {allCodes.map((c) => {
          const width = maxPayment > 0 ? (c.avgPayment / maxPayment) * 100 : 0;
          return (
            <div key={c.code} className="flex items-center gap-3">
              <div className="w-20 text-right">
                {c.isCurrent ? (
                  <span className="text-[var(--accent)] font-semibold text-xs font-mono">{c.code}</span>
                ) : (
                  <Link
                    href={`/codes/${c.code.toLowerCase()}`}
                    className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    {c.code}
                  </Link>
                )}
              </div>
              <div className="flex-1 h-6 bg-[var(--bg-secondary)] rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all ${c.isCurrent ? "bg-[var(--accent)]" : "bg-[var(--accent)]/40"}`}
                  style={{ width: `${width}%` }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-primary)]">
                  ${c.avgPayment.toFixed(2)}
                </span>
              </div>
              <div className="w-20 text-right text-xs text-[var(--text-secondary)]">
                {c.providers.toLocaleString()} provs
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Impact Scenario */}
      {uplift && (
        <div className="rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/15 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="h-4 w-4 text-[var(--accent)]" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Revenue Uplift Scenario</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            If providers billing {currentCode} (${currentAvgPayment.toFixed(2)}/service) documented to qualify for{" "}
            {highestPaying.hcpcs_code} (${highestPaying.avgPayment.toFixed(2)}/service), the{" "}
            <span className="text-[var(--accent)] font-medium">${uplift.toFixed(2)} per-service uplift</span>{" "}
            across {currentTotalProviders.toLocaleString()} providers could represent{" "}
            <span className="text-[var(--accent)] font-bold font-mono">
              ${formatCompact(uplift * currentTotalProviders * 20)}
            </span>{" "}
            in additional annual Medicare revenue (est. 20 services/provider).
          </p>
        </div>
      )}
    </section>
  );
}

function formatCompact(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return `${Math.round(amount)}`;
}
