"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Check, Zap, Calendar } from "lucide-react";

interface PricingCTAProps {
  planId: string;
  label: string;
  highlight: boolean;
}

export function PricingCTA({ planId, label, highlight }: PricingCTAProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const userPlan = (session?.user as any)?.plan || "free";

  /** Check if two plans are equivalent (handles legacy name mapping) */
  function isSamePlan(a: string, b: string): boolean {
    const normalize = (p: string) => {
      if (p === "intelligence" || p === "api") return "pro";
      if (p === "care") return "enterprise";
      return p;
    };
    return normalize(a) === normalize(b);
  }

  async function handleClick() {
    // Free tier — just go to scanner
    if (planId === "free") {
      router.push("/");
      return;
    }

    // Not logged in — send to login first
    if (!session?.user) {
      router.push("/login?callbackUrl=/pricing");
      return;
    }

    // Already on this plan (or equivalent legacy plan)
    if (isSamePlan(userPlan, planId)) return;

    // Logged in — try Stripe checkout
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 503) {
        // Stripe not configured — waitlist mode
        router.push("/dashboard?waitlist=true");
      } else {
        console.error("Checkout error:", data.error);
      }
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setLoading(false);
    }
  }

  // ── Context-aware button text ──
  let buttonText = label;
  let icon: React.ReactNode = <ArrowRight className="h-4 w-4" />;
  let disabled = false;

  if (planId === "free") {
    buttonText = "Scan Now \u2014 It\u2019s Free";
    icon = <Zap className="h-4 w-4" />;
  } else if (session?.user && isSamePlan(userPlan, planId)) {
    buttonText = "Current Plan";
    icon = <Check className="h-4 w-4" />;
    disabled = true;
  } else if (session?.user && userPlan === "free" && planId === "pro") {
    buttonText = "Start 14-Day Free Trial";
    icon = <Zap className="h-4 w-4" />;
  } else if (session?.user && userPlan === "free" && planId === "enterprise") {
    buttonText = "Start 14-Day Free Trial";
    icon = <Zap className="h-4 w-4" />;
  } else if (session?.user && (userPlan === "pro" || userPlan === "intelligence") && planId === "enterprise") {
    buttonText = "Upgrade to Enterprise";
    icon = <Zap className="h-4 w-4" />;
  } else if (!session?.user && planId !== "free") {
    buttonText = "Start 14-Day Free Trial";
    icon = <ArrowRight className="h-4 w-4" />;
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled}
      className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all w-full mb-8 ${
        disabled
          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-default"
          : highlight
            ? "bg-[#2F5EA8] text-white hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/10 disabled:opacity-70"
            : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] disabled:opacity-70"
      }`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {icon}
          {buttonText}
        </>
      )}
    </button>
  );
}
