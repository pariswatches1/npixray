import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/scan/", "/admin/"],
      },
    ],
    sitemap: "https://npixray.com/sitemap.xml",
  };
}
