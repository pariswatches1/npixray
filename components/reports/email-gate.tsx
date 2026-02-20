"use client";

import { useState } from "react";
import { Lock, Mail, ArrowRight, CheckCircle } from "lucide-react";

interface EmailGateProps {
  onUnlock: () => void;
}

export function EmailGate({ onUnlock }: EmailGateProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "national-report" }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");

      setSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 1500);
    } catch {
      // Still unlock — don't block on API failure
      setSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 sm:p-12 text-center">
        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">You&apos;re In!</h3>
        <p className="text-[var(--text-secondary)]">
          Unlocking the full report...
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-[#2F5EA8]/10 bg-white p-8 sm:p-12 overflow-hidden">
      {/* Blurred preview overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.06] mx-auto mb-6">
          <Lock className="h-7 w-7 text-[#2F5EA8]" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold mb-3">
          Get the Full National Report
        </h3>
        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
          Enter your email to unlock state rankings, specialty analysis,
          program adoption data, and E&M coding trends from CMS data
          covering 1M+ providers.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
            <input
              type="email"
              placeholder="you@practice.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-light)] bg-[var(--bg)] pl-10 pr-4 py-3 text-sm placeholder:text-[var(--text-secondary)] focus:border-[#2F5EA8]/20 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F5EA8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#264D8C] transition-colors disabled:opacity-50"
          >
            {loading ? (
              "Unlocking..."
            ) : (
              <>
                Unlock Report
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-400 mt-3">{error}</p>
        )}

        <p className="text-xs text-[var(--text-secondary)] mt-4">
          Free access. No credit card. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
