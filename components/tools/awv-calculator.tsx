"use client";

import { useState } from "react";
import {
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Users,
  Info,
} from "lucide-react";

export function AwvCalculatorTool() {
  const [totalPatients, setTotalPatients] = useState("");
  const [completionRate, setCompletionRate] = useState("30");
  const [results, setResults] = useState<null | {
    eligiblePatients: number;
    initialVisits: number;
    subsequentVisits: number;
    initialRevenue: number;
    subsequentRevenue: number;
    totalRevenue: number;
    scenarios: { rate: number; revenue: number }[];
  }>(null);

  const RATE_G0438 = 174.79; // Initial AWV
  const RATE_G0439 = 118.88; // Subsequent AWV
  const INITIAL_PCT = 0.15; // 15% are new (first AWV)

  const handleCalculate = () => {
    const total = parseInt(totalPatients);
    const rate = parseFloat(completionRate) / 100;
    if (!total || total < 1 || rate <= 0) return;

    const eligiblePatients = Math.round(total * rate);
    const initialVisits = Math.round(eligiblePatients * INITIAL_PCT);
    const subsequentVisits = eligiblePatients - initialVisits;

    const initialRevenue = initialVisits * RATE_G0438;
    const subsequentRevenue = subsequentVisits * RATE_G0439;
    const totalRevenue = initialRevenue + subsequentRevenue;

    const scenarios = [25, 50, 75, 90].map((r) => {
      const eligible = Math.round(total * (r / 100));
      const init = Math.round(eligible * INITIAL_PCT);
      const sub = eligible - init;
      return {
        rate: r,
        revenue: init * RATE_G0438 + sub * RATE_G0439,
      };
    });

    setResults({
      eligiblePatients,
      initialVisits,
      subsequentVisits,
      initialRevenue,
      subsequentRevenue,
      totalRevenue,
      scenarios,
    });
  };

  const formatCurrency = (n: number) =>
    "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div>
      {/* Input */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20">
            <CalendarCheck className="h-5 w-5 text-teal-400" />
          </div>
          <h2 className="text-lg font-semibold">AWV Revenue Inputs</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Total Medicare Patients
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 500"
              value={totalPatients}
              onChange={(e) => setTotalPatients(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
              aria-label="Total Medicare patients"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Current AWV Completion Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="100"
                placeholder="30"
                value={completionRate}
                onChange={(e) => setCompletionRate(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 pr-8 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
                aria-label="AWV completion rate percentage"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">%</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!totalPatients || parseInt(totalPatients) < 1}
          className="mt-6 w-full sm:w-auto bg-[#2F5EA8] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#264D8C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Calculate AWV Revenue
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8 space-y-6">
          {/* Total */}
          <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6 text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              Annual AWV Revenue at {completionRate}% Completion
            </p>
            <p className="text-4xl font-bold font-mono text-[#2F5EA8]">
              {formatCurrency(results.totalRevenue)}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              {results.eligiblePatients} visits ({results.initialVisits} initial + {results.subsequentVisits} subsequent)
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                G0438 — Initial AWV
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                {results.initialVisits} visits x ${RATE_G0438.toFixed(2)}
              </p>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-2">
                {formatCurrency(results.initialRevenue)}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                First-time AWV patients
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
                <TrendingUp className="h-4 w-4 text-teal-400" />
                G0439 — Subsequent AWV
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                {results.subsequentVisits} visits x ${RATE_G0439.toFixed(2)}
              </p>
              <p className="text-xl font-bold font-mono text-teal-400 mt-2">
                {formatCurrency(results.subsequentRevenue)}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Returning AWV patients
              </p>
            </div>
          </div>

          {/* Scenarios */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-[#2F5EA8]" />
              <h3 className="text-base font-semibold">Revenue at Different Completion Rates</h3>
            </div>
            <div className="space-y-3">
              {results.scenarios.map((scenario) => {
                const maxRevenue = results.scenarios[results.scenarios.length - 1].revenue || 1;
                const isCurrent = Math.abs(scenario.rate - parseFloat(completionRate)) < 5;
                return (
                  <div key={scenario.rate} className="flex items-center gap-3">
                    <span className="text-sm w-20 text-[var(--text-secondary)] text-right">
                      {scenario.rate}%
                    </span>
                    <div className="flex-1 h-6 rounded bg-white overflow-hidden">
                      <div
                        className={`h-full rounded transition-all duration-500 ${isCurrent ? "bg-[#2F5EA8]" : "bg-teal-500/60"}`}
                        style={{ width: `${(scenario.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-mono font-semibold w-28 text-right ${isCurrent ? "text-[#2F5EA8]" : ""}`}>
                      {formatCurrency(scenario.revenue)}
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
              <p className="font-medium text-[var(--text-primary)] mb-1">About AWV Billing</p>
              <p>
                The Annual Wellness Visit (AWV) is a preventive visit covered by Medicare at no cost to the patient.
                G0438 is for initial visits (first AWV ever), G0439 is for subsequent annual visits.
                AWVs require a Health Risk Assessment (HRA) and personalized prevention plan.
                The national average AWV completion rate is approximately 35%.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
