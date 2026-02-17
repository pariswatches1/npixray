import { NextResponse } from "next/server";
import {
  getDistinctStates,
  getDistinctCities,
  getDistinctSpecialties,
  stateToSlug,
  cityToSlug,
  specialtyToSlug,
} from "@/lib/db-queries";

/** States + Cities + State/Specialty combo sitemap */
export async function GET() {
  const baseUrl = "https://npixray.com";
  const urls: string[] = [];

  const states = await getDistinctStates();
  const specialties = await getDistinctSpecialties();

  for (const stateAbbr of states) {
    const stateSlug = stateToSlug(stateAbbr);

    // State page
    urls.push(
      `  <url><loc>${baseUrl}/states/${stateSlug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    );

    // City pages
    const cities = await getDistinctCities(stateAbbr, 5);
    for (const city of cities) {
      const cSlug = cityToSlug(city);
      urls.push(
        `  <url><loc>${baseUrl}/states/${stateSlug}/${cSlug}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`
      );
    }

    // State + Specialty combos
    for (const specialty of specialties) {
      const specSlug = specialtyToSlug(specialty);
      urls.push(
        `  <url><loc>${baseUrl}/states/${stateSlug}/specialties/${specSlug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`
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
