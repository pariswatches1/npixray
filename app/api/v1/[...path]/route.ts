import { NextRequest, NextResponse } from "next/server";
import {
  getProvider,
  getProviderCodes,
  getAllBenchmarks,
  getBenchmarkBySpecialty,
  getStateStats,
  getAllStates,
  getStateSpecialties,
  getStateCities,
  getStateTopProviders,
  getCityProviders,
  getCityStats,
  getCitySpecialties,
  getSpecialtyProviders,
  getSpecialtyByState,
  getNationalStats,
  getDistinctSpecialties,
  stateAbbrToName,
  specialtyToSlug,
  type ProviderRow,
  type BenchmarkRow,
} from "@/lib/db-queries";
import { checkRateLimit, validateApiKey, type RateLimitResult } from "@/lib/api-keys";
import { estimateMissedRevenue, calculateCaptureRate, calculateAdoptionRates, calculateEMDistribution } from "@/lib/report-utils";

// ── Helpers ────────────────────────────────────────────────

function jsonResponse(data: unknown, status = 200, rateLimit?: RateLimitResult) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  };
  if (rateLimit) {
    headers["X-RateLimit-Limit"] = String(rateLimit.limit);
    headers["X-RateLimit-Remaining"] = String(rateLimit.remaining);
    headers["X-RateLimit-Reset"] = rateLimit.resetAt;
  }
  return NextResponse.json(data, { status, headers });
}

function errorResponse(message: string, status: number, rateLimit?: RateLimitResult) {
  return jsonResponse({ error: message, status }, status, rateLimit);
}

function providerRevenueScore(p: ProviderRow, benchmark: BenchmarkRow | null): number {
  if (!benchmark || !p.total_beneficiaries) return 50;
  let score = 0, factors = 0;
  const emTotal = p.em_total || 1;
  score += Math.min((p.em_99214 || 0) / emTotal / (benchmark.pct_99214 || 0.5), 1.0);
  factors++;
  const actualRPP = p.total_beneficiaries > 0 ? p.total_medicare_payment / p.total_beneficiaries : 0;
  score += Math.min(actualRPP / (benchmark.avg_revenue_per_patient || 400), 1.0);
  factors++;
  const cm = ((p.ccm_99490_services || 0) > 0 ? 1 : 0) +
    (((p.rpm_99454_services || 0) > 0 || (p.rpm_99457_services || 0) > 0) ? 1 : 0) +
    (((p.awv_g0438_services || 0) > 0 || (p.awv_g0439_services || 0) > 0) ? 1 : 0) +
    ((p.bhi_99484_services || 0) > 0 ? 1 : 0);
  score += cm / 4;
  factors++;
  return Math.round((score / factors) * 100);
}

function basicProviderResponse(p: ProviderRow, benchmark: BenchmarkRow | null) {
  return {
    npi: p.npi,
    name: `${p.first_name} ${p.last_name}`.trim(),
    credential: p.credential || null,
    specialty: p.specialty,
    state: p.state,
    city: p.city,
    total_medicare_payment: p.total_medicare_payment,
    total_beneficiaries: p.total_beneficiaries,
    total_services: p.total_services,
    revenue_score: providerRevenueScore(p, benchmark),
  };
}

function fullProviderResponse(p: ProviderRow, benchmark: BenchmarkRow | null) {
  const base = basicProviderResponse(p, benchmark);
  return {
    ...base,
    em_distribution: {
      em_99211: p.em_99211,
      em_99212: p.em_99212,
      em_99213: p.em_99213,
      em_99214: p.em_99214,
      em_99215: p.em_99215,
      em_total: p.em_total,
    },
    care_management: {
      ccm_99490_services: p.ccm_99490_services,
      ccm_99490_payment: p.ccm_99490_payment,
      rpm_99454_services: p.rpm_99454_services,
      rpm_99457_services: p.rpm_99457_services,
      rpm_payment: p.rpm_payment,
      bhi_99484_services: p.bhi_99484_services,
      bhi_99484_payment: p.bhi_99484_payment,
      awv_g0438_services: p.awv_g0438_services,
      awv_g0439_services: p.awv_g0439_services,
      awv_payment: p.awv_payment,
    },
    estimated_missed_revenue: benchmark ? estimateMissedRevenue([p], [benchmark]) : null,
    benchmark: benchmark ? {
      specialty: benchmark.specialty,
      provider_count: benchmark.provider_count,
      avg_medicare_patients: benchmark.avg_medicare_patients,
      avg_total_payment: benchmark.avg_total_payment,
      pct_99214: benchmark.pct_99214,
      pct_99215: benchmark.pct_99215,
      ccm_adoption_rate: benchmark.ccm_adoption_rate,
      rpm_adoption_rate: benchmark.rpm_adoption_rate,
      awv_adoption_rate: benchmark.awv_adoption_rate,
    } : null,
  };
}

