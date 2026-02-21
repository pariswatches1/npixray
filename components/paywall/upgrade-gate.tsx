"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Lock, Zap, BarChart3, FileText, Brain, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface UpgradeGateProps {
  children: React.ReactNode;
  /** What this locked section contains — displayed in the overlay */
  feature?: string;
  /** Optional: custom teaser bullets (defaults to Pro plan highlights) */
  bullets?: string[];
  /** If true, shows a compact inline version instead of full overlay */
  compact?: boolean;
  /** Minimum tier required: "pro" or "enterprise" (default: "pro") */
  requiredTier?: "pro" | "enterprise";
}

const PRO_BULLETS = [
  "Real-time eligibility verification (500/mo)",
  "Patient cost estimation",
  "Enhanced analytics dashboard",
  "AI-powered coding recommendations",
  "Email & PDF report exports",
];

const ENTERPRISE_BULLETS = [
  "Unlimited eligibility verification",
  "Claims processing & submission",
  "AI-powered coding assistance",
  "Claims scrubbing & denial management",
  "Revenue recovery tracking",
];

/** Check if a plan has at least the given tier level */
function hasTierAccess(plan: string | undefined, requiredTier: "pro" | "enterprise"): boolean {
  // Enterprise-level plans
  if (plan === "enterprise" || plan === "care") {
    return true;
  }
  // Pro-level plans
  if (requiredTier === "pro" && (plan === "pro" || plan === "intelligence" || plan === "api")) {
    return true;
  }
  return false;
}

/**
 * Reusable paywall overlay. Wraps children in a blurred locked state
 * unless the user has the required tier (Pro or Enterprise).
 *
 * Usage:
 *   <UpgradeGate feature="Action Plan">
 *     <ActionPlanTab data={data} />
 *   </UpgradeGate>
 *
 *   <UpgradeGate feature="Claims Processing" requiredTier="enterprise">
 *     <ClaimsDashboard />
 *   </UpgradeGate>
 */
export function UpgradeGate({
  children,
  feature = "this feature",
  bullets,
  compact = false,
  requiredTier = "pro",
}: UpgradeGateProps) {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan;

  // Default bullets based on required tier
  const defaultBullets = requiredTier === "enterprise" ? ENTERPRISE_BULLETS : PRO_BULLETS;
  const displayBullets = bullets || defaultBullets;

  // Check access using tier hierarchy (supports both old + new plan names)
  const hasAccess = hasTierAccess(plan, requiredTier);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div className="pointer-events-none select-none" aria-hidden="true">
        <div className="filter blur-[6px] opacity-40 max-h-[400px] overflow-hidden">
          {children}
        </div>
        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
      </div>

      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`mx-auto w-full ${
            compact ? "max-w-md px-4" : "max-w-lg px-6"
          }`}
        >
          <div className="rounded-2xl border border-[#2F5EA8]/15 bg-white/95 backdrop-blur-sm p-6 sm:p-8 shadow-2xl shadow-[#2F5EA8]/[0.04]">
            {/* Lock icon */}
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10">
                <Lock className="h-7 w-7 text-[#2F5EA8]" />
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-center mb-2">
              Unlock {feature}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] text-center mb-6 leading-relaxed">
              Upgrade to {requiredTier === "enterprise" ? "Enterprise" : "Pro"} to access {feature.toLowerCase()} and
              accelerate your revenue capture.
            </p>

            {/* Feature bullets */}
            {!compact && (
              <ul className="space-y-2.5 mb-6">
                {displayBullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                  >
                    <Zap className="h-4 w-4 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link
                href={session?.user ? "/pricing" : "/login?callbackUrl=/pricing"}
                onClick={() => {
                  trackEvent({
                    action: "upgrade_gate_cta_clicked",
                    category: "conversion",
                    label: feature,
                  });
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] py-3.5 text-sm font-semibold text-white hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/10 transition-all w-full"
              >
                <Zap className="h-4 w-4" />
                {requiredTier === "enterprise" ? "Upgrade to Enterprise — $499/mo" : "Upgrade to Pro — $199/mo"}
                <ArrowRight className="h-4 w-4" />
              </Link>

              {!session?.user && (
                <p className="text-xs text-[var(--text-secondary)] text-center">
                  Already subscribed?{" "}
                  <Link
                    href="/login"
                    className="text-[#2F5EA8] hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              )}
            </div>

            {/* Trust signal */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                No contracts
              </span>
              <span className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                Instant access
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact inline paywall CTA — used within existing sections
 * (e.g., after billing codes table on provider pages).
 */
export function UpgradeInlineCTA({
  feature = "advanced insights",
  teaser,
  requiredTier = "pro",
}: {
  feature?: string;
  teaser?: string;
  requiredTier?: "pro" | "enterprise";
}) {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan;

  if (hasTierAccess(plan, requiredTier)) return null;

  return (
    <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6 my-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 flex-shrink-0">
          <Lock className="h-6 w-6 text-[#2F5EA8]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold mb-1">
            Unlock {feature}
          </h3>
          {teaser && (
            <p className="text-sm text-[var(--text-secondary)] mb-3 leading-relaxed">
              {teaser}
            </p>
          )}
          <Link
            href={session?.user ? "/pricing" : "/login?callbackUrl=/pricing"}
            onClick={() => {
              trackEvent({
                action: "inline_upgrade_cta_clicked",
                category: "conversion",
                label: feature,
              });
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all"
          >
            <Zap className="h-4 w-4" />
            {requiredTier === "enterprise" ? "Upgrade to Enterprise — $499/mo" : "Upgrade to Pro — $199/mo"}
          </Link>
        </div>
      </div>
    </div>
  );
}
