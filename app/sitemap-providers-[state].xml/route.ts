import { NextRequest, NextResponse } from "next/server";
import { getProvidersByState, slugToStateAbbr } from "@/lib/db-queries";

/**
 * Per-state provider sitemap.
 * /sitemap-providers-ca.xml → all providers in California
 * Each sitemap limited to 50,000 URLs per Google spec.
 */
export async function GET(
  request: NextRequest,
  // eslint-disable-next-line
  context: any
) {
  // Extract state from the URL path or params
  const resolvedParams = context?.params ? await context.params : {};
  const stateSlug = resolvedParams.state || "";

  if (!stateSlug) {
    return new NextResponse("State parameter required", { status: 400 });
  }

  const stateAbbr = slugToStateAbbr(stateSlug) || stateSlug.toUpperCase();

  const providers = getProvidersByState(stateAbbr);

  if (!providers.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  const baseUrl = "https://npixray.com";

  // Limit to 50,000 per Google spec
  const limited = providers.slice(0, 50000);

  const urls = limited
    .map(
      (p) =>
        `  <url><loc>${baseUrl}/provider/${p.npi}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`
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
