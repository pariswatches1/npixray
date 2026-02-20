"use client";

import { useState } from "react";
import {
  HeartPulse,
  DollarSign,
  TrendingUp,
  Users,
  Info,
} from "lucide-react";

export function CcmCalculatorTool() {
  const [patients, setPatients] = useState("");
  const [results, setResults] = useState<null | {
    monthly99490: number;
    annual99490: number;
    monthly99439: number;
    annual99439: number;
    totalMonthly: number;
    totalAnnual: number;
    addOnPatients: number;
  }>(null);

  const RATE_99490 = 66;
  const RATE_99439 = 54;
  const ADD_ON_PCT = 0.5; // 50% of patients qualify for add-on

  const handleCalculate = () => {
    const count = parseInt(patients);
    if (!count || count < 1) return;

    const monthly99490 = count * RATE_99490;
    const annual99490 = monthly99490 * 12;

    const addOnPatients = Math.round(count * ADD_ON_PCT);
    const monthly99439 = addOnPatients * RATE_99439;
    const annual99439 = monthly99439 * 12;

    setResults({
      monthly99490,
      annual99490,
      monthly99439,
      annual99439,
      totalMonthly: monthly99490 + monthly99439,
      totalAnnual: annual99490 + annual99439,
      addOnPatients,
    });
  };

  const formatCurrency = (n: number) =>
    "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div>
      {/* Input */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20">
            <HeartPulse className="h-5 w-5 text-rose-400" />
          </div>
          <h2 className="text-lg font-semibold">CCM Revenue Inputs</h2>
        </div>

        <div className="max-w-sm">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Patients with 2+ Chronic Conditions
          </label>
          <input
            type="number"
            min="1"
            placeholder="e.g. 100"
            value={patients}
            onChange={(e) => setPatients(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-white placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
            aria-label="Number of patients with 2+ chronic conditions"
          />
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            Typically 30-40% of Medicare patients have 2+ chronic conditions
          </p>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!patients || parseInt(patients) < 1}
          className="mt-6 w-full sm:w-auto bg-[#2F5EA8] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#264D8C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Calculate CCM Revenue
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8 space-y-6">
          {/* Total Revenue */}
          <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6 text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              Total Annual CCM Revenue Potential
            </p>
            <p className="text-4xl font-bold font-mono text-[#2F5EA8]">
              {formatCurrency(results.totalAnnual)}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              {formatCurrency(results.totalMonthly)}/month
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
                <DollarSign className="h-4 w-4 text-rose-400" />
                CPT 99490 — Initial 20 min
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                {patients} patients x ${RATE_99490}/month
              </p>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Monthly</p>
                  <p className="text-lg font-bold font-mono">{formatCurrency(results.monthly99490)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Annual</p>
                  <p className="text-lg font-bold font-mono text-rose-400">{formatCurrency(results.annual99490)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                CPT 99439 — Add-on 20 min
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                {results.addOnPatients} patients (50%) x ${RATE_99439}/month
              </p>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Monthly</p>
                  <p className="text-lg font-bold font-mono">{formatCurrency(results.monthly99439)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Annual</p>
                  <p className="text-lg font-bold font-mono text-amber-400">{formatCurrency(results.annual99439)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Scaling */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-[#2F5EA8]" />
              <h3 className="text-base font-semibold">Revenue at Different Patient Volumes</h3>
            </div>
            <div className="space-y-3">
              {[25, 50, 100, 150, 200].map((count) => {
                const annual = count * RATE_99490 * 12 + Math.round(count * ADD_ON_PCT) * RATE_99439 * 12;
                const currentPatients = parseInt(patients);
                const isCurrentRange = Math.abs(count - currentPatients) < 25;
                return (
                  <div key={count} className="flex items-center gap-3">
                    <span className="text-sm w-24 text-[var(--text-secondary)]">
                      {count} patients
                    </span>
                    <div className="flex-1 h-6 rounded bg-white overflow-hidden">
                      <div
                        className={`h-full rounded transition-all duration-500 ${isCurrentRange ? "bg-[#2F5EA8]" : "bg-rose-500/60"}`}
                        style={{ width: `${(annual / (200 * RATE_99490 * 12 + 100 * RATE_99439 * 12)) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-mono font-semibold w-28 text-right ${isCurrentRange ? "text-[#2F5EA8]" : ""}`}>
                      {formatCurrency(annual)}/yr
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
              <p className="font-medium text-[var(--text-primary)] mb-1">About CCM Billing</p>
              <p>
                CPT 99490 requires at least 20 minutes of clinical staff time per calendar month for
                patients with 2+ chronic conditions. CPT 99439 is billable for each additional 20 minutes.
                Patient consent is required. Revenue estimates assume 100% collection rate.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
