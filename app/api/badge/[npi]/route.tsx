import { NextRequest, NextResponse } from "next/server";
import { getProvider, getBenchmarkBySpecialty, getProviderCodeCount } from "@/lib/db-queries";
import { calculateRevenueScore, getScoreTier } from "@/lib/revenue-score";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ npi: string }> }
) {
  const { npi } = await params;
  if (!npi || npi.length !== 10) {
    return new NextResponse("Invalid NPI", { status: 400 });
  }

  const provider = await getProvider(npi);
  if (!provider) {
    return new NextResponse("Provider not found", { status: 404 });
  }

  const [benchmark, codeCount] = await Promise.all([
    getBenchmarkBySpecialty(provider.specialty),
    getProviderCodeCount(npi),
  ]);

  let score = 0;
  if (benchmark) {
    const result = calculateRevenueScore(provider, benchmark, codeCount);
    score = result.overall;
  } else if (provider.revenue_score) {
    score = provider.revenue_score;
  }

  const tier = getScoreTier(score);

  // Build shields.io-style SVG badge
  const labelText = "Revenue Score";
  const valueText = String(score);
  const labelWidth = 100;
  const valueWidth = 44;
  const totalWidth = labelWidth + valueWidth;
  const height = 28;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="${labelText}: ${valueText}">
  <title>${labelText}: ${valueText} — Verified by NPIxray</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="5" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="${height}" fill="#1a1a2e"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="${height}" fill="${tier.hexColor}"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text aria-hidden="true" x="${labelWidth / 2}" y="20" fill="#010101" fill-opacity=".3">${labelText}</text>
    <text x="${labelWidth / 2}" y="19">${labelText}</text>
    <text aria-hidden="true" x="${labelWidth + valueWidth / 2}" y="20" fill="#010101" fill-opacity=".3">${valueText}</text>
    <text x="${labelWidth + valueWidth / 2}" y="19" font-weight="bold">${valueText}</text>
  </g>
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
