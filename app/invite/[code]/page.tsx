"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  ArrowRight,
  Mail,
  CheckCircle2,
  Shield,
  Zap,
} from "lucide-react";

interface InviteData {
  code: string;
  npi: string;
  providerName: string;
  specialty: string;
  state: string;
  city: string;
  totalGap: number;
  revenueScore: number;
}

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-[#2F5EA8]";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

function scoreTier(score: number): string {
  if (score >= 80) return "Optimized";
  if (score >= 60) return "On Track";
  if (score >= 40) return "Needs Attention";
  return "Critical";
}

export default function InviteLandingPage() {
  const params = useParams();
  const code = params.code as string;

  const [invite, setInvite] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);

  useEffect(() => {
    async function loadInvite() {
      try {
        const res = await fetch(`/api/admin/invites?code=${encodeURIComponent(code)}`);
        if (!res.ok) {
          setError("This invite link is invalid or has expired.");
          return;
        }
        const json = await res.json();
        setInvite(json.invite);
      } catch {
        setError("Unable to load your report. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadInvite();
  }, [code]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setEmailSubmitting(true);
    try {
      // Capture email on the invite
      await fetch("/api/admin/invites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email }),
      });

      // Also enroll in email sequence
      if (invite) {
        await fetch("/api/email/sequences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            npi: invite.npi,
            providerName: invite.providerName,
            specialty: invite.specialty,
            state: invite.state,
            city: invite.city,
            totalMissedRevenue: invite.totalGap,
            revenueScore: invite.revenueScore,
          }),
        });
      }

      setEmailCaptured(true);
    } catch {
      // Still mark as captured for UX
      setEmailCaptured(true);
    } finally {
      setEmailSubmitting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-[#2F5EA8] animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Loading your report...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !invite) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="h-16 w-16 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <div className="text-center max-w-md">
          <p className="text-lg font-semibold">Report Not Found</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            {error || "We couldn't find a report for this invite code."}
          </p>
        </div>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-colors"
        >
          Scan Your NPI
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const firstName = invite.providerName.split(" ")[0];
  const formattedGap = formatCurrency(invite.totalGap);

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(47,94,168,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(47,94,168,0.15) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#2F5EA8]/[0.04] rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Personalized header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-1.5 mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-[#2F5EA8] animate-pulse" />
            <span className="text-xs font-medium text-[#2F5EA8]">
              Personalized Revenue Analysis
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-balance">
            Dr. {firstName}, your practice may be missing{" "}
            <span className="text-[#2F5EA8]">{formattedGap}/year</span>
          </h1>

          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Based on CMS Medicare public data, we analyzed your billing patterns
            and found significant revenue opportunities for your {invite.specialty} practice
            in {invite.city}, {invite.state}.
          </p>
        </div>

        {/* Revenue Score Card */}
        <div className="mx-auto max-w-2xl mb-12">
          <div className="rounded-2xl border border-[var(--border-light)] bg-white/80 backdrop-blur-sm p-8 glow-blue">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {/* Revenue Score */}
              <div className="text-center">
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2">
                  Revenue Score
                </p>
                <p className={`text-5xl font-bold font-mono ${scoreColor(invite.revenueScore)}`}>
                  {invite.revenueScore}
                </p>
                <p className={`text-sm font-medium mt-1 ${scoreColor(invite.revenueScore)}`}>
                  {scoreTier(invite.revenueScore)}
                </p>
              </div>

              {/* Missed Revenue */}
              <div className="text-center">
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2">
                  Estimated Missed Revenue
                </p>
                <p className="text-5xl font-bold font-mono text-[#2F5EA8]">
                  {formattedGap}
                </p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">/year</p>
              </div>

              {/* Specialty Rank */}
              <div className="text-center">
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-2">
                  Specialty
                </p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{invite.specialty}</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {invite.city}, {invite.state}
                </p>
              </div>
            </div>

            {/* Key findings preview */}
            <div className="border-t border-[var(--border-light)] pt-6 mb-6">
              <p className="text-sm font-semibold mb-4">Your report includes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: DollarSign, label: "E&M Coding Gap Analysis", desc: "99213 vs 99214/99215 shift opportunities" },
                  { icon: Activity, label: "CCM & RPM Opportunities", desc: "Chronic Care & Remote Patient Monitoring revenue" },
                  { icon: Users, label: "Specialty Benchmarks", desc: "How you compare to peers nationally" },
                  { icon: TrendingUp, label: "90-Day Action Plan", desc: "Prioritized steps to capture revenue" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg border border-[var(--border-light)] bg-[var(--bg)]/30">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06] shrink-0">
                      <item.icon className="h-4 w-4 text-[#2F5EA8]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email capture gate */}
            {!emailCaptured ? (
              <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-5 w-5 text-[#2F5EA8]" />
                  <p className="text-sm font-semibold">Save your report &amp; get your action plan</p>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  Enter your email to save this report, receive your personalized 90-day action plan,
                  and get ongoing revenue insights.
                </p>
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@practice.com"
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] py-3 px-4 text-sm placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={emailSubmitting}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#2F5EA8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {emailSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    Get Full Report
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <p className="font-semibold">Report saved!</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Check your inbox for your full report and 90-day action plan.
                </p>
                <Link
                  href={`/scan/${invite.npi}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-colors"
                >
                  View Full Report
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-[#4FA3D1]" />
            100% Free Analysis
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-[#4FA3D1]" />
            CMS Public Data Only
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-[#4FA3D1]" />
            1.2M+ Providers Indexed
          </div>
        </div>
      </div>
    </section>
  );
}
