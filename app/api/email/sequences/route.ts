import { NextRequest, NextResponse } from "next/server";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { Resend } from "resend";

// ─── Constants ─────────────────────────────────────────────────

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const DATA_DIR = path.join(process.cwd(), "data");
const QUEUE_FILE = path.join(DATA_DIR, "email-queue.json");

const FROM_ADDRESS = "NPIxray <reports@npixray.com>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://npixray.com";

// ─── Types ─────────────────────────────────────────────────────

interface EmailQueueEntry {
  id: string;
  email: string;
  npi: string;
  providerName: string;
  specialty: string;
  state: string;
  city: string;
  totalMissedRevenue: number;
  revenueScore?: number;
  enrolledAt: string;
  sequence: string;
  nextEmailDay: number;
  emailsSent: number;
  lastSentAt?: string;
  status: "active" | "completed" | "unsubscribed";
}

interface SequenceTemplate {
  subject: (data: EmailQueueEntry) => string;
  key: string;
}

// ─── Sequence Configuration ────────────────────────────────────

const SEQUENCE_DAYS = [1, 3, 7, 14, 30];

const SEQUENCE_TEMPLATES: Record<number, SequenceTemplate> = {
  1: {
    subject: (d) => `Your revenue report for ${d.providerName}`,
    key: "report",
  },
  3: {
    subject: (d) =>
      `3 quick wins to capture ${formatCurrency(d.totalMissedRevenue)} in missed revenue`,
    key: "quickwins",
  },
  7: {
    subject: (d) =>
      `${d.specialty} practices in ${d.state} are capturing more revenue`,
    key: "competitive",
  },
  14: {
    subject: (d) => `Your Revenue Score update — NPI ${d.npi}`,
    key: "score-update",
  },
  30: {
    subject: (d) => `New CMS data available for ${d.providerName}`,
    key: "reengagement",
  },
};

// ─── Helpers ───────────────────────────────────────────────────

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

function generateId(): string {
  return `seq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function isAuthed(req: NextRequest): boolean {
  return req.cookies.get("npixray_admin")?.value === "authenticated";
}

function readQueue(): EmailQueueEntry[] {
  try {
    if (!existsSync(QUEUE_FILE)) return [];
    const raw = readFileSync(QUEUE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeQueue(entries: EmailQueueEntry[]): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(QUEUE_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

function getNextDay(currentDay: number): number | null {
  const idx = SEQUENCE_DAYS.indexOf(currentDay);
  if (idx === -1 || idx >= SEQUENCE_DAYS.length - 1) return null;
  return SEQUENCE_DAYS[idx + 1];
}

function daysSince(isoDate: string): number {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  return (now - then) / (1000 * 60 * 60 * 24);
}

// ─── Email HTML Templates ──────────────────────────────────────

function emailWrapper(
  content: string,
  unsubscribeUrl: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NPIxray</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F7FA;color:#1A2B4A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F7FA;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <span style="font-size:24px;font-weight:bold;color:#ffffff;letter-spacing:-0.5px;">
                NPI<span style="color:#2F5EA8;">xray</span>
              </span>
            </td>
          </tr>
          ${content}
          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0;text-align:center;border-top:1px solid rgba(255,255,255,0.05);margin-top:32px;">
              <p style="margin:0 0 8px;font-size:12px;color:#666;">
                &copy; ${new Date().getFullYear()} NPIxray. All rights reserved.
              </p>
              <p style="margin:0 0 12px;font-size:11px;color:#555;">
                Data from CMS.gov public datasets. Not medical advice.<br/>
                <a href="${BASE_URL}" style="color:#666;text-decoration:none;">npixray.com</a>
              </p>
              <p style="margin:0;">
                <a href="${unsubscribeUrl}" style="color:#555;text-decoration:underline;font-size:11px;">
                  Unsubscribe from these emails
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background-color:#2F5EA8;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:16px;padding:14px 32px;border-radius:12px;">
  ${text}
</a>`;
}

