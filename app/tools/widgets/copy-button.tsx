"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dark-50/80 bg-dark-300 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-400" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copy Code
        </>
      )}
    </button>
  );
}
