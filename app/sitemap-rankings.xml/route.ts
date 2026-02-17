import { NextResponse } from "next/server";
import { getDistinctStates, getDistinctSpecialties, stateToSlug, specialtyToSlug } from "@/lib/db-queries";

/** Rankings + Comparisons sitemap */
export async function GET() {
  const baseUrl = "https://npixray.com";
  const urls: string[] = [];

  // Top providers by state
  const states = await getDistinctStates();
  for (const s of states) {
    urls.push(
      `  <url><loc>${baseUrl}/rankings/top-providers/${stateToSlug(s)}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    );
  }

  // Comparison pages - generate combos from specialties
  const specialties = await getDistinctSpecialties();
  for (let i = 0; i < specialties.length; i++) {
    for (let j = i + 1; j < specialties.length; j++) {
      const slug = `${specialtyToSlug(specialties[i])}-vs-${specialtyToSlug(specialties[j])}`;
      urls.push(
        `  <url><loc>${baseUrl}/compare/${slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
