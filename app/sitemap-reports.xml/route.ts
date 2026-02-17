import { NextResponse } from "next/server";
import { SPECIALTY_LIST, STATE_LIST } from "@/lib/benchmark-data";
import { stateToSlug, specialtyToSlug } from "@/lib/db-queries";

/** Sitemap for /reports/* pages */
export async function GET() {
  const baseUrl = "https://npixray.com";

  const urls = [
    `  <url><loc>${baseUrl}/reports</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    `  <url><loc>${baseUrl}/reports/national</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>`,
    `  <url><loc>${baseUrl}/reports/embed</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
    ...STATE_LIST.map(
      (s) =>
        `  <url><loc>${baseUrl}/reports/states/${stateToSlug(s.abbr)}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    ),
    ...SPECIALTY_LIST.map(
      (s) =>
        `  <url><loc>${baseUrl}/reports/specialties/${specialtyToSlug(s)}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    ),
  ].join("\n");

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
