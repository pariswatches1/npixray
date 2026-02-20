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
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-light)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[#2F5EA8] hover:border-[#2F5EA8]/10 transition-colors"
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
