"use client";

import { useState, type FormEvent } from "react";
import { Shield, CheckCircle2, AlertCircle, Mail, ArrowRight, Bell, FileText, BarChart3 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ClaimProfileProps {
  npi: string;
  providerName: string;
}

type ClaimState = "idle" | "loading" | "success" | "error" | "already_claimed";

export function ClaimProfile({ npi, providerName }: ClaimProfileProps) {
  const [state, setState] = useState<ClaimState>("idle");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setState("error");
      return;
    }

    setState("loading");
    trackEvent({ action: "claim_profile_started", category: "claim", label: npi });

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ npi, email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setState("success");
        trackEvent({ action: "claim_profile_success", category: "claim", label: npi });
      } else if (data.code === "ALREADY_CLAIMED") {
        setState("already_claimed");
      } else {
        setErrorMessage(data.message || "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-emerald-400">Verification email sent!</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Check your inbox at <span className="font-medium text-[var(--text-primary)]">{email}</span> to confirm ownership of this profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "already_claimed") {
    return (
      <div className="mb-8 rounded-2xl border border-gold/20 bg-gold/5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
            <Shield className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="font-semibold text-gold">Profile already claimed</p>
            <p className="text-sm text-[var(--text-secondary)]">
              This profile has already been claimed by another user.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl border border-dark-50/80 bg-dark-400/30 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
          <Shield className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h3 className="font-semibold">Is this your profile?</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Claim it to unlock exclusive features
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Bell className="h-4 w-4 text-gold/60 flex-shrink-0" />
          <span>Score change alerts</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <BarChart3 className="h-4 w-4 text-gold/60 flex-shrink-0" />
          <span>Full revenue analysis</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <FileText className="h-4 w-4 text-gold/60 flex-shrink-0" />
          <span>Download PDF report</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === "error") setState("idle");
            }}
            placeholder="Enter your work email"
            className="w-full rounded-lg border border-dark-50 bg-dark-400/50 pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all"
            disabled={state === "loading"}
            aria-label="Email address to claim profile"
          />
        </div>
        <button
          type="submit"
          disabled={state === "loading" || !email}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-dark-500 hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          {state === "loading" ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-dark-500/20 border-t-dark-500" />
              Claiming...
            </>
          ) : (
            <>
              Claim Profile
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {state === "error" && errorMessage && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMessage}
        </div>
      )}
    </div>
  );
}
