import { NextResponse } from "next/server";
import { getDistinctStates } from "@/lib/db-queries";

/**
 * Sitemap Index — /sitemap.xml
 * Points to sub-sitemaps for each content section.
 * Each sub-sitemap handles up to 50,000 URLs per Google spec.
 */
export async function GET() {
  const states = await getDistinctStates();
  const baseUrl = "https://npixray.com";

  const providerSitemaps = states
    .map(
      (state) =>
        `  <sitemap><loc>${baseUrl}/api/sitemap-providers/${state.toLowerCase()}</loc></sitemap>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${baseUrl}/sitemap-pages.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-states.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-specialties.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-codes.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-tools.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-insights.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-rankings.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-compare.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-solutions.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-answers.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-reports.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-scores.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-acquire.xml</loc></sitemap>
${providerSitemaps}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
