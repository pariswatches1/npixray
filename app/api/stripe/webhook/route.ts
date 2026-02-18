import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent, STRIPE_ENABLED } from "@/lib/stripe";
import type Stripe from "stripe";

async function getNeon() {
  const { neon } = await import("@neondatabase/serverless");
  return neon(process.env.DATABASE_URL!);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;
  if (!userId || !planId || !process.env.DATABASE_URL) return;

  const sql = await getNeon();
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  // Update user plan + Stripe IDs
  await sql`
    UPDATE users SET
      plan = ${planId},
      stripe_customer_id = ${customerId},
      stripe_subscription_id = ${subscriptionId},
      subscription_status = 'active',
      updated_at = NOW()
    WHERE id = ${userId}
  `;

  // Create subscription record
  const id = crypto.randomUUID();
  await sql`
    INSERT INTO subscriptions (id, user_id, stripe_subscription_id, plan, status)
    VALUES (${id}, ${userId}, ${subscriptionId}, ${planId}, 'active')
    ON CONFLICT (id) DO NOTHING
  `;
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId || !process.env.DATABASE_URL) return;

  const sql = await getNeon();
  const status = subscription.status; // 'active' | 'past_due' | 'canceled' | etc.
  const planId = subscription.metadata?.planId || "free";

  await sql`
    UPDATE users SET
      subscription_status = ${status},
      plan = CASE WHEN ${status} = 'canceled' THEN 'free' ELSE ${planId} END,
      updated_at = NOW()
    WHERE id = ${userId}
  `;

  // Update subscription record
  await sql`
    UPDATE subscriptions SET
      status = ${status},
      current_period_start = ${new Date(((subscription as any).current_period_start ?? 0) * 1000).toISOString()},
      current_period_end = ${new Date(((subscription as any).current_period_end ?? 0) * 1000).toISOString()}
    WHERE stripe_subscription_id = ${subscription.id}
  `;
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId || !process.env.DATABASE_URL) return;

  const sql = await getNeon();

  await sql`
    UPDATE users SET
      plan = 'free',
      subscription_status = 'canceled',
      stripe_subscription_id = NULL,
      updated_at = NOW()
    WHERE id = ${userId}
  `;

  await sql`
    UPDATE subscriptions SET status = 'canceled'
    WHERE stripe_subscription_id = ${subscription.id}
  `;
}

export async function POST(request: NextRequest) {
  if (!STRIPE_ENABLED) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const event = constructWebhookEvent(body, signature);
  if (!event) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe/webhook] Error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
