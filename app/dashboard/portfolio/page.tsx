"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Plus,
  X,
  Search,
  TrendingUp,
  Loader2,
  Building2,
  ArrowRight,
  Download,
  Crown,
} from "lucide-react";
import { formatAcquisitionCurrency } from "@/lib/acquisition-utils";

interface PortfolioProvider {
  npi: string;
  name: string;
  specialty: string;
  state: string;
  city: string;
  currentRevenue: number;
  acquisitionScore: {
    overall: number;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    hexColor: string;
    estimatedUpsideRevenue: number;
    revenueIncreasePct: number;
    projectedOptimizedRevenue: number;
    breakdown: {
      upsidePotential: number;
      patientBaseValue: number;
      optimizationReadiness: number;
      marketPosition: number;
    };
  };
}

interface PortfolioResult {
  providers: PortfolioProvider[];
  totalCurrentRevenue: number;
  totalProjectedRevenue: number;
  totalUpside: number;
  avgAcquisitionScore: number;
  prioritizedActions: string[];
}

export default function PortfolioPage() {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan || "free";
  const [npis, setNpis] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<PortfolioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPaid = plan !== "free";

  const addField = () => {
    const max = isPaid ? 50 : 5;
    if (npis.length < max) setNpis([...npis, ""]);
  };

  const removeField = (i: number) => {
    if (npis.length <= 2) return;
    setNpis(npis.filter((_, idx) => idx !== i));
  };

  const updateNpi = (i: number, val: string) => {
    const next = [...npis];
    next[i] = val.replace(/\D/g, "").slice(0, 10);
    setNpis(next);
  };

  const analyze = async () => {
    const valid = npis.filter((n) => n.length === 10);
    if (valid.length < 2) {
      setError("Enter at least 2 valid 10-digit NPIs");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/acquire/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ npis: valid }),
      });
      if (!res.ok) throw new Error("Failed to analyze portfolio");
      const data = await res.json();
      setResults(data);
    } catch {
      setError("Failed to analyze portfolio. Please check your NPI numbers and try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!results) return;
    const headers = ["NPI", "Name", "Specialty", "City", "State", "Current Revenue", "Projected Revenue", "Upside", "Growth %", "Score", "Label"];
    const rows = results.providers.map((p) => [
      p.npi,
      p.name,
      p.specialty,
      p.city,
      p.state,
      p.currentRevenue,
      p.acquisitionScore.projectedOptimizedRevenue,
      p.acquisitionScore.estimatedUpsideRevenue,
      p.acquisitionScore.revenueIncreasePct,
      p.acquisitionScore.overall,
      p.acquisitionScore.label,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `npixray-portfolio-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Intelligence</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Analyze and track your practice portfolio
          </p>
        </div>
        {results && (
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-light)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* NPI Input */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Enter Practice NPIs</h2>
          <span className="text-xs text-[var(--text-secondary)]">
            {npis.filter((n) => n.length === 10).length} of {npis.length} valid
            {!isPaid && <span className="text-amber-600 ml-1">(Free: up to 5)</span>}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {npis.map((npi, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={npi}
                onChange={(e) => updateNpi(i, e.target.value)}
                placeholder={`NPI #${i + 1}`}
                className="flex-1 rounded-lg border border-[var(--border-light)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-zinc-400 focus:border-[#2F5EA8]/50 focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]/10 font-mono"
              />
              {npis.length > 2 && (
                <button
                  onClick={() => removeField(i)}
                  className="rounded-lg border border-[var(--border-light)] px-2 text-zinc-400 hover:text-red-500 hover:border-red-400/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={addField}
            disabled={npis.length >= (isPaid ? 50 : 5)}
            className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Add Practice ({isPaid ? "up to 50" : "up to 5"})
          </button>
          <button
            onClick={analyze}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F5EA8] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Analyze Portfolio
              </>
            )}
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </div>

      {/* Upgrade CTA for free users */}
      {!isPaid && (
        <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.03] p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-[#2F5EA8]" />
              <span className="text-sm font-semibold text-[#2F5EA8]">
                Upgrade for more
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-md">
              Intelligence plan unlocks up to 50 NPIs per portfolio, CSV exports,
              monthly tracking, and white-label reports.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all"
          >
            View Plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Building2 className="h-4 w-4 text-blue-500" />}
              label="Practices"
              value={String(results.providers.length)}
              color="blue"
            />
            <StatCard
              label="Current Revenue"
              value={formatAcquisitionCurrency(results.totalCurrentRevenue)}
              color="emerald"
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4 text-[#2F5EA8]" />}
              label="Total Upside"
              value={`+${formatAcquisitionCurrency(results.totalUpside)}`}
              color="primary"
            />
            <StatCard
              label="Avg Score"
              value={String(results.avgAcquisitionScore)}
              color="violet"
            />
          </div>

          {/* Optimization Roadmap */}
          {results.prioritizedActions.length > 0 && (
            <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.03] p-6">
              <h3 className="font-bold mb-4">Optimization Roadmap</h3>
              <ul className="space-y-2">
                {results.prioritizedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2F5EA8]/10 text-xs font-bold text-[#2F5EA8] flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practice Table */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-light)]">
              <h3 className="font-bold">Practice-by-Practice Analysis</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-light)] bg-[var(--bg)]">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">#</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Provider</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Specialty</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Current</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Upside</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Growth</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Score</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {results.providers.map((p, i) => (
                    <tr key={p.npi} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg)]/50 transition-colors">
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{i + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{p.city}, {p.state}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{p.specialty}</td>
                      <td className="px-4 py-3 text-right font-mono">
                        {formatAcquisitionCurrency(p.currentRevenue)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-600">
                        +{formatAcquisitionCurrency(p.acquisitionScore.estimatedUpsideRevenue)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[#2F5EA8]">
                        +{p.acquisitionScore.revenueIncreasePct}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
                          style={{
                            color: p.acquisitionScore.hexColor,
                            backgroundColor: `${p.acquisitionScore.hexColor}15`,
                          }}
                        >
                          {p.acquisitionScore.overall}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/scan/${p.npi}`}
                          className="text-xs text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Portfolio Totals */}
            <div className="px-6 py-4 border-t border-[var(--border-light)] bg-[var(--bg)] flex items-center justify-between flex-wrap gap-4">
              <span className="text-sm font-semibold">Portfolio Total</span>
              <div className="flex items-center gap-6 text-sm">
                <span>
                  <span className="text-[var(--text-secondary)]">Current: </span>
                  <span className="font-bold font-mono">
                    {formatAcquisitionCurrency(results.totalCurrentRevenue)}
                  </span>
                </span>
                <span>
                  <span className="text-[var(--text-secondary)]">Upside: </span>
                  <span className="font-bold font-mono text-emerald-600">
                    +{formatAcquisitionCurrency(results.totalUpside)}
                  </span>
                </span>
                <span>
                  <span className="text-[var(--text-secondary)]">Projected: </span>
                  <span className="font-bold font-mono text-[#2F5EA8]">
                    {formatAcquisitionCurrency(results.totalProjectedRevenue)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "emerald" | "primary" | "violet";
}) {
  const colorMap = {
    blue: "border-blue-500/20 bg-blue-500/5",
    emerald: "border-emerald-500/20 bg-emerald-500/5",
    primary: "border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04]",
    violet: "border-violet-500/20 bg-violet-500/5",
  };
  const textMap = {
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    primary: "text-[#2F5EA8]",
    violet: "text-violet-600",
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${textMap[color]}`}>{value}</p>
    </div>
  );
}
