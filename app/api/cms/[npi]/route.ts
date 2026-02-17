import { NextRequest, NextResponse } from "next/server";
import {
  lookupCMSData,
  lookupCMSBenchmark,
  isCMSDataAvailable,
} from "@/lib/cms-data";

/**
 * GET /api/cms/[npi]
 *
 * Returns the CMS Medicare billing data for a specific provider.
 * Reads from the local SQLite database (data/cms.db).
 *
 * Query params:
 *   ?benchmark=1  — also include specialty benchmark data in the response
 *
 * Responses:
 *   200  — provider data found
 *   404  — NPI not found in CMS dataset
 *   503  — CMS database not available (hasn't been built yet)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ npi: string }> }
) {
  const { npi } = await params;

  // Validate NPI format (10 digits)
  if (!npi || !/^\d{10}$/.test(npi)) {
    return NextResponse.json(
      { error: "Invalid NPI. Must be a 10-digit number." },
      { status: 400 }
    );
  }

  // Check if database is available
  if (!isCMSDataAvailable()) {
    return NextResponse.json(
      {
        error: "CMS database not available. Run 'npm run cms:build-db' first.",
      },
      { status: 503 }
    );
  }

  // Look up provider
  const provider = lookupCMSData(npi);

  if (!provider) {
    return NextResponse.json(
      { error: `NPI ${npi} not found in CMS Medicare dataset.` },
      { status: 404 }
    );
  }

  // Optionally include benchmark data
  const includeBenchmark = request.nextUrl.searchParams.get("benchmark");
  let benchmark = null;
  if (includeBenchmark === "1" || includeBenchmark === "true") {
    benchmark = lookupCMSBenchmark(provider.specialty);
  }

  return NextResponse.json(
    {
      provider,
      benchmark,
      source: "CMS Medicare Physician & Other Practitioners (CY2023)",
    },
    {
      status: 200,
      headers: {
        // Cache for 1 hour — this data doesn't change often
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
