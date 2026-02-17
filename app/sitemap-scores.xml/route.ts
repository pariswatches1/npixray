import { NextResponse } from "next/server";
import { STATE_LIST, SPECIALTY_LIST } from "@/lib/benchmark-data";
import { stateToSlug, specialtyToSlug } from "@/lib/db-queries";

const BASE = "https://npixray.com";

export async function GET() {
  const now = new Date().toISOString();

  const urls: { loc: string; priority: string }[] = [
    { loc: `${BASE}/scores`, priority: "0.9" },
  ];

  // State score pages
  for (const s of STATE_LIST) {
    urls.push({ loc: `${BASE}/scores/${stateToSlug(s.abbr)}`, priority: "0.7" });
  }

  // Specialty score pages
  for (const spec of SPECIALTY_LIST) {
    urls.push({ loc: `${BASE}/scores/specialties/${specialtyToSlug(spec)}`, priority: "0.7" });
  }

  // Score compare tool
  urls.push({ loc: `${BASE}/tools/score-compare`, priority: "0.6" });

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
