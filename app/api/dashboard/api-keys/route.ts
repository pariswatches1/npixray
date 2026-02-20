import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createApiKey,
  getAllApiKeys,
  revokeApiKey,
} from "@/lib/api-keys";

// ── GET: List user's API keys ─────────────────────────────

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const allKeys = getAllApiKeys();
  const userKeys = allKeys
    .filter((k) => k.email === session.user!.email)
    .map((k) => ({
      id: k.key.slice(0, 10),
      key_prefix: k.key.slice(0, 7),
      name: k.name,
      tier: k.tier,
      requests: k.totalRequests,
      last_used: k.lastUsedAt || null,
      created_at: k.createdAt,
      status: k.active ? "active" : "revoked",
    }));

  return NextResponse.json({ keys: userKeys });
}

// ── POST: Create a new API key for current user ───────────

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    // Determine tier based on user plan
    const plan = (session.user as any)?.plan || "free";
    const tier = plan === "api" ? "pro" : "free";

    const apiKey = createApiKey(name, session.user.email, tier);

    return NextResponse.json({ key: apiKey.key });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// ── DELETE: Revoke user's API key ─────────────────────────

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Find the full key that matches this prefix and belongs to this user
    const allKeys = getAllApiKeys();
    const userKey = allKeys.find(
      (k) => k.key.startsWith(id) && k.email === session.user!.email && k.active
    );

    if (!userKey) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    revokeApiKey(userKey.key);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
