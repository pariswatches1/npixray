import { NextRequest, NextResponse } from "next/server";
import { getMultipleProviders, getAllBenchmarks } from "@/lib/db-queries";
import { analyzePortfolio } from "@/lib/acquisition-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const npis: string[] = body.npis;

    if (!npis || !Array.isArray(npis) || npis.length < 2) {
      return NextResponse.json(
        { error: "Provide at least 2 NPIs" },
        { status: 400 }
      );
    }

    if (npis.length > 20) {
      return NextResponse.json(
        { error: "Maximum 20 NPIs per request" },
        { status: 400 }
      );
    }

    // Validate NPI format
    const validNpis = npis.filter((n) => /^\d{10}$/.test(n));
    if (validNpis.length < 2) {
      return NextResponse.json(
        { error: "Provide at least 2 valid 10-digit NPIs" },
        { status: 400 }
      );
    }

    const [providers, benchmarks] = await Promise.all([
      getMultipleProviders(validNpis),
      getAllBenchmarks(),
    ]);

    if (!providers || providers.length === 0) {
      return NextResponse.json(
        { error: "No providers found for the given NPIs" },
        { status: 404 }
      );
    }

    const analysis = analyzePortfolio(providers, benchmarks);

    return NextResponse.json(analysis, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (err) {
    console.error("Portfolio analysis error:", err);
    return NextResponse.json(
      { error: "Failed to analyze portfolio" },
      { status: 500 }
    );
  }
}
