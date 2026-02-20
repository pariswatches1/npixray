import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession, STRIPE_ENABLED } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    if (!STRIPE_ENABLED) {
      return NextResponse.json(
        { error: "Billing is not yet available. You've been added to the waitlist." },
        { status: 503 }
      );
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { planId } = await request.json();
    if (!planId || !["intelligence", "api", "care"].includes(planId)) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const origin = request.nextUrl.origin;
    const url = await createCheckoutSession({
      userId: session.user.id!,
      email: session.user.email,
      planId,
      successUrl: `${origin}/dashboard?upgraded=true`,
      cancelUrl: `${origin}/pricing`,
    });

    if (!url) {
      return NextResponse.json(
        { error: "Could not create checkout session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[stripe/checkout] Error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout." },
      { status: 500 }
    );
  }
}
