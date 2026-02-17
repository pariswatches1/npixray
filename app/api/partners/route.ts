import { NextRequest, NextResponse } from "next/server";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PARTNERS_FILE = path.join(DATA_DIR, "partners.json");

const COOKIE_NAME = "npixray_admin";
const COOKIE_VALUE = "authenticated";

function isAuthed(req: NextRequest): boolean {
  return req.cookies.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

export interface PartnerEntry {
  id: string;
  name: string;
  description: string;
  website: string;
  contactEmail: string;
  logo?: string;
  type: "billing" | "consultant" | "ehr" | "other";
  scanCount: number;
  leadCount: number;
  createdAt: string;
  active: boolean;
}

function readPartners(): PartnerEntry[] {
  try {
    if (!existsSync(PARTNERS_FILE)) return [];
    return JSON.parse(readFileSync(PARTNERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writePartners(entries: PartnerEntry[]): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(PARTNERS_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

function generateId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "").replace(/^-+/, "");
}

// ── GET: Get partner info (public by id) or list all (admin) ──

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  const partners = readPartners();

  // Public: fetch single partner by id
  if (id) {
    const partner = partners.find((p) => p.id === id && p.active);
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    return NextResponse.json({
      partner: {
        id: partner.id,
        name: partner.name,
        description: partner.description,
        website: partner.website,
        logo: partner.logo,
      },
    });
  }

  // Admin: list all partners
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = {
    total: partners.length,
    active: partners.filter((p) => p.active).length,
    totalScans: partners.reduce((sum, p) => sum + p.scanCount, 0),
    totalLeads: partners.reduce((sum, p) => sum + p.leadCount, 0),
  };

  return NextResponse.json({ stats, partners });
}

// ── POST: Create a new partner (admin) ────────────────────

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, website, contactEmail, logo, type } = body;

    if (!name || !contactEmail) {
      return NextResponse.json(
        { error: "name and contactEmail are required" },
        { status: 400 }
      );
    }

    const partners = readPartners();
    const id = generateId(name);

    if (partners.find((p) => p.id === id)) {
      return NextResponse.json(
        { error: "A partner with this name already exists" },
        { status: 409 }
      );
    }

    const partner: PartnerEntry = {
      id,
      name,
      description: description || "",
      website: website || "",
      contactEmail,
      logo: logo || undefined,
      type: type || "other",
      scanCount: 0,
      leadCount: 0,
      createdAt: new Date().toISOString(),
      active: true,
    };

    partners.push(partner);
    writePartners(partners);

    return NextResponse.json({ success: true, partner });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// ── PATCH: Increment scan count (public) ──────────────────

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const partners = readPartners();
    const partner = partners.find((p) => p.id === id);
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    partner.scanCount++;
    writePartners(partners);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
