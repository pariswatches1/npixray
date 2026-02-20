"use client";

import { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";

interface CiteBlockProps {
  title: string;
  year: number;
  url: string;
}

type CitationFormat = "apa" | "bibtex" | "plain";

export function CiteBlock({ title, year, url }: CiteBlockProps) {
  const [format, setFormat] = useState<CitationFormat>("apa");
  const [copied, setCopied] = useState(false);

  const citations: Record<CitationFormat, string> = {
    apa: `NPIxray. (${year}). ${title}. NPIxray. ${url}`,
    bibtex: `@misc{npixray${year},
  title={${title}},
  author={{NPIxray}},
  year={${year}},
  url={${url}},
  note={Data sourced from CMS Medicare Physician \\& Other Practitioners dataset}
}`,
    plain: `"${title}" — NPIxray, ${year}. Available at ${url}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citations[format]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = citations[format];
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-[#2F5EA8]" />
        <h3 className="text-lg font-semibold">Cite This Report</h3>
      </div>

      {/* Format selector */}
      <div className="flex gap-2 mb-4">
        {(["apa", "bibtex", "plain"] as CitationFormat[]).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              format === f
                ? "bg-[#2F5EA8]/10 text-[#2F5EA8] border border-[#2F5EA8]/15"
                : "border border-[var(--border-light)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {f === "apa" ? "APA" : f === "bibtex" ? "BibTeX" : "Plain Text"}
          </button>
        ))}
      </div>

      {/* Citation text */}
      <div className="relative">
        <pre className="rounded-lg bg-[var(--bg)]/50 border border-[var(--border-light)] p-4 text-xs text-[var(--text-secondary)] whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
          {citations[format]}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md bg-[var(--bg)] border border-[var(--border-light)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
