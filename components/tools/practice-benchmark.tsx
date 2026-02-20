"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUp,
  Info,
} from "lucide-react";
import { BENCHMARKS, SPECIALTY_LIST, STATE_LIST } from "@/lib/benchmark-data";

export function PracticeBenchmarkTool() {
  const [specialty, setSpecialty] = useState("");
  const [state, setState] = useState("");
  const [revenue, setRevenue] = useState("");
  const [results, setResults] = useState<null | {
    yourRevenue: number;
    avgRevenue: number;
    top25Revenue: number;
    top10Revenue: number;
    percentile: number;
    gapToAvg: number;
    gapToTop25: number;
    gapToTop10: number;
    providerCount: number;
    avgPatients: number;
  }>(null);

  const handleBenchmark = () => {
    const rev = parseInt(revenue);
    if (!specialty || !rev) return;

    const benchmark = BENCHMARKS[specialty];
    if (!benchmark) return;

    const avgRevenue = benchmark.avgTotalPayment;
    const top25Revenue = Math.round(avgRevenue * 1.6); // top 25% ~60% above avg
    const top10Revenue = Math.round(avgRevenue * 2.2); // top 10% ~120% above avg

    // Simple percentile estimation based on normal-ish distribution
    let percentile: number;
    if (rev >= top10Revenue) {
      percentile = 90 + Math.min(10, ((rev - top10Revenue) / top10Revenue) * 10);
    } else if (rev >= top25Revenue) {
      percentile = 75 + ((rev - top25Revenue) / (top10Revenue - top25Revenue)) * 15;
    } else if (rev >= avgRevenue) {
      percentile = 50 + ((rev - avgRevenue) / (top25Revenue - avgRevenue)) * 25;
    } else if (rev >= avgRevenue * 0.5) {
      percentile = 25 + ((rev - avgRevenue * 0.5) / (avgRevenue * 0.5)) * 25;
    } else {
      percentile = Math.max(1, (rev / (avgRevenue * 0.5)) * 25);
    }
    percentile = Math.round(Math.min(99, Math.max(1, percentile)));

    setResults({
      yourRevenue: rev,
      avgRevenue,
      top25Revenue,
      top10Revenue,
      percentile,
      gapToAvg: Math.max(0, avgRevenue - rev),
      gapToTop25: Math.max(0, top25Revenue - rev),
      gapToTop10: Math.max(0, top10Revenue - rev),
      providerCount: benchmark.providerCount,
      avgPatients: benchmark.avgMedicarePatients,
    });
  };

  const formatCurrency = (n: number) =>
    "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  const getPercentileColor = (pct: number) => {
    if (pct >= 75) return "text-emerald-400";
    if (pct >= 50) return "text-[#2F5EA8]";
    if (pct >= 25) return "text-amber-400";
    return "text-red-400";
  };

  const getPercentileLabel = (pct: number) => {
    if (pct >= 90) return "Top 10%";
    if (pct >= 75) return "Top 25%";
    if (pct >= 50) return "Above Average";
    if (pct >= 25) return "Below Average";
    return "Bottom 25%";
  };

  return (
    <div>
      {/* Input */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold">Enter Your Practice Data</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Specialty
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-white focus:border-[#2F5EA8]/20 focus:outline-none transition-colors appearance-none cursor-pointer"
              aria-label="Select specialty"
            >
              <option value="">Select specialty</option>
              {SPECIALTY_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              State
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-white focus:border-[#2F5EA8]/20 focus:outline-none transition-colors appearance-none cursor-pointer"
              aria-label="Select state"
            >
              <option value="">Select state</option>
              {STATE_LIST.map((s) => (
                <option key={s.abbr} value={s.abbr}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Annual Medicare Revenue
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
              <input
                type="number"
                min="1"
                placeholder="e.g. 80000"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-light)] bg-white pl-8 pr-4 py-3 text-white placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
                aria-label="Annual Medicare revenue"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleBenchmark}
          disabled={!specialty || !revenue}
          className="mt-6 w-full sm:w-auto bg-[#2F5EA8] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#264D8C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Benchmark My Practice
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8 space-y-6">
          {/* Percentile Banner */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-8 text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Among {results.providerCount.toLocaleString()} {specialty} providers
            </p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className={`text-6xl font-bold font-mono ${getPercentileColor(results.percentile)}`}>
                {results.percentile}
                <span className="text-2xl">th</span>
              </p>
            </div>
            <p className={`text-lg font-semibold ${getPercentileColor(results.percentile)}`}>
              {getPercentileLabel(results.percentile)}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              percentile for annual Medicare revenue
            </p>

            {/* Visual bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="relative h-8 rounded-full bg-white overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${
                    results.percentile >= 75
                      ? "bg-emerald-500"
                      : results.percentile >= 50
                      ? "bg-[#2F5EA8]"
                      : results.percentile >= 25
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${results.percentile}%` }}
                />
                {/* Marker */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-white"
                  style={{ left: `${results.percentile}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-2">
                <span>0th</span>
                <span>25th</span>
                <span>50th</span>
                <span>75th</span>
                <span>100th</span>
              </div>
            </div>
          </div>

          {/* Revenue Benchmarks */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-4 w-4 text-[#2F5EA8]" />
              <h3 className="text-base font-semibold">Revenue Benchmarks</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Your Revenue", amount: results.yourRevenue, color: "bg-blue-500", highlight: true },
                { label: "Specialty Average", amount: results.avgRevenue, color: "bg-emerald-500/60", highlight: false },
                { label: "Top 25% Threshold", amount: results.top25Revenue, color: "bg-amber-500/60", highlight: false },
                { label: "Top 10% Threshold", amount: results.top10Revenue, color: "bg-[#2F5EA8]/60", highlight: false },
              ].map((item) => {
                const max = Math.max(results.yourRevenue, results.top10Revenue) || 1;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className={`text-sm w-36 flex-shrink-0 ${item.highlight ? "font-medium text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                      {item.label}
                    </span>
                    <div className="flex-1 h-6 rounded bg-white overflow-hidden">
                      <div
                        className={`h-full rounded ${item.color} transition-all duration-500`}
                        style={{ width: `${(item.amount / max) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-mono font-semibold w-24 text-right ${item.highlight ? "text-blue-400" : ""}`}>
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gap Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Gap to Average", gap: results.gapToAvg, color: "text-emerald-400", icon: TrendingUp },
              { label: "Gap to Top 25%", gap: results.gapToTop25, color: "text-amber-400", icon: ArrowUp },
              { label: "Gap to Top 10%", gap: results.gapToTop10, color: "text-[#2F5EA8]", icon: ArrowUp },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[var(--border-light)] bg-white p-5">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  {item.label}
                </div>
                {item.gap > 0 ? (
                  <>
                    <p className={`text-2xl font-bold font-mono ${item.color}`}>
                      +{formatCurrency(item.gap)}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      additional revenue needed
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold font-mono text-emerald-400">
                      Achieved
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      You&apos;re above this threshold
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Context */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-[#2F5EA8]" />
              <h3 className="text-base font-semibold">Specialty Context</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-lg font-bold font-mono">{results.providerCount.toLocaleString()}</p>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Total Providers</p>
              </div>
              <div>
                <p className="text-lg font-bold font-mono">{results.avgPatients}</p>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Avg Patients</p>
              </div>
              <div>
                <p className="text-lg font-bold font-mono">{formatCurrency(results.avgRevenue)}</p>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Avg Revenue</p>
              </div>
              <div>
                <p className="text-lg font-bold font-mono">{formatCurrency(BENCHMARKS[specialty]?.avgRevenuePerPatient || 0)}</p>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Rev/Patient</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)] bg-white/80 rounded-lg p-4 border border-[var(--border-light)]">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#2F5EA8]" />
            <div>
              <p className="font-medium text-[var(--text-primary)] mb-1">About This Benchmark</p>
              <p>
                Percentile estimates are based on national Medicare averages for {specialty} from CMS
                public data. Actual distribution varies by region, practice size, and payer mix.
                Top 25% and top 10% thresholds are estimated from published variance data.
                For a more precise analysis, run a free NPI scan with your actual billing data.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
