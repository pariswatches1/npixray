/**
 * Benchmark Comparison — renders "How [State] Compares" section.
 *
 * Shows:
 * - National rank badge
 * - CSS bar chart comparing state vs neighbors (pure CSS, no Recharts — SSR safe)
 * - Delta indicators
 * - Strongest specialty + weakest program callouts
 */

import { MapPin, TrendingUp, TrendingDown, AlertTriangle, Crown } from "lucide-react";
import type { StateComparison, NeighborComparison, SpecialtyNeighborComparison } from "@/lib/comparisons";

// ── State Comparison ───────────────────────────────────

interface StateBenchmarkProps {
  stateName: string;
  comparison: StateComparison;
  className?: string;
}

export function StateBenchmarkComparison({
  stateName,
  comparison,
  className = "",
}: StateBenchmarkProps) {
  const { nationalRank, totalStates, avgPaymentDelta, neighborComparisons, strongestSpecialty, weakestProgram, programAdoption } = comparison;

  // Find max avg payment for bar scaling
  const allPayments = [
    comparison.avgPayment,
    ...neighborComparisons.map((n) => n.avgPayment),
  ];
  const maxPayment = Math.max(...allPayments);

  return (
    <section className={`rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 ${className}`}>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-[var(--accent)]" />
        How {stateName} Compares
      </h2>

      {/* Rank + Delta */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-4 py-2">
          <div className="text-2xl font-bold text-[var(--accent)]">#{nationalRank}</div>
          <div className="text-xs text-[var(--text-secondary)]">of {totalStates} states</div>
        </div>
        <div className="rounded-lg bg-[var(--bg-secondary)] px-4 py-2">
          <div className={`text-xl font-bold ${avgPaymentDelta >= 0 ? "text-green-400" : "text-red-400"}`}>
            {avgPaymentDelta > 0 ? "+" : ""}{avgPaymentDelta}%
          </div>
          <div className="text-xs text-[var(--text-secondary)]">vs national avg</div>
        </div>
      </div>

      {/* Neighbor Comparison Bars */}
      {neighborComparisons.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            vs Neighboring States
          </h3>
          <div className="space-y-2">
            {/* Current state bar */}
            <BarRow
              label={stateName}
              value={comparison.avgPayment}
              maxValue={maxPayment}
              isCurrent
            />
            {/* Neighbor bars */}
            {neighborComparisons.map((n) => (
              <BarRow
                key={n.state}
                label={n.stateName}
                value={n.avgPayment}
                maxValue={maxPayment}
                delta={n.delta}
              />
            ))}
          </div>
        </div>
      )}

      {/* Callouts */}
      <div className="grid gap-3 sm:grid-cols-2">
        {strongestSpecialty && (
          <div className="rounded-lg bg-green-400/5 border border-green-400/10 p-3">
            <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold mb-1">
              <Crown className="h-3.5 w-3.5" />
              Strongest Specialty
            </div>
            <div className="text-sm text-[var(--text-primary)] font-medium">
              {strongestSpecialty.name}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              {strongestSpecialty.count.toLocaleString()} providers
            </div>
          </div>
        )}
        {weakestProgram && (
          <div className="rounded-lg bg-red-400/5 border border-red-400/10 p-3">
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold mb-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Biggest Program Gap
            </div>
            <div className="text-sm text-[var(--text-primary)] font-medium">
              {weakestProgram.name}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              {(weakestProgram.localRate * 100).toFixed(1)}% adoption vs {(weakestProgram.nationalRate * 100).toFixed(1)}% national
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── State + Specialty Comparison ───────────────────────

interface SpecialtyBenchmarkProps {
  specialty: string;
  stateName: string;
  stateAbbr: string;
  neighbors: SpecialtyNeighborComparison[];
  nationalRank: number;
  totalStates: number;
  percentile: number;
  avgPayment: number;
  vsNational: {
    avgPaymentDelta: number;
    ccmAdoptionDelta: number;
    rpmAdoptionDelta: number;
    awvAdoptionDelta: number;
  } | null;
  className?: string;
}

export function SpecialtyBenchmarkComparison({
  specialty,
  stateName,
  stateAbbr,
  neighbors,
  nationalRank,
  totalStates,
  percentile,
  avgPayment,
  vsNational,
  className = "",
}: SpecialtyBenchmarkProps) {
  const allPayments = [avgPayment, ...neighbors.map((n) => n.avgPayment)];
  const maxPayment = Math.max(...allPayments);

  return (
    <section className={`rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 ${className}`}>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-[var(--accent)]" />
        {specialty} — {stateName} vs Other States
      </h2>

      {/* Rank + Percentile */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-4 py-2">
          <div className="text-2xl font-bold text-[var(--accent)]">#{nationalRank}</div>
          <div className="text-xs text-[var(--text-secondary)]">of {totalStates} states</div>
        </div>
        <div className="rounded-lg bg-[var(--bg-secondary)] px-4 py-2">
          <div className="text-xl font-bold text-[var(--text-primary)]">{percentile}th</div>
          <div className="text-xs text-[var(--text-secondary)]">percentile nationally</div>
        </div>
        {vsNational && (
          <div className="rounded-lg bg-[var(--bg-secondary)] px-4 py-2">
            <div className={`text-xl font-bold ${vsNational.avgPaymentDelta >= 0 ? "text-green-400" : "text-red-400"}`}>
              {vsNational.avgPaymentDelta > 0 ? "+" : ""}{vsNational.avgPaymentDelta}%
            </div>
            <div className="text-xs text-[var(--text-secondary)]">vs national avg</div>
          </div>
        )}
      </div>

      {/* Neighbor bars */}
      {neighbors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            {specialty} in Neighboring States
          </h3>
          <div className="space-y-2">
            <BarRow label={stateName} value={avgPayment} maxValue={maxPayment} isCurrent />
            {neighbors.map((n) => (
              <BarRow key={n.state} label={n.stateName} value={n.avgPayment} maxValue={maxPayment} delta={n.delta} />
            ))}
          </div>
        </div>
      )}

      {/* Program adoption deltas */}
      {vsNational && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Program Adoption vs {specialty} Benchmark
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <DeltaCard label="CCM" delta={vsNational.ccmAdoptionDelta} unit="pts" />
            <DeltaCard label="RPM" delta={vsNational.rpmAdoptionDelta} unit="pts" />
            <DeltaCard label="AWV" delta={vsNational.awvAdoptionDelta} unit="pts" />
          </div>
        </div>
      )}
    </section>
  );
}

// ── Shared sub-components ──────────────────────────────

function BarRow({
  label,
  value,
  maxValue,
  isCurrent = false,
  delta,
}: {
  label: string;
  value: number;
  maxValue: number;
  isCurrent?: boolean;
  delta?: number;
}) {
  const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const formattedValue = value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : `$${Math.round(value)}`;

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs text-right truncate" title={label}>
        <span className={isCurrent ? "text-[var(--accent)] font-semibold" : "text-[var(--text-secondary)]"}>
          {label}
        </span>
      </div>
      <div className="flex-1 h-6 bg-[var(--bg-secondary)] rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all ${isCurrent ? "bg-[var(--accent)]" : "bg-[var(--accent)]/40"}`}
          style={{ width: `${width}%` }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-primary)]">
          {formattedValue}
        </span>
      </div>
      {delta !== undefined && (
        <div className="w-14 text-right">
          <span className={`text-xs font-medium ${delta > 0 ? "text-green-400" : delta < 0 ? "text-red-400" : "text-[var(--text-secondary)]"}`}>
            {delta > 0 ? "+" : ""}{delta}%
          </span>
        </div>
      )}
    </div>
  );
}

function DeltaCard({ label, delta, unit = "%" }: { label: string; delta: number; unit?: string }) {
  const isPositive = delta > 0;
  const isNegative = delta < 0;
  return (
    <div className={`rounded-lg p-3 text-center border ${isNegative ? "bg-red-400/5 border-red-400/10" : isPositive ? "bg-green-400/5 border-green-400/10" : "bg-[var(--bg-secondary)] border-[var(--border-primary)]"}`}>
      <div className={`text-lg font-bold ${isPositive ? "text-green-400" : isNegative ? "text-red-400" : "text-[var(--text-secondary)]"}`}>
        {delta > 0 ? "+" : ""}{delta}{unit}
      </div>
      <div className="text-xs text-[var(--text-secondary)]">{label}</div>
    </div>
  );
}
