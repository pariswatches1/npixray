import { NextResponse } from "next/server";
import { TOP_BILLING_CODES } from "@/lib/benchmark-data";

/**
 * Billing codes sitemap.
 *
 * Uses static TOP_BILLING_CODES instead of DB queries to ensure
 * sitemaps are always available — even when DB is slow.
 */
export async function GET() {
  const baseUrl = "https://npixray.com";

  const urls = TOP_BILLING_CODES
    .map(
      (code) =>
        `  <url><loc>${baseUrl}/codes/${code}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
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
