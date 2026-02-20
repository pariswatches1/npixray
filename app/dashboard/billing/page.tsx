"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { AlertTriangle, CreditCard, ExternalLink, Shield } from "lucide-react";

export default function BillingPage() {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan || "free";
  const status = (session?.user as any)?.subscriptionStatus || "none";

  const planLabel =
    plan === "intelligence"
      ? "Intelligence ($99/mo)"
      : plan === "api"
        ? "API Pro ($49/mo)"
        : plan === "care"
          ? "Care Management ($299–699/mo)"
          : "Free";

  const isActive = status === "active";
  const isPastDue = status === "past_due";

  async function handleManageBilling() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Past due warning */}
      {isPastDue && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">Payment failed</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Your last payment didn&apos;t go through. Please update your payment method below to keep your subscription active.
            </p>
          </div>
        </div>
      )}

      {/* Current Plan */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-[#2F5EA8]" />
          <h2 className="text-lg font-semibold">Current Plan</h2>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-lg font-bold">{planLabel}</p>
            <p className="text-sm text-[var(--text-secondary)]">
              {isActive
                ? "Active subscription"
                : isPastDue
                  ? "Payment past due"
                  : plan === "free"
                    ? "No active subscription"
                    : `Status: ${status}`}
            </p>
          </div>

          {(isActive || isPastDue) ? (
            <button
              onClick={handleManageBilling}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                isPastDue
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "border border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8]"
              }`}
            >
              {isPastDue ? "Update Payment" : "Manage Billing"}
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          ) : (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all"
            >
              Upgrade Plan
            </Link>
          )}
        </div>
      </div>

      {/* Stripe not configured notice */}
      {plan === "free" && (
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Secure payments via Stripe</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                When you upgrade, payments are processed securely through Stripe.
                We never store your credit card information. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
