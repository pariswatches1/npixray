import { NextRequest, NextResponse } from "next/server";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { getProvider, type ProviderRow } from "@/lib/db-queries";

const DATA_DIR = path.join(process.cwd(), "data");
const INVITES_FILE = path.join(DATA_DIR, "invites.json");

const COOKIE_NAME = "npixray_admin";
const COOKIE_VALUE = "authenticated";

function isAuthed(req: NextRequest): boolean {
  return req.cookies.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

export interface InviteEntry {
  code: string;
  npi: string;
  providerName: string;
  specialty: string;
  state: string;
  city: string;
  totalGap: number;
  revenueScore: number;
  createdAt: string;
  views: number;
  emailCaptured: boolean;
  capturedEmail?: string;
  source: string; // "outreach" | "mailer" | "manual"
}

function readInvites(): InviteEntry[] {
  try {
    if (!existsSync(INVITES_FILE)) return [];
    return JSON.parse(readFileSync(INVITES_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeInvites(entries: InviteEntry[]): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(INVITES_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

function generateCode(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ── POST: Create invite(s) ─────────────────────────────────

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Support both single and bulk creation
    const providers: Array<{
      npi: string;
      name?: string;
      specialty?: string;
      state?: string;
      city?: string;
      totalGap?: number;
      revenueScore?: number;
    }> = Array.isArray(body) ? body : [body];

    const invites = readInvites();
    const created: InviteEntry[] = [];

    for (const item of providers) {
      if (!item.npi || !/^\d{10}$/.test(item.npi)) continue;

      // Check if invite already exists for this NPI
      const existing = invites.find((inv) => inv.npi === item.npi);
      if (existing) {
        created.push(existing);
        continue;
      }

      // Try to get provider data from DB
      const dbProvider = await getProvider(item.npi);

      const entry: InviteEntry = {
        code: generateCode(),
        npi: item.npi,
        providerName: item.name || (dbProvider ? `${dbProvider.first_name} ${dbProvider.last_name}`.trim() : `Provider ${item.npi}`),
        specialty: item.specialty || dbProvider?.specialty || "Unknown",
        state: item.state || dbProvider?.state || "",
        city: item.city || dbProvider?.city || "",
        totalGap: item.totalGap || 0,
        revenueScore: item.revenueScore || 50,
        createdAt: new Date().toISOString(),
        views: 0,
        emailCaptured: false,
        source: "outreach",
      };

      invites.push(entry);
      created.push(entry);
    }

    writeInvites(invites);

    return NextResponse.json({
      success: true,
      created: created.length,
      invites: created,
    });
  } catch (err) {
    console.error("[invites] Create error:", err);
    return NextResponse.json({ error: "Failed to create invites" }, { status: 500 });
  }
}

// ── GET: List invites (admin) or fetch single invite (public) ──

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");

  // Public: fetch single invite by code (for landing pages)
  if (code) {
    const invites = readInvites();
    const invite = invites.find((inv) => inv.code === code);

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Increment view count
    invite.views++;
    writeInvites(invites);

    return NextResponse.json({ invite });
  }

  // Admin: list all invites
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invites = readInvites();

  const stats = {
    total: invites.length,
    views: invites.reduce((sum, i) => sum + i.views, 0),
    emailsCaptured: invites.filter((i) => i.emailCaptured).length,
    conversionRate: invites.length > 0
      ? (invites.filter((i) => i.emailCaptured).length / invites.filter((i) => i.views > 0).length * 100).toFixed(1) + "%"
      : "0%",
  };

  return NextResponse.json({ stats, invites });
}

// ── PATCH: Record email capture on an invite ──────────────

export async function PATCH(request: NextRequest) {
  try {
    const { code, email } = await request.json();

    if (!code || !email) {
      return NextResponse.json({ error: "code and email are required" }, { status: 400 });
    }

    const invites = readInvites();
    const invite = invites.find((inv) => inv.code === code);

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    invite.emailCaptured = true;
    invite.capturedEmail = email;
    writeInvites(invites);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
