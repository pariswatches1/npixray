"use client";

import { useState } from "react";
import { Code, Copy, Check, Eye } from "lucide-react";
import { STATE_LIST, SPECIALTY_LIST } from "@/lib/benchmark-data";
import { stateToSlug, specialtyToSlug } from "@/lib/db-queries";

export default function EmbedPage() {
  const [type, setType] = useState<"state" | "specialty">("state");
  const [stateId, setStateId] = useState("california");
  const [specialtyId, setSpecialtyId] = useState("internal-medicine");
  const [copied, setCopied] = useState(false);

  const id = type === "state" ? stateId : specialtyId;
  const widgetUrl = `https://npixray.com/api/reports/widget?type=${type}&id=${id}`;
  const embedCode = `<iframe src="${widgetUrl}" width="400" height="180" frameborder="0" style="border-radius:12px;overflow:hidden;"></iframe>`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-10">
        <Code className="h-10 w-10 text-gold mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">
          Embed Medicare Report Cards
        </h1>
        <p className="text-[var(--text-secondary)]">
          Add Medicare revenue data to your website with a free embeddable
          widget.
        </p>
      </div>

      {/* Config */}
      <div className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-6 mb-8">
        <h2 className="font-semibold mb-4">Configure Widget</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => setType("state")}
            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
              type === "state"
                ? "border-gold bg-gold/10 text-gold"
                : "border-dark-50/80 hover:border-gold/20"
            }`}
          >
            State Report
          </button>
          <button
            onClick={() => setType("specialty")}
            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
              type === "specialty"
                ? "border-gold bg-gold/10 text-gold"
                : "border-dark-50/80 hover:border-gold/20"
            }`}
          >
            Specialty Report
          </button>
        </div>

        {type === "state" ? (
          <select
            value={stateId}
            onChange={(e) => setStateId(e.target.value)}
            className="w-full p-3 rounded-lg bg-dark-400 border border-dark-50/80 text-sm"
          >
            {STATE_LIST.map((s) => (
              <option key={s.abbr} value={stateToSlug(s.abbr)}>
                {s.name}
              </option>
            ))}
          </select>
        ) : (
          <select
            value={specialtyId}
            onChange={(e) => setSpecialtyId(e.target.value)}
            className="w-full p-3 rounded-lg bg-dark-400 border border-dark-50/80 text-sm"
          >
            {SPECIALTY_LIST.map((s) => (
              <option key={s} value={specialtyToSlug(s)}>
                {s}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Preview */}
      <div className="mb-8">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Eye className="h-4 w-4 text-gold" />
          Preview
        </h2>
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-4 flex justify-center">
          <iframe
            src={widgetUrl}
            width={400}
            height={180}
            style={{ borderRadius: 12, overflow: "hidden", border: "none" }}
          />
        </div>
      </div>

      {/* Embed Code */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Code className="h-4 w-4 text-gold" />
            Embed Code
          </h2>
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-sm hover:bg-gold/20 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
        <pre className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-sm text-[var(--text-secondary)] overflow-x-auto">
          <code>{embedCode}</code>
        </pre>
      </div>
    </div>
  );
}
