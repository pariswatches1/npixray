"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { STATE_LIST } from "@/lib/benchmark-data";

// Placeholder state-level data for client-side comparison
const STATE_DATA: Record<
  string,
  {
    providers: number;
    avgPayment: number;
    avgPatients: number;
    topSpecialty: string;
    avgRevenuePerProvider: number;
  }
> = {
  AL: { providers: 14200, avgPayment: 68500, avgPatients: 195, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 72000 },
  AK: { providers: 2100, avgPayment: 82300, avgPatients: 140, topSpecialty: "Family Medicine", avgRevenuePerProvider: 85000 },
  AZ: { providers: 21500, avgPayment: 73200, avgPatients: 185, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 76000 },
  AR: { providers: 8900, avgPayment: 64800, avgPatients: 200, topSpecialty: "Family Medicine", avgRevenuePerProvider: 68000 },
  CA: { providers: 98500, avgPayment: 78900, avgPatients: 170, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 82000 },
  CO: { providers: 18200, avgPayment: 74500, avgPatients: 165, topSpecialty: "Family Medicine", avgRevenuePerProvider: 77000 },
  CT: { providers: 14800, avgPayment: 81200, avgPatients: 175, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 85000 },
  DE: { providers: 3400, avgPayment: 76800, avgPatients: 180, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 79000 },
  DC: { providers: 5200, avgPayment: 85600, avgPatients: 155, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 88000 },
  FL: { providers: 68900, avgPayment: 71400, avgPatients: 210, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 74000 },
  GA: { providers: 28700, avgPayment: 70200, avgPatients: 190, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 73000 },
  HI: { providers: 4800, avgPayment: 79500, avgPatients: 160, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 82000 },
  ID: { providers: 5200, avgPayment: 68900, avgPatients: 175, topSpecialty: "Family Medicine", avgRevenuePerProvider: 72000 },
  IL: { providers: 39800, avgPayment: 75600, avgPatients: 180, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 78000 },
  IN: { providers: 19600, avgPayment: 69800, avgPatients: 190, topSpecialty: "Family Medicine", avgRevenuePerProvider: 72000 },
  IA: { providers: 9400, avgPayment: 67500, avgPatients: 185, topSpecialty: "Family Medicine", avgRevenuePerProvider: 70000 },
  KS: { providers: 8200, avgPayment: 68200, avgPatients: 180, topSpecialty: "Family Medicine", avgRevenuePerProvider: 71000 },
  KY: { providers: 13100, avgPayment: 66900, avgPatients: 200, topSpecialty: "Family Medicine", avgRevenuePerProvider: 70000 },
  LA: { providers: 14500, avgPayment: 69100, avgPatients: 195, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 72000 },
  ME: { providers: 5100, avgPayment: 72400, avgPatients: 175, topSpecialty: "Family Medicine", avgRevenuePerProvider: 75000 },
  MD: { providers: 24300, avgPayment: 79800, avgPatients: 175, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 83000 },
  MA: { providers: 30200, avgPayment: 84500, avgPatients: 165, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 87000 },
  MI: { providers: 31500, avgPayment: 72800, avgPatients: 185, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 76000 },
  MN: { providers: 18900, avgPayment: 73600, avgPatients: 170, topSpecialty: "Family Medicine", avgRevenuePerProvider: 76000 },
  MS: { providers: 8100, avgPayment: 63500, avgPatients: 205, topSpecialty: "Family Medicine", avgRevenuePerProvider: 67000 },
  MO: { providers: 18700, avgPayment: 70100, avgPatients: 185, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 73000 },
  MT: { providers: 3600, avgPayment: 69800, avgPatients: 170, topSpecialty: "Family Medicine", avgRevenuePerProvider: 72000 },
  NE: { providers: 6100, avgPayment: 68400, avgPatients: 175, topSpecialty: "Family Medicine", avgRevenuePerProvider: 71000 },
  NV: { providers: 8900, avgPayment: 74200, avgPatients: 185, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 77000 },
  NH: { providers: 5300, avgPayment: 76100, avgPatients: 170, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 79000 },
  NJ: { providers: 33400, avgPayment: 80500, avgPatients: 180, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 84000 },
  NM: { providers: 6200, avgPayment: 70800, avgPatients: 175, topSpecialty: "Family Medicine", avgRevenuePerProvider: 74000 },
  NY: { providers: 72100, avgPayment: 79200, avgPatients: 175, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 82000 },
  NC: { providers: 28900, avgPayment: 71800, avgPatients: 185, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 75000 },
  ND: { providers: 2800, avgPayment: 67200, avgPatients: 175, topSpecialty: "Family Medicine", avgRevenuePerProvider: 70000 },
  OH: { providers: 35200, avgPayment: 72100, avgPatients: 185, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 75000 },
  OK: { providers: 10800, avgPayment: 66500, avgPatients: 195, topSpecialty: "Family Medicine", avgRevenuePerProvider: 69000 },
  OR: { providers: 13200, avgPayment: 74800, avgPatients: 165, topSpecialty: "Family Medicine", avgRevenuePerProvider: 78000 },
  PA: { providers: 42300, avgPayment: 76500, avgPatients: 180, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 80000 },
  RI: { providers: 4200, avgPayment: 78900, avgPatients: 175, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 82000 },
  SC: { providers: 14800, avgPayment: 69500, avgPatients: 190, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 72000 },
  SD: { providers: 3100, avgPayment: 66800, avgPatients: 175, topSpecialty: "Family Medicine", avgRevenuePerProvider: 69000 },
  TN: { providers: 20100, avgPayment: 70500, avgPatients: 195, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 73000 },
  TX: { providers: 72800, avgPayment: 73900, avgPatients: 190, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 77000 },
  UT: { providers: 9100, avgPayment: 71200, avgPatients: 165, topSpecialty: "Family Medicine", avgRevenuePerProvider: 74000 },
  VT: { providers: 2700, avgPayment: 73500, avgPatients: 170, topSpecialty: "Family Medicine", avgRevenuePerProvider: 76000 },
  VA: { providers: 26500, avgPayment: 76200, avgPatients: 180, topSpecialty: "Internal Medicine", avgRevenuePerProvider: 79000 },
  WA: { providers: 22800, avgPayment: 77300, avgPatients: 165, topSpecialty: "Family Medicine", avgRevenuePerProvider: 80000 },
  WV: { providers: 5800, avgPayment: 65200, avgPatients: 205, topSpecialty: "Family Medicine", avgRevenuePerProvider: 68000 },
  WI: { providers: 17800, avgPayment: 72400, avgPatients: 175, topSpecialty: "Family Medicine", avgRevenuePerProvider: 75000 },
  WY: { providers: 1800, avgPayment: 70100, avgPatients: 165, topSpecialty: "Family Medicine", avgRevenuePerProvider: 73000 },
};

