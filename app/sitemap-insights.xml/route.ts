import { NextResponse } from "next/server";

/** Insights sitemap */
export async function GET() {
  const baseUrl = "https://npixray.com";
  const insights = [
    "medicare-billing-overview", "highest-paying-specialties", "most-common-billing-codes",
    "ccm-adoption-rates", "rpm-adoption-rates", "awv-completion-rates", "bhi-screening-rates",
    "em-coding-patterns", "medicare-revenue-by-state", "revenue-gap-by-specialty",
    "top-billing-providers", "rural-vs-urban-billing", "new-patient-vs-established",
    "procedure-vs-evaluation", "medicare-payment-trends",
  ];

  const urls = insights
    .map(
      (i) =>
        `  <url><loc>${baseUrl}/insights/${i}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
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
