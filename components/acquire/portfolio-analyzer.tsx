"use client";

import { useState } from "react";
import { Plus, X, Search, TrendingUp, Loader2, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatAcquisitionCurrency } from "@/lib/acquisition-utils";

interface PortfolioResult {
  providers: {
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
  }[];
  totalCurrentRevenue: number;
  totalProjectedRevenue: number;
  totalUpside: number;
  avgAcquisitionScore: number;
  prioritizedActions: string[];
}

export function PortfolioAnalyzer() {
  const [npis, setNpis] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<PortfolioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addField = () => {
    if (npis.length < 20) setNpis([...npis, ""]);
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

  return (
    <div>
      {/* Input Section */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Enter Practice NPIs</h3>
          <span className="text-xs text-[var(--text-secondary)]">
            {npis.filter((n) => n.length === 10).length} of {npis.length} valid
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
                className="flex-1 rounded-lg border border-[var(--border-light)] bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:border-[#2F5EA8]/20/50 focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]/10 font-mono"
              />
              {npis.length > 2 && (
                <button
                  onClick={() => removeField(i)}
                  className="rounded-lg border border-[var(--border-light)] px-2 text-zinc-500 hover:text-red-400 hover:border-red-400/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {npis.length < 20 && (
            <button
              onClick={addField}
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Practice (up to 20)
            </button>
          )}
          <button
            onClick={analyze}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/10 disabled:opacity-50"
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

        {error && (
          <p className="text-sm text-red-400 mt-3">{error}</p>
        )}
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-[var(--text-secondary)]">Practices</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">{results.providers.length}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="text-xs text-[var(--text-secondary)] mb-2">Current Revenue</div>
              <p className="text-2xl font-bold text-emerald-400">
                {formatAcquisitionCurrency(results.totalCurrentRevenue)}
              </p>
            </div>
            <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[#2F5EA8]" />
                <span className="text-xs text-[var(--text-secondary)]">Total Upside</span>
              </div>
              <p className="text-2xl font-bold text-[#2F5EA8]">
                +{formatAcquisitionCurrency(results.totalUpside)}
              </p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <div className="text-xs text-[var(--text-secondary)] mb-2">Avg Acquisition Score</div>
              <p className="text-2xl font-bold text-violet-400">{results.avgAcquisitionScore}</p>
            </div>
          </div>

          {/* Prioritized Actions */}
          {results.prioritizedActions.length > 0 && (
            <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6">
              <h3 className="font-bold text-lg mb-4">Optimization Roadmap</h3>
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

          {/* Individual Practice Cards */}
          <div>
            <h3 className="font-bold text-lg mb-4">Practice-by-Practice Analysis</h3>
            <div className="space-y-4">
              {results.providers.map((p, i) => (
                <div
                  key={p.npi}
                  className="rounded-xl border border-[var(--border-light)] bg-white p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[var(--text-secondary)]">
                          #{i + 1}
                        </span>
                        <div>
                          <h4 className="font-bold">{p.name}</h4>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {p.specialty} &middot; {p.city}, {p.state} &middot; NPI: {p.npi}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold" style={{ color: p.acquisitionScore.hexColor }}>
                        {p.acquisitionScore.overall}
                      </span>
                      <p className="text-xs" style={{ color: p.acquisitionScore.hexColor }}>
                        {p.acquisitionScore.label}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div className="text-center rounded-lg bg-white p-2">
                      <p className="text-xs text-[var(--text-secondary)]">Current</p>
                      <p className="text-sm font-bold">{formatAcquisitionCurrency(p.currentRevenue)}</p>
                    </div>
                    <div className="text-center rounded-lg bg-white p-2">
                      <p className="text-xs text-[var(--text-secondary)]">Projected</p>
                      <p className="text-sm font-bold text-emerald-400">
                        {formatAcquisitionCurrency(p.acquisitionScore.projectedOptimizedRevenue)}
                      </p>
                    </div>
                    <div className="text-center rounded-lg bg-white p-2">
                      <p className="text-xs text-[var(--text-secondary)]">Upside</p>
                      <p className="text-sm font-bold text-[#2F5EA8]">
                        +{formatAcquisitionCurrency(p.acquisitionScore.estimatedUpsideRevenue)}
                      </p>
                    </div>
                    <div className="text-center rounded-lg bg-white p-2">
                      <p className="text-xs text-[var(--text-secondary)]">Growth</p>
                      <p className="text-sm font-bold text-[#2F5EA8]">
                        +{p.acquisitionScore.revenueIncreasePct}%
                      </p>
                    </div>
                  </div>

                  {/* Sub-score bars */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Upside", value: p.acquisitionScore.breakdown.upsidePotential },
                      { label: "Patients", value: p.acquisitionScore.breakdown.patientBaseValue },
                      { label: "Quick Wins", value: p.acquisitionScore.breakdown.optimizationReadiness },
                      { label: "Market", value: p.acquisitionScore.breakdown.marketPosition },
                    ].map((sub) => (
                      <div key={sub.label}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] text-[var(--text-secondary)]">{sub.label}</span>
                          <span className="text-[10px] font-bold">{sub.value}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[var(--bg)]/80 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#2F5EA8] transition-all"
                            style={{ width: `${sub.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/provider/${p.npi}`}
                    className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors mt-3 pt-3 border-t border-[var(--border-light)]"
                  >
                    Full provider analysis
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