// ── Auth & rate limiting ──────────────────────────────────

function authenticate(req: NextRequest): { tier: string; identifier: string; rateLimit: RateLimitResult } {
  const authHeader = req.headers.get("authorization") || req.headers.get("x-api-key") || "";
  const apiKey = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (apiKey && apiKey.startsWith("npx_")) {
    const keyData = validateApiKey(apiKey);
    if (keyData) {
      const rl = checkRateLimit(`key:${apiKey}`, keyData.tier);
      return { tier: keyData.tier, identifier: `key:${apiKey}`, rateLimit: rl };
    }
  }

  // Anonymous — rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") || "unknown";
  const rl = checkRateLimit(`ip:${ip}`, "anonymous");
  return { tier: "anonymous", identifier: `ip:${ip}`, rateLimit: rl };
}

// ── Search helper (uses direct DB) ─────────────────────────

function searchProviders(name: string, state?: string, specialty?: string, limit = 20): ProviderRow[] {
  try {
    const { existsSync: ex } = require("fs");
    const { join: j } = require("path");
    const dbPath = j(process.cwd(), "data", "cms.db");
    if (!ex(dbPath)) return [];
    const Database = require("better-sqlite3");
    const db = new Database(dbPath, { readonly: true });

    const conditions: string[] = [];
    const params: any[] = [];

    if (name) {
      conditions.push("(LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ? OR LOWER(first_name || ' ' || last_name) LIKE ?)");
      const pattern = `%${name.toLowerCase()}%`;
      params.push(pattern, pattern, pattern);
    }
    if (state) {
      conditions.push("state = ?");
      params.push(state.toUpperCase());
    }
    if (specialty) {
      conditions.push("specialty = ?");
      params.push(specialty);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = db.prepare(
      `SELECT * FROM providers ${where} ORDER BY total_medicare_payment DESC LIMIT ?`
    ).all(...params, limit) as ProviderRow[];

    db.close();
    return rows;
  } catch {
    return [];
  }
}

// ── Score distribution helper ──────────────────────────────

function getScoreDistribution(state?: string, specialty?: string): { bucket: string; count: number }[] {
  try {
    const { existsSync: ex } = require("fs");
    const { join: j } = require("path");
    const dbPath = j(process.cwd(), "data", "cms.db");
    if (!ex(dbPath)) return [];
    const Database = require("better-sqlite3");
    const db = new Database(dbPath, { readonly: true });

    const conditions: string[] = [];
    const params: any[] = [];
    if (state) { conditions.push("state = ?"); params.push(state.toUpperCase()); }
    if (specialty) { conditions.push("specialty = ?"); params.push(specialty); }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const rows = db.prepare(
      `SELECT * FROM providers ${where} ORDER BY total_medicare_payment DESC LIMIT 500`
    ).all(...params) as ProviderRow[];
    db.close();

    const benchmarks = getAllBenchmarks();
    const benchmarkMap = new Map<string, BenchmarkRow>();
    for (const b of benchmarks) benchmarkMap.set(b.specialty, b);

    const buckets: Record<string, number> = {
      "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0,
    };

    for (const p of rows) {
      const score = providerRevenueScore(p, benchmarkMap.get(p.specialty) ?? null);
      if (score <= 20) buckets["0-20"]++;
      else if (score <= 40) buckets["21-40"]++;
      else if (score <= 60) buckets["41-60"]++;
      else if (score <= 80) buckets["61-80"]++;
      else buckets["81-100"]++;
    }

    return Object.entries(buckets).map(([bucket, count]) => ({ bucket, count }));
  } catch {
    return [];
  }
}

// ── Route handler ──────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const { searchParams } = request.nextUrl;
  const { tier, rateLimit } = authenticate(request);

  // Rate limit check
  if (!rateLimit.allowed) {
    return errorResponse(
      `Rate limit exceeded. Limit: ${rateLimit.limit}/day. Resets: ${rateLimit.resetAt}`,
      429,
      rateLimit
    );
  }

  const isPro = tier === "pro";
  const segment0 = path[0] || "";
  const segment1 = path[1] || "";
  const segment2 = path[2] || "";
  const segment3 = path[3] || "";

  try {
    // ── GET /api/v1/provider/[npi] ─────────────────────────
    if (segment0 === "provider" && segment1 && /^\d{10}$/.test(segment1)) {
      const provider = getProvider(segment1);
      if (!provider) {
        return errorResponse("Provider not found", 404, rateLimit);
      }

      const benchmarks = getAllBenchmarks();
      const benchmark = benchmarks.find((b) => b.specialty === provider.specialty) ?? null;

      // /provider/[npi]/full — Pro only
      if (segment2 === "full") {
        if (!isPro) {
          return errorResponse("Pro API key required for /full endpoint. Get one at npixray.com/developers", 403, rateLimit);
        }
        return jsonResponse({ data: fullProviderResponse(provider, benchmark) }, 200, rateLimit);
      }

      // /provider/[npi]/codes — Pro only
      if (segment2 === "codes") {
        if (!isPro) {
          return errorResponse("Pro API key required for /codes endpoint. Get one at npixray.com/developers", 403, rateLimit);
        }
        const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);
        const codes = getProviderCodes(segment1, limit);
        return jsonResponse({
          data: {
            npi: provider.npi,
            name: `${provider.first_name} ${provider.last_name}`.trim(),
            codes: codes.map((c) => ({
              hcpcs_code: c.hcpcs_code,
              services: c.services,
              payment: c.payment,
              beneficiaries: c.beneficiaries,
            })),
          },
        }, 200, rateLimit);
      }

      // /provider/[npi] — Free tier: basic info + score
      return jsonResponse({ data: basicProviderResponse(provider, benchmark) }, 200, rateLimit);
    }

    // ── GET /api/v1/search?name=...&state=...&specialty=... ──
    if (segment0 === "search") {
      const name = searchParams.get("name") || "";
      const state = searchParams.get("state") || "";
      const specialty = searchParams.get("specialty") || "";
      const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

      if (!name && !state && !specialty) {
        return errorResponse("At least one search parameter (name, state, specialty) is required", 400, rateLimit);
      }

      const results = searchProviders(name, state || undefined, specialty || undefined, limit);
      const benchmarks = getAllBenchmarks();
      const benchmarkMap = new Map<string, BenchmarkRow>();
      for (const b of benchmarks) benchmarkMap.set(b.specialty, b);

      return jsonResponse({
        data: results.map((p) => basicProviderResponse(p, benchmarkMap.get(p.specialty) ?? null)),
        total: results.length,
      }, 200, rateLimit);
    }

    // ── GET /api/v1/benchmarks ─────────────────────────────
    if (segment0 === "benchmarks") {
      // /benchmarks/[specialty]
      if (segment1) {
        const allBenchmarks = getAllBenchmarks();
        const match = allBenchmarks.find(
          (b) => specialtyToSlug(b.specialty) === segment1 || b.specialty.toLowerCase() === segment1.toLowerCase()
        );
        if (!match) {
          return errorResponse("Specialty not found", 404, rateLimit);
        }
        return jsonResponse({ data: match }, 200, rateLimit);
      }

      // /benchmarks — list all
      const allBenchmarks = getAllBenchmarks();
      return jsonResponse({
        data: allBenchmarks,
        total: allBenchmarks.length,
      }, 200, rateLimit);
    }

    // ── GET /api/v1/stats/[state] ─────────────────────────
    if (segment0 === "stats") {
      if (segment1) {
        const stateAbbr = segment1.toUpperCase();
        const stats = getStateStats(stateAbbr);
        if (!stats || !stats.totalProviders) {
          return errorResponse("State not found", 404, rateLimit);
        }

        const specialties = getStateSpecialties(stateAbbr, 20);
        const cities = getStateCities(stateAbbr, 20);

        return jsonResponse({
          data: {
            state: stateAbbr,
            name: stateAbbrToName(stateAbbr),
            total_providers: stats.totalProviders,
            total_payment: stats.totalPayment,
            total_services: stats.totalServices,
            avg_payment: stats.avgPayment,
            top_specialties: specialties.map((s) => ({
              specialty: s.specialty,
              providers: s.count,
              avg_payment: Math.round(s.avgPayment),
            })),
            top_cities: cities.map((c) => ({
              city: c.city,
              providers: c.count,
              avg_payment: Math.round(c.avgPayment),
            })),
          },
        }, 200, rateLimit);
      }

      // /stats — all states
      const allStates = getAllStates();
      return jsonResponse({
        data: allStates.map((s) => ({
          state: s.state,
          name: stateAbbrToName(s.state),
          total_providers: s.totalProviders,
          total_payment: s.totalPayment,
          avg_payment: Math.round(s.avgPayment),
        })),
        total: allStates.length,
      }, 200, rateLimit);
    }

    // ── GET /api/v1/compare?npis=123,456,789 — Pro only ───
    if (segment0 === "compare") {
      if (!isPro) {
        return errorResponse("Pro API key required for /compare endpoint. Get one at npixray.com/developers", 403, rateLimit);
      }

      const npisParam = searchParams.get("npis") || "";
      const npis = npisParam.split(",").map((n) => n.trim()).filter((n) => /^\d{10}$/.test(n));

      if (npis.length < 2 || npis.length > 10) {
        return errorResponse("Provide 2-10 comma-separated NPIs", 400, rateLimit);
      }

      const benchmarks = getAllBenchmarks();
      const benchmarkMap = new Map<string, BenchmarkRow>();
      for (const b of benchmarks) benchmarkMap.set(b.specialty, b);

      const providers = npis.map((npi) => {
        const p = getProvider(npi);
        if (!p) return { npi, error: "Not found" };
        return fullProviderResponse(p, benchmarkMap.get(p.specialty) ?? null);
      });

      return jsonResponse({ data: providers }, 200, rateLimit);
    }

    // ── GET /api/v1/market/[state]/[city]/[specialty] — Pro ─
    if (segment0 === "market") {
      if (!isPro) {
        return errorResponse("Pro API key required for /market endpoint. Get one at npixray.com/developers", 403, rateLimit);
      }

      const state = segment1?.toUpperCase();
      const city = segment2 ? decodeURIComponent(segment2) : "";
      const specialty = segment3 ? decodeURIComponent(segment3) : "";

      if (!state) {
        return errorResponse("State is required: /market/[state]/[city]/[specialty]", 400, rateLimit);
      }

      const stateStats = getStateStats(state);
      if (!stateStats || !stateStats.totalProviders) {
        return errorResponse("State not found", 404, rateLimit);
      }

      const benchmarks = getAllBenchmarks();
      const benchmarkMap = new Map<string, BenchmarkRow>();
      for (const b of benchmarks) benchmarkMap.set(b.specialty, b);

      let providers: ProviderRow[] = [];
      if (city && specialty) {
        // Import getCitySpecialtyProviders
        const { getCitySpecialtyProviders } = require("@/lib/db-queries");
        providers = getCitySpecialtyProviders(state, city, specialty, 100);
      } else if (city) {
        providers = getCityProviders(state, city, 100);
      } else if (specialty) {
        const { getSpecialtyStateProviders } = require("@/lib/db-queries");
        providers = getSpecialtyStateProviders(specialty, state, 100);
      } else {
        providers = getStateTopProviders(state, 100);
      }

      const adoption = calculateAdoptionRates(providers);
      const emDist = calculateEMDistribution(providers);
      const captureRate = calculateCaptureRate(providers, benchmarks);
      const missed = estimateMissedRevenue(providers, benchmarks);

      return jsonResponse({
        data: {
          market: { state, city: city || null, specialty: specialty || null },
          summary: {
            providers: providers.length,
            total_payment: providers.reduce((s, p) => s + p.total_medicare_payment, 0),
            avg_payment: providers.length > 0
              ? Math.round(providers.reduce((s, p) => s + p.total_medicare_payment, 0) / providers.length)
              : 0,
            estimated_missed_revenue: missed,
            capture_rate: Math.round(captureRate * 100),
          },
          adoption_rates: {
            ccm: Math.round(adoption.ccm * 100),
            rpm: Math.round(adoption.rpm * 100),
            bhi: Math.round(adoption.bhi * 100),
            awv: Math.round(adoption.awv * 100),
          },
          em_distribution: {
            pct_99213: Math.round(emDist.pct99213 * 100),
            pct_99214: Math.round(emDist.pct99214 * 100),
            pct_99215: Math.round(emDist.pct99215 * 100),
          },
          top_providers: providers.slice(0, 20).map((p) =>
            basicProviderResponse(p, benchmarkMap.get(p.specialty) ?? null)
          ),
        },
      }, 200, rateLimit);
    }

    // ── GET /api/v1/scores/[state]/[specialty] — Pro only ──
    if (segment0 === "scores") {
      if (!isPro) {
        return errorResponse("Pro API key required for /scores endpoint. Get one at npixray.com/developers", 403, rateLimit);
      }

      const state = segment1?.toUpperCase() || undefined;
      const specialty = segment2 ? decodeURIComponent(segment2) : undefined;

      const distribution = getScoreDistribution(state, specialty);
      return jsonResponse({
        data: {
          state: state || null,
          specialty: specialty || null,
          distribution,
          total: distribution.reduce((s, b) => s + b.count, 0),
        },
      }, 200, rateLimit);
    }

    // ── GET /api/v1/specialties — list all specialties ──────
    if (segment0 === "specialties") {
      const specs = getDistinctSpecialties();
      return jsonResponse({
        data: specs,
        total: specs.length,
      }, 200, rateLimit);
    }

    // ── 404 ────────────────────────────────────────────────
    return errorResponse(
      `Unknown endpoint: /api/v1/${path.join("/")}. See docs at npixray.com/api-docs`,
      404,
      rateLimit
    );
  } catch (err) {
    console.error("[api/v1] Error:", err);
    return errorResponse("Internal server error", 500, rateLimit);
  }
}

// ── CORS preflight ──────────────────────────────────────────

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, X-API-Key, Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
