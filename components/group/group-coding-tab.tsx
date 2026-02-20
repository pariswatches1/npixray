"use client";

import type { GroupScanResult } from "@/lib/types";

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount.toLocaleString()}`;
}

interface Props {
  data: GroupScanResult;
}

export function GroupCodingTab({ data }: Props) {
  const successful = data.providers.filter((p) => p.status === "success" && p.fullScan);

  // Aggregate E&M distribution across all providers
  let total213 = 0, total214 = 0, total215 = 0, totalEm = 0;
  let bench213 = 0, bench214 = 0, bench215 = 0, benchCount = 0;

  for (const p of successful) {
    const scan = p.fullScan!;
    total213 += scan.billing.em99213Count;
    total214 += scan.billing.em99214Count;
    total215 += scan.billing.em99215Count;
    totalEm += scan.billing.emTotalCount;
    bench213 += scan.benchmark.pct99213;
    bench214 += scan.benchmark.pct99214;
    bench215 += scan.benchmark.pct99215;
    benchCount++;
  }

  const pct213 = totalEm > 0 ? (total213 / totalEm) * 100 : 0;
  const pct214 = totalEm > 0 ? (total214 / totalEm) * 100 : 0;
  const pct215 = totalEm > 0 ? (total215 / totalEm) * 100 : 0;
  const avgBench213 = benchCount > 0 ? (bench213 / benchCount) * 100 : 0;
  const avgBench214 = benchCount > 0 ? (bench214 / benchCount) * 100 : 0;
  const avgBench215 = benchCount > 0 ? (bench215 / benchCount) * 100 : 0;

  const codingRows = [
    { code: "99213", label: "Level 3", pct: pct213, bench: avgBench213, color: "#60a5fa" },
    { code: "99214", label: "Level 4", pct: pct214, bench: avgBench214, color: "#2F5EA8" },
    { code: "99215", label: "Level 5", pct: pct215, bench: avgBench215, color: "#34d399" },
  ];

  // Per-provider E&M distribution for stacked bars
  const providerEm = successful
    .map((p) => {
      const scan = p.fullScan!;
      const em = scan.billing.emTotalCount || 1;
      return {
        name: p.fullName,
        npi: p.npi,
        pct213: (scan.billing.em99213Count / em) * 100,
        pct214: (scan.billing.em99214Count / em) * 100,
        pct215: (scan.billing.em99215Count / em) * 100,
        codingGap: p.codingGap,
      };
    })
    .sort((a, b) => b.codingGap - a.codingGap);

  return (
    <div className="space-y-8">
      {/* Aggregate E&M Distribution */}
      <div className="rounded-2xl bg-white border border-[var(--border-light)] p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Practice E&M Distribution vs. Benchmark
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Aggregated across all {successful.length} providers
        </p>

        <div className="space-y-6">
          {codingRows.map((row) => {
            const diff = row.pct - row.bench;
            const isUnder = diff < -3;
            return (
              <div key={row.code} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white font-medium">
                    {row.code} <span className="text-[var(--text-secondary)]/60">({row.label})</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono" style={{ color: row.color }}>
                      {row.pct.toFixed(1)}%
                    </span>
                    <span className="text-[var(--text-secondary)]/60">vs</span>
                    <span className="font-mono text-[var(--text-secondary)]">
                      {row.bench.toFixed(1)}%
                    </span>
                    {isUnder && (
                      <span className="text-xs text-orange-400 font-medium">
                        {diff.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-6 bg-[var(--bg)] rounded-full overflow-hidden">
                  {/* Benchmark line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/30 z-10"
                    style={{ left: `${Math.min(row.bench, 100)}%` }}
                  />
                  {/* Actual bar */}
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(row.pct, 100)}%`,
                      backgroundColor: row.color,
                      opacity: 0.6,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {data.totalCodingGap > 0 && (
          <div className="mt-6 pt-4 border-t border-[var(--border-light)] flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">
              Total Coding Gap Across Practice
            </span>
            <span className="text-lg font-bold font-mono text-[#2F5EA8]">
              {formatCurrency(data.totalCodingGap)}/yr
            </span>
          </div>
        )}
      </div>

      {/* Per-Provider E&M Bars */}
      <div className="rounded-2xl bg-white border border-[var(--border-light)] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Provider E&M Mix Comparison
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Sorted by coding gap (largest opportunity first)
        </p>

        <div className="space-y-3">
          {providerEm.map((p) => (
            <div key={p.npi} className="flex items-center gap-3">
              <span className="w-36 text-xs text-[var(--text-primary)] truncate shrink-0">{p.name}</span>
              <div className="flex-1 flex h-5 rounded-full overflow-hidden bg-[var(--bg)]">
                <div
                  className="h-full"
                  style={{ width: `${p.pct213}%`, backgroundColor: "#60a5fa", opacity: 0.6 }}
                  title={`99213: ${p.pct213.toFixed(1)}%`}
                />
                <div
                  className="h-full"
                  style={{ width: `${p.pct214}%`, backgroundColor: "#2F5EA8", opacity: 0.6 }}
                  title={`99214: ${p.pct214.toFixed(1)}%`}
                />
                <div
                  className="h-full"
                  style={{ width: `${p.pct215}%`, backgroundColor: "#34d399", opacity: 0.6 }}
                  title={`99215: ${p.pct215.toFixed(1)}%`}
                />
              </div>
              <span className="w-16 text-right text-xs font-mono text-[#2F5EA8] shrink-0">
                {p.codingGap > 0 ? formatCurrency(p.codingGap) : "—"}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[var(--border-light)] text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#60a5fa" }} />
            99213
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#2F5EA8" }} />
            99214
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#34d399" }} />
            99215
          </span>
        </div>
      </div>
    </div>
  );
}
