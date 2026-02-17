import { NextRequest, NextResponse } from "next/server";
import {
  getAllStates,
  getAllBenchmarks,
  stateAbbrToName,
  stateToSlug,
  specialtyToSlug,
  formatCurrency,
  formatNumber,
  type ProviderRow,
  type BenchmarkRow,
} from "@/lib/db-queries";
import { estimateMissedRevenue } from "@/lib/report-utils";

const COOKIE_NAME = "npixray_admin";
const COOKIE_VALUE = "authenticated";

function isAuthed(req: NextRequest): boolean {
  return req.cookies.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

// ── Revenue score for a single provider ────────────────────

function providerRevenueScore(p: ProviderRow, benchmark: BenchmarkRow | null): number {
  if (!benchmark || !p.total_beneficiaries) return 50;

  let score = 0;
  let factors = 0;

  // E&M coding efficiency
  const emTotal = p.em_total || 1;
  const actual214 = (p.em_99214 || 0) / emTotal;
  const bench214 = benchmark.pct_99214 || 0.5;
  score += Math.min(actual214 / bench214, 1.0);
  factors++;

  // Revenue per patient
  const actualRPP = p.total_beneficiaries > 0
    ? p.total_medicare_payment / p.total_beneficiaries
    : 0;
  const benchRPP = benchmark.avg_revenue_per_patient || 400;
  score += Math.min(actualRPP / benchRPP, 1.0);
  factors++;

  // Care management adoption
  const hasCCM = (p.ccm_99490_services || 0) > 0 ? 1 : 0;
  const hasRPM = ((p.rpm_99454_services || 0) > 0 || (p.rpm_99457_services || 0) > 0) ? 1 : 0;
  const hasAWV = ((p.awv_g0438_services || 0) > 0 || (p.awv_g0439_services || 0) > 0) ? 1 : 0;
  const hasBHI = (p.bhi_99484_services || 0) > 0 ? 1 : 0;
  score += (hasCCM + hasRPM + hasAWV + hasBHI) / 4;
  factors++;

  return Math.round((factors > 0 ? score / factors : 0.5) * 100);
}

function providerMissedRevenue(p: ProviderRow, benchmark: BenchmarkRow | null): number {
  if (!benchmark) return 0;
  return estimateMissedRevenue([p], [benchmark]);
}

function providerCCMGap(p: ProviderRow, benchmark: BenchmarkRow | null): number {
  if (!benchmark || !p.total_beneficiaries) return 0;
  const hasCCM = (p.ccm_99490_services || 0) > 0;
  if (hasCCM || (benchmark.ccm_adoption_rate || 0) < 0.02) return 0;
  const eligiblePct = Math.min(benchmark.ccm_adoption_rate * 3, 0.25);
  return Math.round(p.total_beneficiaries * eligiblePct * 62 * 6);
}

// ── GET handler ─────────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;

  const filterState = searchParams.get("state") || "";
  const filterCity = searchParams.get("city") || "";
  const filterSpecialty = searchParams.get("specialty") || "";
  const minScore = parseInt(searchParams.get("minScore") || "0", 10);
  const maxScore = parseInt(searchParams.get("maxScore") || "100", 10);
  const minGap = parseInt(searchParams.get("minGap") || "0", 10);
  const minCCMGap = parseInt(searchParams.get("minCCMGap") || "0", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "200", 10), 2000);
  const format = searchParams.get("format") || "json";

  // Dynamic import to avoid module resolution at import time
  let getDb: () => any;
  try {
    const mod = await import("@/lib/db-queries");
    // Access internal db through a query
    getDb = () => {
      // We need direct db access for the filter query
      const { existsSync } = require("fs");
      const { join } = require("path");
      const DB_PATH = join(process.cwd(), "data", "cms.db");
      if (!existsSync(DB_PATH)) return null;
      const Database = require("better-sqlite3");
      const db = new Database(DB_PATH, { readonly: true });
      db.pragma("journal_mode = WAL");
      return db;
    };
  } catch {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not found" }, { status: 503 });
  }

  // Build benchmark map
  const benchmarks = getAllBenchmarks();
  const benchmarkMap = new Map<string, BenchmarkRow>();
  for (const b of benchmarks) {
    benchmarkMap.set(b.specialty, b);
  }

  // Build SQL query with filters
  const conditions: string[] = [];
  const params: any[] = [];

  if (filterState) {
    conditions.push("state = ?");
    params.push(filterState.toUpperCase());
  }
  if (filterCity) {
    conditions.push("LOWER(city) = LOWER(?)");
    params.push(filterCity);
  }
  if (filterSpecialty) {
    conditions.push("specialty = ?");
    params.push(filterSpecialty);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = db.prepare(
    `SELECT * FROM providers ${where} ORDER BY total_medicare_payment DESC LIMIT ?`
  ).all(...params, limit * 3) as ProviderRow[];

  db.close();

  // Apply revenue score and gap filters in JS
  interface OutreachRow {
    npi: string;
    name: string;
    credential: string;
    specialty: string;
    state: string;
    city: string;
    totalPayment: number;
    totalPatients: number;
    revenueScore: number;
    totalGap: number;
    ccmGap: number;
  }

  const results: OutreachRow[] = [];

  for (const p of rows) {
    if (results.length >= limit) break;

    const bench = benchmarkMap.get(p.specialty) ?? null;
    const score = providerRevenueScore(p, bench);
    const gap = providerMissedRevenue(p, bench);
    const ccmGap = providerCCMGap(p, bench);

    if (score < minScore || score > maxScore) continue;
    if (gap < minGap) continue;
    if (ccmGap < minCCMGap) continue;

    results.push({
      npi: p.npi,
      name: `${p.first_name} ${p.last_name}`.trim(),
      credential: p.credential || "",
      specialty: p.specialty,
      state: p.state,
      city: p.city,
      totalPayment: p.total_medicare_payment,
      totalPatients: p.total_beneficiaries,
      revenueScore: score,
      totalGap: gap,
      ccmGap,
    });
  }

  // CSV export
  if (format === "csv") {
    const header = "NPI,Name,Credential,Specialty,State,City,Medicare Payment,Patients,Revenue Score,Total Gap,CCM Gap";
    const csvRows = results.map((r) =>
      [
        r.npi,
        `"${r.name}"`,
        `"${r.credential}"`,
        `"${r.specialty}"`,
        r.state,
        `"${r.city}"`,
        r.totalPayment,
        r.totalPatients,
        r.revenueScore,
        r.totalGap,
        r.ccmGap,
      ].join(",")
    );
    const csv = [header, ...csvRows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="outreach-${Date.now()}.csv"`,
      },
    });
  }

  // Get available filter options
  const states = getAllStates().map((s) => ({ abbr: s.state, name: stateAbbrToName(s.state) }));
  const specialties = benchmarks.map((b) => b.specialty).sort();

  return NextResponse.json({
    results,
    total: results.length,
    filters: { states, specialties },
  });
}
