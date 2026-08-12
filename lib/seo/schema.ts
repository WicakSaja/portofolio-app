import { SEO_CONFIG } from "./config";
import { makeAbsoluteUrl } from "./metadata";

interface GlobalSettingsSchemaInput {
  authorName?: string | null;
  authorAlternateName?: string | null;
  authorJobTitle?: string | null;
  authorDescription?: string | null;
  about?: string | null;
  avatar?: string | null;
  seoDescription?: string | null;
}

interface ContactSchemaInput {
  linkedin?: string | null;
  github?: string | null;
  email?: string | null;
}

export function generateHomepageSchema(
  settings?: GlobalSettingsSchemaInput | null,
  contact?: ContactSchemaInput | null
) {
  const authorName = settings?.authorName || SEO_CONFIG.defaultAuthorName;
  const alternateName = settings?.authorAlternateName || SEO_CONFIG.defaultAuthorAlt;
  const jobTitle = settings?.authorJobTitle || SEO_CONFIG.defaultAuthorJob;
  const description =
    settings?.authorDescription ||
    settings?.about ||
    settings?.seoDescription ||
    SEO_CONFIG.defaultAuthorDesc;
  const avatarUrl = makeAbsoluteUrl(settings?.avatar || SEO_CONFIG.defaultOgImage);

  const sameAs: string[] = [];
  if (contact?.linkedin) sameAs.push(contact.linkedin);
  if (contact?.github) sameAs.push(contact.github);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorName,
    alternateName: alternateName,
    url: SEO_CONFIG.siteUrl,
    image: avatarUrl,
    jobTitle: jobTitle,
    description: description,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${authorName} Portfolio`,
    url: SEO_CONFIG.siteUrl,
    author: {
      "@type": "Person",
      name: authorName,
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${authorName} - ${jobTitle}`,
    url: SEO_CONFIG.siteUrl,
    mainEntity: personSchema,
  };

  return [personSchema, webSiteSchema, profilePageSchema];
}

interface ProjectSchemaInput {
  id: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  images?: string[];
  seoCanonicalUrl?: string | null;
  seoOgImage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export function generateProjectSchema(project: ProjectSchemaInput) {
  const projectUrl = makeAbsoluteUrl(
    project.seoCanonicalUrl || `/projects/${project.id}`
  );
  const imageUrl = makeAbsoluteUrl(
    project.seoOgImage || project.images?.[0] || project.thumbnail || SEO_CONFIG.defaultOgImage
  );

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: projectUrl,
    image: imageUrl,
    author: {
      "@type": "Person",
      name: SEO_CONFIG.defaultAuthorName,
      url: SEO_CONFIG.siteUrl,
    },
    ...(project.createdAt ? { dateCreated: project.createdAt.toISOString() } : {}),
    ...(project.updatedAt ? { dateModified: project.updatedAt.toISOString() } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SEO_CONFIG.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${SEO_CONFIG.siteUrl}/#projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: projectUrl,
      },
    ],
  };

  return [creativeWorkSchema, breadcrumbSchema];
}

interface ExperienceSchemaInput {
  id: string;
  company: string;
  position: string;
  description: string;
  seoCanonicalUrl?: string | null;
}

export function generateExperienceSchema(experience: ExperienceSchemaInput) {
  const experienceUrl = makeAbsoluteUrl(
    experience.seoCanonicalUrl || `/experience/${experience.id}`
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SEO_CONFIG.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Experience",
        item: `${SEO_CONFIG.siteUrl}/#experience`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${experience.position} at ${experience.company}`,
        item: experienceUrl,
      },
    ],
  };

  return [breadcrumbSchema];
}
