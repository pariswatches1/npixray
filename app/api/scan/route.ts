import { NextRequest, NextResponse } from "next/server";
import { lookupByNPI } from "@/lib/npi-api";
import { calculateScanResult } from "@/lib/revenue-calc";

export async function GET(request: NextRequest) {
  const npi = request.nextUrl.searchParams.get("npi");

  if (!npi || !/^\d{10}$/.test(npi)) {
    return NextResponse.json(
      { error: "Invalid NPI. Must be a 10-digit number." },
      { status: 400 }
    );
  }

  try {
    const provider = await lookupByNPI(npi);
    if (!provider) {
      return NextResponse.json(
        { error: "No provider found for this NPI." },
        { status: 404 }
      );
    }

    const result = calculateScanResult(provider);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json(
      { error: "Failed to complete scan. Please try again." },
      { status: 500 }
    );
  }
}
