"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ScanResult } from "@/lib/types";
import {
  generateForecast, generateScenarios, formatForecastCurrency,
  DEFAULT_CONFIG, ForecastConfig,
} from "@/lib/predictions";
import { TrendingUp, Sliders, Download, ChevronDown, ChevronUp } from "lucide-react";

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

interface ForecastTabProps {
  data: ScanResult;
}

export function ForecastTab({ data }: ForecastTabProps) {
  const [config, setConfig] = useState<ForecastConfig>(DEFAULT_CONFIG);
  const [showSliders, setShowSliders] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);

  const forecast = useMemo(() => generateForecast(data, config), [data, config]);
  const scenarios = useMemo(() => generateScenarios(data), [data]);

  const toggleProgram = (key: keyof ForecastConfig) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateSlider = (key: keyof ForecastConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-4">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Year 1 Additional Revenue</p>
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
          <p className="text-xs text-[var(--text-secondary)] mb-1">Annualized at M12 Rate</p>
          <p className="text-2xl font-bold text-blue-400">
            +{formatForecastCurrency(forecast.month12MonthlyRate * 12)}/yr
          </p>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Active Programs</p>
          <p className="text-2xl font-bold text-violet-400">
            {forecast.programs.filter((p) => p.enabled).length}
          </p>
        </div>
      </div>

      {/* Program Toggles */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#2F5EA8]" />
            Revenue Programs
          </h3>
          <button
            onClick={() => setShowSliders(!showSliders)}
            className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
          >
            <Sliders className="h-3.5 w-3.5" />
            {showSliders ? "Hide" : "Adjust"} Enrollment
            {showSliders ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { key: "ccmEnabled" as const, label: "CCM", code: "99490", color: PROGRAM_COLORS.ccm, sliderKey: "ccmEnrollmentPct" as const },
            { key: "rpmEnabled" as const, label: "RPM", code: "99454", color: PROGRAM_COLORS.rpm, sliderKey: "rpmEnrollmentPct" as const },
            { key: "bhiEnabled" as const, label: "BHI", code: "99484", color: PROGRAM_COLORS.bhi, sliderKey: "bhiEnrollmentPct" as const },
            { key: "awvEnabled" as const, label: "AWV", code: "G0438", color: PROGRAM_COLORS.awv, sliderKey: "awvEnrollmentPct" as const },
            { key: "emCodingEnabled" as const, label: "E&M Coding", code: "99213→14", color: PROGRAM_COLORS.emCoding, sliderKey: null },
          ].map((prog) => (
            <div key={prog.key} className="space-y-2">
              <button
                onClick={() => toggleProgram(prog.key)}
                className={`w-full rounded-lg border p-3 text-left transition-all ${
                  config[prog.key]
                    ? "border-[#2F5EA8]/15 bg-[#2F5EA8]/[0.04]"
                    : "border-[var(--border-light)] bg-white opacity-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: config[prog.key] ? prog.color : "#555" }}
                  />
                  <span className="text-xs font-bold">{prog.label}</span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)]">{prog.code}</p>
              </button>

              {showSliders && prog.sliderKey && config[prog.key] && (
                <div className="px-1">
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={config[prog.sliderKey] as number}
                    onChange={(e) => updateSlider(prog.sliderKey!, Number(e.target.value))}
                    className="w-full h-1 bg-gray-100 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2F5EA8]"
                  />
                  <p className="text-[10px] text-center text-[var(--text-secondary)]">
                    {config[prog.sliderKey]}% enrollment
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 12-Month Revenue Chart */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
        <h3 className="font-bold text-lg mb-6">12-Month Revenue Projection</h3>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast.monthly} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="gradCcm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PROGRAM_COLORS.ccm} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={PROGRAM_COLORS.ccm} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradRpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PROGRAM_COLORS.rpm} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={PROGRAM_COLORS.rpm} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradBhi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PROGRAM_COLORS.bhi} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={PROGRAM_COLORS.bhi} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradAwv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PROGRAM_COLORS.awv} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={PROGRAM_COLORS.awv} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradEm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PROGRAM_COLORS.emCoding} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={PROGRAM_COLORS.emCoding} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9EEF6" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6B7A99", fontSize: 12 }} axisLine={{ stroke: "#E9EEF6" }} />
              <YAxis tick={{ fill: "#6B7A99", fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} axisLine={{ stroke: "#E9EEF6" }} />
              <Tooltip
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                contentStyle={TOOLTIP_STYLE}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#6B7A99" }} />
              {config.ccmEnabled && <Area type="monotone" dataKey="ccm" name="CCM" stackId="1" stroke={PROGRAM_COLORS.ccm} fill="url(#gradCcm)" />}
              {config.rpmEnabled && <Area type="monotone" dataKey="rpm" name="RPM" stackId="1" stroke={PROGRAM_COLORS.rpm} fill="url(#gradRpm)" />}
              {config.bhiEnabled && <Area type="monotone" dataKey="bhi" name="BHI" stackId="1" stroke={PROGRAM_COLORS.bhi} fill="url(#gradBhi)" />}
              {config.awvEnabled && <Area type="monotone" dataKey="awv" name="AWV" stackId="1" stroke={PROGRAM_COLORS.awv} fill="url(#gradAwv)" />}
              {config.emCodingEnabled && <Area type="monotone" dataKey="emCoding" name="E&M Coding" stackId="1" stroke={PROGRAM_COLORS.emCoding} fill="url(#gradEm)" />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Revenue Chart */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
        <h3 className="font-bold text-lg mb-2">Cumulative Revenue Captured</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          By Month 12, you could be generating an additional{" "}
          <span className="text-[#2F5EA8] font-bold">{formatForecastCurrency(forecast.month12MonthlyRate * 12)}/year</span>
        </p>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast.monthly} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9EEF6" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6B7A99", fontSize: 12 }} axisLine={{ stroke: "#E9EEF6" }} />
              <YAxis tick={{ fill: "#6B7A99", fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} axisLine={{ stroke: "#E9EEF6" }} />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Cumulative Revenue"]}
                contentStyle={TOOLTIP_STYLE}
              />
              <Line type="monotone" dataKey="cumulative" stroke="#2F5EA8" strokeWidth={3} dot={{ fill: "#2F5EA8", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Program Breakdown Cards */}
      <div>
        <h3 className="font-bold text-lg mb-4">Program-by-Program Trajectory</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {forecast.programs.filter((p) => p.enabled).map((prog) => {
            const colorKey = prog.code.includes("99490") ? "ccm"
              : prog.code.includes("99454") ? "rpm"
              : prog.code.includes("99484") ? "bhi"
              : prog.code.includes("G0438") ? "awv"
              : "emCoding";
            const color = PROGRAM_COLORS[colorKey as keyof typeof PROGRAM_COLORS];

            return (
              <div
                key={prog.programName}
                className="rounded-xl border border-[var(--border-light)] bg-white p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                  <h4 className="font-bold text-sm">{prog.programName}</h4>
                  <span className="text-[10px] text-[var(--text-secondary)]">({prog.code})</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Year 1 Total</p>
                    <p className="text-sm font-bold" style={{ color }}>
                      {formatForecastCurrency(prog.annualProjected)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Month 12 Rate</p>
                    <p className="text-sm font-bold">
                      {formatForecastCurrency(prog.month12MontlyRate)}/mo
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {prog.enrollmentTarget > 0 ? "Target Patients" : "Impact"}
                    </p>
                    <p className="text-sm font-bold">
                      {prog.enrollmentTarget > 0 ? prog.enrollmentTarget : "Full"}
                    </p>
                  </div>
                </div>

                {/* Monthly milestones */}
                <div className="flex justify-between mt-3 pt-3 border-t border-[var(--border-light)] text-[10px] text-[var(--text-secondary)]">
                  {[1, 3, 6, 12].map((m) => {
                    const mp = forecast.monthly[m - 1];
                    const val = mp[colorKey as keyof typeof mp] as number;
                    return (
                      <div key={m} className="text-center">
                        <p>M{m}</p>
                        <p className="font-bold text-[var(--text-primary)]">
                          +${Math.round(val).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scenario Comparison */}
      <div>
        <button
          onClick={() => setShowScenarios(!showScenarios)}
          className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors mb-4"
        >
          {showScenarios ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Compare Scenarios
        </button>

        {showScenarios && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.name}
                className="rounded-xl border border-[var(--border-light)] bg-white p-5"
              >
                <h4 className="font-bold text-sm mb-1">{scenario.name}</h4>
                <p className="text-[10px] text-[var(--text-secondary)] mb-3">
                  {scenario.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">Year 1</span>
                    <span className="font-bold text-[#2F5EA8]">
                      +{formatForecastCurrency(scenario.result.totalYear1Additional)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">M12 Rate</span>
                    <span className="font-bold text-emerald-400">
                      +{formatForecastCurrency(scenario.result.month12MonthlyRate)}/mo
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">Annualized</span>
                    <span className="font-bold text-blue-400">
                      +{formatForecastCurrency(scenario.result.month12MonthlyRate * 12)}/yr
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 mt-3 pt-2 border-t border-[var(--border-light)]">
                  {Object.entries(scenario.programs).map(([key, enabled]) => (
                    <span
                      key={key}
                      className={`text-[9px] rounded px-1.5 py-0.5 ${
                        enabled ? "bg-[#2F5EA8]/10 text-[#2F5EA8]" : "bg-gray-100 text-zinc-500"
                      }`}
                    >
                      {key.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF CTA */}
      <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6 text-center">
        <Download className="h-8 w-8 text-[#2F5EA8] mx-auto mb-3" />
        <h3 className="font-bold text-lg mb-2">Download Forecast Report</h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-4">
          Get a printable 12-month revenue projection broken down by program.
          Share it with your team to build the business case.
        </p>
        <a
          href={`/api/reports/forecast?npi=${data.provider.npi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F5EA8] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/10"
        >
          <Download className="h-4 w-4" />
          View Forecast Report
        </a>
      </div>
    </div>
  );
}
