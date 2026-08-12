import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { SEO_CONFIG } from "@/lib/seo/config";
import { makeAbsoluteUrl } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, projects, experiences] = await Promise.all([
    prisma.settings.findFirst({
      select: { updatedAt: true, robotsIndex: true },
    }),
    prisma.portfolio.findMany({
      select: { id: true, updatedAt: true, seoIndex: true, seoCanonicalUrl: true },
    }),
    prisma.experience.findMany({
      select: { id: true, updatedAt: true, seoIndex: true, seoCanonicalUrl: true },
    }),
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Homepage (if global index is not explicitly false)
  if (settings?.robotsIndex !== false) {
    sitemapEntries.push({
      url: SEO_CONFIG.siteUrl,
      lastModified: settings?.updatedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    });
  }

  // 2. Indexable Projects
  projects.forEach((proj) => {
    if (proj.seoIndex !== false) {
      const url = makeAbsoluteUrl(
        proj.seoCanonicalUrl && proj.seoCanonicalUrl.trim() !== ""
          ? proj.seoCanonicalUrl
          : `/projects/${proj.id}`
      );
      sitemapEntries.push({
        url,
        lastModified: proj.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  });

  // 3. Indexable Experiences
  experiences.forEach((exp) => {
    if (exp.seoIndex !== false) {
      const url = makeAbsoluteUrl(
        exp.seoCanonicalUrl && exp.seoCanonicalUrl.trim() !== ""
          ? exp.seoCanonicalUrl
          : `/experience/${exp.id}`
      );
      sitemapEntries.push({
        url,
        lastModified: exp.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  });

  return sitemapEntries;
}
