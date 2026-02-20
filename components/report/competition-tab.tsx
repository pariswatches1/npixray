"use client";

import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Trophy,
  Minus,
  HeartPulse,
  Activity,
  Brain,
  CalendarCheck,
  Loader2,
  AlertCircle,
  BarChart3,
} from "lucide-react";

interface CompetitionData {
  scope: "city" | "state";
  location: string;
  specialty: string;
  totalCompetitors: number;
  you: {
    npi: string;
    payment: number;
    beneficiaries: number;
    score: number | null;
    paymentRank: number;
    scoreRank: number;
    em: { pct213: number; pct214: number; pct215: number };
    hasCCM: boolean;
    hasRPM: boolean;
    hasBHI: boolean;
    hasAWV: boolean;
  };
  localAvg: {
    payment: number;
    beneficiaries: number;
    score: number;
    em: { pct213: number; pct214: number; pct215: number };
  };
  programs: {
    ccm: { count: number; total: number };
    rpm: { count: number; total: number };
    bhi: { count: number; total: number };
    awv: { count: number; total: number };
  };
  topPerformer: {
    payment: number;
    score: number | null;
  };
}

function fmt$(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function pct(n: number) {
  return `${(n * 100).toFixed(0)}%`;
}

function ComparisonBar({
  label,
  you,
  avg,
  top,
  format = "dollar",
}: {
  label: string;
  you: number;
  avg: number;
  top: number;
  format?: "dollar" | "percent" | "number";
}) {
  const maxVal = Math.max(you, avg, top, 1);
  const yourWidth = (you / maxVal) * 100;
  const avgWidth = (avg / maxVal) * 100;
  const topWidth = (top / maxVal) * 100;

  const fmtVal = (v: number) =>
    format === "dollar"
      ? fmt$(v)
      : format === "percent"
      ? pct(v)
      : v.toLocaleString();

  const diff = you - avg;
  const isAhead = diff >= 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span
          className={`font-medium ${
            isAhead ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {isAhead ? "+" : ""}
          {format === "dollar"
            ? fmt$(diff)
            : format === "percent"
            ? `${(diff * 100).toFixed(0)}pp`
            : diff.toLocaleString()}{" "}
          vs avg
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#2F5EA8] w-6">You</span>
          <div className="flex-1 h-4 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2F5EA8] rounded-full transition-all duration-700"
              style={{ width: `${Math.max(yourWidth, 2)}%` }}
            />
          </div>
          <span className="text-xs text-white font-medium w-16 text-right">
            {fmtVal(you)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-secondary)] w-6">
            Avg
          </span>
          <div className="flex-1 h-4 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-200 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(avgWidth, 2)}%` }}
            />
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-medium w-16 text-right">
            {fmtVal(avg)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-400 w-6">Top</span>
          <div className="flex-1 h-4 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500/40 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(topWidth, 2)}%` }}
            />
          </div>
          <span className="text-xs text-emerald-400 font-medium w-16 text-right">
            {fmtVal(top)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CompetitionTab({ npi }: { npi: string }) {
  const [data, setData] = useState<CompetitionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/competition?npi=${npi}`);
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        setData(json);
      } catch {
        setError("Unable to load competition data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [npi]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3">
        <Loader2 className="h-5 w-5 text-[#2F5EA8] animate-spin" />
        <span className="text-sm text-[var(--text-secondary)]">
          Analyzing your competition...
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-[var(--text-secondary)]">
          {error || "No competition data available"}
        </p>
      </div>
    );
  }

  const { you, localAvg, programs, topPerformer } = data;
  const paymentDiff = you.payment - localAvg.payment;
  const isAheadOnPayment = paymentDiff >= 0;

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 flex-shrink-0">
            <Users className="h-6 w-6 text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">
              You vs {data.totalCompetitors - 1} other {data.specialty} providers
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              in {data.location}
            </p>
          </div>
        </div>

        {/* Rank badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="rounded-xl border border-[var(--border-light)] bg-[var(--bg)] p-3 text-center">
            <p className="text-2xl font-bold text-[#2F5EA8]">
              #{you.paymentRank}
            </p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1">
              Revenue Rank
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">
              of {data.totalCompetitors}
            </p>
          </div>
          {you.score != null && (
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--bg)] p-3 text-center">
              <p className="text-2xl font-bold text-[#2F5EA8]">
                #{you.scoreRank}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                Score Rank
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                of {data.totalCompetitors}
              </p>
            </div>
          )}
          <div className="rounded-xl border border-[var(--border-light)] bg-[var(--bg)] p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              {isAheadOnPayment ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <p
                className={`text-lg font-bold ${
                  isAheadOnPayment ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {fmt$(Math.abs(paymentDiff))}
              </p>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1">
              {isAheadOnPayment ? "Above" : "Below"} Avg
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-[var(--bg)] p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {fmt$(topPerformer.payment)}
            </p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1">
              Top Earner
            </p>
          </div>
        </div>
      </div>

      {/* Revenue + Patient Comparison */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-5 w-5 text-[#2F5EA8]" />
          <h3 className="text-base font-bold">Revenue Comparison</h3>
        </div>
        <ComparisonBar
          label="Total Medicare Payment"
          you={you.payment}
          avg={localAvg.payment}
          top={topPerformer.payment}
        />
        <ComparisonBar
          label="Medicare Patients"
          you={you.beneficiaries}
          avg={localAvg.beneficiaries}
          top={Math.max(you.beneficiaries, localAvg.beneficiaries * 1.5)}
          format="number"
        />
      </div>

      {/* E&M Distribution */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          <h3 className="text-base font-bold">E&M Coding vs Local Average</h3>
        </div>
        <div className="space-y-4">
          {[
            { code: "99213", you: you.em.pct213, avg: localAvg.em.pct213, color: "bg-yellow-400" },
            { code: "99214", you: you.em.pct214, avg: localAvg.em.pct214, color: "bg-blue-400" },
            { code: "99215", you: you.em.pct215, avg: localAvg.em.pct215, color: "bg-emerald-400" },
          ].map((row) => (
            <div key={row.code} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{row.code}</span>
                <div className="flex gap-4">
                  <span className="text-[#2F5EA8]">You: {pct(row.you)}</span>
                  <span className="text-[var(--text-secondary)]">
                    Avg: {pct(row.avg)}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <div className="flex-1 h-3 bg-white rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-[#2F5EA8]/40 rounded-full"
                    style={{ width: `${Math.max(row.you * 100, 1)}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 border-r-2 border-white/60"
                    style={{ width: `${row.avg * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {you.em.pct214 < localAvg.em.pct214 && (
          <div className="mt-4 rounded-lg bg-red-500/5 border border-red-500/20 p-3">
            <p className="text-xs text-red-300">
              <strong>Opportunity:</strong> Your 99214 rate ({pct(you.em.pct214)}) is
              below the local average ({pct(localAvg.em.pct214)}). Shifting just 10% of
              your 99213s could add significant revenue.
            </p>
          </div>
        )}
      </div>

      {/* Program Adoption */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-[#2F5EA8]" />
          <h3 className="text-base font-bold">
            Program Adoption vs Competition
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              name: "CCM",
              icon: HeartPulse,
              color: "rose",
              has: you.hasCCM,
              count: programs.ccm.count,
              total: programs.ccm.total,
            },
            {
              name: "RPM",
              icon: Activity,
              color: "sky",
              has: you.hasRPM,
              count: programs.rpm.count,
              total: programs.rpm.total,
            },
            {
              name: "BHI",
              icon: Brain,
              color: "purple",
              has: you.hasBHI,
              count: programs.bhi.count,
              total: programs.bhi.total,
            },
            {
              name: "AWV",
              icon: CalendarCheck,
              color: "teal",
              has: you.hasAWV,
              count: programs.awv.count,
              total: programs.awv.total,
            },
          ].map((prog) => (
            <div
              key={prog.name}
              className={`rounded-xl border p-4 ${
                prog.has
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : prog.count > 0
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-[var(--border-light)] bg-[var(--bg)]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <prog.icon className={`h-4 w-4 text-${prog.color}-400`} />
                  <span className="text-sm font-bold">{prog.name}</span>
                </div>
                {prog.has ? (
                  <span className="text-xs text-emerald-400 font-medium">
                    Active ✓
                  </span>
                ) : (
                  <span className="text-xs text-red-400 font-medium">
                    Not billing
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {prog.count} of {prog.total} competitors bill {prog.name}
                {!prog.has && prog.count > 0 && (
                  <span className="text-red-300 font-medium">
                    {" "}
                    — you&apos;re missing out
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6">
        <h3 className="text-base font-bold text-[#2F5EA8] mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Competitive Insights
        </h3>
        <ul className="space-y-2">
          {you.paymentRank > Math.ceil(data.totalCompetitors / 2) && (
            <li className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
              <Minus className="h-4 w-4 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
              You rank in the bottom half of {data.specialty} providers in{" "}
              {data.location} by revenue. The top earner makes{" "}
              {fmt$(topPerformer.payment)}/year.
            </li>
          )}
          {!you.hasCCM && programs.ccm.count > 0 && (
            <li className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
              <Minus className="h-4 w-4 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
              {programs.ccm.count} of {programs.ccm.total} competitors bill
              CCM. You don&apos;t — this is likely leaving revenue on the table.
            </li>
          )}
          {!you.hasRPM && programs.rpm.count > 0 && (
            <li className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
              <Minus className="h-4 w-4 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
              {programs.rpm.count} of {programs.rpm.total} competitors bill
              RPM. You&apos;re falling behind on remote monitoring revenue.
            </li>
          )}
          {!you.hasAWV && programs.awv.count > 0 && (
            <li className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
              <Minus className="h-4 w-4 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
              {programs.awv.count} of {programs.awv.total} competitors bill
              AWV. Annual Wellness Visits are low-hanging revenue fruit.
            </li>
          )}
          {you.em.pct214 < localAvg.em.pct214 && (
            <li className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
              <Minus className="h-4 w-4 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
              Your 99214 coding rate is below local peers. Review your documentation
              practices — you may be undercoding.
            </li>
          )}
          {you.paymentRank <= 3 && (
            <li className="text-sm text-emerald-400 flex items-start gap-2">
              <Trophy className="h-4 w-4 flex-shrink-0 mt-0.5" />
              You&apos;re a top performer in your area! You rank #{you.paymentRank}{" "}
              out of {data.totalCompetitors} providers.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
