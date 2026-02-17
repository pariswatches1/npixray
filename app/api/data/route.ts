import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

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

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Data not available. The database has not been configured." },
      { status: 503 }
    );
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    let rows: AggregateResult[];

    if (state && specialty) {
      // Filter by both state and specialty
      rows = await sql.query(
        `SELECT COUNT(*) as providers,
                AVG(total_medicare_payment) as "avgPayment",
                SUM(total_medicare_payment) as "totalPayment",
                SUM(total_services) as "totalServices"
         FROM providers
         WHERE state = $1 AND specialty = $2`,
        [state, specialty]
      ) as AggregateResult[];
    } else if (state) {
      // Filter by state only
      rows = await sql.query(
        `SELECT COUNT(*) as providers,
                AVG(total_medicare_payment) as "avgPayment",
                SUM(total_medicare_payment) as "totalPayment",
                SUM(total_services) as "totalServices"
         FROM providers
         WHERE state = $1`,
        [state]
      ) as AggregateResult[];
    } else if (specialty) {
      // Filter by specialty only
      rows = await sql.query(
        `SELECT COUNT(*) as providers,
                AVG(total_medicare_payment) as "avgPayment",
                SUM(total_medicare_payment) as "totalPayment",
                SUM(total_services) as "totalServices"
         FROM providers
         WHERE specialty = $1`,
        [specialty]
      ) as AggregateResult[];
    } else {
      // National stats (no filters)
      rows = await sql.query(
        `SELECT COUNT(*) as providers,
                AVG(total_medicare_payment) as "avgPayment",
                SUM(total_medicare_payment) as "totalPayment",
                SUM(total_services) as "totalServices"
         FROM providers`
      ) as AggregateResult[];
    }

    const result = rows[0];

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
