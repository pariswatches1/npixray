/**
 * POST /api/eligibility/batch
 *
 * Batch eligibility verification via pVerify.
 * Accepts JSON array of verification requests.
 * Pro: max 100 per batch. Enterprise: max 500.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  withTierAccess,
  checkUsageLimit,
  recordUsage,
  normalizePlan,
} from "@/lib/access-control";
import { verifyBatch, isPVerifyEnabled } from "@/lib/pverify";
import type { EligibilityRequest } from "@/lib/pverify";

const BATCH_LIMITS: Record<string, number> = {
  pro: 100,
  enterprise: 500,
};

export const POST = withTierAccess(
  "batch_eligibility",
  async (req: NextRequest, { userId, plan }) => {
    if (!isPVerifyEnabled()) {
      return NextResponse.json(
        { error: "Eligibility verification is not yet configured. Coming soon." },
        { status: 503 }
      );
    }

    // Parse request
    let body: { requests: EligibilityRequest[] };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!Array.isArray(body.requests) || body.requests.length === 0) {
      return NextResponse.json(
        { error: "Request body must contain a non-empty 'requests' array" },
        { status: 400 }
      );
    }

    // Check batch size limit
    const tier = normalizePlan(plan);
    const maxBatch = BATCH_LIMITS[tier] || 100;
    if (body.requests.length > maxBatch) {
      return NextResponse.json(
        {
          error: `Batch size exceeds limit. Your plan allows ${maxBatch} per batch.`,
          limit: maxBatch,
          requested: body.requests.length,
        },
        { status: 400 }
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

    // If Pro plan, check if batch size + used would exceed limit
    if (usage.limit > 0 && usage.used + body.requests.length > usage.limit) {
      return NextResponse.json(
        {
          error: `Batch would exceed monthly limit. You have ${usage.remaining} checks remaining.`,
          remaining: usage.remaining,
          requested: body.requests.length,
        },
        { status: 429 }
      );
    }

    // Validate each request
    for (let i = 0; i < body.requests.length; i++) {
      const r = body.requests[i];
      if (!r.payerCode || !r.providerNpi || !r.subscriberId || !r.memberFirstName || !r.memberLastName || !r.memberDob) {
        return NextResponse.json(
          { error: `Request at index ${i} is missing required fields` },
          { status: 400 }
        );
      }
    }

    try {
      // Process batch with concurrency limit
      const concurrency = tier === "enterprise" ? 10 : 5;
      const results = await verifyBatch(body.requests, concurrency);

      // Record usage for successful checks
      const successCount = results.filter((r) => r.response?.isSuccess).length;
      if (successCount > 0) {
        await recordUsage(userId, "eligibility_check", successCount);
      }

      // Get updated usage
      const updatedUsage = await checkUsageLimit(userId, "eligibility_check", plan);

      return NextResponse.json({
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: results.length - successCount,
          active: results.filter((r) => r.response?.status === "Active").length,
          inactive: results.filter((r) => r.response?.status === "Inactive").length,
        },
        usage: {
          used: updatedUsage.used,
          limit: updatedUsage.limit,
          remaining: updatedUsage.remaining,
        },
      });
    } catch (err) {
      console.error("[eligibility/batch] Error:", err);
      return NextResponse.json(
        { error: "Batch verification failed" },
        { status: 500 }
      );
    }
  }
);
