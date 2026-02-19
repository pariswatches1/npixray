"use client";

import { useState, useCallback } from "react";
import { Plus, X, ClipboardPaste, Search, Building2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface NpiField {
  value: string;
  name: string | null;
  specialty: string | null;
  loading: boolean;
  error: boolean;
}

interface NpiInputFormProps {
  onSubmit: (npis: string[], practiceName: string) => void;
  loading?: boolean;
}

export function NpiInputForm({ onSubmit, loading = false }: NpiInputFormProps) {
  const [mode, setMode] = useState<"grid" | "paste">("grid");
  const [practiceName, setPracticeName] = useState("");
  const [fields, setFields] = useState<NpiField[]>([
    { value: "", name: null, specialty: null, loading: false, error: false },
    { value: "", name: null, specialty: null, loading: false, error: false },
  ]);
  const [pasteText, setPasteText] = useState("");

  // Look up a single NPI via the existing /api/npi endpoint
  const lookupNpi = useCallback(async (npi: string, index: number) => {
    if (!/^\d{10}$/.test(npi)) return;

    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], loading: true, error: false, name: null, specialty: null };
      return next;
    });

    try {
      const res = await fetch(`/api/npi?number=${npi}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      const provider = data.results?.[0] || data;

      setFields((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          loading: false,
          name: provider.fullName || `${provider.firstName} ${provider.lastName}`.trim() || null,
          specialty: provider.specialty || null,
          error: false,
        };
        return next;
      });
    } catch {
      setFields((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], loading: false, error: true };
        return next;
      });
    }
  }, []);

  const updateField = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], value: cleaned, name: null, specialty: null, error: false };
      return next;
    });

    // Auto-lookup when 10 digits entered
    if (cleaned.length === 10) {
      lookupNpi(cleaned, index);
    }
  };

  const addField = () => {
    if (fields.length < 50) {
      setFields([...fields, { value: "", name: null, specialty: null, loading: false, error: false }]);
    }
  };

  const removeField = (index: number) => {
    if (fields.length <= 2) return;
    setFields(fields.filter((_, i) => i !== index));
  };

  // Parse pasted text for NPIs
  const parsePaste = () => {
    const matches = pasteText.match(/\d{10}/g);
    if (!matches || matches.length === 0) return;

    const unique = [...new Set(matches)];
    const newFields: NpiField[] = unique.map((npi) => ({
      value: npi,
      name: null,
      specialty: null,
      loading: false,
      error: false,
    }));

    setFields(newFields);
    setMode("grid");

    // Look up all parsed NPIs
    newFields.forEach((field, i) => lookupNpi(field.value, i));
  };

  const validNpis = fields.filter((f) => /^\d{10}$/.test(f.value)).map((f) => f.value);
  const uniqueNpis = [...new Set(validNpis)];
  const canSubmit = uniqueNpis.length >= 2 && !loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSubmit(uniqueNpis, practiceName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Practice Name (optional) */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Practice Name <span className="text-[var(--text-secondary)]">(optional)</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={practiceName}
            onChange={(e) => setPracticeName(e.target.value)}
            placeholder="e.g., Valley Medical Associates"
            className="w-full rounded-xl bg-dark-800 border border-dark-50/30 pl-10 pr-4 py-3 text-white placeholder:text-[var(--text-secondary)]/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
          />
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("grid")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "grid"
              ? "bg-gold/15 text-gold border border-gold/30"
              : "bg-dark-800 text-[var(--text-secondary)] border border-dark-50/20 hover:border-dark-50/40"
          }`}
        >
          <Search className="h-4 w-4" />
          Enter NPIs
        </button>
        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "paste"
              ? "bg-gold/15 text-gold border border-gold/30"
              : "bg-dark-800 text-[var(--text-secondary)] border border-dark-50/20 hover:border-dark-50/40"
          }`}
        >
          <ClipboardPaste className="h-4 w-4" />
          Paste List
        </button>
      </div>

      {mode === "paste" ? (
        /* Paste Mode */
        <div className="space-y-3">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={6}
            placeholder="Paste NPIs here — separated by commas, spaces, tabs, or newlines.&#10;&#10;Example:&#10;1234567890, 2345678901&#10;3456789012"
            className="w-full rounded-xl bg-dark-800 border border-dark-50/30 p-4 text-white placeholder:text-[var(--text-secondary)]/40 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 resize-none"
          />
          <button
            type="button"
            onClick={parsePaste}
            disabled={!pasteText.trim()}
            className="w-full rounded-xl bg-gold/15 border border-gold/30 text-gold py-3 font-semibold hover:bg-gold/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Parse NPIs
          </button>
        </div>
      ) : (
        /* Grid Mode */
        <div className="space-y-3">
          <div className="grid gap-3">
            {fields.map((field, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 text-xs text-[var(--text-secondary)] text-right font-mono shrink-0">
                  {i + 1}.
                </span>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={field.value}
                    onChange={(e) => updateField(i, e.target.value)}
                    placeholder="10-digit NPI"
                    className="w-full rounded-lg bg-dark-800 border border-dark-50/30 px-4 py-2.5 text-white font-mono text-sm placeholder:text-[var(--text-secondary)]/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  />
                  {/* Status indicator */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {field.loading && <Loader2 className="h-4 w-4 text-gold animate-spin" />}
                    {field.name && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    {field.error && <AlertCircle className="h-4 w-4 text-red-400" />}
                  </div>
                </div>

                {/* Provider preview */}
                <div className="hidden sm:block w-48 truncate">
                  {field.name ? (
                    <div className="text-xs">
                      <span className="text-white">{field.name}</span>
                      {field.specialty && (
                        <span className="text-[var(--text-secondary)] ml-1">· {field.specialty}</span>
                      )}
                    </div>
                  ) : field.error ? (
                    <span className="text-xs text-red-400">Not found</span>
                  ) : null}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeField(i)}
                  disabled={fields.length <= 2}
                  className="p-1 text-[var(--text-secondary)] hover:text-red-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {fields.length < 50 && (
            <button
              type="button"
              onClick={addField}
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-gold transition-colors px-7"
            >
              <Plus className="h-4 w-4" />
              Add Provider
            </button>
          )}
        </div>
      )}

      {/* Summary + Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-sm text-[var(--text-secondary)]">
          {uniqueNpis.length} valid NPI{uniqueNpis.length !== 1 ? "s" : ""} entered
          {uniqueNpis.length < 2 && (
            <span className="text-[var(--text-secondary)]/60 ml-1">(minimum 2)</span>
          )}
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-3 font-bold text-dark-900 hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              Scan Practice
            </>
          )}
        </button>
      </div>
    </form>
  );
}
