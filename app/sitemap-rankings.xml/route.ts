import { NextResponse } from "next/server";
import { STATE_LIST, SPECIALTY_LIST } from "@/lib/benchmark-data";
import { stateToSlug, specialtyToSlug } from "@/lib/db-queries";

/**
 * Rankings + Comparisons sitemap.
 *
 * Uses static STATE_LIST and SPECIALTY_LIST instead of DB queries
 * to ensure sitemaps are always available — even when DB is slow.
 */
export async function GET() {
  const baseUrl = "https://npixray.com";
  const urls: string[] = [];

  // Top providers by state
  for (const s of STATE_LIST) {
    urls.push(
      `  <url><loc>${baseUrl}/rankings/top-providers/${stateToSlug(s.abbr)}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    );
  }

  // Comparison pages - generate combos from specialties
  for (let i = 0; i < SPECIALTY_LIST.length; i++) {
    for (let j = i + 1; j < SPECIALTY_LIST.length; j++) {
      const slug = `${specialtyToSlug(SPECIALTY_LIST[i])}-vs-${specialtyToSlug(SPECIALTY_LIST[j])}`;
      urls.push(
        `  <url><loc>${baseUrl}/compare/${slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
