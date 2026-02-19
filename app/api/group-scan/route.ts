import { NextRequest, NextResponse } from "next/server";
import { scanBatch, aggregateGroupResults } from "@/lib/group-scan";

/**
 * POST /api/group-scan
 *
 * Accepts a list of NPIs, scans each in parallel (concurrency-limited),
 * and returns an aggregated GroupScanResult.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { npis: rawNpis, practiceName } = body as {
      npis: string[];
      practiceName?: string;
    };

    // Validate input
    if (!Array.isArray(rawNpis) || rawNpis.length === 0) {
      return NextResponse.json(
        { error: "npis must be a non-empty array" },
        { status: 400 }
      );
    }

    // Deduplicate and validate NPIs
    const npis = [...new Set(rawNpis.filter((n) => /^\d{10}$/.test(n)))];

    if (npis.length < 2) {
      return NextResponse.json(
        { error: "At least 2 valid 10-digit NPIs are required" },
        { status: 400 }
      );
    }

    if (npis.length > 50) {
      return NextResponse.json(
        { error: "Maximum 50 NPIs per group scan" },
        { status: 400 }
      );
    }

    // Run batch scan
    const scanMap = await scanBatch(npis);

    // Aggregate results
    const groupResult = aggregateGroupResults(
      scanMap,
      practiceName || "Group Practice"
    );

    return NextResponse.json({ groupResult }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (err) {
    console.error("[group-scan] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
