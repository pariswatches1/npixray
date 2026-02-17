"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileCode2, Search, ArrowRight, Info } from "lucide-react";

const POPULAR_CODES = [
  { code: "99213", desc: "Office visit, established patient (level 3)" },
  { code: "99214", desc: "Office visit, established patient (level 4)" },
  { code: "99215", desc: "Office visit, established patient (level 5)" },
  { code: "99490", desc: "Chronic Care Management, initial 20 min" },
  { code: "99439", desc: "CCM add-on, each additional 20 min" },
  { code: "99453", desc: "RPM device setup & patient education" },
  { code: "99454", desc: "RPM device supply, per 30 days" },
  { code: "99457", desc: "RPM treatment management, initial 20 min" },
  { code: "99458", desc: "RPM treatment management, additional 20 min" },
  { code: "G0438", desc: "Initial Annual Wellness Visit" },
  { code: "G0439", desc: "Subsequent Annual Wellness Visit" },
  { code: "99484", desc: "Behavioral Health Integration" },
];

export function CodeLookupTool() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = code.trim().toUpperCase();
    if (!cleaned) return;
    router.push(`/codes/${cleaned}`);
  };

  const handleCodeClick = (codeValue: string) => {
    router.push(`/codes/${codeValue}`);
  };

  return (
    <div>
      {/* Search Form */}
      <div className="rounded-2xl border border-dark-50/80 bg-dark-400/50 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20">
            <FileCode2 className="h-5 w-5 text-violet-400" />
          </div>
          <h2 className="text-lg font-semibold">Search CPT/HCPCS Code</h2>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter CPT or HCPCS code (e.g. 99214, G0439)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={10}
              className="w-full rounded-lg border border-dark-50/50 bg-dark-200 px-4 py-3 text-white font-mono tracking-wider placeholder:text-[var(--text-secondary)]/50 focus:border-gold focus:outline-none transition-colors"
              aria-label="CPT or HCPCS code"
            />
          </div>
          <button
            type="submit"
            disabled={!code.trim()}
            className="flex items-center gap-2 bg-gold text-dark font-semibold rounded-lg px-6 py-3 hover:bg-gold-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Search className="h-4 w-4" />
            Look Up
          </button>
        </form>

        <div className="mt-4 flex items-start gap-2 text-xs text-[var(--text-secondary)]">
          <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <p>
            Enter any 5-character CPT code (e.g. 99214) or HCPCS code (e.g. G0439)
            to view national Medicare payment data and utilization statistics.
          </p>
        </div>
      </div>

      {/* Popular Codes */}
      <div className="mt-8">
        <h3 className="text-base font-semibold mb-4">Popular Codes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POPULAR_CODES.map((item) => (
            <button
              key={item.code}
              onClick={() => handleCodeClick(item.code)}
              className="group text-left rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 hover:border-gold/20 hover:bg-dark-300/80 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-gold">
                  {item.code}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[var(--text-secondary)] group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-snug">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
