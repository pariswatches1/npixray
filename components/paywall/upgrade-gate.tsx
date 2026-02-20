"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Lock, Zap, BarChart3, FileText, Brain, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface UpgradeGateProps {
  children: React.ReactNode;
  /** What this locked section contains — displayed in the overlay */
  feature?: string;
  /** Optional: custom teaser bullets (defaults to Intelligence plan highlights) */
  bullets?: string[];
  /** If true, shows a compact inline version instead of full overlay */
  compact?: boolean;
}

const DEFAULT_BULLETS = [
  "90-day action plan with prioritized steps",
  "12-month revenue forecast projections",
  "AI-powered coding recommendations",
  "Monthly benchmark tracking & alerts",
  "Email & PDF report exports",
];

/**
 * Reusable paywall overlay. Wraps children in a blurred locked state
 * unless the user has an Intelligence or Care plan.
 *
 * Usage:
 *   <UpgradeGate feature="Action Plan">
 *     <ActionPlanTab data={data} />
 *   </UpgradeGate>
 */
export function UpgradeGate({
  children,
  feature = "this feature",
  bullets = DEFAULT_BULLETS,
  compact = false,
}: UpgradeGateProps) {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan;

  // Intelligence and Care Management users see content normally
  const hasAccess = plan === "intelligence" || plan === "care";

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
              Upgrade to Intelligence to access {feature.toLowerCase()} and
              accelerate your revenue capture.
            </p>

            {/* Feature bullets */}
            {!compact && (
              <ul className="space-y-2.5 mb-6">
                {bullets.map((bullet) => (
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
                Upgrade to Intelligence — $99/mo
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
}: {
  feature?: string;
  teaser?: string;
}) {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan;

  if (plan === "intelligence" || plan === "care") return null;

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
            Upgrade to Intelligence — $99/mo
          </Link>
        </div>
      </div>
    </div>
  );
}
