import { NextRequest, NextResponse } from "next/server";
import {
  createApiKey,
  getAllApiKeys,
  revokeApiKey,
  getApiKeyStats,
} from "@/lib/api-keys";

const COOKIE_NAME = "npixray_admin";
const COOKIE_VALUE = "authenticated";

function isAuthed(req: NextRequest): boolean {
  return req.cookies.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

// ── GET: List all API keys + stats ───────────────────────

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = getAllApiKeys();
  const stats = getApiKeyStats();

  return NextResponse.json({ stats, keys });
}

// ── POST: Create a new API key ───────────────────────────

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, tier } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "name and email are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const apiKey = createApiKey(name, email, tier === "pro" ? "pro" : "free");

    return NextResponse.json({ success: true, key: apiKey });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// ── DELETE: Revoke an API key ────────────────────────────

export async function DELETE(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "key is required" }, { status: 400 });
    }

    const revoked = revokeApiKey(key);

    return NextResponse.json({
      success: revoked,
      message: revoked ? "Key revoked" : "Key not found",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
