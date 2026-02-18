import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPortalSession, STRIPE_ENABLED } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    if (!STRIPE_ENABLED) {
      return NextResponse.json(
        { error: "Billing portal is not yet available." },
        { status: 503 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const customerId = (session.user as any).stripeCustomerId;
    if (!customerId) {
      return NextResponse.json(
        { error: "No active subscription found." },
        { status: 400 }
      );
    }

    const origin = request.nextUrl.origin;
    const url = await createPortalSession({
      customerId,
      returnUrl: `${origin}/dashboard/billing`,
    });

    if (!url) {
      return NextResponse.json(
        { error: "Could not create portal session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[stripe/portal] Error:", err);
    return NextResponse.json(
      { error: "Failed to create portal session." },
      { status: 500 }
    );
  }
}
