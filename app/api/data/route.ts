import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import { join } from "path";

const DB_PATH = join(process.cwd(), "data", "cms.db");

// eslint-disable-next-line
function getDb(): any {
  if (!existsSync(DB_PATH)) return null;
  try {
    // eslint-disable-next-line
    const Database = require("better-sqlite3");
    return new Database(DB_PATH, { readonly: true });
  } catch {
    return null;
  }
}

const VALID_STATE_RE = /^[A-Z]{2}$/;

interface AggregateResult {
  providers: number;
  avgPayment: number;
  totalPayment: number;
  totalServices: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const state = searchParams.get("state")?.toUpperCase() ?? null;
  const specialty = searchParams.get("specialty") ?? null;

  // Validate state param if provided
  if (state && !VALID_STATE_RE.test(state)) {
    return NextResponse.json(
      { error: "Invalid state parameter. Must be a 2-letter state abbreviation (e.g., FL, CA, NY)." },
      { status: 400 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Data not available. The CMS database has not been initialized." },
      { status: 503 }
    );
  }

  try {
    let result: AggregateResult;

    if (state && specialty) {
      // Filter by both state and specialty
      const row = db
        .prepare(
          `SELECT COUNT(*) as providers,
                  AVG(total_medicare_payment) as avgPayment,
                  SUM(total_medicare_payment) as totalPayment,
                  SUM(total_services) as totalServices
           FROM providers
           WHERE state = ? AND specialty = ?`
        )
        .get(state, specialty) as AggregateResult;
      result = row;
    } else if (state) {
      // Filter by state only
      const row = db
        .prepare(
          `SELECT COUNT(*) as providers,
                  AVG(total_medicare_payment) as avgPayment,
                  SUM(total_medicare_payment) as totalPayment,
                  SUM(total_services) as totalServices
           FROM providers
           WHERE state = ?`
        )
        .get(state) as AggregateResult;
      result = row;
    } else if (specialty) {
      // Filter by specialty only
      const row = db
        .prepare(
          `SELECT COUNT(*) as providers,
                  AVG(total_medicare_payment) as avgPayment,
                  SUM(total_medicare_payment) as totalPayment,
                  SUM(total_services) as totalServices
           FROM providers
           WHERE specialty = ?`
        )
        .get(specialty) as AggregateResult;
      result = row;
    } else {
      // National stats (no filters)
      const row = db
        .prepare(
          `SELECT COUNT(*) as providers,
                  AVG(total_medicare_payment) as avgPayment,
                  SUM(total_medicare_payment) as totalPayment,
                  SUM(total_services) as totalServices
           FROM providers`
        )
        .get() as AggregateResult;
      result = row;
    }

    // Handle case where no data matches
    if (!result || result.providers === 0) {
      return NextResponse.json(
        { error: "No data found for the specified filters." },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      providers: result.providers,
      avgPayment: Math.round((result.avgPayment ?? 0) * 100) / 100,
      totalPayment: Math.round((result.totalPayment ?? 0) * 100) / 100,
      totalServices: result.totalServices ?? 0,
    });

    // Cache for 1 hour
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=7200"
    );

    return response;
  } catch (err) {
    console.error("Data API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
