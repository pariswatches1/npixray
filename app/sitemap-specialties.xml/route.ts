import { NextResponse } from "next/server";
import { SPECIALTY_LIST } from "@/lib/benchmark-data";
import { specialtyToSlug } from "@/lib/db-queries";

/**
 * Specialties sitemap.
 *
 * Uses static SPECIALTY_LIST instead of DB queries to ensure
 * sitemaps are always available — even when DB is slow.
 */
export async function GET() {
  const baseUrl = "https://npixray.com";

  const urls = SPECIALTY_LIST
    .map(
      (s) =>
        `  <url><loc>${baseUrl}/specialties/${specialtyToSlug(s)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
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
