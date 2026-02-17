import { NextResponse } from "next/server";
import { ALL_SLUGS } from "@/app/answers/data";

/** Sitemap for /answers/* AEO pages */
export async function GET() {
  const baseUrl = "https://npixray.com";

  const urls = [
    // Answers index page
    `  <url><loc>${baseUrl}/answers</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    // Individual answer pages
    ...ALL_SLUGS.map(
      (slug) =>
        `  <url><loc>${baseUrl}/answers/${slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`
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
