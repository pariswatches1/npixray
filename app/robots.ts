import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/scan/",
          "/embed/",
          "/api/",
          "/coach/",
          "/partners/",
          "/admin/",
          "/login/",
          "/dashboard/",
        ],
      },
    ],
    sitemap: "https://npixray.com/sitemap.xml",
  };
}
