"use client";

import { useState } from "react";
import {
  Calculator,
  DollarSign,
  Users,
  TrendingUp,
  HeartPulse,
  Activity,
  CalendarCheck,
} from "lucide-react";
import { BENCHMARKS, SPECIALTY_LIST, STATE_LIST } from "@/lib/benchmark-data";

export function RevenueCalculatorTool() {
  const [specialty, setSpecialty] = useState("");
  const [state, setState] = useState("");
  const [patientCount, setPatientCount] = useState("");
  const [results, setResults] = useState<null | {
    totalRevenue: number;
    revenuePerPatient: number;
    em99213: number;
    em99214: number;
    em99215: number;
    ccmOpportunity: number;
    rpmOpportunity: number;
    awvOpportunity: number;
  }>(null);

  const handleCalculate = () => {
    if (!specialty || !patientCount) return;
    const benchmark = BENCHMARKS[specialty];
    if (!benchmark) return;

    const patients = parseInt(patientCount);
    const totalRevenue = patients * benchmark.avgRevenuePerPatient;
    const totalEM = patients * 0.75; // ~75% of patients have E&M visits

    const em99213 = Math.round(totalEM * benchmark.pct99213);
    const em99214 = Math.round(totalEM * benchmark.pct99214);
    const em99215 = Math.round(totalEM * benchmark.pct99215);

    const em99213Rev = em99213 * 92.03;
    const em99214Rev = em99214 * 130.04;
    const em99215Rev = em99215 * 176.15;

    // Program opportunities: percentage of patients eligible x payment
    const ccmEligible = Math.round(patients * 0.35); // 35% have 2+ chronic conditions
    const ccmOpportunity = ccmEligible * 66 * 12;

    const rpmEligible = Math.round(patients * 0.25); // 25% eligible for RPM
    const rpmOpportunity = rpmEligible * (55.72 + 48.80) * 12;

    const awvEligible = Math.round(patients * 0.80); // 80% eligible for AWV
    const awvOpportunity = awvEligible * 118.88;

    setResults({
      totalRevenue,
      revenuePerPatient: benchmark.avgRevenuePerPatient,
      em99213: em99213Rev,
      em99214: em99214Rev,
      em99215: em99215Rev,
      ccmOpportunity,
      rpmOpportunity,
      awvOpportunity,
    });
  };

  const formatCurrency = (n: number) =>
    "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Calculator className="h-5 w-5 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold">Enter Your Practice Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <option key={s} value={s}>
                  {s}
                </option>
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
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] focus:border-[#2F5EA8]/20 focus:outline-none transition-colors appearance-none cursor-pointer"
              aria-label="Select state"
            >
              <option value="">Select state</option>
              {STATE_LIST.map((s) => (
                <option key={s.abbr} value={s.abbr}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Medicare Patient Count
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 200"
              value={patientCount}
              onChange={(e) => setPatientCount(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
              aria-label="Medicare patient count"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!specialty || !patientCount}
          className="mt-6 w-full sm:w-auto bg-[#2F5EA8] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#264D8C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Calculate Revenue
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8 space-y-6">
          {/* Top-level metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                <DollarSign className="h-4 w-4 text-[#2F5EA8]" />
                Estimated Annual Revenue
              </div>
              <p className="text-2xl font-bold font-mono text-[#2F5EA8]">
                {formatCurrency(results.totalRevenue)}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                <Users className="h-4 w-4 text-emerald-400" />
                Revenue Per Patient
              </div>
              <p className="text-2xl font-bold font-mono text-emerald-400">
                {formatCurrency(results.revenuePerPatient)}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                Additional Program Revenue
              </div>
              <p className="text-2xl font-bold font-mono text-amber-400">
                {formatCurrency(
                  results.ccmOpportunity +
                    results.rpmOpportunity +
                    results.awvOpportunity
                )}
              </p>
            </div>
          </div>

          {/* E&M Breakdown */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
            <h3 className="text-base font-semibold mb-4">E&M Revenue Breakdown</h3>
            <div className="space-y-4">
              {[
                { code: "99213", amount: results.em99213, rate: "$92.03", color: "bg-blue-500" },
                { code: "99214", amount: results.em99214, rate: "$130.04", color: "bg-emerald-500" },
                { code: "99215", amount: results.em99215, rate: "$176.15", color: "bg-amber-500" },
              ].map((item) => {
                const total = results.em99213 + results.em99214 + results.em99215;
                const pct = total > 0 ? (item.amount / total) * 100 : 0;
                return (
                  <div key={item.code}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium">
                        CPT {item.code}{" "}
                        <span className="text-[var(--text-secondary)] font-normal">
                          ({item.rate}/visit)
                        </span>
                      </span>
                      <span className="font-mono font-semibold">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-white overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Program Opportunities */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
            <h3 className="text-base font-semibold mb-4">
              Program Revenue Opportunities (Annual)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
                <HeartPulse className="h-5 w-5 text-rose-400 mb-2" />
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                  CCM (99490)
                </p>
                <p className="text-xl font-bold font-mono text-rose-400">
                  {formatCurrency(results.ccmOpportunity)}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  $66/patient/month
                </p>
              </div>
              <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
                <Activity className="h-5 w-5 text-sky-400 mb-2" />
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                  RPM (99453-99458)
                </p>
                <p className="text-xl font-bold font-mono text-sky-400">
                  {formatCurrency(results.rpmOpportunity)}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  $104.52/patient/month
                </p>
              </div>
              <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-4">
                <CalendarCheck className="h-5 w-5 text-teal-400 mb-2" />
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                  AWV (G0439)
                </p>
                <p className="text-xl font-bold font-mono text-teal-400">
                  {formatCurrency(results.awvOpportunity)}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  $118.88/visit/year
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
