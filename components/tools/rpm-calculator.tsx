"use client";

import { useState } from "react";
import {
  Activity,
  DollarSign,
  TrendingUp,
  Minus,
  Info,
} from "lucide-react";

export function RpmCalculatorTool() {
  const [patients, setPatients] = useState("");
  const [deviceCost, setDeviceCost] = useState("50");
  const [results, setResults] = useState<null | {
    monthlyRevenue: number;
    annualRevenue: number;
    monthlyDeviceCost: number;
    annualDeviceCost: number;
    netMonthly: number;
    netAnnual: number;
    roi: number;
    rev99453: number;
    rev99454: number;
    rev99457: number;
    rev99458: number;
  }>(null);

  const RATE_99453 = 19.32; // Device setup (one-time per patient)
  const RATE_99454 = 55.72; // Device supply per 30 days
  const RATE_99457 = 48.80; // Treatment management initial 20 min
  const RATE_99458 = 40.42; // Treatment management additional 20 min

  const handleCalculate = () => {
    const count = parseInt(patients);
    const cost = parseFloat(deviceCost) || 0;
    if (!count || count < 1) return;

    const monthlyPerPatient = RATE_99454 + RATE_99457;
    const monthlyRevenue = count * monthlyPerPatient;
    const annualRevenue = monthlyRevenue * 12 + count * RATE_99453; // setup is one-time

    const rev99458Annual = Math.round(count * 0.6) * RATE_99458 * 12; // 60% need additional time

    const totalAnnualRevenue = annualRevenue + rev99458Annual;

    const monthlyDeviceCost = count * cost;
    const annualDeviceCost = monthlyDeviceCost * 12;

    const netAnnual = totalAnnualRevenue - annualDeviceCost;
    const netMonthly = netAnnual / 12;

    const roi = annualDeviceCost > 0 ? ((totalAnnualRevenue - annualDeviceCost) / annualDeviceCost) * 100 : 0;

    setResults({
      monthlyRevenue: totalAnnualRevenue / 12,
      annualRevenue: totalAnnualRevenue,
      monthlyDeviceCost,
      annualDeviceCost,
      netMonthly,
      netAnnual,
      roi,
      rev99453: count * RATE_99453,
      rev99454: count * RATE_99454 * 12,
      rev99457: count * RATE_99457 * 12,
      rev99458: rev99458Annual,
    });
  };

  const formatCurrency = (n: number) =>
    "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div>
      {/* Input */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Activity className="h-5 w-5 text-sky-400" />
          </div>
          <h2 className="text-lg font-semibold">RPM Revenue Inputs</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Eligible Patients
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 75"
              value={patients}
              onChange={(e) => setPatients(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-white placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
              aria-label="Number of eligible RPM patients"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Monthly Device Cost / Patient
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
              <input
                type="number"
                min="0"
                step="5"
                placeholder="50"
                value={deviceCost}
                onChange={(e) => setDeviceCost(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-light)] bg-white pl-8 pr-4 py-3 text-white placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
                aria-label="Monthly device cost per patient"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!patients || parseInt(patients) < 1}
          className="mt-6 w-full sm:w-auto bg-[#2F5EA8] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#264D8C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Calculate RPM Revenue
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8 space-y-6">
          {/* Net Revenue + ROI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                <DollarSign className="h-4 w-4 text-sky-400" />
                Gross Annual Revenue
              </div>
              <p className="text-2xl font-bold font-mono text-sky-400">
                {formatCurrency(results.annualRevenue)}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {formatCurrency(results.monthlyRevenue)}/month
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                <Minus className="h-4 w-4 text-red-400" />
                Annual Device Cost
              </div>
              <p className="text-2xl font-bold font-mono text-red-400">
                {formatCurrency(results.annualDeviceCost)}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {formatCurrency(results.monthlyDeviceCost)}/month
              </p>
            </div>

            <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                <TrendingUp className="h-4 w-4 text-[#2F5EA8]" />
                Net Annual Revenue
              </div>
              <p className="text-2xl font-bold font-mono text-[#2F5EA8]">
                {formatCurrency(results.netAnnual)}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                ROI: {results.roi.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Code Breakdown */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
            <h3 className="text-base font-semibold mb-4">Revenue by CPT Code (Annual)</h3>
            <div className="space-y-4">
              {[
                { code: "99453", desc: "Device setup & education (one-time)", amount: results.rev99453, color: "bg-violet-500" },
                { code: "99454", desc: "Device supply, per 30 days", amount: results.rev99454, color: "bg-sky-500" },
                { code: "99457", desc: "Treatment management, initial 20 min", amount: results.rev99457, color: "bg-emerald-500" },
                { code: "99458", desc: "Treatment management, additional 20 min (60% of patients)", amount: results.rev99458, color: "bg-amber-500" },
              ].map((item) => {
                const max = Math.max(results.rev99453, results.rev99454, results.rev99457, results.rev99458) || 1;
                return (
                  <div key={item.code}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span>
                        <span className="font-medium font-mono text-[#2F5EA8]">{item.code}</span>
                        <span className="text-[var(--text-secondary)] ml-2">{item.desc}</span>
                      </span>
                      <span className="font-mono font-semibold">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${(item.amount / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)] bg-white/80 rounded-lg p-4 border border-[var(--border-light)]">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#2F5EA8]" />
            <div>
              <p className="font-medium text-[var(--text-primary)] mb-1">About RPM Billing</p>
              <p>
                RPM requires 16 days of device readings per 30-day period for 99454. Treatment management
                codes (99457/99458) require real-time monitoring and at least 20 minutes of interactive
                communication per month. Eligible conditions include hypertension, diabetes, COPD, and CHF.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
