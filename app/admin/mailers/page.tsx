"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lock,
  LogIn,
  Loader2,
  Printer,
  Download,
  Mail,
  Users,
  QrCode,
  RefreshCw,
  Eye,
  Search,
  FileText,
} from "lucide-react";

interface InviteEntry {
  code: string;
  npi: string;
  providerName: string;
  specialty: string;
  state: string;
  city: string;
  totalGap: number;
  revenueScore: number;
  createdAt: string;
  views: number;
  emailCaptured: boolean;
  capturedEmail?: string;
  source: string;
}

interface InviteStats {
  total: number;
  views: number;
  emailsCaptured: number;
  conversionRate: string;
}

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MailerGenerator() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [invites, setInvites] = useState<InviteEntry[]>([]);
  const [stats, setStats] = useState<InviteStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());

  const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://npixray.com";

  const fetchInvites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invites");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const json = await res.json();
      setInvites(json.invites || []);
      if (json.stats) setStats(json.stats);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/invites")
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
          return res.json();
        }
        return null;
      })
      .then((json) => {
        if (json) {
          setInvites(json.invites || []);
          if (json.stats) setStats(json.stats);
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
      fetchInvites();
    } catch {
      setAuthError("Network error");
    } finally {
      setAuthLoading(false);
    }
  };

  const filteredInvites = invites.filter((inv) => {
    if (!filterText) return true;
    const lower = filterText.toLowerCase();
    return (
      inv.providerName.toLowerCase().includes(lower) ||
      inv.specialty.toLowerCase().includes(lower) ||
      inv.city.toLowerCase().includes(lower) ||
      inv.state.toLowerCase().includes(lower) ||
      inv.npi.includes(lower)
    );
  });

  const toggleSelect = (code: string) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCodes.size === filteredInvites.length) {
      setSelectedCodes(new Set());
    } else {
      setSelectedCodes(new Set(filteredInvites.map((i) => i.code)));
    }
  };

  const getMailerInvites = () => {
    if (selectedCodes.size > 0) {
      return filteredInvites.filter((i) => selectedCodes.has(i.code));
    }
    return filteredInvites;
  };

  const handlePrintMailers = () => {
    const mailerInvites = getMailerInvites();
    if (mailerInvites.length === 0) return;

    const mailerHtml = mailerInvites.map((inv) => {
      const inviteUrl = `${BASE_URL}/invite/${inv.code}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(inviteUrl)}`;
      const gap = formatCurrency(inv.totalGap);

      return `
<div style="page-break-after:always;width:6in;height:4.25in;border:1px solid #ccc;padding:0.5in;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;box-sizing:border-box;position:relative;">
  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
    <div>
      <div style="font-size:20px;font-weight:bold;color:#111;">
        NPI<span style="color:#E8A824;">xray</span>
      </div>
      <div style="font-size:9px;color:#888;margin-top:2px;">AI Revenue Intelligence</div>
    </div>
    <img src="${qrUrl}" alt="QR Code" style="width:100px;height:100px;" />
  </div>

  <!-- Personalized message -->
  <p style="font-size:15px;color:#111;margin:0 0 12px;line-height:1.5;">
    <strong>Dr. ${inv.providerName.split(" ")[0]},</strong>
  </p>
  <p style="font-size:13px;color:#333;margin:0 0 12px;line-height:1.6;">
    According to CMS data, <strong>${inv.specialty}</strong> practices in
    <strong>${inv.city}</strong> leave an average of
    <strong style="color:#E8A824;">${gap}</strong> on the table annually
    through under-utilized billing codes and care management programs.
  </p>
  <p style="font-size:13px;color:#333;margin:0 0 16px;line-height:1.6;">
    We&rsquo;ve prepared a free, personalized revenue analysis for your practice.
    Scan the QR code or visit:
  </p>

  <!-- CTA -->
  <div style="background:#111;border-radius:8px;padding:12px 16px;text-align:center;">
    <div style="font-size:14px;font-weight:600;color:#E8A824;letter-spacing:0.5px;">
      ${inviteUrl}
    </div>
  </div>

  <!-- Footer -->
  <div style="position:absolute;bottom:0.5in;left:0.5in;right:0.5in;display:flex;justify-content:space-between;align-items:center;">
    <span style="font-size:9px;color:#999;">Data from CMS.gov &bull; Free &bull; No login required</span>
    <span style="font-size:9px;color:#999;">npixray.com</span>
  </div>
</div>`;
    }).join("\n");

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>NPIxray Mailers</title>
  <style>
    @page { size: 6in 4.25in; margin: 0; }
    body { margin: 0; padding: 0; }
    @media print {
      div { page-break-after: always; }
      div:last-child { page-break-after: auto; }
    }
  </style>
</head>
<body>
${mailerHtml}
</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleExportCSV = () => {
    const mailerInvites = getMailerInvites();
    const header = "Code,NPI,Name,Specialty,State,City,Total Gap,Revenue Score,Invite URL,Views,Email Captured";
    const rows = mailerInvites.map((inv) =>
      [
        inv.code,
        inv.npi,
        `"${inv.providerName}"`,
        `"${inv.specialty}"`,
        inv.state,
        `"${inv.city}"`,
        inv.totalGap,
        inv.revenueScore,
        `${BASE_URL}/invite/${inv.code}`,
        inv.views,
        inv.emailCaptured ? "Yes" : "No",
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mailers-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Auth gate
  if (!authenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20 mb-4">
              <Lock className="h-7 w-7 text-gold" />
            </div>
            <h1 className="text-2xl font-bold">Mailer Generator</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Generate printable postcards with personalized invite links
            </p>
          </div>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full rounded-xl border border-dark-50 bg-dark-500 py-3.5 px-4 text-sm placeholder:text-[var(--text-secondary)]/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all mb-4"
              autoFocus
            />
            {authError && <p className="text-xs text-red-400 mb-3">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-semibold text-dark transition-all hover:bg-gold-300 disabled:opacity-50"
            >
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Mailer <span className="text-gold">Generator</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Generate personalized postcards with QR codes linking to invite pages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={filteredInvites.length === 0}
            className="flex items-center gap-2 rounded-lg border border-dark-50 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-gold hover:border-gold/30 transition-all disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={handlePrintMailers}
            disabled={filteredInvites.length === 0}
            className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-dark hover:bg-gold-300 transition-all disabled:opacity-50"
          >
            <Printer className="h-4 w-4" />
            Print Mailers ({selectedCodes.size > 0 ? selectedCodes.size : filteredInvites.length})
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                <Mail className="h-4 w-4 text-gold" />
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Total Invites</p>
            </div>
            <p className="text-3xl font-bold font-mono text-gold">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                <Eye className="h-4 w-4 text-gold" />
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Total Views</p>
            </div>
            <p className="text-3xl font-bold font-mono text-gold">{stats.views}</p>
          </div>
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                <Users className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Emails Captured</p>
            </div>
            <p className="text-3xl font-bold font-mono text-emerald-400">{stats.emailsCaptured}</p>
          </div>
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                <QrCode className="h-4 w-4 text-gold" />
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Conversion Rate</p>
            </div>
            <p className="text-3xl font-bold font-mono text-gold">{stats.conversionRate}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter by name, specialty, city, state, or NPI..."
            className="w-full rounded-lg border border-dark-50 bg-dark-500 py-2.5 pl-10 pr-4 text-sm placeholder:text-[var(--text-secondary)]/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all"
          />
        </div>
        <button
          onClick={fetchInvites}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-dark-50 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-gold hover:border-gold/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Invite Table */}
      {filteredInvites.length === 0 ? (
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-12 text-center">
          <FileText className="h-12 w-12 text-[var(--text-secondary)]/30 mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">No invite links yet.</p>
          <p className="text-sm text-[var(--text-secondary)]/60 mt-1">
            Generate invite links from the Outreach Dashboard first.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-50/50">
                  <th className="text-left px-3 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedCodes.size === filteredInvites.length && filteredInvites.length > 0}
                      onChange={toggleSelectAll}
                      className="accent-gold"
                    />
                  </th>
                  <th className="text-left px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Provider</th>
                  <th className="text-left px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Specialty</th>
                  <th className="text-left px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Location</th>
                  <th className="text-right px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Gap</th>
                  <th className="text-left px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Invite Link</th>
                  <th className="text-center px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Views</th>
                  <th className="text-center px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Captured</th>
                  <th className="text-right px-3 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvites.map((inv) => (
                  <tr
                    key={inv.code}
                    className={`border-b border-dark-50/30 hover:bg-dark-500/30 transition-colors ${
                      selectedCodes.has(inv.code) ? "bg-gold/5" : ""
                    }`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedCodes.has(inv.code)}
                        onChange={() => toggleSelect(inv.code)}
                        className="accent-gold"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium">{inv.providerName}</div>
                      <div className="text-xs text-[var(--text-secondary)] font-mono">{inv.npi}</div>
                    </td>
                    <td className="px-3 py-3 text-[var(--text-secondary)]">{inv.specialty}</td>
                    <td className="px-3 py-3 text-[var(--text-secondary)]">{inv.city}, {inv.state}</td>
                    <td className="px-3 py-3 text-right font-mono text-gold">{formatCurrency(inv.totalGap)}</td>
                    <td className="px-3 py-3">
                      <a
                        href={`/invite/${inv.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold hover:underline font-mono"
                      >
                        /invite/{inv.code}
                      </a>
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-[var(--text-secondary)]">{inv.views}</td>
                    <td className="px-3 py-3 text-center">
                      {inv.emailCaptured ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {inv.capturedEmail || "Yes"}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)]/50">&mdash;</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-[var(--text-secondary)]">{formatDate(inv.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="mt-12 rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
        <h2 className="text-lg font-bold mb-4">How Mailers Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
          <div className="p-4 rounded-lg border border-dark-50/50 bg-dark-500/30">
            <div className="text-gold font-bold text-lg mb-1">1</div>
            <p className="font-medium mb-1">Generate Invites</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Filter providers in the Outreach Dashboard and click &quot;Generate Invite Links&quot;
            </p>
          </div>
          <div className="p-4 rounded-lg border border-dark-50/50 bg-dark-500/30">
            <div className="text-gold font-bold text-lg mb-1">2</div>
            <p className="font-medium mb-1">Print Mailers</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Select invites here and click Print. Each postcard has a unique QR code and personalized message.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-dark-50/50 bg-dark-500/30">
            <div className="text-gold font-bold text-lg mb-1">3</div>
            <p className="font-medium mb-1">Mail Postcards</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Print on 6x4.25&quot; postcard stock and mail to provider addresses from the CSV export.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-dark-50/50 bg-dark-500/30">
            <div className="text-gold font-bold text-lg mb-1">4</div>
            <p className="font-medium mb-1">Track Results</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Monitor views and email captures here. Leads auto-enroll in the email drip sequence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
