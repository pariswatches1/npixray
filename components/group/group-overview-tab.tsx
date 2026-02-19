"use client";

import { DollarSign, Users, TrendingUp, Activity } from "lucide-react";
import type { GroupScanResult } from "@/lib/types";

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount.toLocaleString()}`;
}

interface Props {
  data: GroupScanResult;
}

export function GroupOverviewTab({ data }: Props) {
  const gapBreakdown = [
    { label: "E&M Coding", amount: data.totalCodingGap, color: "#E8A824" },
    { label: "CCM", amount: data.totalCcmGap, color: "#34d399" },
    { label: "RPM", amount: data.totalRpmGap, color: "#60a5fa" },
    { label: "AWV", amount: data.totalAwvGap, color: "#a78bfa" },
    { label: "BHI", amount: data.totalBhiGap, color: "#f472b6" },
  ].filter((g) => g.amount > 0).sort((a, b) => b.amount - a.amount);

  const maxGap = gapBreakdown[0]?.amount || 1;

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-blue-400" />}
          label="Providers Scanned"
          value={`${data.successfulScans}`}
          sub={data.failedScans > 0 ? `${data.failedScans} failed` : `of ${data.totalProviders}`}
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-gold" />}
          label="Total Missed Revenue"
          value={formatCurrency(data.totalMissedRevenue)}
          sub="annual opportunity"
          highlight
        />
        <StatCard
          icon={<Activity className="h-5 w-5 text-emerald-400" />}
          label="Avg Revenue Score"
          value={`${data.averageRevenueScore}/100`}
          sub={data.scoreDistribution.map((d) => `${d.count} ${d.tier}`).join(", ")}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
          label="Revenue Increase"
          value={`+${data.revenueIncreasePct}%`}
          sub={`${formatCurrency(data.totalCurrentRevenue)} → ${formatCurrency(data.totalPotentialRevenue)}`}
        />
      </div>

      {/* Gap Breakdown */}
      <div className="rounded-2xl bg-dark-800/50 border border-dark-50/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue Gap Breakdown</h3>
        <div className="space-y-4">
          {gapBreakdown.map((gap) => (
            <div key={gap.label} className="flex items-center gap-4">
              <span className="w-24 text-sm text-dark-200 shrink-0">{gap.label}</span>
              <div className="flex-1 h-6 bg-dark-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(gap.amount / maxGap) * 100}%`,
                    backgroundColor: gap.color,
                    opacity: 0.7,
                  }}
                />
              </div>
              <span className="w-20 text-right text-sm font-mono text-white">
                {formatCurrency(gap.amount)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-dark-50/10 flex justify-between items-center">
          <span className="text-sm text-dark-300">Total Practice Opportunity</span>
          <span className="text-lg font-bold font-mono text-gold">
            {formatCurrency(data.totalMissedRevenue)}
          </span>
        </div>
      </div>

      {/* Specialty Mix */}
      {data.specialtyBreakdown.length > 1 && (
        <div className="rounded-2xl bg-dark-800/50 border border-dark-50/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Specialty Mix</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.specialtyBreakdown.map((s) => (
              <div
                key={s.specialty}
                className="flex items-center justify-between rounded-xl bg-dark-900/40 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{s.specialty}</p>
                  <p className="text-xs text-dark-300">
                    {s.count} provider{s.count > 1 ? "s" : ""}
                  </p>
                </div>
                <span className="text-sm font-mono text-dark-200">
                  {formatCurrency(s.totalRevenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Source */}
      <div className="flex items-center justify-center gap-4 text-xs text-dark-400">
        {data.cmsDataCount > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {data.cmsDataCount} with CMS data
          </span>
        )}
        {data.estimatedDataCount > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            {data.estimatedDataCount} estimated
          </span>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "bg-gold/5 border-gold/20"
          : "bg-dark-800/50 border-dark-50/20"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-dark-300 uppercase tracking-wider">{label}</span>
      </div>
      <p
        className={`text-2xl font-bold font-mono ${
          highlight ? "text-gold" : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-dark-400 mt-1 truncate">{sub}</p>
    </div>
  );
}
