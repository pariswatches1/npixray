"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lock,
  LogIn,
  Users,
  DollarSign,
  TrendingUp,
  Mail,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface Lead {
  email: string;
  npi: string;
  providerName: string;
  specialty: string;
  totalMissedRevenue: number;
  timestamp: string;
  emailSent?: boolean;
}

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminLeadsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const json = await res.json();
      setLeads(json.leads || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Try to fetch on mount (in case cookie already exists)
  useEffect(() => {
    fetch("/api/admin/leads")
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
          return res.json();
        }
        return null;
      })
      .then((json) => {
        if (json) setLeads(json.leads || []);
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

      if (!res.ok) {
        setAuthError("Invalid password");
        return;
      }

      setAuthenticated(true);
      setPassword("");
      fetchLeads();
    } catch {
      setAuthError("Network error");
    } finally {
      setAuthLoading(false);
    }
  };

  // Stats
  const totalLeads = leads.length;
  const totalRevenue = leads.reduce((sum, l) => sum + (l.totalMissedRevenue || 0), 0);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const leadsThisWeek = leads.filter(
    (l) => new Date(l.timestamp) > weekAgo
  ).length;

  if (!authenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 mb-4">
              <Lock className="h-7 w-7 text-[#2F5EA8]" />
            </div>
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Enter the admin password to view leads
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
            {authError && (
              <p className="text-xs text-red-400 mb-3">{authError}</p>
            )}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] disabled:opacity-50"
            >
              {authLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Leads <span className="text-[#2F5EA8]">Dashboard</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Email captures from NPI scans
          </p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] hover:border-[#2F5EA8]/15 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06]">
              <Users className="h-4 w-4 text-[#2F5EA8]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Total Leads</p>
          </div>
          <p className="text-3xl font-bold font-mono text-[#2F5EA8]">{totalLeads}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06]">
              <DollarSign className="h-4 w-4 text-[#2F5EA8]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Total Revenue Scanned</p>
          </div>
          <p className="text-3xl font-bold font-mono text-[#2F5EA8]">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06]">
              <TrendingUp className="h-4 w-4 text-[#2F5EA8]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">This Week</p>
          </div>
          <p className="text-3xl font-bold font-mono text-[#2F5EA8]">{leadsThisWeek}</p>
        </div>
      </div>

      {/* Table */}
      {leads.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-12 text-center">
          <Mail className="h-12 w-12 text-[var(--text-secondary)]/30 mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">No leads yet.</p>
          <p className="text-sm text-[var(--text-secondary)]/60 mt-1">
            Leads will appear here when users submit their email on scan results.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-light)]">
                  <th className="text-left px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                    Provider
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                    NPI
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                    Specialty
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                    Missed Rev
                  </th>
                  <th className="text-center px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                    Email
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr
                    key={`${lead.email}-${lead.npi}-${i}`}
                    className="border-b border-[var(--border-light)] hover:bg-[var(--bg)]/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{lead.email}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {lead.providerName}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">
                      {lead.npi}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {lead.specialty}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[#2F5EA8]">
                      {formatCurrency(lead.totalMissedRevenue)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {lead.emailSent ? (
                        <span className="inline-flex items-center gap-1 text-green-400 text-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          Sent
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)]/50">
                          &mdash;
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-[var(--text-secondary)]">
                      {formatDate(lead.timestamp)}
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
