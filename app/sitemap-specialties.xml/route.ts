import { NextResponse } from "next/server";
import { getDistinctSpecialties, specialtyToSlug } from "@/lib/db-queries";

/** Specialties sitemap */
export async function GET() {
  const baseUrl = "https://npixray.com";
  const specialties = getDistinctSpecialties();

  const urls = specialties
    .map(
      (s) =>
        `  <url><loc>${baseUrl}/specialties/${specialtyToSlug(s)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
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