export function StateComparisonTool() {
  const [stateA, setStateA] = useState("");
  const [stateB, setStateB] = useState("");
  const [compared, setCompared] = useState(false);

  const handleCompare = () => {
    if (stateA && stateB) setCompared(true);
  };

  const a = stateA ? STATE_DATA[stateA] : null;
  const b = stateB ? STATE_DATA[stateB] : null;

  const stateNameA = STATE_LIST.find((s) => s.abbr === stateA)?.name || stateA;
  const stateNameB = STATE_LIST.find((s) => s.abbr === stateB)?.name || stateB;

  const formatCurrency = (n: number) =>
    "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <MapPin className="h-5 w-5 text-cyan-400" />
          </div>
          <h2 className="text-lg font-semibold">Select Two States</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">
              State A
            </label>
            <select
              value={stateA}
              onChange={(e) => { setStateA(e.target.value); setCompared(false); }}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-white focus:border-[#2F5EA8]/20 focus:outline-none transition-colors appearance-none cursor-pointer"
              aria-label="First state"
            >
              <option value="">Select state</option>
              {STATE_LIST.map((s) => (
                <option key={s.abbr} value={s.abbr}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-emerald-400 mb-2">
              State B
            </label>
            <select
              value={stateB}
              onChange={(e) => { setStateB(e.target.value); setCompared(false); }}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-white focus:border-[#2F5EA8]/20 focus:outline-none transition-colors appearance-none cursor-pointer"
              aria-label="Second state"
            >
              <option value="">Select state</option>
              {STATE_LIST.map((s) => (
                <option key={s.abbr} value={s.abbr}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={!stateA || !stateB}
          className="mt-6 w-full sm:w-auto bg-[#2F5EA8] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#264D8C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Compare States
        </button>
      </div>

      {/* Results */}
      {compared && a && b && (
        <div className="mt-8 space-y-6">
          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-500" />
              <span className="text-blue-400 font-medium">{stateNameA}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-emerald-500" />
              <span className="text-emerald-400 font-medium">{stateNameB}</span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Medicare Providers", icon: Users, valA: a.providers, valB: b.providers, format: (n: number) => n.toLocaleString() },
              { label: "Avg Payment Per Provider", icon: DollarSign, valA: a.avgPayment, valB: b.avgPayment, format: formatCurrency },
              { label: "Avg Patients Per Provider", icon: Users, valA: a.avgPatients, valB: b.avgPatients, format: (n: number) => n.toString() },
              { label: "Avg Revenue Per Provider", icon: TrendingUp, valA: a.avgRevenuePerProvider, valB: b.avgRevenuePerProvider, format: formatCurrency },
            ].map((metric) => {
              const max = Math.max(metric.valA, metric.valB) || 1;
              const diff = metric.valA - metric.valB;
              return (
                <div key={metric.label} className="rounded-xl border border-[var(--border-light)] bg-white p-5">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
                    <metric.icon className="h-4 w-4 text-[#2F5EA8]" />
                    {metric.label}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-blue-400">{stateNameA}</span>
                        <span className="font-mono font-semibold">{metric.format(metric.valA)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-white overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${(metric.valA / max) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-emerald-400">{stateNameB}</span>
                        <span className="font-mono font-semibold">{metric.format(metric.valB)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-white overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${(metric.valB / max) * 100}%` }}
                        />
                      </div>
                    </div>
                    {diff !== 0 && (
                      <p className="text-xs text-[var(--text-secondary)]">
                        {diff > 0 ? stateNameA : stateNameB} is{" "}
                        <span className="text-[#2F5EA8] font-medium">
                          {Math.abs(((diff / Math.min(metric.valA, metric.valB)) * 100)).toFixed(1)}% higher
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top Specialty */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
            <h3 className="text-base font-semibold mb-4">Top Specialty by State</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white">
                <span className="text-blue-400 font-medium">{stateNameA}</span>
                <span className="text-sm">{a.topSpecialty}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white">
                <span className="text-emerald-400 font-medium">{stateNameB}</span>
                <span className="text-sm">{b.topSpecialty}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/states/${stateA.toLowerCase()}`}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
            >
              View {stateNameA} details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href={`/states/${stateB.toLowerCase()}`}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
            >
              View {stateNameB} details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
