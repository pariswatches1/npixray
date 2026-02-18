"use client";

import { useState } from "react";
import { Rocket, CheckCircle, Mail } from "lucide-react";

interface EarlyAccessCTAProps {
  title?: string;
  subtitle?: string;
  tier?: string;
}

export function EarlyAccessCTA({
  title = "Get Early Access to Acquisition Intelligence",
  subtitle = "Premium analytics for PE firms, hospital systems, and practice aggregators. Be the first to access acquisition scoring when it launches.",
  tier = "$499-999/mo",
}: EarlyAccessCTAProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // For now, just show success state
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 sm:p-12 text-center">
        <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">You&apos;re on the List</h3>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          We&apos;ll notify you when Acquisition Intelligence launches. You&apos;ll get priority access and early-bird pricing.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gold/20 bg-gold/5 p-8 sm:p-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 mb-6">
          <Rocket className="h-3.5 w-3.5 text-gold" />
          <span className="text-xs font-medium text-gold">Coming Soon — {tier}</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
          {title}
        </h3>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="work@company.com"
              required
              className="w-full rounded-xl border border-dark-50/80 bg-dark-400/50 pl-10 pr-4 py-3 text-sm placeholder:text-zinc-500 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20 whitespace-nowrap"
          >
            Get Early Access
          </button>
        </form>

        <p className="text-xs text-[var(--text-secondary)] mt-4">
          No spam. Just a one-time launch notification with early-bird pricing.
        </p>
      </div>
    </div>
  );
}
