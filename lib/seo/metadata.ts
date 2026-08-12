import type { Metadata } from "next";
import { SEO_CONFIG } from "./config";

export function makeAbsoluteUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return SEO_CONFIG.siteUrl;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SEO_CONFIG.siteUrl}${cleanPath}`;
}

interface GlobalSeoOptions {
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoCanonicalUrl?: string | null;
  seoOgTitle?: string | null;
  seoOgDescription?: string | null;
  seoOgImage?: string | null;
  avatar?: string | null;
  googleSiteVerification?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
}

export function buildGlobalMetadata(
  settings?: GlobalSeoOptions | null,
  path: string = "/"
): Metadata {
  const title =
    settings?.seoTitle && settings.seoTitle.trim() !== ""
      ? settings.seoTitle
      : SEO_CONFIG.defaultTitle;

  const description =
    settings?.seoDescription && settings.seoDescription.trim() !== ""
      ? settings.seoDescription
      : SEO_CONFIG.defaultDescription;

  const canonicalUrl = makeAbsoluteUrl(
    settings?.seoCanonicalUrl && settings.seoCanonicalUrl.trim() !== ""
      ? settings.seoCanonicalUrl
      : path
  );

  const ogTitle =
    settings?.seoOgTitle && settings.seoOgTitle.trim() !== ""
      ? settings.seoOgTitle
      : title;

  const ogDescription =
    settings?.seoOgDescription && settings.seoOgDescription.trim() !== ""
      ? settings.seoOgDescription
      : description;

  const rawOgImage =
    settings?.seoOgImage || settings?.avatar || SEO_CONFIG.defaultOgImage;
  const ogImageUrl = makeAbsoluteUrl(rawOgImage);

  const index = settings?.robotsIndex ?? true;
  const follow = settings?.robotsFollow ?? true;

  const verification: Record<string, string> = {};
  if (settings?.googleSiteVerification && settings.googleSiteVerification.trim() !== "") {
    verification.google = settings.googleSiteVerification;
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: settings?.seoTitle || SEO_CONFIG.defaultAuthorName,
      images: [
        {
          url: ogImageUrl,
          alt: ogTitle,
        },
      ],
      type: "website",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
  };
}

interface ProjectSeoOptions {
  id: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  images?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoOgTitle?: string | null;
  seoOgDescription?: string | null;
  seoOgImage?: string | null;
  seoCanonicalUrl?: string | null;
  seoIndex?: boolean;
  seoFollow?: boolean;
}

export function buildProjectMetadata(
  project: ProjectSeoOptions,
  globalSettings?: GlobalSeoOptions | null
): Metadata {
  const authorName = globalSettings?.seoTitle || "Bayu Wicaksono";

  const fallbackTitle = `${project.title} | ${authorName}`;
  const title =
    project.seoTitle && project.seoTitle.trim() !== ""
      ? project.seoTitle
      : fallbackTitle;

  const fallbackDescription = project.description;
  const description =
    project.seoDescription && project.seoDescription.trim() !== ""
      ? project.seoDescription
      : fallbackDescription;

  const canonicalUrl = makeAbsoluteUrl(
    project.seoCanonicalUrl && project.seoCanonicalUrl.trim() !== ""
      ? project.seoCanonicalUrl
      : `/projects/${project.id}`
  );

  const ogTitle =
    project.seoOgTitle && project.seoOgTitle.trim() !== ""
      ? project.seoOgTitle
      : title;

  const ogDescription =
    project.seoOgDescription && project.seoOgDescription.trim() !== ""
      ? project.seoOgDescription
      : description;

  const rawImage =
    project.seoOgImage ||
    project.images?.[0] ||
    project.thumbnail ||
    globalSettings?.seoOgImage ||
    globalSettings?.avatar ||
    SEO_CONFIG.defaultOgImage;

  const ogImageUrl = makeAbsoluteUrl(rawImage);

  const index = project.seoIndex ?? true;
  const follow = project.seoFollow ?? true;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "Bayu Wicaksono Portfolio",
      images: [
        {
          url: ogImageUrl,
          alt: ogTitle,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
  };
}

interface ExperienceSeoOptions {
  id: string;
  company: string;
  position: string;
  description: string;
  images?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoOgTitle?: string | null;
  seoOgDescription?: string | null;
  seoOgImage?: string | null;
  seoCanonicalUrl?: string | null;
  seoIndex?: boolean;
  seoFollow?: boolean;
}

export function buildExperienceMetadata(
  experience: ExperienceSeoOptions,
  globalSettings?: GlobalSeoOptions | null
): Metadata {
  const fallbackTitle = `${experience.position} at ${experience.company} | Bayu Wicaksono`;
  const title =
    experience.seoTitle && experience.seoTitle.trim() !== ""
      ? experience.seoTitle
      : fallbackTitle;

  const fallbackDescription = experience.description;
  const description =
    experience.seoDescription && experience.seoDescription.trim() !== ""
      ? experience.seoDescription
      : fallbackDescription;

  const canonicalUrl = makeAbsoluteUrl(
    experience.seoCanonicalUrl && experience.seoCanonicalUrl.trim() !== ""
      ? experience.seoCanonicalUrl
      : `/experience/${experience.id}`
  );

  const ogTitle =
    experience.seoOgTitle && experience.seoOgTitle.trim() !== ""
      ? experience.seoOgTitle
      : title;

  const ogDescription =
    experience.seoOgDescription && experience.seoOgDescription.trim() !== ""
      ? experience.seoOgDescription
      : description;

  const rawImage =
    experience.seoOgImage ||
    experience.images?.[0] ||
    globalSettings?.seoOgImage ||
    globalSettings?.avatar ||
    SEO_CONFIG.defaultOgImage;

  const ogImageUrl = makeAbsoluteUrl(rawImage);

  const index = experience.seoIndex ?? true;
  const follow = experience.seoFollow ?? true;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "Bayu Wicaksono Portfolio",
      images: [
        {
          url: ogImageUrl,
          alt: ogTitle,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
  };
}
