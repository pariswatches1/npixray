import { NextRequest, NextResponse } from "next/server";
import { lookupByNPI, searchByName } from "@/lib/npi-api";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const npi = searchParams.get("npi");
  const lastName = searchParams.get("last_name");
  const firstName = searchParams.get("first_name");
  const state = searchParams.get("state");

  try {
    // Lookup by NPI number
    if (npi) {
      if (!/^\d{10}$/.test(npi)) {
        return NextResponse.json(
          { error: "Invalid NPI. Must be a 10-digit number." },
          { status: 400 }
        );
      }
      const provider = await lookupByNPI(npi);
      if (!provider) {
        return NextResponse.json(
          { error: "No provider found for this NPI." },
          { status: 404 }
        );
      }
      return NextResponse.json({ provider });
    }

    // Search by name
    if (lastName) {
      const results = await searchByName(
        lastName,
        firstName || undefined,
        state || undefined
      );
      return NextResponse.json({ results });
    }

    return NextResponse.json(
      { error: "Provide either 'npi' or 'last_name' parameter." },
      { status: 400 }
    );
  } catch (err) {
    console.error("NPI lookup error:", err);
    return NextResponse.json(
      { error: "Failed to look up provider. Please try again." },
      { status: 500 }
    );
  }
}
