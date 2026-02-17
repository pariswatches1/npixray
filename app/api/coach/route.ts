import { NextRequest } from "next/server";
import { BENCHMARKS } from "@/lib/benchmark-data";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CoachRequest {
  messages: ChatMessage[];
  npi?: string;
  scanData?: Record<string, unknown>;
  specialty?: string;
}

function buildSystemPrompt(
  scanData?: Record<string, unknown>,
  specialty?: string
): string {
  const benchmarkSummary = Object.entries(BENCHMARKS)
    .map(([name, b]) => {
      return `${name}: ${b.providerCount.toLocaleString()} providers, avg ${b.avgMedicarePatients} Medicare patients, avg $${b.avgTotalPayment.toLocaleString()} payment, $${b.avgRevenuePerPatient}/patient, E&M: ${(b.pct99213 * 100).toFixed(0)}%/99213 ${(b.pct99214 * 100).toFixed(0)}%/99214 ${(b.pct99215 * 100).toFixed(0)}%/99215, CCM adoption: ${(b.ccmAdoptionRate * 100).toFixed(1)}%, RPM: ${(b.rpmAdoptionRate * 100).toFixed(1)}%, BHI: ${(b.bhiAdoptionRate * 100).toFixed(1)}%, AWV: ${(b.awvAdoptionRate * 100).toFixed(1)}%`;
    })
    .join("\n");

  let scanContext = "";
  if (scanData) {
    scanContext = `
## THIS USER'S SCAN DATA (from real CMS Medicare data)
The user has scanned their NPI and you have their actual billing data:
${JSON.stringify(scanData, null, 2)}

IMPORTANT: When answering questions, ALWAYS reference their specific numbers. Don't give generic advice — give exact dollar amounts and percentages from their data. For example:
- "Based on your ${scanData.billing && (scanData.billing as Record<string, unknown>).totalMedicarePatients} Medicare patients..."
- "Your current CCM enrollment is ${scanData.billing && (scanData.billing as Record<string, unknown>).ccmPatients} patients out of an estimated ${scanData.ccmGap && (scanData.ccmGap as Record<string, unknown>).eligiblePatients} eligible..."
- "You're leaving $${scanData.totalMissedRevenue ? Number(scanData.totalMissedRevenue).toLocaleString() : "X"}/year on the table..."
`;
  }

  return `You are the NPIxray AI Revenue Coach — an expert Medicare billing consultant powered by real CMS data.

## YOUR ROLE
You help medical practices maximize their Medicare revenue through data-driven insights. You are knowledgeable about:
- E&M coding optimization (99211-99215 level selection)
- Chronic Care Management (CCM - 99490, 99439)
- Remote Patient Monitoring (RPM - 99453, 99454, 99457, 99458)
- Behavioral Health Integration (BHI - 99484, 99492, 99493, 99494)
- Annual Wellness Visits (AWV - G0438 initial, G0439 subsequent)
- Medicare billing compliance and documentation requirements
- Practice revenue optimization strategies

## COMMUNICATION STYLE
- Be direct, specific, and data-driven
- Use actual dollar amounts whenever possible
- Break complex topics into actionable steps
- When making recommendations, prioritize by ROI (easiest money first)
- Use bullet points and clear formatting
- Keep responses concise but thorough (aim for 150-300 words)
- Sound like a trusted consultant, not a textbook

## SPECIALTY BENCHMARK DATA (National Averages from CMS)
${benchmarkSummary}

${scanContext}

## PROGRAM DETAILS

### CCM (Chronic Care Management) — 99490, 99439
- Eligible: Medicare patients with 2+ chronic conditions
- 99490: First 20 min/month, ~$62/month per patient
- 99439: Each additional 20 min, ~$47/month per patient
- Requires: Care plan, patient consent, 20+ min non-face-to-face care/month
- ROI: One of the highest ROI programs. 100 enrolled patients = ~$74K/year
- Common chronic conditions: diabetes, hypertension, COPD, heart failure, depression, CKD

### RPM (Remote Patient Monitoring) — 99453, 99454, 99457, 99458
- Eligible: Patients with acute or chronic conditions needing monitoring
- 99453: Device setup, one-time ~$19
- 99454: Device supply/data transmission, ~$55/month
- 99457: First 20 min monitoring/month, ~$51/month
- 99458: Additional 20 min, ~$42/month
- Requires: FDA-cleared device, 16+ days/month data, clinical monitoring
- Devices: blood pressure cuffs, glucose monitors, pulse oximeters, weight scales
- ROI: Higher revenue per patient than CCM but needs device infrastructure

### BHI (Behavioral Health Integration) — 99484, 99492, 99493, 99494
- Eligible: Patients with behavioral health conditions (depression, anxiety, substance use)
- 99484: Care manager, ~$49/month
- 99492: Psychiatric collaborative care, first 70 min
- 99493: Subsequent months, first 60 min
- 99494: Additional 30 min
- Requires: Care manager, consulting psychiatrist, measurement-based care
- ROI: Growing opportunity, especially for primary care. PHQ-9 screening is the starting point.

### AWV (Annual Wellness Visit) — G0438, G0439
- Eligible: ALL Medicare patients (after first 12 months of Part B)
- G0438: Initial AWV, ~$175
- G0439: Subsequent AWV, ~$125
- Requires: Health Risk Assessment (HRA), personalized prevention plan
- ROI: Low-hanging fruit. Many practices do <30% of eligible patients
- Tip: Schedule AWVs alongside regular office visits to maximize completion rates

### E&M Coding Optimization (99211-99215)
- Most practices undercode — billing 99213 when 99214 is justified
- 99213 → 99214 shift adds ~$40 per visit
- 99214 → 99215 shift adds ~$70 per visit
- Key: Document medical decision-making (MDM) elements properly
- 2021 E&M guidelines simplified coding: focus on MDM or total time
- Revenue impact: Shifting just 10% of 99213s to 99214 can add $15-30K/year

## RULES
1. Always give specific numbers when possible
2. If the user hasn't scanned their NPI, encourage them to do so for personalized advice
3. Never provide medical advice — only billing/revenue optimization advice
4. Be honest about limitations and compliance requirements
5. When recommending programs, mention both revenue potential AND implementation requirements
6. If asked about something outside Medicare billing, politely redirect
7. Reference benchmarks for their specialty (or ask their specialty if unknown)
${specialty ? `8. The user's specialty is ${specialty}. Reference ${specialty} benchmarks by default.` : ""}`;
}

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Coach API not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body: CoachRequest = await request.json();
    const { messages, scanData, specialty } = body;

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Limit conversation history to last 20 messages to manage context
    const trimmedMessages = messages.slice(-20);

    const systemPrompt = buildSystemPrompt(scanData, specialty);

    // Call Claude API with streaming
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        system: systemPrompt,
        messages: trimmedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[coach] Claude API error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the response back
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") continue;

                try {
                  const event = JSON.parse(data);
                  if (
                    event.type === "content_block_delta" &&
                    event.delta?.type === "text_delta"
                  ) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
                    );
                  }
                } catch {
                  // Skip unparseable lines
                }
              }
            }
          }
        } catch (err) {
          console.error("[coach] Stream error:", err);
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[coach] Route error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
