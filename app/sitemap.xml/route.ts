import { NextResponse } from "next/server";

/**
 * Sitemap Index — /sitemap.xml
 * Points to sub-sitemaps for each content section.
 * Each sub-sitemap handles up to 50,000 URLs per Google spec.
 *
 * All sub-sitemaps use static constants — zero DB dependency.
 * Provider sitemaps removed: they depend on DB queries which fail
 * on Neon free tier, causing "Couldn't fetch" in Google Search Console.
 * Provider pages are discoverable via internal links instead.
 */
export async function GET() {
  const baseUrl = "https://npixray.com";

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
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
