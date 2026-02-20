"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ScanResult } from "@/lib/types";

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

export function CodingTab({ data }: { data: ScanResult }) {
  const { codingGap, billing, benchmark } = data;

  const chartData = [
    {
      code: "99213",
      "Your Practice": Math.round(codingGap.current99213Pct * 100),
      "Specialty Benchmark": Math.round(codingGap.optimal99213Pct * 100),
    },
    {
      code: "99214",
      "Your Practice": Math.round(codingGap.current99214Pct * 100),
      "Specialty Benchmark": Math.round(codingGap.optimal99214Pct * 100),
    },
    {
      code: "99215",
      "Your Practice": Math.round(codingGap.current99215Pct * 100),
      "Specialty Benchmark": Math.round(codingGap.optimal99215Pct * 100),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Coding Gap Header */}
      <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-1">
            E&M Coding Gap
          </p>
          <p className="text-3xl font-bold text-[#2F5EA8] font-mono">
            {formatCurrency(codingGap.annualGap)}
            <span className="text-base text-[var(--text-secondary)] font-sans">
              /year
            </span>
          </p>
        </div>
        <p className="text-sm text-[var(--text-secondary)] max-w-md text-right">
          {codingGap.shiftsNeeded}
        </p>
      </div>

      {/* Bar Chart */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-6">
          E&M Code Distribution — Your Practice vs {benchmark.specialty}{" "}
          Benchmark
        </h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={8}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E9EEF6"
                vertical={false}
              />
              <XAxis
                dataKey="code"
                tick={{ fill: "#6B7A99", fontSize: 13 }}
                axisLine={{ stroke: "#E9EEF6" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6B7A99", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 70]}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, undefined]}
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #E9EEF6",
                  borderRadius: "8px",
                  color: "#1A2B4A",
                  fontSize: "13px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "#6B7A99" }}
              />
              <Bar
                dataKey="Your Practice"
                fill="#2F5EA8"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              <Bar
                dataKey="Specialty Benchmark"
                fill="#4a4530"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            code: "99213",
            label: "Level 3 — Low Complexity",
            rate: "$92",
            current: billing.em99213Count,
            currentPct: codingGap.current99213Pct,
            optimal: codingGap.optimal99213Pct,
            direction: codingGap.current99213Pct > codingGap.optimal99213Pct ? "high" : "ok",
          },
          {
            code: "99214",
            label: "Level 4 — Moderate Complexity",
            rate: "$130",
            current: billing.em99214Count,
            currentPct: codingGap.current99214Pct,
            optimal: codingGap.optimal99214Pct,
            direction: Math.abs(codingGap.current99214Pct - codingGap.optimal99214Pct) < 0.05 ? "ok" : "low",
          },
          {
            code: "99215",
            label: "Level 5 — High Complexity",
            rate: "$176",
            current: billing.em99215Count,
            currentPct: codingGap.current99215Pct,
            optimal: codingGap.optimal99215Pct,
            direction: codingGap.current99215Pct < codingGap.optimal99215Pct ? "low" : "ok",
          },
        ].map((item) => (
          <div
            key={item.code}
            className="rounded-xl border border-[var(--border-light)] bg-white p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold font-mono">{item.code}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  item.direction === "high"
                    ? "bg-red-500/10 text-red-400"
                    : item.direction === "low"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-green-500/10 text-green-400"
                }`}
              >
                {item.direction === "high"
                  ? "Over-indexed"
                  : item.direction === "low"
                  ? "Under-coded"
                  : "On target"}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              {item.label}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Your rate</span>
                <span className="font-mono font-semibold">
                  {Math.round(item.currentPct * 100)}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">
                  Benchmark
                </span>
                <span className="font-mono">
                  {Math.round(item.optimal * 100)}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Volume</span>
                <span className="font-mono">
                  {item.current.toLocaleString()} visits
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">
                  Payment rate
                </span>
                <span className="font-mono">{item.rate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
