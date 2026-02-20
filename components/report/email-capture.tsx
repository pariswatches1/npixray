"use client";

import { useState, useEffect } from "react";
import { X, Mail, Send, CheckCircle2, Check } from "lucide-react";
import { ScanResult } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

async function submitLead(
  email: string,
  data: ScanResult
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        npi: data.provider.npi,
        providerName: data.provider.fullName,
        specialty: data.provider.specialty,
        state: data.provider.address?.state || "",
        city: data.provider.address?.city || "",
        totalMissedRevenue: data.totalMissedRevenue,
      }),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error };
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

// ─── Modal overlay (appears after 8 seconds) ───
export function EmailCaptureModal({ data }: { data: ScanResult }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already submitted from this session
    const saved = sessionStorage.getItem(`npixray-lead-${data.provider.npi}`);
    if (saved) return;

    const timer = setTimeout(() => setShow(true), 8000);
    return () => clearTimeout(timer);
  }, [data.provider.npi]);

  if (!show || dismissed) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const result = await submitLead(email, data);
    if (result.success) {
      setStatus("success");
      trackEvent({
        action: "email_captured",
        category: "lead",
        label: "modal",
        value: data.totalMissedRevenue,
      });
      sessionStorage.setItem(`npixray-lead-${data.provider.npi}`, email);
      setTimeout(() => setDismissed(true), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setDismissed(true)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-light)] bg-[var(--bg)] p-8 shadow-2xl shadow-[#2F5EA8]/[0.06] animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">Report sent!</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Check your inbox for the full analysis.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 mb-4">
                <Mail className="h-6 w-6 text-[#2F5EA8]" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Save Your Revenue Report
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                We&apos;ll email you the complete revenue analysis for{" "}
                <span className="text-[var(--text-primary)] font-medium">{data.provider.fullName}</span>{" "}
                including{" "}
                <span className="text-[#2F5EA8] font-semibold">
                  {formatCurrency(data.totalMissedRevenue)}/yr
                </span>{" "}
                in missed revenue opportunities.
              </p>
              <ul className="mt-3 space-y-1.5 text-left text-sm text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                  Your complete revenue gap analysis
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                  3 quick wins to start capturing revenue
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                  Competitive benchmarks for your specialty
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Mail className="h-4 w-4 text-[var(--text-secondary)]" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="you@practice.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3.5 pl-11 pr-4 text-sm placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none transition-all"
                  aria-label="Email address"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 mb-3">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/10 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <>
                    <div className="h-4 w-4 border-2 border-[var(--border-light)] border-t-[var(--text-primary)] rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Email Me This Report
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-[var(--text-secondary)] text-[10px]">
              Join 2,400+ providers who&apos;ve scanned their NPI
            </p>
            <p className="mt-1 text-center text-[10px] text-[var(--text-secondary)]">
              No spam. One report per NPI. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Inline email form (bottom of results page) ───
export function EmailCaptureInline({ data }: { data: ScanResult }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const result = await submitLead(email, data);
    if (result.success) {
      setStatus("success");
      trackEvent({
        action: "email_captured",
        category: "lead",
        label: "inline",
        value: data.totalMissedRevenue,
      });
      sessionStorage.setItem(`npixray-lead-${data.provider.npi}`, email);
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center">
        <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-3" />
        <p className="font-semibold">Report sent to your inbox!</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Check your email for the full {data.provider.fullName} revenue analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="h-5 w-5 text-[#2F5EA8]" />
            <h3 className="text-lg font-semibold">Email Me This Report</h3>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Get the full revenue analysis for NPI {data.provider.npi} delivered
            to your inbox with actionable next steps.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 w-full">
          <div className="flex gap-2">
            <input
              type="email"
              required
              placeholder="you@practice.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3 px-4 text-sm placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none transition-all"
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center gap-2 rounded-xl bg-[#2F5EA8] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/10 disabled:opacity-50 whitespace-nowrap"
            >
              {status === "loading" ? (
                <div className="h-4 w-4 border-2 border-[var(--border-light)] border-t-[var(--text-primary)] rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </button>
          </div>
          {errorMsg && (
            <p className="text-xs text-red-400 mt-2">{errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
}