function goldBox(inner: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
  <tr>
    <td style="background-color:rgba(47,94,168,0.06);border:1px solid rgba(47,94,168,0.15);border-radius:12px;padding:20px 40px;text-align:center;">
      ${inner}
    </td>
  </tr>
</table>`;
}

function buildReportEmail(data: EmailQueueEntry): string {
  const scanUrl = `${BASE_URL}/scan/${data.npi}`;
  const missed = formatCurrency(data.totalMissedRevenue);
  return `
<!-- Hero -->
<tr>
  <td style="background-color:#FFFFFF;border:1px solid rgba(47,94,168,0.15);border-radius:16px;padding:40px 32px;text-align:center;">
    <p style="margin:0 0 8px;font-size:14px;color:#999;text-transform:uppercase;letter-spacing:2px;">
      Revenue Analysis Ready
    </p>
    <h1 style="margin:0 0 8px;font-size:28px;font-weight:bold;color:#ffffff;">
      ${data.providerName}
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#999;">
      ${data.specialty} &bull; NPI ${data.npi}
    </p>
    ${goldBox(`
      <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">
        Estimated Missed Revenue
      </p>
      <p style="margin:0;font-size:36px;font-weight:bold;color:#2F5EA8;font-family:'Courier New',monospace;">
        ${missed}<span style="font-size:16px;color:#999;font-family:-apple-system,sans-serif;">/yr</span>
      </p>
    `)}
    ${ctaButton("View Full Report", scanUrl)}
  </td>
</tr>
<!-- Details -->
<tr>
  <td style="padding:32px 0;">
    <p style="margin:0 0 16px;font-size:15px;color:#ccc;line-height:1.7;">
      Hi there &mdash; your NPIxray revenue scan for <strong style="color:#fff;">${data.providerName}</strong>
      is ready. Based on CMS public data, we estimate you may be missing up to
      <strong style="color:#2F5EA8;">${missed}/year</strong> in billable revenue.
    </p>
    <p style="margin:0;font-size:14px;color:#999;line-height:1.6;">
      Your report includes E&amp;M coding gap analysis, program opportunities
      (CCM, RPM, BHI, AWV), specialty benchmarks, and a prioritized 90-day
      action plan.
    </p>
  </td>
</tr>`;
}

function buildQuickWinsEmail(data: EmailQueueEntry): string {
  const scanUrl = `${BASE_URL}/scan/${data.npi}`;
  const missed = formatCurrency(data.totalMissedRevenue);
  const ccmEstimate = formatCurrency(Math.round(data.totalMissedRevenue * 0.35));
  const codingEstimate = formatCurrency(Math.round(data.totalMissedRevenue * 0.4));
  const awvEstimate = formatCurrency(Math.round(data.totalMissedRevenue * 0.25));
  return `
<tr>
  <td style="background-color:#FFFFFF;border:1px solid rgba(47,94,168,0.15);border-radius:16px;padding:40px 32px;">
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:bold;color:#ffffff;text-align:center;">
      3 Quick Wins to Capture ${missed}
    </h1>
    <p style="margin:0 0 32px;font-size:14px;color:#999;text-align:center;">
      Based on your CMS data, here are three actionable changes:
    </p>
    <!-- Win 1 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="width:48px;vertical-align:top;">
          <div style="width:36px;height:36px;border-radius:8px;background-color:rgba(47,94,168,0.08);border:1px solid rgba(47,94,168,0.15);text-align:center;line-height:36px;font-size:18px;font-weight:bold;color:#2F5EA8;">1</div>
        </td>
        <td style="padding-left:12px;">
          <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#fff;">Optimize E&amp;M Coding</p>
          <p style="margin:0 0 4px;font-size:13px;color:#ccc;line-height:1.5;">
            Shift appropriate visits from 99213 to 99214/99215 with better documentation.
            Most practices undercode by 15&ndash;25%.
          </p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#2F5EA8;">${codingEstimate}/yr potential</p>
        </td>
      </tr>
    </table>
    <!-- Win 2 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="width:48px;vertical-align:top;">
          <div style="width:36px;height:36px;border-radius:8px;background-color:rgba(47,94,168,0.08);border:1px solid rgba(47,94,168,0.15);text-align:center;line-height:36px;font-size:18px;font-weight:bold;color:#2F5EA8;">2</div>
        </td>
        <td style="padding-left:12px;">
          <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#fff;">Enroll CCM Patients (99490)</p>
          <p style="margin:0 0 4px;font-size:13px;color:#ccc;line-height:1.5;">
            Patients with 2+ chronic conditions are eligible for Chronic Care Management.
            Average reimbursement is $66&ndash;$144/patient/month.
          </p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#2F5EA8;">${ccmEstimate}/yr potential</p>
        </td>
      </tr>
    </table>
    <!-- Win 3 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="width:48px;vertical-align:top;">
          <div style="width:36px;height:36px;border-radius:8px;background-color:rgba(47,94,168,0.08);border:1px solid rgba(47,94,168,0.15);text-align:center;line-height:36px;font-size:18px;font-weight:bold;color:#2F5EA8;">3</div>
        </td>
        <td style="padding-left:12px;">
          <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#fff;">Bill Annual Wellness Visits (G0438/G0439)</p>
          <p style="margin:0 0 4px;font-size:13px;color:#ccc;line-height:1.5;">
            AWVs are massively underbilled nationally. Each missed visit = $118&ndash;$174
            in lost revenue. Most Medicare patients are eligible.
          </p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#2F5EA8;">${awvEstimate}/yr potential</p>
        </td>
      </tr>
    </table>
    <div style="text-align:center;">
      ${ctaButton("View Your Full Report", scanUrl)}
    </div>
  </td>
</tr>`;
}

function buildCompetitiveEmail(data: EmailQueueEntry): string {
  const scanUrl = `${BASE_URL}/scan/${data.npi}`;
  const leaderboardUrl = `${BASE_URL}/leaderboard/${data.state.toLowerCase()}`;
  const missed = formatCurrency(data.totalMissedRevenue);
  return `
<tr>
  <td style="background-color:#FFFFFF;border:1px solid rgba(47,94,168,0.15);border-radius:16px;padding:40px 32px;text-align:center;">
    <p style="margin:0 0 8px;font-size:14px;color:#999;text-transform:uppercase;letter-spacing:2px;">
      Competitive Intel
    </p>
    <h1 style="margin:0 0 24px;font-size:24px;font-weight:bold;color:#ffffff;">
      How Do You Compare?
    </h1>
    ${goldBox(`
      <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">
        Your Estimated Gap
      </p>
      <p style="margin:0;font-size:32px;font-weight:bold;color:#2F5EA8;font-family:'Courier New',monospace;">
        ${missed}<span style="font-size:14px;color:#999;font-family:-apple-system,sans-serif;">/yr</span>
      </p>
    `)}
    <p style="margin:0 0 24px;font-size:15px;color:#ccc;line-height:1.7;">
      Other <strong style="color:#fff;">${data.specialty}</strong> practices in
      <strong style="color:#fff;">${data.state}</strong> are actively capturing revenue
      from programs like CCM, RPM, and optimized E&amp;M coding. Practices that act
      on their gaps typically close 30&ndash;60% within the first 90 days.
    </p>
    ${ctaButton("See State Leaderboard", leaderboardUrl)}
    <p style="margin:16px 0 0;">
      <a href="${scanUrl}" style="font-size:13px;color:#2F5EA8;text-decoration:none;">
        View your full report &rarr;
      </a>
    </p>
  </td>
</tr>`;
}

function buildScoreUpdateEmail(data: EmailQueueEntry): string {
  const scanUrl = `${BASE_URL}/scan/${data.npi}`;
  const score = data.revenueScore ?? Math.max(20, Math.min(85, 100 - Math.round(data.totalMissedRevenue / 2500)));
  let tier: string;
  let tierColor: string;
  if (score >= 80) {
    tier = "Optimized";
    tierColor = "#22c55e";
  } else if (score >= 60) {
    tier = "On Track";
    tierColor = "#2F5EA8";
  } else if (score >= 40) {
    tier = "Needs Attention";
    tierColor = "#f97316";
  } else {
    tier = "Critical";
    tierColor = "#ef4444";
  }
  return `
<tr>
  <td style="background-color:#FFFFFF;border:1px solid rgba(47,94,168,0.15);border-radius:16px;padding:40px 32px;text-align:center;">
    <p style="margin:0 0 8px;font-size:14px;color:#999;text-transform:uppercase;letter-spacing:2px;">
      Revenue Score Update
    </p>
    <h1 style="margin:0 0 8px;font-size:28px;font-weight:bold;color:#ffffff;">
      ${data.providerName}
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#999;">
      NPI ${data.npi}
    </p>
    ${goldBox(`
      <p style="margin:0 0 8px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">
        Revenue Score
      </p>
      <p style="margin:0 0 4px;font-size:48px;font-weight:bold;color:#2F5EA8;font-family:'Courier New',monospace;">
        ${score}
      </p>
      <p style="margin:0;font-size:14px;font-weight:600;color:${tierColor};">
        ${tier}
      </p>
    `)}
    <p style="margin:0 0 24px;font-size:15px;color:#ccc;line-height:1.7;">
      Your Revenue Score measures how effectively you capture available Medicare
      revenue compared to peers. A score of 100 means you&rsquo;re billing at
      specialty benchmarks across all programs and E&amp;M levels.
    </p>
    ${ctaButton("View Full Report", scanUrl)}
  </td>
</tr>`;
}

function buildReengagementEmail(data: EmailQueueEntry): string {
  const scanUrl = `${BASE_URL}/scan/${data.npi}`;
  return `
<tr>
  <td style="background-color:#FFFFFF;border:1px solid rgba(47,94,168,0.15);border-radius:16px;padding:40px 32px;text-align:center;">
    <p style="margin:0 0 8px;font-size:14px;color:#999;text-transform:uppercase;letter-spacing:2px;">
      Data Update
    </p>
    <h1 style="margin:0 0 24px;font-size:24px;font-weight:bold;color:#ffffff;">
      Fresh CMS Data Available
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#ccc;line-height:1.7;">
      Hi &mdash; we&rsquo;ve updated our analysis for
      <strong style="color:#fff;">${data.providerName}</strong>
      with the latest CMS Medicare data. Your revenue gaps and recommendations
      may have changed.
    </p>
    ${goldBox(`
      <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">
        Last Estimated Gap
      </p>
      <p style="margin:0;font-size:32px;font-weight:bold;color:#2F5EA8;font-family:'Courier New',monospace;">
        ${formatCurrency(data.totalMissedRevenue)}<span style="font-size:14px;color:#999;font-family:-apple-system,sans-serif;">/yr</span>
      </p>
    `)}
    <p style="margin:0 0 24px;font-size:14px;color:#999;line-height:1.6;">
      Run a fresh scan to see your updated E&amp;M coding gaps, program
      opportunities, and 90-day action plan.
    </p>
    ${ctaButton("Scan Again", scanUrl)}
  </td>
</tr>`;
}

function buildEmailHtml(
  day: number,
  data: EmailQueueEntry
): string {
  const unsubscribeUrl = `${BASE_URL}/api/email/sequences?action=unsubscribe&email=${encodeURIComponent(data.email)}`;

  let content: string;
  switch (day) {
    case 1:
      content = buildReportEmail(data);
      break;
    case 3:
      content = buildQuickWinsEmail(data);
      break;
    case 7:
      content = buildCompetitiveEmail(data);
      break;
    case 14:
      content = buildScoreUpdateEmail(data);
      break;
    case 30:
      content = buildReengagementEmail(data);
      break;
    default:
      content = buildReportEmail(data);
  }

  return emailWrapper(content, unsubscribeUrl);
}

// ─── POST handler ──────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action");

  // ── Unsubscribe (public) ──────────────────────────────────
  if (action === "unsubscribe") {
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required." },
        { status: 400 }
      );
    }

    const queue = readQueue();
    let found = false;
    for (const entry of queue) {
      if (entry.email.toLowerCase() === email.toLowerCase() && entry.status === "active") {
        entry.status = "unsubscribed";
        found = true;
      }
    }

    if (found) {
      writeQueue(queue);
    }

    return NextResponse.json({
      success: true,
      message: found
        ? "You have been unsubscribed."
        : "No active subscription found for this email.",
    });
  }

  // ── Process queue (admin only) ────────────────────────────
  if (action === "process") {
    if (!isAuthed(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const queue = readQueue();
    let processed = 0;
    let sent = 0;
    const errors: string[] = [];

    for (const entry of queue) {
      if (entry.status !== "active") continue;

      const template = SEQUENCE_TEMPLATES[entry.nextEmailDay];
      if (!template) continue;

      // Determine if enough days have passed
      const referenceDate = entry.lastSentAt || entry.enrolledAt;
      const currentDayIdx = SEQUENCE_DAYS.indexOf(entry.nextEmailDay);
      const previousDay = currentDayIdx > 0 ? SEQUENCE_DAYS[currentDayIdx - 1] : 0;
      const daysToWait = entry.nextEmailDay - previousDay;

      if (daysSince(referenceDate) < daysToWait) continue;

      processed++;

      // Send email
      if (!resend) {
        errors.push(`${entry.email}: RESEND_API_KEY not configured`);
        continue;
      }

      try {
        const html = buildEmailHtml(entry.nextEmailDay, entry);
        const { error } = await resend.emails.send({
          from: FROM_ADDRESS,
          to: entry.email,
          subject: template.subject(entry),
          html,
        });

        if (error) {
          errors.push(`${entry.email}: ${error.message}`);
          continue;
        }

        sent++;
        entry.emailsSent++;
        entry.lastSentAt = new Date().toISOString();

        const nextDay = getNextDay(entry.nextEmailDay);
        if (nextDay) {
          entry.nextEmailDay = nextDay;
        } else {
          entry.status = "completed";
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        errors.push(`${entry.email}: ${msg}`);
      }
    }

    writeQueue(queue);

    return NextResponse.json({
      processed,
      sent,
      errors: errors.length > 0 ? errors : undefined,
    });
  }

  // ── Enroll a contact (public) ─────────────────────────────
  try {
    const body = await request.json();
    const { email, npi, providerName, specialty, state, city, totalMissedRevenue, revenueScore } = body;

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

    if (!providerName || !specialty || !state || !city) {
      return NextResponse.json(
        { error: "providerName, specialty, state, and city are required." },
        { status: 400 }
      );
    }

    const queue = readQueue();

    // Check for existing active entry with same email + npi
    const existing = queue.find(
      (e) =>
        e.email.toLowerCase() === email.toLowerCase() &&
        e.npi === npi &&
        e.status === "active"
    );

    if (existing) {
      return NextResponse.json({
        success: true,
        id: existing.id,
        message: "Already enrolled in sequence.",
      });
    }

    const entry: EmailQueueEntry = {
      id: generateId(),
      email: email.trim().toLowerCase(),
      npi,
      providerName,
      specialty,
      state,
      city,
      totalMissedRevenue: totalMissedRevenue || 0,
      revenueScore: revenueScore ?? undefined,
      enrolledAt: new Date().toISOString(),
      sequence: "re-engagement",
      nextEmailDay: 1,
      emailsSent: 0,
      status: "active",
    };

    queue.push(entry);
    writeQueue(queue);

    return NextResponse.json({ success: true, id: entry.id });
  } catch (err) {
    console.error("[email/sequences] Enrollment error:", err);
    return NextResponse.json(
      { error: "Failed to enroll contact." },
      { status: 500 }
    );
  }
}

// ─── GET handler (admin — view queue) ──────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action");

  // Public unsubscribe via GET (for email link clicks)
  if (action === "unsubscribe") {
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required." },
        { status: 400 }
      );
    }

    const queue = readQueue();
    let found = false;
    for (const entry of queue) {
      if (entry.email.toLowerCase() === email.toLowerCase() && entry.status === "active") {
        entry.status = "unsubscribed";
        found = true;
      }
    }

    if (found) {
      writeQueue(queue);
    }

    // Return a simple HTML page for the user
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>Unsubscribed | NPIxray</title></head>
<body style="margin:0;padding:60px 20px;background:#F5F7FA;color:#1A2B4A;font-family:-apple-system,sans-serif;text-align:center;">
  <h1 style="font-size:24px;color:#fff;margin-bottom:8px;">
    ${found ? "You've been unsubscribed" : "No active subscription found"}
  </h1>
  <p style="color:#999;font-size:14px;">
    ${found ? "You will no longer receive emails from this sequence." : "This email address does not have an active email sequence."}
  </p>
  <a href="${BASE_URL}" style="display:inline-block;margin-top:24px;color:#2F5EA8;font-size:14px;text-decoration:none;">
    &larr; Back to NPIxray
  </a>
</body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  // Admin view — requires auth
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const queue = readQueue();

  const stats = {
    total: queue.length,
    active: queue.filter((e) => e.status === "active").length,
    completed: queue.filter((e) => e.status === "completed").length,
    unsubscribed: queue.filter((e) => e.status === "unsubscribed").length,
    totalEmailsSent: queue.reduce((sum, e) => sum + e.emailsSent, 0),
  };

  return NextResponse.json({ stats, entries: queue });
}
