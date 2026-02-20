"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lock,
  LogIn,
  Loader2,
  Key,
  Plus,
  Trash2,
  RefreshCw,
  Users,
  Activity,
  Star,
  Copy,
  Check,
} from "lucide-react";

interface ApiKeyEntry {
  key: string;
  name: string;
  email: string;
  tier: "free" | "pro";
  createdAt: string;
  lastUsedAt?: string;
  totalRequests: number;
  active: boolean;
}

interface Stats {
  total: number;
  active: number;
  pro: number;
  totalRequests: number;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function maskKey(key: string): string {
  return key.slice(0, 7) + "..." + key.slice(-4);
}

export default function ApiKeysAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [keys, setKeys] = useState<ApiKeyEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTier, setNewTier] = useState<"free" | "pro">("free");
  const [creating, setCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/api-keys");
      if (res.status === 401) { setAuthenticated(false); return; }
      const json = await res.json();
      setKeys(json.keys || []);
      if (json.stats) setStats(json.stats);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetch("/api/admin/api-keys")
      .then((res) => {
        if (res.ok) { setAuthenticated(true); return res.json(); }
        return null;
      })
      .then((json) => {
        if (json) { setKeys(json.keys || []); if (json.stats) setStats(json.stats); }
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
      fetchKeys();
    } catch { setAuthError("Network error"); } finally { setAuthLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    setCreating(true);
    setCreatedKey(null);
    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail, tier: newTier }),
      });
      if (res.ok) {
        const json = await res.json();
        setCreatedKey(json.key?.key || null);
        setNewName("");
        setNewEmail("");
        fetchKeys();
      }
    } catch {} finally { setCreating(false); }
  };

  const handleRevoke = async (key: string) => {
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    try {
      await fetch("/api/admin/api-keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      fetchKeys();
    } catch {}
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!authenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 mb-4">
              <Lock className="h-7 w-7 text-[#2F5EA8]" />
            </div>
            <h1 className="text-2xl font-bold">API Key Manager</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Manage API keys and usage</p>
          </div>
          <form onSubmit={handleAuth}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password" className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3.5 px-4 text-sm placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none transition-all mb-4" autoFocus />
            {authError && <p className="text-xs text-red-400 mb-3">{authError}</p>}
            <button type="submit" disabled={authLoading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] disabled:opacity-50">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">API <span className="text-[#2F5EA8]">Keys</span></h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Generate and manage API keys</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchKeys} disabled={loading} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] hover:border-[#2F5EA8]/15 transition-all disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all">
            <Plus className="h-4 w-4" />
            New Key
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
            <div className="flex items-center gap-3 mb-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06]"><Key className="h-4 w-4 text-[#2F5EA8]" /></div><p className="text-sm text-[var(--text-secondary)]">Total Keys</p></div>
            <p className="text-3xl font-bold font-mono text-[#2F5EA8]">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
            <div className="flex items-center gap-3 mb-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10"><Users className="h-4 w-4 text-emerald-400" /></div><p className="text-sm text-[var(--text-secondary)]">Active</p></div>
            <p className="text-3xl font-bold font-mono text-emerald-400">{stats.active}</p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
            <div className="flex items-center gap-3 mb-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06]"><Star className="h-4 w-4 text-[#2F5EA8]" /></div><p className="text-sm text-[var(--text-secondary)]">Pro Keys</p></div>
            <p className="text-3xl font-bold font-mono text-[#2F5EA8]">{stats.pro}</p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
            <div className="flex items-center gap-3 mb-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06]"><Activity className="h-4 w-4 text-[#2F5EA8]" /></div><p className="text-sm text-[var(--text-secondary)]">Total Requests</p></div>
            <p className="text-3xl font-bold font-mono text-[#2F5EA8]">{stats.totalRequests.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Create New API Key</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="App name" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none" required />
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="developer@company.com" className="rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none" required />
            <select value={newTier} onChange={(e) => setNewTier(e.target.value as "free" | "pro")} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none">
              <option value="free">Free (100/day)</option>
              <option value="pro">Pro (10K/day)</option>
            </select>
            <button type="submit" disabled={creating} className="flex items-center justify-center gap-2 rounded-lg bg-[#2F5EA8] py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all disabled:opacity-50">
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
              Generate
            </button>
          </form>
          {createdKey && (
            <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-sm font-semibold text-emerald-400 mb-2">API Key Created! Copy it now — it won&apos;t be shown again.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono text-[#2F5EA8] bg-[var(--bg)] rounded-lg px-3 py-2">{createdKey}</code>
                <button onClick={() => copyKey(createdKey)} className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] hover:border-[#2F5EA8]/15 transition-all">
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Keys table */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-light)]">
                <th className="text-left px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Key</th>
                <th className="text-left px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Name</th>
                <th className="text-left px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Email</th>
                <th className="text-center px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Tier</th>
                <th className="text-right px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Requests</th>
                <th className="text-right px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Last Used</th>
                <th className="text-center px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Status</th>
                <th className="text-right px-4 py-3 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                    No API keys yet. Click &quot;New Key&quot; to create one.
                  </td>
                </tr>
              ) : keys.map((k) => (
                <tr key={k.key} className="border-b border-[var(--border-light)] hover:bg-[var(--bg)]/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#2F5EA8]">{maskKey(k.key)}</td>
                  <td className="px-4 py-3 font-medium">{k.name}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{k.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-bold uppercase ${k.tier === "pro" ? "text-[#2F5EA8]" : "text-[var(--text-secondary)]"}`}>
                      {k.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{k.totalRequests.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs text-[var(--text-secondary)]">
                    {k.lastUsedAt ? formatDate(k.lastUsedAt) : "Never"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {k.active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Active</span>
                    ) : (
                      <span className="text-xs text-red-400">Revoked</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {k.active && (
                      <button onClick={() => handleRevoke(k.key)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
