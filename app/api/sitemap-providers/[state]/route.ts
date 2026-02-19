import { NextRequest, NextResponse } from "next/server";
import { getHighPriorityProviders, slugToStateAbbr } from "@/lib/db-queries";

/**
 * Per-state provider sitemap with tiered drip-feed.
 * /api/sitemap-providers/ca        → tier 1 (high-value: $25K+ payment, 20+ beneficiaries)
 * /api/sitemap-providers/ca?tier=2 → tier 2 ($10K-$25K payment)
 * /api/sitemap-providers/ca?tier=3 → tier 3 (<$10K payment)
 *
 * Only tier 1 is registered in the sitemap index initially.
 * Each sitemap limited to 50,000 URLs per Google spec.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ state: string }> }
) {
  const { state: stateSlug } = await params;

  if (!stateSlug) {
    return new NextResponse("State parameter required", { status: 400 });
  }

  const stateAbbr = slugToStateAbbr(stateSlug) || stateSlug.toUpperCase();

  // Parse tier from query string (default: 1)
  const tierParam = request.nextUrl.searchParams.get("tier");
  const tier = (tierParam === "2" ? 2 : tierParam === "3" ? 3 : 1) as 1 | 2 | 3;

  const providers = await getHighPriorityProviders(stateAbbr, tier);

  if (!providers.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  const baseUrl = "https://npixray.com";
  const priority = tier === 1 ? "0.6" : "0.4";

  // Limit to 50,000 per Google spec
  const limited = providers.slice(0, 50000);

  const urls = limited
    .map(
      (p) =>
        `  <url><loc>${baseUrl}/provider/${p.npi}</loc><changefreq>monthly</changefreq><priority>${priority}</priority></url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
