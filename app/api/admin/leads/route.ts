import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");
const COOKIE_NAME = "npixray_admin";
const COOKIE_VALUE = "authenticated";

function isAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get(COOKIE_NAME);
  return cookie?.value === COOKIE_VALUE;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    const leads = JSON.parse(raw);

    // Sort by timestamp descending (newest first)
    leads.sort((a: { timestamp: string }, b: { timestamp: string }) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ leads });
  } catch {
    // No leads file yet
    return NextResponse.json({ leads: [] });
  }
}
