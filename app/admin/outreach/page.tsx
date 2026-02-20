"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lock,
  LogIn,
  Loader2,
  Search,
  Download,
  Users,
  DollarSign,
  TrendingDown,
  RefreshCw,
  Filter,
  Mail,
  Link as LinkIcon,
  ChevronDown,
} from "lucide-react";

interface OutreachProvider {
  npi: string;
  name: string;
  credential: string;
  specialty: string;
  state: string;
  city: string;
  totalPayment: number;
  totalPatients: number;
  revenueScore: number;
  totalGap: number;
  ccmGap: number;
}

interface Filters {
  states: { abbr: string; name: string }[];
  specialties: string[];
}

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-[#2F5EA8]";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export default function OutreachDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [providers, setProviders] = useState<OutreachProvider[]>([]);
  const [filters, setFilters] = useState<Filters>({ states: [], specialties: [] });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Filter state
  const [filterState, setFilterState] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [minScore, setMinScore] = useState("0");
  const [maxScore, setMaxScore] = useState("100");
  const [minGap, setMinGap] = useState("0");
  const [minCCMGap, setMinCCMGap] = useState("0");
  const [selectedNPIs, setSelectedNPIs] = useState<Set<string>>(new Set());

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (filterState) params.set("state", filterState);
    if (filterCity) params.set("city", filterCity);
    if (filterSpecialty) params.set("specialty", filterSpecialty);
    if (minScore && minScore !== "0") params.set("minScore", minScore);
    if (maxScore && maxScore !== "100") params.set("maxScore", maxScore);
    if (minGap && minGap !== "0") params.set("minGap", minGap);
    if (minCCMGap && minCCMGap !== "0") params.set("minCCMGap", minCCMGap);
    return params.toString();
  }, [filterState, filterCity, filterSpecialty, minScore, maxScore, minGap, minCCMGap]);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQueryString();
      const res = await fetch(`/api/admin/outreach?${qs}`);
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const json = await res.json();
      setProviders(json.results || []);
      if (json.filters) setFilters(json.filters);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/admin/outreach")
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
          return res.json();
        }
        return null;
      })
      .then((json) => {
        if (json) {
          setProviders(json.results || []);
          if (json.filters) setFilters(json.filters);
        }
      })
      .catch(() => {});
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { setAuthError("Invalid password"); return; }
      setAuthenticated(true);
      setPassword("");
      fetchProviders();
    } catch {
      setAuthError("Network error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleExportCSV = () => {
    const qs = buildQueryString();
    window.open(`/api/admin/outreach?${qs}&format=csv`, "_blank");
  };

  const handleGenerateInvites = async () => {
    const npis = selectedNPIs.size > 0
      ? providers.filter((p) => selectedNPIs.has(p.npi))
      : providers;

    if (npis.length === 0) return;

    setGenerating(true);
    try {
      const payload = npis.map((p) => ({
        npi: p.npi,
        name: p.name,
        specialty: p.specialty,
        state: p.state,
        city: p.city,
        totalGap: p.totalGap,
        revenueScore: p.revenueScore,
      }));

      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        alert(`Created ${json.created} invite links. View them in the Mailers dashboard.`);
      }
    } catch {
      alert("Failed to generate invite links.");
    } finally {
      setGenerating(false);
    }
  };

  const toggleSelect = (npi: string) => {
    setSelectedNPIs((prev) => {
      const next = new Set(prev);
      if (next.has(npi)) next.delete(npi);
      else next.add(npi);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedNPIs.size === providers.length) {
      setSelectedNPIs(new Set());
    } else {
      setSelectedNPIs(new Set(providers.map((p) => p.npi)));
    }
  };

  // ── Auth gate ────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 mb-4">
              <Lock className="h-7 w-7 text-[#2F5EA8]" />
            </div>
            <h1 className="text-2xl font-bold">Outreach Dashboard</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Enter admin password to access provider outreach tools
            </p>
          </div>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3.5 px-4 text-sm placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none transition-all mb-4"
              autoFocus
            />
            {authError && <p className="text-xs text-red-400 mb-3">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] disabled:opacity-50"
            >
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Stats ────────────────────────────────────────────────
  const totalGap = providers.reduce((sum, p) => sum + p.totalGap, 0);
  const avgScore = providers.length > 0
    ? Math.round(providers.reduce((sum, p) => sum + p.revenueScore, 0) / providers.length)
    : 0;
  const lowScoreCount = providers.filter((p) => p.revenueScore < 50).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Outreach <span className="text-[#2F5EA8]">Dashboard</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Filter providers by revenue gaps for targeted outreach
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={providers.length === 0}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] hover:border-[#2F5EA8]/15 transition-all disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={handleGenerateInvites}
            disabled={providers.length === 0 || generating}
            className="flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
            Generate Invite Links ({selectedNPIs.size > 0 ? selectedNPIs.size : providers.length})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06]">
              <Users className="h-4 w-4 text-[#2F5EA8]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Providers</p>
          </div>
          <p className="text-3xl font-bold font-mono text-[#2F5EA8]">{providers.length.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06]">
              <DollarSign className="h-4 w-4 text-[#2F5EA8]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Total Revenue Gap</p>
          </div>
          <p className="text-3xl font-bold font-mono text-[#2F5EA8]">{formatCurrency(totalGap)}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06]">
              <TrendingDown className="h-4 w-4 text-[#2F5EA8]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Avg Revenue Score</p>
          </div>
          <p className={`text-3xl font-bold font-mono ${scoreColor(avgScore)}`}>{avgScore}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
              <TrendingDown className="h-4 w-4 text-red-400" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Score &lt; 50</p>
          </div>
          <p className="text-3xl font-bold font-mono text-red-400">{lowScoreCount.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-[#2F5EA8]" />
          <p className="text-sm font-semibold">Filter Providers</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1 block">State</label>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none"
            >
              <option value="">All States</option>
              {filters.states.map((s) => (
                <option key={s.abbr} value={s.abbr}>{s.name} ({s.abbr})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1 block">City</label>
            <input
              type="text"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              placeholder="e.g. Miami"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1 block">Specialty</label>
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none"
            >
              <option value="">All Specialties</option>
              {filters.specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1 block">Revenue Score Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                placeholder="0"
                min={0}
                max={100}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm font-mono focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none"
              />
              <span className="text-[var(--text-secondary)]">–</span>
              <input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                placeholder="100"
                min={0}
                max={100}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm font-mono focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1 block">Min Total Gap ($)</label>
            <input
              type="number"
              value={minGap}
              onChange={(e) => setMinGap(e.target.value)}
              placeholder="0"
              min={0}
              step={10000}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm font-mono focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1 block">Min CCM Gap ($)</label>
            <input
              type="number"
              value={minCCMGap}
              onChange={(e) => setMinCCMGap(e.target.value)}
              placeholder="0"
              min={0}
              step={10000}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm font-mono focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchProviders}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#2F5EA8] py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </button>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterState("");
                setFilterCity("");
                setFilterSpecialty("");
                setMinScore("0");
                setMaxScore("100");
                setMinGap("0");
                setMinCCMGap("0");
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] py-2.5 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] hover:border-[#2F5EA8]/15 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      {providers.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-12 text-center">
          <Search className="h-12 w-12 text-[var(--text-secondary)]/30 mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">No providers found.</p>
          <p className="text-sm text-[var(--text-secondary)]/60 mt-1">
            Adjust your filters and click Search.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-light)]">
                  <th className="text-left px-3 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedNPIs.size === providers.length && providers.length > 0}
                      onChange={toggleSelectAll}
                      className="accent-[#2F5EA8]"
                    />
                  </th>
                  <th className="text-left px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">NPI</th>
                  <th className="text-left px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Name</th>
                  <th className="text-left px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Specialty</th>
                  <th className="text-left px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Location</th>
                  <th className="text-right px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Score</th>
                  <th className="text-right px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Total Gap</th>
                  <th className="text-right px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">CCM Gap</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr
                    key={p.npi}
                    className={`border-b border-[var(--border-light)] hover:bg-[var(--bg)]/30 transition-colors ${
                      selectedNPIs.has(p.npi) ? "bg-[#2F5EA8]/[0.04]" : ""
                    }`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedNPIs.has(p.npi)}
                        onChange={() => toggleSelect(p.npi)}
                        className="accent-[#2F5EA8]"
                      />
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-[var(--text-secondary)]">{p.npi}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium">{p.name}</div>
                      {p.credential && (
                        <div className="text-xs text-[var(--text-secondary)]">{p.credential}</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-[var(--text-secondary)]">{p.specialty}</td>
                    <td className="px-3 py-3 text-[var(--text-secondary)]">
                      {p.city}, {p.state}
                    </td>
                    <td className={`px-3 py-3 text-right font-mono font-bold ${scoreColor(p.revenueScore)}`}>
                      {p.revenueScore}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-[#2F5EA8]">
                      {formatCurrency(p.totalGap)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-orange-400">
                      {p.ccmGap > 0 ? formatCurrency(p.ccmGap) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
