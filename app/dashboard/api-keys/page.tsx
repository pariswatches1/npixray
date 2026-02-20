"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Key,
  Copy,
  Check,
  Plus,
  Crown,
  ArrowRight,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";

interface ApiKey {
  id: string;
  key_prefix: string;
  name: string;
  tier: string;
  requests: number;
  last_used: string | null;
  created_at: string;
  status: string;
}

export default function ApiKeysPage() {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan || "free";
  const isPaid = plan !== "free";

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    try {
      const res = await fetch("/api/dashboard/api-keys");
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch {
      // silently fail
    }
  }

  async function createKey() {
    if (!newKeyName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreatedKey(data.key);
        setNewKeyName("");
        fetchKeys();
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  async function revokeKey(id: string) {
    try {
      await fetch("/api/dashboard/api-keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchKeys();
    } catch {
      // handle error
    }
  }

  function copyKey() {
    navigator.clipboard.writeText(createdKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tierLimit = plan === "api" ? "10,000" : plan === "intelligence" || plan === "care" ? "1,000" : "100";

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">API Keys</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage API keys for programmatic access to NPIxray data
        </p>
      </div>

      {/* Rate limit info */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
        <div className="flex items-center gap-3 mb-3">
          <Key className="h-5 w-5 text-[#2F5EA8]" />
          <h2 className="font-semibold">API Access</h2>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm">
              <span className="font-medium">{tierLimit} requests/day</span>
              <span className="text-[var(--text-secondary)]"> on your current plan</span>
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Base URL: <code className="text-xs bg-[var(--bg)] rounded px-1.5 py-0.5 font-mono">https://npixray.com/api/v1/</code>
            </p>
          </div>
          <Link
            href="/developers"
            className="inline-flex items-center gap-1 text-sm text-[#2F5EA8] hover:underline"
          >
            API Docs
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Upgrade CTA for free users */}
      {!isPaid && (
        <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.03] p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-[#2F5EA8]" />
              <span className="text-sm font-semibold text-[#2F5EA8]">
                Upgrade for higher limits
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-md">
              API Pro plan gives you 10,000 requests/day, batch lookups, group scans, and full billing code breakdowns.
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

      {/* Create new key */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
        <h3 className="font-semibold mb-4">Create New Key</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g., My App)"
            className="flex-1 rounded-lg border border-[var(--border-light)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-zinc-400 focus:border-[#2F5EA8]/50 focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]/10"
          />
          <button
            onClick={createKey}
            disabled={loading || !newKeyName.trim()}
            className="flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        </div>

        {/* Show newly created key */}
        {createdKey && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-900 mb-2">
              Key created! Copy it now — you won&apos;t see it again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-white border border-emerald-200 px-3 py-2 text-sm font-mono text-emerald-800 select-all">
                {showKey ? createdKey : createdKey.slice(0, 7) + "..." + createdKey.slice(-4)}
              </code>
              <button
                onClick={() => setShowKey(!showKey)}
                className="rounded-lg border border-emerald-200 p-2 text-emerald-600 hover:bg-emerald-100 transition-colors"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={copyKey}
                className="rounded-lg border border-emerald-200 p-2 text-emerald-600 hover:bg-emerald-100 transition-colors"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Existing keys */}
      {keys.length > 0 && (
        <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-light)]">
            <h3 className="font-semibold">Your Keys</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-[var(--bg)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Key</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Requests</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Last Used</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} className="border-b border-[var(--border-light)] last:border-0">
                    <td className="px-4 py-3 font-medium">{k.name}</td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-[var(--bg)] rounded px-1.5 py-0.5 font-mono text-[var(--text-secondary)]">
                        {k.key_prefix}...
                      </code>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[var(--text-secondary)]">
                      {k.requests.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                      {k.last_used
                        ? new Date(k.last_used).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {k.status === "active" ? (
                        <button
                          onClick={() => revokeKey(k.id)}
                          className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)]">Revoked</span>
                      )}
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
