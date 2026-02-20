"use client";

/**
 * Inline Scanner Widget — Layer 5 of the Differentiation Engine.
 *
 * A mini NPI scanner pre-filled with state/specialty context.
 * Creates unique interactive content per page that Google values
 * because users engage differently on each page.
 */

import { useState } from "react";
import { Search, ArrowRight, Loader2, Zap } from "lucide-react";
import Link from "next/link";

interface InlineScannerProps {
  state?: string;
  specialty?: string;
  city?: string;
}

export function InlineScanner({ state, specialty, city }: InlineScannerProps) {
  const [npi, setNpi] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [mode, setMode] = useState<"npi" | "name">("npi");

  const contextLabel = [specialty, city, state].filter(Boolean).join(", ");

  async function handleSearch() {
    if (mode === "npi") {
      if (npi.length !== 10) return;
      window.location.href = `/scan/${npi}`;
      return;
    }

    // Name search with state context
    if (!npi.trim()) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ name: npi.trim() });
      if (state) params.set("state", state);
      const res = await fetch(`/api/npi/search?${params}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results?.slice(0, 5) || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-[#2F5EA8]" />
        <h3 className="text-sm font-semibold">
          Scan a Provider{contextLabel ? ` in ${contextLabel}` : ""}
        </h3>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg bg-[var(--bg)] w-fit">
        <button
          onClick={() => { setMode("npi"); setResults(null); }}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mode === "npi"
              ? "bg-[#2F5EA8] text-white shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          By NPI
        </button>
        <button
          onClick={() => { setMode("name"); setResults(null); }}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mode === "name"
              ? "bg-[#2F5EA8] text-white shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          By Name
        </button>
      </div>

      {/* Search input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={npi}
          onChange={(e) => {
            const val = mode === "npi" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value;
            setNpi(val);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={mode === "npi" ? "Enter 10-digit NPI" : `Search provider name${state ? ` in ${state}` : ""}`}
          className="flex-1 rounded-lg border border-[var(--border-light)] bg-white px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-zinc-400 focus:border-[#2F5EA8]/50 focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]/10 font-mono"
        />
        <button
          onClick={handleSearch}
          disabled={loading || (mode === "npi" ? npi.length !== 10 : !npi.trim())}
          className="flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Scan
        </button>
      </div>

      {/* Quick results (name search) */}
      {results && results.length > 0 && (
        <div className="mt-3 space-y-1">
          {results.map((r: any) => (
            <Link
              key={r.npi || r.number}
              href={`/scan/${r.npi || r.number}`}
              className="flex items-center justify-between rounded-lg border border-[var(--border-light)] p-3 hover:border-[#2F5EA8]/15 hover:bg-[var(--bg)] transition-all group"
            >
              <div>
                <p className="text-sm font-medium group-hover:text-[#2F5EA8] transition-colors">
                  {r.name || `${r.basic?.first_name} ${r.basic?.last_name}`}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {r.specialty || r.taxonomies?.[0]?.desc} · NPI: {r.npi || r.number}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[#2F5EA8] transition-colors" />
            </Link>
          ))}
        </div>
      )}

      {results && results.length === 0 && (
        <p className="mt-3 text-xs text-[var(--text-secondary)]">
          No providers found. Try a different search.
        </p>
      )}
    </div>
  );
}
