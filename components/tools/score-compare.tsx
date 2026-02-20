"use client";

import { useState } from "react";
import { Plus, Trash2, BarChart3, Loader2 } from "lucide-react";
import { RevenueScoreGauge } from "@/components/score/revenue-score-gauge";
import { ScoreBreakdown } from "@/components/score/score-breakdown";
import type { ScoreBreakdown as ScoreBreakdownType } from "@/lib/revenue-score";

interface ProviderScore {
  provider: { npi: string; name: string; specialty: string; state: string; city: string };
  score: { overall: number; label: string; hexColor: string; percentile: number; breakdown: ScoreBreakdownType };
}

export function ScoreCompare() {
  const [npis, setNpis] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<(ProviderScore | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addField = () => {
    if (npis.length < 5) setNpis([...npis, ""]);
  };

  const removeField = (i: number) => {
    if (npis.length > 2) setNpis(npis.filter((_, idx) => idx !== i));
  };

  const updateNpi = (i: number, val: string) => {
    const next = [...npis];
    next[i] = val.replace(/\D/g, "").slice(0, 10);
    setNpis(next);
  };

  const compare = async () => {
    const valid = npis.filter((n) => n.length === 10);
    if (valid.length < 2) {
      setError("Enter at least 2 valid 10-digit NPIs");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fetches = valid.map((npi) =>
        fetch(`/api/score?npi=${npi}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      );
      const data = await Promise.all(fetches);
      setResults(data);
      if (data.every((d) => d === null)) {
        setError("No providers found for the given NPIs");
      }
    } catch {
      setError("Failed to fetch scores");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Input Section */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6 mb-8">
        <div className="space-y-3 mb-4">
          {npis.map((npi, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-secondary)] w-4">{i + 1}.</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 10-digit NPI"
                value={npi}
                onChange={(e) => updateNpi(i, e.target.value)}
                className="flex-1 rounded-lg border border-[var(--border-light)] bg-white px-4 py-2.5 text-sm font-mono placeholder:text-[var(--text-secondary)] focus:border-[#2F5EA8]/20/50 focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]/10"
              />
              {npis.length > 2 && (
                <button
                  onClick={() => removeField(i)}
                  className="p-2 text-[var(--text-secondary)] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {npis.length < 5 && (
            <button
              onClick={addField}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Provider
            </button>
          )}
          <button
            onClick={compare}
            disabled={loading}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
            Compare Scores
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((r, i) => {
            if (!r) {
              return (
                <div
                  key={i}
                  className="rounded-xl border border-[var(--border-light)] bg-[var(--bg)]/20 p-6 text-center"
                >
                  <p className="text-sm text-[var(--text-secondary)]">
                    NPI {npis[i]} not found
                  </p>
                </div>
              );
            }
            return (
              <div
                key={r.provider.npi}
                className="rounded-xl border border-[var(--border-light)] bg-white p-6"
              >
                <div className="text-center mb-4">
                  <p className="font-semibold truncate">{r.provider.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {r.provider.specialty} &middot; {r.provider.city}, {r.provider.state}
                  </p>
                </div>
                <div className="flex justify-center mb-4">
                  <RevenueScoreGauge
                    score={r.score.overall}
                    size="md"
                    animate={true}
                    percentile={r.score.percentile}
                    specialty={r.provider.specialty}
                  />
                </div>
                <ScoreBreakdown breakdown={r.score.breakdown} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
