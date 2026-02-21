/**
 * Tier-based access control + usage tracking.
 *
 * Maps features to required plan tiers and enforces monthly usage limits.
 * Uses raw SQL with Neon, consistent with the rest of the codebase.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// ── Plan hierarchy (higher index = more access) ──────────────
export type PlanTier = "free" | "pro" | "enterprise";

const PLAN_RANK: Record<string, number> = {
  free: 0,
  // Legacy plan names → map to new tiers
  intelligence: 1,
  api: 1,
  pro: 1,
  care: 2,
  enterprise: 2,
};

/** Normalize legacy plan names to new tier system */
export function normalizePlan(plan: string | null | undefined): PlanTier {
  if (!plan) return "free";
  const p = plan.toLowerCase();
  if (p === "enterprise" || p === "care") return "enterprise";
  if (p === "pro" || p === "intelligence" || p === "api") return "pro";
  return "free";
}

// ── Feature → required tier mapping ─────────────────────────
export type Feature =
  | "eligibility_verification"
  | "batch_eligibility"
  | "claims_processing"
  | "ai_coding"
  | "enhanced_analytics"
  | "cost_estimation"
  | "multi_payer";

const FEATURE_MIN_TIER: Record<Feature, PlanTier> = {
  eligibility_verification: "pro",
  batch_eligibility: "pro",
  claims_processing: "enterprise",
  ai_coding: "enterprise",
  enhanced_analytics: "pro",
  cost_estimation: "pro",
  multi_payer: "enterprise",
};

// ── Usage types + monthly limits per tier ────────────────────
export type UsageType = "eligibility_check" | "claim_submission" | "ai_code_review";

const MONTHLY_LIMITS: Record<PlanTier, Record<UsageType, number>> = {
  free: {
    eligibility_check: 0,
    claim_submission: 0,
    ai_code_review: 0,
  },
  pro: {
    eligibility_check: 500,
    claim_submission: 0,
    ai_code_review: 0,
  },
  enterprise: {
    eligibility_check: -1, // unlimited
    claim_submission: -1,  // unlimited
    ai_code_review: -1,    // unlimited
  },
};

// ── DB helpers ──────────────────────────────────────────────
async function getNeon() {
  const { neon } = await import("@neondatabase/serverless");
  return neon(process.env.DATABASE_URL!);
}

// ── Access check ────────────────────────────────────────────
/**
 * Check if a user's plan allows access to a feature.
 * Returns { allowed: true } or { allowed: false, requiredTier }.
 */
export function checkAccess(
  userPlan: string | null | undefined,
  feature: Feature
): { allowed: boolean; requiredTier?: PlanTier } {
  const tier = normalizePlan(userPlan);
  const requiredTier = FEATURE_MIN_TIER[feature];
  const userRank = PLAN_RANK[tier] ?? 0;
  const requiredRank = PLAN_RANK[requiredTier] ?? 0;

  if (userRank >= requiredRank) {
    return { allowed: true };
  }
  return { allowed: false, requiredTier };
}

// ── Usage limit check ────────────────────────────────────────
/**
 * Check if a user has remaining usage for a given type this month.
 */
export async function checkUsageLimit(
  userId: string,
  usageType: UsageType,
  userPlan: string | null | undefined
): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
}> {
  const tier = normalizePlan(userPlan);
  const limit = MONTHLY_LIMITS[tier][usageType];

  // Unlimited
  if (limit === -1) {
    return { allowed: true, used: 0, limit: -1, remaining: -1 };
  }

  // No access
  if (limit === 0) {
    return { allowed: false, used: 0, limit: 0, remaining: 0 };
  }

  if (!process.env.DATABASE_URL) {
    return { allowed: true, used: 0, limit, remaining: limit };
  }

  const sql = await getNeon();
  const [row] = await sql`
    SELECT COALESCE(SUM(count), 0) AS used
    FROM usage_logs
    WHERE user_id = ${userId}
      AND type = ${usageType}
      AND created_at >= date_trunc('month', CURRENT_TIMESTAMP)
  `;

  const used = Number(row?.used ?? 0);
  const remaining = Math.max(0, limit - used);

  return {
    allowed: used < limit,
    used,
    limit,
    remaining,
  };
}

// ── Record usage ─────────────────────────────────────────────
/**
 * Record a usage event for billing tracking.
 */
export async function recordUsage(
  userId: string,
  usageType: UsageType,
  count: number = 1
): Promise<void> {
  if (!process.env.DATABASE_URL) return;

  const sql = await getNeon();
  const id = crypto.randomUUID();

  await sql`
    INSERT INTO usage_logs (id, user_id, type, count, created_at)
    VALUES (${id}, ${userId}, ${usageType}, ${count}, NOW())
  `;
}

// ── Get usage summary for a user ────────────────────────────
export async function getUsageSummary(
  userId: string,
  userPlan: string | null | undefined
): Promise<Record<UsageType, { used: number; limit: number; remaining: number }>> {
  const tier = normalizePlan(userPlan);
  const types: UsageType[] = ["eligibility_check", "claim_submission", "ai_code_review"];

  const result: Record<string, { used: number; limit: number; remaining: number }> = {};

  if (!process.env.DATABASE_URL) {
    for (const t of types) {
      const limit = MONTHLY_LIMITS[tier][t];
      result[t] = { used: 0, limit, remaining: limit === -1 ? -1 : limit };
    }
    return result as any;
  }

  const sql = await getNeon();
  const rows = await sql`
    SELECT type, COALESCE(SUM(count), 0) AS used
    FROM usage_logs
    WHERE user_id = ${userId}
      AND created_at >= date_trunc('month', CURRENT_TIMESTAMP)
    GROUP BY type
  `;

  const usageMap: Record<string, number> = {};
  for (const row of rows) {
    usageMap[row.type] = Number(row.used);
  }

  for (const t of types) {
    const limit = MONTHLY_LIMITS[tier][t];
    const used = usageMap[t] || 0;
    result[t] = {
      used,
      limit,
      remaining: limit === -1 ? -1 : Math.max(0, limit - used),
    };
  }

  return result as any;
}

// ── API route wrapper ───────────────────────────────────────
/**
 * Higher-order function to wrap API routes with tier access control.
 *
 * Usage:
 *   export const POST = withTierAccess("pro", async (req, { userId, plan }) => {
 *     // your handler logic
 *   });
 */
export function withTierAccess(
  requiredFeature: Feature,
  handler: (
    req: NextRequest,
    context: { userId: string; plan: string; email: string }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const session = await auth();
      if (!session?.user?.email || !session?.user?.id) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }

      const plan = (session.user as any)?.plan || "free";
      const access = checkAccess(plan, requiredFeature);

      if (!access.allowed) {
        return NextResponse.json(
          {
            error: "Upgrade required",
            requiredTier: access.requiredTier,
            currentTier: normalizePlan(plan),
          },
          { status: 403 }
        );
      }

      return handler(req, {
        userId: session.user.id,
        plan,
        email: session.user.email,
      });
    } catch (err) {
      console.error("[access-control] Error:", err);
      return NextResponse.json(
        { error: "Access check failed" },
        { status: 500 }
      );
    }
  };
}
