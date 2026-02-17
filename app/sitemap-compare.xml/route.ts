import { NextResponse } from "next/server";
import { getAllCompetitorSlugs, getAllAlternativeSlugs } from "@/lib/competitor-data";

/** Sitemap for /compare/vs/* and /alternatives/* pages */
export async function GET() {
  const baseUrl = "https://npixray.com";

  const competitorSlugs = getAllCompetitorSlugs();
  const alternativeSlugs = getAllAlternativeSlugs();

  const urls = [
    // VS index page
    `  <url><loc>${baseUrl}/vs</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    // VS comparison pages
    ...competitorSlugs.map(
      (slug) =>
        `  <url><loc>${baseUrl}/vs/${slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    ),
    // Alternatives index page
    `  <url><loc>${baseUrl}/alternatives</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    // Alternatives pages
    ...alternativeSlugs.map(
      (slug) =>
        `  <url><loc>${baseUrl}/alternatives/${slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
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
