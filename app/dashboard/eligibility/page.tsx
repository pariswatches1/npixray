"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Zap, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { UpgradeGate } from "@/components/paywall/upgrade-gate";

function EligibilityContent() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10">
          <ShieldCheck className="h-5 w-5 text-[#2F5EA8]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Eligibility Verification</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Verify patient eligibility in real-time
          </p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-8 text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2F5EA8]/[0.08] border border-[#2F5EA8]/10">
            <ShieldCheck className="h-8 w-8 text-[#2F5EA8]" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">Eligibility Verification Coming Soon</h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto mb-6 leading-relaxed">
          Verify patient coverage in 1–3 seconds via pVerify. Check copays, deductibles,
          and out-of-pocket maximums — plus auto-detect revenue opportunities for each patient.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 text-center">
            <CheckCircle className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">Real-Time Verification</p>
            <p className="text-xs text-[var(--text-secondary)]">1–3 second response</p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 text-center">
            <Clock className="h-5 w-5 text-[#2F5EA8] mx-auto mb-2" />
            <p className="text-sm font-semibold">Batch Processing</p>
            <p className="text-xs text-[var(--text-secondary)]">Up to 500 patients</p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 text-center">
            <BarChart3 className="h-5 w-5 text-purple-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">Revenue Connector</p>
            <p className="text-xs text-[var(--text-secondary)]">Auto-detect opportunities</p>
          </div>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Pro subscribers will get 500 verifications/month. Enterprise gets unlimited.
        </p>
      </div>
    </div>
  );
}

export default function EligibilityPage() {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan;

  // Show upgrade gate for free users
  if (!plan || plan === "free") {
    return (
      <UpgradeGate
        feature="Eligibility Verification"
        requiredTier="pro"
        bullets={[
          "Verify patient coverage in 1–3 seconds",
          "Check copays, deductibles, and out-of-pocket max",
          "Medicare Advantage recursive identification",
          "Auto-detect CCM/AWV/TCM revenue opportunities",
          "Batch verification for up to 500 patients",
        ]}
      >
        <EligibilityContent />
      </UpgradeGate>
    );
  }

  return <EligibilityContent />;
}
