"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import type { GroupScanResult, ProviderScanSummary } from "@/lib/types";

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount.toLocaleString()}`;
}

type SortKey = "score" | "missed" | "name" | "revenue";

interface Props {
  data: GroupScanResult;
}

export function GroupProvidersTab({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("missed");
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const sorted = [...data.providers]
    .filter((p) => p.status === "success")
    .sort((a, b) => {
      let diff = 0;
      switch (sortKey) {
        case "score": diff = b.revenueScore - a.revenueScore; break;
        case "missed": diff = b.missedRevenue - a.missedRevenue; break;
        case "name": diff = a.fullName.localeCompare(b.fullName); break;
        case "revenue": diff = b.currentRevenue - a.currentRevenue; break;
      }
      return sortAsc ? -diff : diff;
    });

  const maxMissed = Math.max(...sorted.map((p) => p.missedRevenue), 1);

  return (
    <div className="space-y-6">
      {/* Provider Table */}
      <div className="rounded-2xl bg-white border border-[var(--border-light)] overflow-hidden">
        {/* Header */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-[var(--bg)] border-b border-[var(--border-light)] text-xs text-[var(--text-secondary)] uppercase tracking-wider">
          <SortHeader label="Provider" col="col-span-3" sortKey="name" current={sortKey} asc={sortAsc} onSort={toggleSort} />
          <div className="col-span-2">Specialty</div>
          <SortHeader label="Score" col="col-span-1" sortKey="score" current={sortKey} asc={sortAsc} onSort={toggleSort} />
          <SortHeader label="Revenue" col="col-span-2" sortKey="revenue" current={sortKey} asc={sortAsc} onSort={toggleSort} />
          <SortHeader label="Missed Revenue" col="col-span-3" sortKey="missed" current={sortKey} asc={sortAsc} onSort={toggleSort} />
          <div className="col-span-1 text-right">Details</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-dark-50/10">
          {sorted.map((provider, i) => (
            <ProviderRow key={provider.npi} provider={provider} index={i} maxMissed={maxMissed} />
          ))}
        </div>
      </div>

      {/* Failed providers */}
      {data.failedScans > 0 && (
        <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4">
          <p className="text-sm text-red-400">
            {data.failedScans} provider{data.failedScans > 1 ? "s" : ""} could not be scanned:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.providers
              .filter((p) => p.status === "failed")
              .map((p) => (
                <span key={p.npi} className="px-2 py-1 rounded bg-red-500/10 text-xs font-mono text-red-300">
                  {p.npi}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SortHeader({
  label,
  col,
  sortKey,
  current,
  asc,
  onSort,
}: {
  label: string;
  col: string;
  sortKey: SortKey;
  current: SortKey;
  asc: boolean;
  onSort: (key: SortKey) => void;
}) {
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`${col} flex items-center gap-1 hover:text-[#2F5EA8] transition-colors ${
        current === sortKey ? "text-[#2F5EA8]" : ""
      }`}
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

function ProviderRow({
  provider,
  index,
  maxMissed,
}: {
  provider: ProviderScanSummary;
  index: number;
  maxMissed: number;
}) {
  const missedPct = maxMissed > 0 ? (provider.missedRevenue / maxMissed) * 100 : 0;

  // Find the biggest gap category
  const gaps = [
    { label: "Coding", value: provider.codingGap },
    { label: "CCM", value: provider.ccmGap },
    { label: "RPM", value: provider.rpmGap },
    { label: "BHI", value: provider.bhiGap },
    { label: "AWV", value: provider.awvGap },
  ].sort((a, b) => b.value - a.value);
  const topGap = gaps[0];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[var(--bg)] transition-colors">
      {/* Provider Name */}
      <div className="col-span-2 lg:col-span-3">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{provider.fullName}</p>
        <p className="text-xs text-[var(--text-secondary)] font-mono">{provider.npi}</p>
      </div>

      {/* Specialty */}
      <div className="hidden lg:block lg:col-span-2">
        <span className="text-sm text-[var(--text-primary)]">{provider.specialty}</span>
      </div>

      {/* Score */}
      <div className="lg:col-span-1">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: `${provider.scoreColor}15`,
            color: provider.scoreColor,
            border: `1px solid ${provider.scoreColor}40`,
          }}
        >
          {provider.revenueScore}
        </span>
      </div>

      {/* Revenue */}
      <div className="hidden lg:block lg:col-span-2">
        <span className="text-sm font-mono text-[var(--text-primary)]">
          {formatCurrency(provider.currentRevenue)}
        </span>
      </div>

      {/* Missed Revenue with bar */}
      <div className="col-span-2 lg:col-span-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-4 bg-[var(--bg)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2F5EA8]/60 rounded-full transition-all duration-500"
                style={{ width: `${missedPct}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-mono text-[#2F5EA8] w-16 text-right shrink-0">
            {formatCurrency(provider.missedRevenue)}
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)]/60 mt-0.5 lg:hidden">{provider.specialty}</p>
        {topGap && topGap.value > 0 && (
          <p className="text-xs text-[var(--text-secondary)]/60 mt-0.5">
            Top gap: {topGap.label} ({formatCurrency(topGap.value)})
          </p>
        )}
      </div>

      {/* Link */}
      <div className="hidden lg:flex lg:col-span-1 justify-end">
        <Link
          href={`/scan/${provider.npi}`}
          className="p-2 rounded-lg hover:bg-[var(--bg)] text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
          title="View full report"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
