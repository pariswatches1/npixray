"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";
import { ScanResult } from "@/lib/types";

const COLORS = ["#E8A824", "#D49A1F", "#B07E19", "#8C6313", "#68490E"];

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export function OverviewTab({ data }: { data: ScanResult }) {
  const pieData = [
    { name: "E&M Coding", value: data.codingGap.annualGap },
    { name: "CCM", value: data.ccmGap.annualGap },
    { name: "RPM", value: data.rpmGap.annualGap },
    { name: "BHI", value: data.bhiGap.annualGap },
    { name: "AWV", value: data.awvGap.annualGap },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-8">
      {/* Big Number */}
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-8 text-center">
        <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-2">
          Total Estimated Missed Revenue / Year
        </p>
        <p className="text-5xl sm:text-6xl font-bold text-gold font-mono">
          {formatCurrency(data.totalMissedRevenue)}
        </p>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Based on {data.billing.totalMedicarePatients} Medicare patients &bull;{" "}
          {data.provider.specialty}
          {data.dataSource === "cms" && (
            <> &bull; Real CMS billing data</>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
            Revenue Gap Breakdown
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Annual Gap",
                  ]}
                  contentStyle={{
                    background: "#15140e",
                    border: "1px solid #2a2820",
                    borderRadius: "8px",
                    color: "#f5f5f0",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div
                  className="h-2.5 w-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-[var(--text-secondary)]">{d.name}</span>
                <span className="ml-auto font-mono text-[var(--text-primary)]">
                  {formatCurrency(d.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {[
            {
              icon: DollarSign,
              label: "Current Annual Medicare Revenue",
              value: formatCurrency(data.billing.totalMedicarePayment),
              sub: `${data.billing.totalServices.toLocaleString()} total services`,
            },
            {
              icon: TrendingUp,
              label: "Potential Revenue After Optimization",
              value: formatCurrency(
                data.billing.totalMedicarePayment + data.totalMissedRevenue
              ),
              sub: `+${Math.round(
                (data.totalMissedRevenue / data.billing.totalMedicarePayment) * 100
              )}% increase`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
                  <stat.icon className="h-4 w-4 text-gold" />
                </div>
                <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold font-mono">{stat.value}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {stat.sub}
              </p>
            </div>
          ))}

          {/* Gap Cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Coding Gap", value: data.codingGap.annualGap },
              { label: "CCM Gap", value: data.ccmGap.annualGap },
              { label: "RPM Gap", value: data.rpmGap.annualGap },
              { label: "AWV Gap", value: data.awvGap.annualGap },
            ].map((g) => (
              <div
                key={g.label}
                className="rounded-lg border border-dark-50/80 bg-dark-400/50 p-4"
              >
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
                  {g.label}
                </p>
                <p className="text-lg font-bold font-mono text-gold mt-1">
                  {formatCurrency(g.value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
