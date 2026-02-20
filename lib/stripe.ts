/**
 * Stripe client + billing helpers.
 *
 * Gracefully no-ops when STRIPE_SECRET_KEY is not set,
 * allowing the app to run in "Stripe-ready / waitlist" mode.
 */

import Stripe from "stripe";

// ── Stripe client (null when not configured) ───────────────

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-01-27.acacia" as any })
  : null;

export const STRIPE_ENABLED = !!stripe;

// ── Plan config ────────────────────────────────────────────

export interface PlanConfig {
  id: string;
  name: string;
  price: number;
  priceId: string | null;
  features: string[];
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "Unlimited NPI scans",
      "E&M coding gap analysis",
      "CCM / RPM / BHI / AWV gap estimates",
      "Specialty benchmark comparisons",
      "Revenue Score & badge",
      "Shareable report link",
    ],
  },
  intelligence: {
    id: "intelligence",
    name: "Intelligence",
    price: 99,
    priceId: process.env.STRIPE_INTELLIGENCE_PRICE_ID || null,
    features: [
      "Everything in Free, plus:",
      "90-day action plan roadmap",
      "12-month revenue forecast",
      "CSV billing data upload & analysis",
      "Patient-level eligibility lists",
      "AI-powered coding recommendations",
      "Unlimited AI Coach sessions",
      "Monthly benchmark tracking",
      "MIPS quality score dashboard",
      "Email & PDF report exports",
      "Priority support",
    ],
  },
  api: {
    id: "api",
    name: "API Pro",
    price: 49,
    priceId: process.env.STRIPE_API_PRICE_ID || null,
    features: [
      "10,000 API requests per day",
      "Full billing breakdowns",
      "All billing codes per provider",
      "Multi-provider comparison",
      "Batch lookup (100 NPIs)",
      "Group practice scan (50 NPIs)",
      "Market intelligence",
      "Score distributions",
    ],
  },
  care: {
    id: "care",
    name: "Care Management",
    price: 299,
    priceId: process.env.STRIPE_CARE_PRICE_ID || null,
    features: [
      "Everything in Intelligence, plus:",
      "CCM module (care plans, time tracking, billing)",
      "RPM module (device integration, vitals monitoring)",
      "BHI module (screening, care coordination)",
      "AWV module (HRA forms, visit workflows)",
      "AI documentation & coding optimizer",
      "Automated billing submission",
      "Dedicated implementation manager",
      "Staff training & onboarding",
    ],
  },
};

// ── Checkout session ───────────────────────────────────────

export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string | null> {
  if (!stripe) return null;

  const plan = PLANS[params.planId];
  if (!plan?.priceId) return null;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: params.email,
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true,
    metadata: {
      userId: params.userId,
      planId: params.planId,
    },
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        userId: params.userId,
        planId: params.planId,
      },
    },
  });

  return session.url;
}

// ── Customer portal ────────────────────────────────────────

export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<string | null> {
  if (!stripe) return null;

  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });

  return session.url;
}

// ── Webhook verification ───────────────────────────────────

export function constructWebhookEvent(
  body: string,
  signature: string
): Stripe.Event | null {
  if (!stripe) return null;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return null;

  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}
