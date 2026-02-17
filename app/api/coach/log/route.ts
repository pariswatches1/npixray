import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "data", "coach-logs.json");

interface CoachLog {
  npi: string | null;
  email: string | null;
  question: string;
  topics: string[];
  leadScore: "hot" | "warm" | "cold";
  messageCount: number;
  hasScan: boolean;
  timestamp: string;
}

async function readLogs(): Promise<CoachLog[]> {
  try {
    const raw = await fs.readFile(LOG_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLogs(logs: CoachLog[]): Promise<void> {
  await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
  await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const log: CoachLog = {
      npi: body.npi || null,
      email: body.email || null,
      question: (body.question || "").slice(0, 500),
      topics: body.topics || [],
      leadScore: body.leadScore || "cold",
      messageCount: body.messageCount || 0,
      hasScan: !!body.hasScan,
      timestamp: new Date().toISOString(),
    };

    const logs = await readLogs();

    // Keep last 10,000 logs max
    if (logs.length >= 10000) {
      logs.splice(0, logs.length - 9999);
    }

    logs.push(log);
    await writeLogs(logs);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[coach-log] Error:", err);
    return NextResponse.json(
      { error: "Failed to log" },
      { status: 500 }
    );
  }
}
