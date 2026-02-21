/**
 * GET /api/eligibility/usage
 *
 * Returns the current user's eligibility check usage for this month.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkUsageLimit, normalizePlan } from "@/lib/access-control";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const plan = (session.user as any)?.plan || "free";
    const tier = normalizePlan(plan);
    const usage = await checkUsageLimit(session.user.id, "eligibility_check", plan);

    return NextResponse.json({
      tier,
      eligibility: {
        used: usage.used,
        limit: usage.limit,
        remaining: usage.remaining,
      },
    });
  } catch (err) {
    console.error("[eligibility/usage] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}
