/**
 * POST /api/eligibility/verify
 *
 * Single patient eligibility verification via pVerify.
 * Requires PRO tier or above.
 */

import { NextRequest, NextResponse } from "next/server";
import { withTierAccess, checkUsageLimit, recordUsage } from "@/lib/access-control";
import { verifyEligibility, isPVerifyEnabled } from "@/lib/pverify";
import type { EligibilityRequest } from "@/lib/pverify";

export const POST = withTierAccess(
  "eligibility_verification",
  async (req: NextRequest, { userId, plan }) => {
    // Check if pVerify is configured
    if (!isPVerifyEnabled()) {
      return NextResponse.json(
        { error: "Eligibility verification is not yet configured. Coming soon." },
        { status: 503 }
      );
    }

    // Check usage limits
    const usage = await checkUsageLimit(userId, "eligibility_check", plan);
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: "Monthly eligibility check limit reached",
          used: usage.used,
          limit: usage.limit,
          remaining: usage.remaining,
        },
        { status: 429 }
      );
    }

    // Parse and validate request
    let body: EligibilityRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Validate required fields
    const missing: string[] = [];
    if (!body.payerCode) missing.push("payerCode");
    if (!body.providerNpi) missing.push("providerNpi");
    if (!body.subscriberId) missing.push("subscriberId");
    if (!body.memberFirstName) missing.push("memberFirstName");
    if (!body.memberLastName) missing.push("memberLastName");
    if (!body.memberDob) missing.push("memberDob");

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate NPI format
    if (!/^\d{10}$/.test(body.providerNpi)) {
      return NextResponse.json(
        { error: "Provider NPI must be exactly 10 digits" },
        { status: 400 }
      );
    }

    // Validate DOB format (MM/DD/YYYY)
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(body.memberDob)) {
      return NextResponse.json(
        { error: "Date of birth must be in MM/DD/YYYY format" },
        { status: 400 }
      );
    }

    try {
      const result = await verifyEligibility(body);

      // Record usage on success
      await recordUsage(userId, "eligibility_check");

      // Recalculate remaining
      const updatedUsage = await checkUsageLimit(userId, "eligibility_check", plan);

      return NextResponse.json({
        eligibility: result,
        usage: {
          used: updatedUsage.used,
          limit: updatedUsage.limit,
          remaining: updatedUsage.remaining,
        },
      });
    } catch (err) {
      console.error("[eligibility/verify] Error:", err);
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Verification failed" },
        { status: 500 }
      );
    }
  }
);
