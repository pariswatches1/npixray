import { NextResponse } from "next/server";

export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://npixray.com/sitemap.xml
`;

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
