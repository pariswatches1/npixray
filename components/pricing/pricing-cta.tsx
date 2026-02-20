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

  async function handleClick() {
    // Free tier — just go to scanner
    if (planId === "free") {
      router.push("/");
      return;
    }

    // Care Management — open demo booking
    if (planId === "care") {
      window.location.href = "mailto:sales@npixray.com?subject=Care%20Management%20Demo%20Request";
      return;
    }

    // Not logged in — send to login first
    if (!session?.user) {
      router.push("/login?callbackUrl=/pricing");
      return;
    }

    // Already on this plan
    if (userPlan === planId) return;

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
  } else if (planId === "care") {
    buttonText = "Book a Demo";
    icon = <Calendar className="h-4 w-4" />;
  } else if (session?.user && userPlan === planId) {
    buttonText = "Current Plan";
    icon = <Check className="h-4 w-4" />;
    disabled = true;
  } else if (session?.user && userPlan === "free" && planId === "intelligence") {
    buttonText = "Upgrade Now \u2014 $99/mo";
    icon = <Zap className="h-4 w-4" />;
  } else if (!session?.user && planId !== "free") {
    buttonText = "Start Free, Then Upgrade";
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
