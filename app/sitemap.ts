import type { MetadataRoute } from "next";
import { getAllStateSlugs } from "@/lib/state-data";
import { getAllSpecialtySlugs } from "@/lib/specialty-data";

const BASE_URL = "https://npixray.com";

const GUIDE_SLUGS = [
  "ccm-billing-99490",
  "rpm-billing-99453-99458",
  "awv-billing-g0438-g0439",
  "bhi-billing-99484",
  "em-coding-optimization",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/states`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/specialties`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const guidePages: MetadataRoute.Sitemap = GUIDE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/guides/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const statePages: MetadataRoute.Sitemap = getAllStateSlugs().map((slug) => ({
    url: `${BASE_URL}/states/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const specialtyPages: MetadataRoute.Sitemap = getAllSpecialtySlugs().map(
    (slug) => ({
      url: `${BASE_URL}/specialties/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  return [...staticPages, ...guidePages, ...statePages, ...specialtyPages];
}
