import { NextResponse } from "next/server";
import { STATE_LIST } from "@/lib/benchmark-data";
import { stateToSlug } from "@/lib/db-queries";

const BASE = "https://npixray.com";

export async function GET() {
  const now = new Date().toISOString();

  const urls: { loc: string; priority: string }[] = [
    { loc: `${BASE}/acquire`, priority: "0.9" },
    { loc: `${BASE}/tools/portfolio`, priority: "0.8" },
  ];

  // State market pages
  for (const s of STATE_LIST) {
    urls.push({ loc: `${BASE}/acquire/markets/${stateToSlug(s.abbr)}`, priority: "0.7" });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
