import { NextResponse } from "next/server";

/** Tools sitemap */
export async function GET() {
  const baseUrl = "https://npixray.com";
  const tools = [
    "revenue-calculator", "npi-lookup", "code-lookup", "specialty-comparison",
    "state-comparison", "ccm-calculator", "rpm-calculator", "awv-calculator",
    "em-audit", "practice-benchmark", "portfolio", "forecast", "widgets",
  ];

  const urls = tools
    .map(
      (t) =>
        `  <url><loc>${baseUrl}/tools/${t}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`
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
