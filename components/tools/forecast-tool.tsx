"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  generateStandaloneForecast, formatForecastCurrency,
  DEFAULT_CONFIG, ForecastConfig, StandaloneForecastInput,
} from "@/lib/predictions";
import { BENCHMARKS } from "@/lib/benchmark-data";
import { TrendingUp, BarChart3, Mail, CheckCircle } from "lucide-react";

const TOOLTIP_STYLE = {
  background: "#FFFFFF",
  border: "1px solid #E9EEF6",
  borderRadius: "8px",
  color: "#1A2B4A",
  fontSize: "13px",
};

const PROGRAM_COLORS = {
  ccm: "#2F5EA8",
  rpm: "#34d399",
  bhi: "#a78bfa",
  awv: "#38bdf8",
  emCoding: "#fb923c",
};

const SPECIALTY_OPTIONS = Object.keys(BENCHMARKS).sort();

export function ForecastTool() {
  const [specialty, setSpecialty] = useState("Internal Medicine");
  const [patientCount, setPatientCount] = useState(300);
  const [chronicPct, setChronicPct] = useState(45);
  const [currentPrograms, setCurrentPrograms] = useState({
    ccm: false, rpm: false, bhi: false, awv: false,
  });
  const [config, setConfig] = useState<ForecastConfig>(DEFAULT_CONFIG);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const bench = BENCHMARKS[specialty];
  const input: StandaloneForecastInput = useMemo(() => ({
    specialty,
    patientCount,
    chronicPct,
    currentCcm: currentPrograms.ccm,
    currentRpm: currentPrograms.rpm,
    currentBhi: currentPrograms.bhi,
    currentAwv: currentPrograms.awv,
    benchPct99213: bench?.pct99213 ?? 0.30,
    benchPct99214: bench?.pct99214 ?? 0.55,
    benchPct99215: bench?.pct99215 ?? 0.10,
    avgRevenuePerPatient: bench?.avgRevenuePerPatient ?? 400,
  }), [specialty, patientCount, chronicPct, currentPrograms, bench]);

  const forecast = useMemo(
    () => generateStandaloneForecast(input, config),
    [input, config]
  );

  // Scenario comparison
  const scenarioA = useMemo(() => {
    return generateStandaloneForecast(input, {
      ...DEFAULT_CONFIG, rpmEnabled: false, bhiEnabled: false, awvEnabled: false, emCodingEnabled: false,
    });
  }, [input]);

  const scenarioB = useMemo(() => {
    return generateStandaloneForecast(input, {
      ...DEFAULT_CONFIG, bhiEnabled: false, awvEnabled: false, emCodingEnabled: false,
    });
  }, [input]);

  const scenarioC = useMemo(() => {
    return generateStandaloneForecast(input, DEFAULT_CONFIG);
  }, [input]);

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
        <h3 className="font-bold text-lg mb-4">Practice Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1.5">Specialty</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-3 py-2 text-sm focus:border-[#2F5EA8]/20/50 focus:outline-none"
            >
              {SPECIALTY_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1.5">
              Medicare Patients
            </label>
            <input
              type="number"
              value={patientCount}
              onChange={(e) => setPatientCount(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-[var(--border-light)] bg-white px-3 py-2 text-sm focus:border-[#2F5EA8]/20/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1.5">
              Chronic Condition Rate: {chronicPct}%
            </label>
            <input
              type="range"
              min={10}
              max={80}
              value={chronicPct}
              onChange={(e) => setChronicPct(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2F5EA8]"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1.5">
              Currently Billing
            </label>
            <div className="flex flex-wrap gap-2">
              {(["ccm", "rpm", "bhi", "awv"] as const).map((prog) => (
                <button
                  key={prog}
                  onClick={() => setCurrentPrograms((p) => ({ ...p, [prog]: !p[prog] }))}
                  className={`rounded px-2 py-1 text-[10px] font-bold uppercase transition-all ${
                    currentPrograms[prog]
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-gray-50 text-[var(--text-secondary)] border border-[var(--border-light)]"
                  }`}
                >
                  {prog}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enrollment sliders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {([
            { key: "ccmEnrollmentPct" as const, label: "CCM Enrollment", toggle: "ccmEnabled" as const },
            { key: "rpmEnrollmentPct" as const, label: "RPM Enrollment", toggle: "rpmEnabled" as const },
            { key: "bhiEnrollmentPct" as const, label: "BHI Enrollment", toggle: "bhiEnabled" as const },
            { key: "awvEnrollmentPct" as const, label: "AWV Completion", toggle: "awvEnabled" as const },
          ]).map((slider) => (
            <div key={slider.key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-[var(--text-secondary)]">{slider.label}</label>
                <span className="text-[10px] font-bold text-[#2F5EA8]">{config[slider.key]}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={config[slider.key] as number}
                onChange={(e) => setConfig((c) => ({ ...c, [slider.key]: Number(e.target.value) }))}
                className="w-full h-1 bg-gray-100 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2F5EA8]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-4">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Year 1 Revenue</p>
          <p className="text-2xl font-bold text-[#2F5EA8]">
            +{formatForecastCurrency(forecast.totalYear1Additional)}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Month 12 Run Rate</p>
          <p className="text-2xl font-bold text-emerald-400">
            +{formatForecastCurrency(forecast.month12MonthlyRate)}/mo
          </p>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Annualized at M12</p>
          <p className="text-2xl font-bold text-blue-400">
            +{formatForecastCurrency(forecast.month12MonthlyRate * 12)}/yr
          </p>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Programs</p>
          <p className="text-2xl font-bold text-violet-400">
            {forecast.programs.filter((p) => p.enabled).length}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
        <h3 className="font-bold text-lg mb-6">12-Month Revenue Projection</h3>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast.monthly} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                {Object.entries(PROGRAM_COLORS).map(([key, color]) => (
                  <linearGradient key={key} id={`fg-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9EEF6" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6B7A99", fontSize: 12 }} axisLine={{ stroke: "#E9EEF6" }} />
              <YAxis tick={{ fill: "#6B7A99", fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} axisLine={{ stroke: "#E9EEF6" }} />
              <Tooltip
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                contentStyle={TOOLTIP_STYLE}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#6B7A99" }} />
              <Area type="monotone" dataKey="ccm" name="CCM" stackId="1" stroke={PROGRAM_COLORS.ccm} fill="url(#fg-ccm)" />
              <Area type="monotone" dataKey="rpm" name="RPM" stackId="1" stroke={PROGRAM_COLORS.rpm} fill="url(#fg-rpm)" />
              <Area type="monotone" dataKey="bhi" name="BHI" stackId="1" stroke={PROGRAM_COLORS.bhi} fill="url(#fg-bhi)" />
              <Area type="monotone" dataKey="awv" name="AWV" stackId="1" stroke={PROGRAM_COLORS.awv} fill="url(#fg-awv)" />
              <Area type="monotone" dataKey="emCoding" name="E&M Coding" stackId="1" stroke={PROGRAM_COLORS.emCoding} fill="url(#fg-emCoding)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-[#2F5EA8]" />
          <h3 className="font-bold text-lg">Compare Scenarios</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Scenario A: CCM Only", result: scenarioA, desc: "Add CCM at 50% enrollment" },
            { name: "Scenario B: CCM + RPM", result: scenarioB, desc: "Add CCM and RPM together" },
            { name: "Scenario C: Full Optimization", result: scenarioC, desc: "All programs + E&M coding" },
          ].map((s) => (
            <div key={s.name} className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <h4 className="font-bold text-sm mb-1">{s.name}</h4>
              <p className="text-[10px] text-[var(--text-secondary)] mb-4">{s.desc}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">Year 1</span>
                  <span className="font-bold text-[#2F5EA8]">
                    +{formatForecastCurrency(s.result.totalYear1Additional)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">M12 Rate</span>
                  <span className="font-bold text-emerald-400">
                    +{formatForecastCurrency(s.result.month12MonthlyRate)}/mo
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">Annualized</span>
                  <span className="font-bold text-blue-400">
                    +{formatForecastCurrency(s.result.month12MonthlyRate * 12)}/yr
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Capture */}
      <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-8 text-center">
        {emailSubmitted ? (
          <>
            <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Forecast Report Sent!</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Check your inbox for the detailed 12-month projection.
            </p>
          </>
        ) : (
          <>
            <TrendingUp className="h-10 w-10 text-[#2F5EA8] mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Get Your Custom Forecast Report</h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">
              Receive a detailed PDF breakdown by program with month-by-month projections.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setEmailSubmitted(true); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@practice.com"
                  required
                  className="w-full rounded-xl border border-[var(--border-light)] bg-white pl-10 pr-4 py-3 text-sm placeholder:text-zinc-500 focus:border-[#2F5EA8]/20/50 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-[#2F5EA8] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] whitespace-nowrap"
              >
                Send Report
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
