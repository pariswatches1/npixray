"use client";

import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface GroupProgressProps {
  total: number;
  completed: number;
  failed: number;
}

export function GroupProgress({ total, completed, failed }: GroupProgressProps) {
  const pct = total > 0 ? Math.round(((completed + failed) / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl py-16 px-4 text-center">
      <div className="relative mx-auto mb-8 h-32 w-32">
        {/* Circular progress */}
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="#2F5EA8"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${pct * 2.64} 264`}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono text-white">{completed + failed}</span>
          <span className="text-sm text-[var(--text-secondary)]">of {total}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-3">
        <Loader2 className="h-5 w-5 text-[#2F5EA8] animate-spin" />
        <h2 className="text-xl font-semibold text-white">
          Scanning providers...
        </h2>
      </div>

      <p className="text-[var(--text-secondary)] text-sm mb-6">
        Analyzing Medicare billing data, coding patterns, and program adoption for each provider.
      </p>

      {/* Progress bar */}
      <div className="h-2 bg-[var(--bg)] rounded-full overflow-hidden max-w-md mx-auto">
        <div
          className="h-full bg-[#2F5EA8] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Status counts */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {completed} scanned
        </span>
        {failed > 0 && (
          <span className="flex items-center gap-1.5 text-red-400">
            <XCircle className="h-4 w-4" />
            {failed} failed
          </span>
        )}
        <span className="text-[var(--text-secondary)]/60">
          {total - completed - failed} remaining
        </span>
      </div>
    </div>
  );
}
