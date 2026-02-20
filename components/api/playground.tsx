"use client";

import { useState } from "react";
import { Loader2, Play, ChevronDown } from "lucide-react";

const ENDPOINTS = [
  { label: "Provider Lookup", path: "/api/v1/provider/{npi}", placeholder: "1306849450" },
  { label: "Provider Search", path: "/api/v1/search?name={query}&state=FL", placeholder: "Smith" },
  { label: "Specialty Benchmarks", path: "/api/v1/benchmarks/{specialty}", placeholder: "internal-medicine" },
  { label: "State Stats", path: "/api/v1/stats/{state}", placeholder: "FL" },
  { label: "All Benchmarks", path: "/api/v1/benchmarks", placeholder: "" },
  { label: "All States", path: "/api/v1/stats", placeholder: "" },
];

export function ApiPlayground() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [inputValue, setInputValue] = useState("1306849450");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const endpoint = ENDPOINTS[selectedIdx];

  const buildUrl = () => {
    const base = endpoint.path;
    if (base.includes("{npi}")) return base.replace("{npi}", inputValue);
    if (base.includes("{query}")) return base.replace("{query}", encodeURIComponent(inputValue));
    if (base.includes("{specialty}")) return base.replace("{specialty}", inputValue);
    if (base.includes("{state}")) return base.replace("{state}", inputValue);
    return base;
  };

  const handleRun = async () => {
    setLoading(true);
    setResponse("");
    setStatusCode(null);
    setResponseTime(null);

    const url = buildUrl();
    const start = performance.now();

    try {
      const res = await fetch(url);
      const elapsed = Math.round(performance.now() - start);
      setResponseTime(elapsed);
      setStatusCode(res.status);

      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setResponseTime(elapsed);
      setStatusCode(0);
      setResponse(JSON.stringify({ error: "Network error" }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border-light)] bg-white/80 overflow-hidden">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-b border-[var(--border-light)]">
        <select
          value={selectedIdx}
          onChange={(e) => {
            const idx = parseInt(e.target.value, 10);
            setSelectedIdx(idx);
            setInputValue(ENDPOINTS[idx].placeholder);
          }}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none"
        >
          {ENDPOINTS.map((ep, i) => (
            <option key={ep.path} value={i}>{ep.label}</option>
          ))}
        </select>

        <div className="flex-1 flex items-center gap-2">
          <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400 shrink-0">
            GET
          </span>
          <code className="text-xs text-[var(--text-secondary)] font-mono truncate">
            {buildUrl()}
          </code>
        </div>

        {endpoint.placeholder && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={endpoint.placeholder}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-3 text-sm font-mono w-full sm:w-48 focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none"
          />
        )}

        <button
          onClick={handleRun}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#2F5EA8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run
        </button>
      </div>

      {/* Response */}
      <div className="relative">
        {/* Status bar */}
        {statusCode !== null && (
          <div className="flex items-center gap-4 px-4 py-2 border-b border-[var(--border-light)] bg-[var(--bg)]/30">
            <span className={`text-xs font-mono font-bold ${
              statusCode >= 200 && statusCode < 300 ? "text-emerald-400" :
              statusCode >= 400 ? "text-red-400" : "text-yellow-400"
            }`}>
              {statusCode || "ERR"}
            </span>
            {responseTime !== null && (
              <span className="text-xs text-[var(--text-secondary)] font-mono">{responseTime}ms</span>
            )}
          </div>
        )}

        <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed max-h-[400px] overflow-y-auto">
          <code className="text-[var(--text-secondary)]">
            {response || "// Click Run to make an API request"}
          </code>
        </pre>
      </div>
    </div>
  );
}
