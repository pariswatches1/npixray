"use client";

import { useSession } from "next-auth/react";
import { Brain, FileSearch, TrendingUp, AlertCircle } from "lucide-react";
import { UpgradeGate } from "@/components/paywall/upgrade-gate";

function CodingContent() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10">
          <Brain className="h-5 w-5 text-[#2F5EA8]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Coding Assistant</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            AI-powered encounter review and coding optimization
          </p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-8 text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2F5EA8]/[0.08] border border-[#2F5EA8]/10">
            <Brain className="h-8 w-8 text-[#2F5EA8]" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">AI Coding Assistant Coming Soon</h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto mb-6 leading-relaxed">
          Review encounter documentation against 2021 E&M guidelines. Get recommended coding
          levels with confidence scores, identify documentation gaps, and audit historical claims.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 text-center">
            <FileSearch className="h-5 w-5 text-[#2F5EA8] mx-auto mb-2" />
            <p className="text-sm font-semibold">Encounter Review</p>
            <p className="text-xs text-[var(--text-secondary)]">Real-time E&M analysis</p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 text-center">
            <TrendingUp className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">Bulk Audit</p>
            <p className="text-xs text-[var(--text-secondary)]">Review historical claims</p>
          </div>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 text-center">
            <AlertCircle className="h-5 w-5 text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">Doc Gap Detection</p>
            <p className="text-xs text-[var(--text-secondary)]">Find missing elements</p>
          </div>
        </div>
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-2 inline-block">
          <p className="text-xs text-amber-600 font-medium">
            AI suggestions require physician review — this is a decision support tool, not autonomous coding.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CodingPage() {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan;

  // Enterprise-only feature
  const hasAccess = plan === "enterprise" || plan === "care";

  if (!hasAccess) {
    return (
      <UpgradeGate
        feature="AI Coding Assistant"
        requiredTier="enterprise"
        bullets={[
          "Analyze encounters against 2021 E&M guidelines",
          "Recommended E&M level with confidence score",
          "Documentation gap identification",
          "Bulk audit historical claims for undercoding",
          "Coding trends vs specialty benchmarks",
        ]}
      >
        <CodingContent />
      </UpgradeGate>
    );
  }

  return <CodingContent />;
}
