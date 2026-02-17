import { NextResponse } from "next/server";
import { getAllCategorySlugs } from "@/lib/category-data";
import { getAllSwitchSlugs } from "@/lib/switch-data";

/** Solutions sitemap — solutions pages, category comparisons, switch/migration, ROI calculator */
export async function GET() {
  const baseUrl = "https://npixray.com";

  const categorySlugs = getAllCategorySlugs();
  const switchSlugs = getAllSwitchSlugs();

  // Solutions pages — inline data from solutions/[slug]/page.tsx
  const solutionSlugs = [
    "solo-practice",
    "group-practice",
    "rural-practice",
    "hospital-outpatient",
    "billing-companies",
    "practice-managers",
    "physician-entrepreneurs",
    "new-practices",
    "multi-location",
    "fqhc-community-health",
  ];

  const solutionUrls = [
    `  <url><loc>${baseUrl}/solutions</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    ...solutionSlugs.map(
      (slug) =>
        `  <url><loc>${baseUrl}/solutions/${slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    ),
  ].join("\n");

  const categoryUrls = categorySlugs
    .map(
      (slug) =>
        `  <url><loc>${baseUrl}/compare/category/${slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    )
    .join("\n");

  const switchUrls = [
    `  <url><loc>${baseUrl}/switch</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    ...switchSlugs.map(
      (slug) =>
        `  <url><loc>${baseUrl}/switch/${slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    ),
  ].join("\n");

  const toolUrls = `  <url><loc>${baseUrl}/tools/roi-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${solutionUrls}
${categoryUrls}
${switchUrls}
${toolUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control":
        "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
