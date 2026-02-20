"use client";

import { useState, useMemo } from "react";
import { Code2, Copy, Check, Eye, ChevronDown } from "lucide-react";
import { STATE_LIST, SPECIALTY_LIST, specialtyToSlug } from "@/lib/benchmark-data";

function stateToSlug(abbr: string): string {
  const st = STATE_LIST.find((s) => s.abbr === abbr);
  return st ? st.name.toLowerCase().replace(/\s+/g, "-") : abbr.toLowerCase();
}

type WidgetType = "state" | "specialty";

export default function EmbedPage() {
  const [widgetType, setWidgetType] = useState<WidgetType>("state");
  const [stateId, setStateId] = useState("CA");
  const [specialtyId, setSpecialtyId] = useState(SPECIALTY_LIST[0]);
  const [copied, setCopied] = useState(false);

  const iframeUrl = useMemo(() => {
    if (widgetType === "state") {
      return `/api/reports/widget?type=state&id=${stateId}`;
    }
    return `/api/reports/widget?type=specialty&id=${specialtyToSlug(specialtyId)}`;
  }, [widgetType, stateId, specialtyId]);

  const fullIframeUrl = useMemo(() => {
    if (widgetType === "state") {
      return `https://npixray.com/api/reports/widget?type=state&id=${stateId}`;
    }
    return `https://npixray.com/api/reports/widget?type=specialty&id=${specialtyToSlug(specialtyId)}`;
  }, [widgetType, stateId, specialtyId]);

  const embedCode = `<iframe src="${fullIframeUrl}" width="400" height="200" frameborder="0" style="border:none;border-radius:12px;overflow:hidden;" title="NPIxray Medicare Report Widget"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = embedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentLabel = widgetType === "state"
    ? STATE_LIST.find((s) => s.abbr === stateId)?.name || stateId
    : specialtyId;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-1.5 mb-8">
              <Code2 className="h-3.5 w-3.5 text-[#2F5EA8]" />
              <span className="text-xs font-medium text-[#2F5EA8]">
                Free Embeddable Widgets
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Embed Medicare Report Cards{" "}
              <span className="text-[#2F5EA8]">on Your Website</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Add real CMS Medicare data widgets to your website, blog, or
              dashboard. Free to use, always up-to-date.
            </p>
          </div>
        </div>
      </section>

      {/* Builder */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Controls */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Configure Widget</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Type Selector */}
              <div>
                <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Report Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setWidgetType("state")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                      widgetType === "state"
                        ? "bg-[#2F5EA8] text-white"
                        : "bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[#2F5EA8]/15"
                    }`}
                  >
                    State
                  </button>
                  <button
                    onClick={() => setWidgetType("specialty")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                      widgetType === "specialty"
                        ? "bg-[#2F5EA8] text-white"
                        : "bg-[var(--bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[#2F5EA8]/15"
                    }`}
                  >
                    Specialty
                  </button>
                </div>
              </div>

              {/* Value Selector */}
              <div>
                <label className="block text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  {widgetType === "state" ? "Select State" : "Select Specialty"}
                </label>
                <div className="relative">
                  {widgetType === "state" ? (
                    <select
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-4 pr-10 text-sm focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none transition-all"
                    >
                      {STATE_LIST.map((s) => (
                        <option key={s.abbr} value={s.abbr}>
                          {s.name} ({s.abbr})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={specialtyId}
                      onChange={(e) => setSpecialtyId(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2.5 px-4 pr-10 text-sm focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none transition-all"
                    >
                      {SPECIALTY_LIST.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-[#2F5EA8]" />
              <h2 className="text-lg font-semibold">Preview</h2>
              <span className="text-xs text-[var(--text-secondary)]">
                {currentLabel}
              </span>
            </div>
            <div className="flex justify-center bg-[var(--bg)]/50 rounded-lg p-6 border border-[var(--border-light)]">
              <iframe
                key={iframeUrl}
                src={iframeUrl}
                width="400"
                height="200"
                frameBorder="0"
                style={{
                  border: "none",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
                title="NPIxray Medicare Report Widget Preview"
              />
            </div>
          </div>

          {/* Embed Code */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#2F5EA8]" />
                <h2 className="text-lg font-semibold">Embed Code</h2>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] hover:border-[#2F5EA8]/15 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
            <div className="bg-[var(--bg)] rounded-lg p-4 border border-[var(--border-light)] overflow-x-auto">
              <code className="text-sm text-[var(--text-secondary)] font-mono whitespace-pre-wrap break-all">
                {embedCode}
              </code>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-3">
              Paste this code into your website&apos;s HTML where you want the
              widget to appear. The widget is responsive and works on any site.
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06] mb-3">
                <span className="text-[#2F5EA8] font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-1">Choose Report</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Select a state or specialty for your widget
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06] mb-3">
                <span className="text-[#2F5EA8] font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-1">Copy Code</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Click &quot;Copy Code&quot; to grab the embed snippet
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06] mb-3">
                <span className="text-[#2F5EA8] font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-1">Paste &amp; Publish</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Add the code to your site. Widget updates automatically.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
