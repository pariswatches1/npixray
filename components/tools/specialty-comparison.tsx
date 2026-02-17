"use client";

import { useState } from "react";
import {
  GitCompareArrows,
  Users,
  DollarSign,
  BarChart3,
  HeartPulse,
  Activity,
  CalendarCheck,
  Brain,
} from "lucide-react";
import { BENCHMARKS, SPECIALTY_LIST } from "@/lib/benchmark-data";

export function SpecialtyComparisonTool() {
  const [specialtyA, setSpecialtyA] = useState("");
  const [specialtyB, setSpecialtyB] = useState("");
  const [compared, setCompared] = useState(false);

  const handleCompare = () => {
    if (specialtyA && specialtyB) {
      setCompared(true);
    }
  };

  const a = specialtyA ? BENCHMARKS[specialtyA] : null;
  const b = specialtyB ? BENCHMARKS[specialtyB] : null;

  const formatCurrency = (n: number) =>
    "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  const formatPct = (n: number) => (n * 100).toFixed(1) + "%";

  const ComparisonBar = ({
    label,
    valA,
    valB,
    format,
    colorA = "bg-blue-500",
    colorB = "bg-emerald-500",
  }: {
    label: string;
    valA: number;
    valB: number;
    format: (n: number) => string;
    colorA?: string;
    colorB?: string;
  }) => {
    const max = Math.max(valA, valB) || 1;
    return (
      <div className="mb-5">
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs w-8 text-blue-400 font-medium flex-shrink-0">A</span>
            <div className="flex-1 h-6 rounded bg-dark-200 overflow-hidden">
              <div
                className={`h-full rounded ${colorA} transition-all duration-500`}
                style={{ width: `${(valA / max) * 100}%` }}
              />
            </div>
            <span className="text-sm font-mono font-semibold w-24 text-right">
              {format(valA)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs w-8 text-emerald-400 font-medium flex-shrink-0">B</span>
            <div className="flex-1 h-6 rounded bg-dark-200 overflow-hidden">
              <div
                className={`h-full rounded ${colorB} transition-all duration-500`}
                style={{ width: `${(valB / max) * 100}%` }}
              />
            </div>
            <span className="text-sm font-mono font-semibold w-24 text-right">
              {format(valB)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-2xl border border-dark-50/80 bg-dark-400/50 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
            <GitCompareArrows className="h-5 w-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold">Select Two Specialties</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">
              Specialty A
            </label>
            <select
              value={specialtyA}
              onChange={(e) => { setSpecialtyA(e.target.value); setCompared(false); }}
              className="w-full rounded-lg border border-dark-50/50 bg-dark-200 px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
              aria-label="First specialty"
            >
              <option value="">Select specialty</option>
              {SPECIALTY_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-emerald-400 mb-2">
              Specialty B
            </label>
            <select
              value={specialtyB}
              onChange={(e) => { setSpecialtyB(e.target.value); setCompared(false); }}
              className="w-full rounded-lg border border-dark-50/50 bg-dark-200 px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
              aria-label="Second specialty"
            >
              <option value="">Select specialty</option>
              {SPECIALTY_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={!specialtyA || !specialtyB}
          className="mt-6 w-full sm:w-auto bg-gold text-dark font-semibold rounded-lg px-6 py-3 hover:bg-gold-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Compare Specialties
        </button>
      </div>

      {/* Results */}
      {compared && a && b && (
        <div className="mt-8 space-y-6">
          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-500" />
              <span className="text-blue-400 font-medium">{specialtyA}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-emerald-500" />
              <span className="text-emerald-400 font-medium">{specialtyB}</span>
            </div>
          </div>

          {/* Core Metrics */}
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-4 w-4 text-gold" />
              <h3 className="text-base font-semibold">Core Metrics</h3>
            </div>
            <ComparisonBar
              label="Provider Count"
              valA={a.providerCount}
              valB={b.providerCount}
              format={(n) => n.toLocaleString()}
            />
            <ComparisonBar
              label="Avg Medicare Patients"
              valA={a.avgMedicarePatients}
              valB={b.avgMedicarePatients}
              format={(n) => n.toLocaleString()}
            />
            <ComparisonBar
              label="Avg Total Payment"
              valA={a.avgTotalPayment}
              valB={b.avgTotalPayment}
              format={formatCurrency}
            />
            <ComparisonBar
              label="Avg Revenue Per Patient"
              valA={a.avgRevenuePerPatient}
              valB={b.avgRevenuePerPatient}
              format={formatCurrency}
            />
          </div>

          {/* E&M Distribution */}
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
            <div className="flex items-center gap-2 mb-5">
              <DollarSign className="h-4 w-4 text-gold" />
              <h3 className="text-base font-semibold">E&M Distribution</h3>
            </div>
            <ComparisonBar
              label="99213 (Level 3)"
              valA={a.pct99213}
              valB={b.pct99213}
              format={formatPct}
            />
            <ComparisonBar
              label="99214 (Level 4)"
              valA={a.pct99214}
              valB={b.pct99214}
              format={formatPct}
            />
            <ComparisonBar
              label="99215 (Level 5)"
              valA={a.pct99215}
              valB={b.pct99215}
              format={formatPct}
            />
          </div>

          {/* Program Adoption */}
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users className="h-4 w-4 text-gold" />
              <h3 className="text-base font-semibold">Program Adoption Rates</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "CCM Adoption", icon: HeartPulse, valA: a.ccmAdoptionRate, valB: b.ccmAdoptionRate, color: "text-rose-400" },
                { label: "RPM Adoption", icon: Activity, valA: a.rpmAdoptionRate, valB: b.rpmAdoptionRate, color: "text-sky-400" },
                { label: "BHI Adoption", icon: Brain, valA: a.bhiAdoptionRate, valB: b.bhiAdoptionRate, color: "text-purple-400" },
                { label: "AWV Adoption", icon: CalendarCheck, valA: a.awvAdoptionRate, valB: b.awvAdoptionRate, color: "text-teal-400" },
              ].map((program) => (
                <div key={program.label}>
                  <div className="flex items-center gap-2 mb-3">
                    <program.icon className={`h-4 w-4 ${program.color}`} />
                    <span className="text-sm font-medium">{program.label}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-400">{specialtyA}</span>
                      <span className="font-mono font-semibold">{formatPct(program.valA)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400">{specialtyB}</span>
                      <span className="font-mono font-semibold">{formatPct(program.valB)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
