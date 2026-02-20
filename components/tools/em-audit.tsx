"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Info,
} from "lucide-react";
import { BENCHMARKS, SPECIALTY_LIST } from "@/lib/benchmark-data";

export function EmAuditTool() {
  const [specialty, setSpecialty] = useState("");
  const [count99213, setCount99213] = useState("");
  const [count99214, setCount99214] = useState("");
  const [count99215, setCount99215] = useState("");
  const [results, setResults] = useState<null | {
    yourTotal: number;
    yourPct213: number;
    yourPct214: number;
    yourPct215: number;
    benchPct213: number;
    benchPct214: number;
    benchPct215: number;
    yourRevenue: number;
    benchRevenue: number;
    revenueGap: number;
    optimalRevenue: number;
    optimalGap: number;
  }>(null);

  const RATE_99213 = 92.03;
  const RATE_99214 = 130.04;
  const RATE_99215 = 176.15;

  const handleAudit = () => {
    const c213 = parseInt(count99213) || 0;
    const c214 = parseInt(count99214) || 0;
    const c215 = parseInt(count99215) || 0;
    const total = c213 + c214 + c215;
    if (!specialty || total === 0) return;

    const benchmark = BENCHMARKS[specialty];
    if (!benchmark) return;

    const yourPct213 = c213 / total;
    const yourPct214 = c214 / total;
    const yourPct215 = c215 / total;

    const yourRevenue = c213 * RATE_99213 + c214 * RATE_99214 + c215 * RATE_99215;

    // What revenue would be at benchmark distribution
    const benchRevenue =
      total * benchmark.pct99213 * RATE_99213 +
      total * benchmark.pct99214 * RATE_99214 +
      total * benchmark.pct99215 * RATE_99215;

    // "Optimal" distribution: shift 10% from 213 to 214, 5% from 214 to 215
    const optPct213 = Math.max(benchmark.pct99213 - 0.1, 0.1);
    const optPct215 = benchmark.pct99215 + 0.05;
    const optPct214 = 1 - optPct213 - optPct215;
    const optimalRevenue =
      total * optPct213 * RATE_99213 +
      total * optPct214 * RATE_99214 +
      total * optPct215 * RATE_99215;

    setResults({
      yourTotal: total,
      yourPct213,
      yourPct214,
      yourPct215,
      benchPct213: benchmark.pct99213,
      benchPct214: benchmark.pct99214,
      benchPct215: benchmark.pct99215,
      yourRevenue,
      benchRevenue,
      revenueGap: benchRevenue - yourRevenue,
      optimalRevenue,
      optimalGap: optimalRevenue - yourRevenue,
    });
  };

  const formatCurrency = (n: number) =>
    "$" + Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

  const formatPct = (n: number) => (n * 100).toFixed(1) + "%";

  return (
    <div>
      {/* Input */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20">
            <ClipboardCheck className="h-5 w-5 text-orange-400" />
          </div>
          <h2 className="text-lg font-semibold">Enter Your E&M Data</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Specialty
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] focus:border-[#2F5EA8]/20 focus:outline-none transition-colors appearance-none cursor-pointer"
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
              99213 Count
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 200"
              value={count99213}
              onChange={(e) => setCount99213(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
              aria-label="99213 visit count"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              99214 Count
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 500"
              value={count99214}
              onChange={(e) => setCount99214(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
              aria-label="99214 visit count"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              99215 Count
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 50"
              value={count99215}
              onChange={(e) => setCount99215(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
              aria-label="99215 visit count"
            />
          </div>
        </div>

        <button
          onClick={handleAudit}
          disabled={!specialty || ((parseInt(count99213) || 0) + (parseInt(count99214) || 0) + (parseInt(count99215) || 0)) === 0}
          className="mt-6 w-full sm:w-auto bg-[#2F5EA8] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#264D8C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Run E&M Audit
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8 space-y-6">
          {/* Revenue Gap Banner */}
          {results.revenueGap > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-400">
                  Potential Undercoding Detected
                </p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Your E&M distribution suggests you may be leaving{" "}
                  <span className="font-bold text-[#2F5EA8]">{formatCurrency(results.revenueGap)}</span>{" "}
                  on the table compared to your specialty average. At optimal coding, the gap is{" "}
                  <span className="font-bold text-[#2F5EA8]">{formatCurrency(results.optimalGap)}</span>.
                </p>
              </div>
            </div>
          )}

          {results.revenueGap <= 0 && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-400">
                  Your coding is at or above the specialty benchmark.
                </p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  You&apos;re earning {formatCurrency(Math.abs(results.revenueGap))} more than the
                  specialty average from your E&M distribution.
                </p>
              </div>
            </div>
          )}

          {/* Distribution Comparison */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
            <h3 className="text-base font-semibold mb-5">
              Your Distribution vs. {specialty} Benchmark
            </h3>
            <div className="space-y-6">
              {[
                { code: "99213", yours: results.yourPct213, bench: results.benchPct213, rate: RATE_99213, color: "bg-blue-500", benchColor: "bg-blue-500/30" },
                { code: "99214", yours: results.yourPct214, bench: results.benchPct214, rate: RATE_99214, color: "bg-emerald-500", benchColor: "bg-emerald-500/30" },
                { code: "99215", yours: results.yourPct215, bench: results.benchPct215, rate: RATE_99215, color: "bg-amber-500", benchColor: "bg-amber-500/30" },
              ].map((item) => (
                <div key={item.code}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium">
                      CPT {item.code}{" "}
                      <span className="text-[var(--text-secondary)] font-normal">
                        (${item.rate.toFixed(2)}/visit)
                      </span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs w-20 text-[var(--text-secondary)]">Yours</span>
                      <div className="flex-1 h-5 rounded bg-white overflow-hidden">
                        <div
                          className={`h-full rounded ${item.color} transition-all duration-500`}
                          style={{ width: `${item.yours * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono font-semibold w-16 text-right">
                        {formatPct(item.yours)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs w-20 text-[var(--text-secondary)]">Benchmark</span>
                      <div className="flex-1 h-5 rounded bg-white overflow-hidden">
                        <div
                          className={`h-full rounded ${item.benchColor} transition-all duration-500`}
                          style={{ width: `${item.bench * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono w-16 text-right text-[var(--text-secondary)]">
                        {formatPct(item.bench)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Comparison */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-4 w-4 text-[#2F5EA8]" />
              <h3 className="text-base font-semibold">Revenue Comparison ({results.yourTotal} total visits)</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Your Current Revenue", amount: results.yourRevenue, color: "bg-blue-500" },
                { label: `${specialty} Benchmark`, amount: results.benchRevenue, color: "bg-emerald-500" },
                { label: "Optimal Coding", amount: results.optimalRevenue, color: "bg-[#2F5EA8]" },
              ].map((item) => {
                const max = Math.max(results.yourRevenue, results.benchRevenue, results.optimalRevenue) || 1;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-sm w-40 text-[var(--text-secondary)] flex-shrink-0">
                      {item.label}
                    </span>
                    <div className="flex-1 h-6 rounded bg-white overflow-hidden">
                      <div
                        className={`h-full rounded ${item.color} transition-all duration-500`}
                        style={{ width: `${(item.amount / max) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono font-semibold w-24 text-right">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)] bg-white/80 rounded-lg p-4 border border-[var(--border-light)]">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#2F5EA8]" />
            <div>
              <p className="font-medium text-[var(--text-primary)] mb-1">About E&M Coding</p>
              <p>
                Under the 2021 E&M guidelines, office visits are coded based on Medical Decision Making (MDM)
                complexity or total time. Many practices undercode due to documentation habits from the old
                guidelines. This tool compares your distribution to national specialty averages to identify
                potential undercoding. Always ensure documentation supports the code level billed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
