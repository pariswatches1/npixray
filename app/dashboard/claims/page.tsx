"use client";

import { useSession } from "next-auth/react";
import { FileText, Send, AlertTriangle, DollarSign } from "lucide-react";
import { UpgradeGate } from "@/components/paywall/upgrade-gate";

function ClaimsContent() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10">
          <FileText className="h-5 w-5 text-[#2F5EA8]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Claims Processing</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Submit, scrub, and track claims end-to-end
          </p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-8 text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2F5EA8]/[0.08] border border-[#2F5EA8]/10">
            <FileText className="h-8 w-8 text-[#2F5EA8]" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">Claims Processing Coming Soon</h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto mb-6 leading-relaxed">
          Submit claims directly, catch errors before they cause denials, and track
          revenue from identification to payment — all in one dashboard.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 text-center">
            <Send className="h-5 w-5 text-[#2F5EA8] mx-auto mb-2" />
            <p className="text-sm font-semibold">Direct Submission</p>
            <p className="text-xs text-[var(--text-secondary)]">Via DrChrono API</p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 text-center">
            <AlertTriangle className="h-5 w-5 text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">Pre-Submission Scrub</p>
            <p className="text-xs text-[var(--text-secondary)]">Catch errors early</p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 text-center">
            <DollarSign className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">Revenue Recovery</p>
            <p className="text-xs text-[var(--text-secondary)]">Track the full lifecycle</p>
          </div>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Enterprise feature — unlimited claims processing with denial management.
        </p>
      </div>
    </div>
  );
}

export default function ClaimsPage() {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan;

  // Enterprise-only feature
  const hasAccess = plan === "enterprise" || plan === "care";

  if (!hasAccess) {
    return (
      <UpgradeGate
        feature="Claims Processing"
        requiredTier="enterprise"
        bullets={[
          "Submit claims directly via DrChrono",
          "Pre-submission scrubbing catches errors",
          "95%+ first-pass acceptance rate",
          "Denial management with AI corrective actions",
          "Revenue recovery tracking from identification to payment",
        ]}
      >
        <ClaimsContent />
      </UpgradeGate>
    );
  }

  return <ClaimsContent />;
}
