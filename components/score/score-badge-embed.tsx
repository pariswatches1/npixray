"use client";

import { useState } from "react";
import { Code, Copy, Check } from "lucide-react";

interface ScoreBadgeEmbedProps {
  npi: string;
  score: number;
}

export function ScoreBadgeEmbed({ npi, score }: ScoreBadgeEmbedProps) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<a href="https://npixray.com/provider/${npi}" target="_blank" rel="noopener">
  <img src="https://npixray.com/api/badge/${npi}" alt="Revenue Score: ${score} — Verified by NPIxray" />
</a>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Code className="h-4 w-4 text-gold" />
        <h4 className="text-sm font-semibold">Embed Your Score</h4>
      </div>
      <p className="text-xs text-[var(--text-secondary)] mb-3">
        Add this badge to your website to display your Revenue Score. It links back to your full report.
      </p>
      {/* Badge preview */}
      <div className="mb-3 p-3 bg-dark-400/50 rounded-lg flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/badge/${npi}`}
          alt={`Revenue Score: ${score}`}
          className="h-8"
        />
      </div>
      {/* Code snippet */}
      <div className="relative">
        <pre className="text-xs font-mono bg-dark-400/50 rounded-lg p-3 pr-10 overflow-x-auto text-[var(--text-secondary)]">
          {embedCode}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-dark-200/80 hover:bg-gold/20 transition-colors"
          title="Copy embed code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
          )}
        </button>
      </div>
    </div>
  );
}
