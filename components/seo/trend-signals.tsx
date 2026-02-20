/**
 * Trend Signals — Layer 3 of the Differentiation Engine.
 *
 * Shows trend arrows and change signals computed from data percentiles.
 * Even with a single year of CMS data, we can compute relative signals
 * (vs national average, vs benchmark, percentile rank) that create
 * unique positioning per page.
 */

import { TrendingUp, TrendingDown, Minus, Target, BarChart3, Users } from "lucide-react";

interface TrendSignal {
  label: string;
  value: string;
  delta: number; // percentage vs benchmark/national
  context?: string;
}

export function TrendSignals({
  signals,
  title,
}: {
  signals: TrendSignal[];
  title?: string;
}) {
  if (!signals || signals.length === 0) return null;

  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-[#2F5EA8]" />
        <h3 className="text-sm font-semibold">
          {title || "Performance Signals"}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {signals.map((signal, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg bg-[var(--bg)] p-4"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${
                signal.delta > 5
                  ? "bg-emerald-100 text-emerald-600"
                  : signal.delta < -5
                    ? "bg-red-100 text-red-500"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {signal.delta > 5 ? (
                <TrendingUp className="h-4 w-4" />
              ) : signal.delta < -5 ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[var(--text-secondary)]">
                {signal.label}
              </p>
              <p className="text-sm font-bold mt-0.5">{signal.value}</p>
              <p
                className={`text-xs font-medium mt-0.5 ${
                  signal.delta > 5
                    ? "text-emerald-600"
                    : signal.delta < -5
                      ? "text-red-500"
                      : "text-gray-500"
                }`}
              >
                {signal.delta > 0 ? "+" : ""}
                {signal.delta.toFixed(1)}% vs benchmark
                {signal.context && (
                  <span className="text-[var(--text-secondary)] font-normal">
                    {" · "}
                    {signal.context}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Compute trend signals from state + benchmark data.
 */
export function computeStateTrends(data: {
  stateName: string;
  avgPayment: number;
  totalProviders: number;
  nationalAvg: number;
  nationalProviders: number;
  ccmAdoption?: number;
  rpmAdoption?: number;
  awvAdoption?: number;
  nationalCcm?: number;
  nationalRpm?: number;
  nationalAwv?: number;
}): TrendSignal[] {
  const signals: TrendSignal[] = [];

  // Revenue per provider vs national
  if (data.nationalAvg > 0) {
    const delta = ((data.avgPayment - data.nationalAvg) / data.nationalAvg) * 100;
    signals.push({
      label: "Revenue per Provider",
      value: `$${Math.round(data.avgPayment).toLocaleString()}`,
      delta,
      context: `national avg $${Math.round(data.nationalAvg).toLocaleString()}`,
    });
  }

  // Provider density (market size signal)
  if (data.nationalProviders > 0) {
    const stateShare = (data.totalProviders / data.nationalProviders) * 100;
    const expectedShare = 2; // ~2% per state average (50 states)
    const densityDelta = ((stateShare - expectedShare) / expectedShare) * 100;
    signals.push({
      label: "Provider Market Share",
      value: `${stateShare.toFixed(1)}% of US`,
      delta: densityDelta > 100 ? 100 : densityDelta,
      context: `${data.totalProviders.toLocaleString()} providers`,
    });
  }

  // CCM adoption
  if (data.ccmAdoption !== undefined && data.nationalCcm !== undefined && data.nationalCcm > 0) {
    const delta = ((data.ccmAdoption - data.nationalCcm) / data.nationalCcm) * 100;
    signals.push({
      label: "CCM Adoption",
      value: `${(data.ccmAdoption * 100).toFixed(1)}%`,
      delta,
      context: `national ${(data.nationalCcm * 100).toFixed(1)}%`,
    });
  }

  // RPM adoption
  if (data.rpmAdoption !== undefined && data.nationalRpm !== undefined && data.nationalRpm > 0) {
    const delta = ((data.rpmAdoption - data.nationalRpm) / data.nationalRpm) * 100;
    signals.push({
      label: "RPM Adoption",
      value: `${(data.rpmAdoption * 100).toFixed(1)}%`,
      delta,
      context: `national ${(data.nationalRpm * 100).toFixed(1)}%`,
    });
  }

  // AWV adoption
  if (data.awvAdoption !== undefined && data.nationalAwv !== undefined && data.nationalAwv > 0) {
    const delta = ((data.awvAdoption - data.nationalAwv) / data.nationalAwv) * 100;
    signals.push({
      label: "AWV Completion",
      value: `${(data.awvAdoption * 100).toFixed(1)}%`,
      delta,
      context: `national ${(data.nationalAwv * 100).toFixed(1)}%`,
    });
  }

  return signals;
}

/**
 * Compute trend signals for a state+specialty page.
 */
export function computeSpecialtyTrends(data: {
  specialty: string;
  stateName: string;
  avgPayment: number;
  providerCount: number;
  nationalAvg: number;
  percentile?: number;
  ccmAdoption?: number;
  rpmAdoption?: number;
  awvAdoption?: number;
  nationalCcm?: number;
  nationalRpm?: number;
  nationalAwv?: number;
}): TrendSignal[] {
  const signals: TrendSignal[] = [];

  // Revenue vs national specialty avg
  if (data.nationalAvg > 0) {
    const delta = ((data.avgPayment - data.nationalAvg) / data.nationalAvg) * 100;
    signals.push({
      label: `${data.specialty} Revenue`,
      value: `$${Math.round(data.avgPayment).toLocaleString()}`,
      delta,
      context: `national avg $${Math.round(data.nationalAvg).toLocaleString()}`,
    });
  }

  // Percentile position
  if (data.percentile !== undefined) {
    const delta = data.percentile - 50; // above/below median
    signals.push({
      label: "National Percentile",
      value: `${data.percentile}th`,
      delta,
      context: `among all states for ${data.specialty}`,
    });
  }

  // Program adoption signals
  if (data.ccmAdoption !== undefined && data.nationalCcm !== undefined && data.nationalCcm > 0) {
    const delta = ((data.ccmAdoption - data.nationalCcm) / data.nationalCcm) * 100;
    signals.push({
      label: "CCM Adoption",
      value: `${(data.ccmAdoption * 100).toFixed(1)}%`,
      delta,
      context: `national ${(data.nationalCcm * 100).toFixed(1)}%`,
    });
  }

  if (data.rpmAdoption !== undefined && data.nationalRpm !== undefined && data.nationalRpm > 0) {
    const delta = ((data.rpmAdoption - data.nationalRpm) / data.nationalRpm) * 100;
    signals.push({
      label: "RPM Adoption",
      value: `${(data.rpmAdoption * 100).toFixed(1)}%`,
      delta,
      context: `national ${(data.nationalRpm * 100).toFixed(1)}%`,
    });
  }

  return signals;
}
