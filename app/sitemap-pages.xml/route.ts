import { NextResponse } from "next/server";

/** Static pages sitemap */
export async function GET() {
  const baseUrl = "https://npixray.com";
  const pages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/pricing", priority: "0.8", changefreq: "monthly" },
    { loc: "/about", priority: "0.7", changefreq: "monthly" },
    { loc: "/tools", priority: "0.9", changefreq: "monthly" },
    { loc: "/tools/revenue-calculator", priority: "0.9", changefreq: "monthly" },
    { loc: "/tools/npi-lookup", priority: "0.9", changefreq: "monthly" },
    { loc: "/tools/code-lookup", priority: "0.8", changefreq: "monthly" },
    { loc: "/tools/specialty-comparison", priority: "0.8", changefreq: "monthly" },
    { loc: "/tools/state-comparison", priority: "0.8", changefreq: "monthly" },
    { loc: "/tools/ccm-calculator", priority: "0.8", changefreq: "monthly" },
    { loc: "/tools/rpm-calculator", priority: "0.8", changefreq: "monthly" },
    { loc: "/tools/awv-calculator", priority: "0.8", changefreq: "monthly" },
    { loc: "/tools/em-audit", priority: "0.8", changefreq: "monthly" },
    { loc: "/tools/practice-benchmark", priority: "0.8", changefreq: "monthly" },
    { loc: "/tools/widgets", priority: "0.6", changefreq: "monthly" },
    { loc: "/states", priority: "0.9", changefreq: "weekly" },
    { loc: "/specialties", priority: "0.9", changefreq: "weekly" },
    { loc: "/codes", priority: "0.9", changefreq: "weekly" },
    { loc: "/insights", priority: "0.8", changefreq: "weekly" },
    { loc: "/rankings", priority: "0.8", changefreq: "weekly" },
    { loc: "/rankings/top-specialties", priority: "0.8", changefreq: "monthly" },
    { loc: "/rankings/top-cities", priority: "0.8", changefreq: "monthly" },
    { loc: "/compare", priority: "0.8", changefreq: "monthly" },
    { loc: "/api-docs", priority: "0.6", changefreq: "monthly" },
    { loc: "/research", priority: "0.8", changefreq: "monthly" },
    { loc: "/data-api", priority: "0.7", changefreq: "monthly" },
    { loc: "/search", priority: "0.7", changefreq: "weekly" },
    { loc: "/methodology", priority: "0.9", changefreq: "monthly" },
    { loc: "/programs", priority: "0.9", changefreq: "monthly" },
    { loc: "/programs/ccm", priority: "0.9", changefreq: "monthly" },
    { loc: "/programs/rpm", priority: "0.9", changefreq: "monthly" },
    { loc: "/programs/awv", priority: "0.9", changefreq: "monthly" },
    { loc: "/programs/bhi", priority: "0.9", changefreq: "monthly" },
    { loc: "/programs/em-coding", priority: "0.9", changefreq: "monthly" },
    { loc: "/reports/2026-medicare-revenue-gap", priority: "1.0", changefreq: "monthly" },
  ];

  const urls = pages
    .map(
      (p) =>
        `  <url><loc>${baseUrl}${p.loc}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`
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
