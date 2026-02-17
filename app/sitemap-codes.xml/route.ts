import { NextResponse } from "next/server";
import { getTopCodes } from "@/lib/db-queries";

/** Billing codes sitemap */
export async function GET() {
  const baseUrl = "https://npixray.com";
  const codes = await getTopCodes(200);

  const urls = codes
    .map(
      (c) =>
        `  <url><loc>${baseUrl}/codes/${c.hcpcs_code}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
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
