import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { sendWelcomeEmail } from "@/lib/email";

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

interface Lead {
  email: string;
  npi: string;
  providerName: string;
  specialty: string;
  totalMissedRevenue: number;
  timestamp: string;
  emailSent?: boolean;
}

async function readLeads(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLeads(leads: Lead[]): Promise<void> {
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, npi, providerName, specialty, totalMissedRevenue } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    if (!npi || !/^\d{10}$/.test(npi)) {
      return NextResponse.json(
        { error: "Valid 10-digit NPI is required." },
        { status: 400 }
      );
    }

    const lead: Lead = {
      email: email.trim().toLowerCase(),
      npi,
      providerName: providerName || "",
      specialty: specialty || "",
      totalMissedRevenue: totalMissedRevenue || 0,
      timestamp: new Date().toISOString(),
      emailSent: false,
    };

    const leads = await readLeads();

    // Check for duplicate email+npi combo
    const existing = leads.findIndex(
      (l) => l.email === lead.email && l.npi === lead.npi
    );
    if (existing >= 0) {
      leads[existing] = lead; // update existing
    } else {
      leads.push(lead);
    }

    await writeLeads(leads);

    // Send welcome email (non-blocking — lead is already saved)
    let emailSent = false;
    try {
      emailSent = await sendWelcomeEmail({
        to: lead.email,
        providerName: lead.providerName,
        npi: lead.npi,
        specialty: lead.specialty,
        totalMissedRevenue: lead.totalMissedRevenue,
      });

      // Update lead with email status
      if (emailSent) {
        const updatedLeads = await readLeads();
        const idx = updatedLeads.findIndex(
          (l) => l.email === lead.email && l.npi === lead.npi
        );
        if (idx >= 0) {
          updatedLeads[idx].emailSent = true;
          await writeLeads(updatedLeads);
        }
      }
    } catch (emailErr) {
      console.error("[leads] Email sending failed:", emailErr);
      // Lead is still saved — email failure is non-critical
    }

    return NextResponse.json({
      success: true,
      message: "Lead saved.",
      emailSent,
    });
  } catch (err) {
    console.error("Leads API error:", err);
    return NextResponse.json(
      { error: "Failed to save lead." },
      { status: 500 }
    );
  }
}
