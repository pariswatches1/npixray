import { NextRequest, NextResponse } from "next/server";
import { performScan } from "@/lib/scan";

export async function GET(request: NextRequest) {
  const npi = request.nextUrl.searchParams.get("npi");

  if (!npi || !/^\d{10}$/.test(npi)) {
    return NextResponse.json(
      { error: "Invalid NPI. Must be a 10-digit number." },
      { status: 400 }
    );
  }

  try {
    const result = await performScan(npi);
    return NextResponse.json({ result });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json(
      { error: "Failed to complete scan. Please try again." },
      { status: 500 }
    );
  }
}
