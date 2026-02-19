"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

interface PricingCTAProps {
  planId: string;
  label: string;
  highlight: boolean;
}

export function PricingCTA({ planId, label, highlight }: PricingCTAProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    // Free tier — just go to scanner
    if (planId === "free") {
      router.push("/");
      return;
    }

    // Not logged in — send to login first
    if (!session?.user) {
      router.push("/login");
      return;
    }

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

  // Determine button text
  let buttonText = label;
  if (planId !== "free" && !session?.user) {
    buttonText = "Sign In to Get Started";
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all w-full mb-8 ${
        highlight
          ? "bg-gold text-dark hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70"
          : "border border-dark-50 text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold disabled:opacity-70"
      }`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {buttonText}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
