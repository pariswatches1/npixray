import { NextResponse } from "next/server";
import { STATE_LIST, SPECIALTY_LIST } from "@/lib/benchmark-data";
import { stateToSlug, specialtyToSlug } from "@/lib/db-queries";

/**
 * States + State/Specialty combo sitemap.
 *
 * Uses static STATE_LIST and SPECIALTY_LIST instead of DB queries
 * to ensure sitemaps are always available — even when DB is slow.
 * City pages are omitted (require DB) but remain discoverable via
 * internal links on state pages.
 */
export async function GET() {
  const baseUrl = "https://npixray.com";
  const urls: string[] = [];

  for (const state of STATE_LIST) {
    const stateSlug = stateToSlug(state.abbr);

    // State page
    urls.push(
      `  <url><loc>${baseUrl}/states/${stateSlug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    );

    // State + Specialty combos
    for (const specialty of SPECIALTY_LIST) {
      const specSlug = specialtyToSlug(specialty);
      urls.push(
        `  <url><loc>${baseUrl}/states/${stateSlug}/specialties/${specSlug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`
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
