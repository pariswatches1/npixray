/**
 * AI Insight Engine — generates unique prose paragraphs per page using Gemini.
 *
 * Each state/specialty page gets a unique 150-200 word analysis that
 * Google cannot cluster with other pages. Insights are cached via
 * Next.js ISR (24h revalidation) so we only call Gemini once per page.
 */

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

interface InsightContext {
  type: "state" | "state-specialty" | "specialty" | "city";
  stateName?: string;
  stateAbbr?: string;
  specialty?: string;
  city?: string;
  providerCount: number;
  avgPayment: number;
  totalPayment: number;
  nationalAvgPayment?: number;
  nationalRank?: number;
  totalStates?: number;
  ccmAdoption?: number;
  rpmAdoption?: number;
  awvAdoption?: number;
  bhiAdoption?: number;
  nationalCcm?: number;
  nationalRpm?: number;
  nationalAwv?: number;
  topSpecialty?: string;
  topCity?: string;
  neighbors?: { name: string; avgPayment: number }[];
  opportunities?: { title: string; estimatedRevenue: number }[];
}

function buildPrompt(ctx: InsightContext): string {
  const location =
    ctx.type === "state"
      ? ctx.stateName
      : ctx.type === "state-specialty"
        ? `${ctx.specialty} in ${ctx.stateName}`
        : ctx.type === "city"
          ? `${ctx.city}, ${ctx.stateName}`
          : ctx.specialty;

  const neighborText = ctx.neighbors?.length
    ? `Neighboring states for comparison: ${ctx.neighbors.map((n) => `${n.name} ($${Math.round(n.avgPayment).toLocaleString()} avg)`).join(", ")}.`
    : "";

  const opportunityText = ctx.opportunities?.length
    ? `Top revenue opportunities: ${ctx.opportunities.map((o) => `${o.title} (~$${Math.round(o.estimatedRevenue).toLocaleString()})`).join(", ")}.`
    : "";

  const deltaText =
    ctx.nationalAvgPayment && ctx.nationalAvgPayment > 0
      ? `National average payment: $${Math.round(ctx.nationalAvgPayment).toLocaleString()}. This location is ${((ctx.avgPayment - ctx.nationalAvgPayment) / ctx.nationalAvgPayment * 100).toFixed(1)}% ${ctx.avgPayment >= ctx.nationalAvgPayment ? "above" : "below"} national average.`
      : "";

  const rankText =
    ctx.nationalRank && ctx.totalStates
      ? `Ranked #${ctx.nationalRank} out of ${ctx.totalStates} states.`
      : "";

  const programText = [
    ctx.ccmAdoption !== undefined ? `CCM adoption: ${(ctx.ccmAdoption * 100).toFixed(1)}% (national: ${((ctx.nationalCcm ?? 0) * 100).toFixed(1)}%)` : "",
    ctx.rpmAdoption !== undefined ? `RPM adoption: ${(ctx.rpmAdoption * 100).toFixed(1)}% (national: ${((ctx.nationalRpm ?? 0) * 100).toFixed(1)}%)` : "",
    ctx.awvAdoption !== undefined ? `AWV adoption: ${(ctx.awvAdoption * 100).toFixed(1)}% (national: ${((ctx.nationalAwv ?? 0) * 100).toFixed(1)}%)` : "",
  ]
    .filter(Boolean)
    .join(". ");

  return `Write a unique 150-200 word analytical paragraph about ${location} Medicare billing patterns. This is for an SEO data page — make every sentence specific and data-driven, NOT generic.

DATA:
- ${ctx.providerCount.toLocaleString()} Medicare providers
- Average payment per provider: $${Math.round(ctx.avgPayment).toLocaleString()}
- Total Medicare payments: $${Math.round(ctx.totalPayment).toLocaleString()}
${deltaText ? `- ${deltaText}` : ""}
${rankText ? `- ${rankText}` : ""}
${programText ? `- ${programText}` : ""}
${ctx.topSpecialty ? `- Largest specialty: ${ctx.topSpecialty}` : ""}
${ctx.topCity ? `- Largest city: ${ctx.topCity}` : ""}
${neighborText ? `- ${neighborText}` : ""}
${opportunityText ? `- ${opportunityText}` : ""}

RULES:
1. Start with a distinctive observation about what makes this location's billing patterns unique
2. Reference specific numbers (percentages, dollar amounts, rankings)
3. Explain WHY the data matters (implications for practices)
4. End with a forward-looking insight about revenue opportunity
5. Do NOT use headers, bullets, or formatting — plain prose paragraph only
6. Do NOT start with "In" or the location name — vary your opening
7. Make this paragraph impossible to confuse with any other state/specialty page
8. Sound like a healthcare revenue consultant, not a textbook`;
}

/**
 * Generate a unique AI insight paragraph. Returns null if API unavailable.
 * Called at ISR build time — cached for 24h via page revalidation.
 */
export async function generateInsight(ctx: InsightContext): Promise<string | null> {
  if (!GOOGLE_API_KEY) return null;

  try {
    const prompt = buildPrompt(ctx);

    // 5-second timeout — fail fast so pages don't hang
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5_000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 350,
            temperature: 0.9, // Higher temp = more unique per page
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timer);

    if (!response.ok) {
      console.warn(`[ai-insights] Gemini API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return null;

    // Clean up: remove any markdown formatting, trim whitespace
    return text
      .replace(/\*\*/g, "")
      .replace(/##/g, "")
      .replace(/\n+/g, " ")
      .trim();
  } catch (err) {
    // Timeout or network error — fail gracefully
    if (err instanceof DOMException && err.name === "AbortError") {
      console.warn("[ai-insights] Timed out after 5s — skipping insight");
    } else {
      console.warn("[ai-insights] Failed to generate insight:", err);
    }
    return null;
  }
}
