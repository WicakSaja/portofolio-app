import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const settingsFormSchema = z.object({
  heroTitle: z.string().trim().min(5, "Hero title must be at least 5 characters"),
  heroSubtitle: z.string().trim().min(10, "Hero subtitle must be at least 10 characters"),
  about: z.string().trim().min(20, "About section must be at least 20 characters"),
  avatar: z.custom<FileList>().nullable(),
  resume: z.custom<FileList>().nullable(),

  seoTitle: optionalString,
  seoDescription: optionalString,
  seoCanonicalUrl: optionalString,
  seoOgTitle: optionalString,
  seoOgDescription: optionalString,
  seoOgImage: optionalString,

  authorName: optionalString,
  authorAlternateName: optionalString,
  authorJobTitle: optionalString,
  authorDescription: optionalString,

  googleSiteVerification: optionalString,
  bingSiteVerification: optionalString,

  robotsIndex: z.boolean(),
  robotsFollow: z.boolean(),
});

export const settingsUploadSchema = z.object({
  heroTitle: z.string().trim().min(5, "Hero title must be at least 5 characters"),
  heroSubtitle: z.string().trim().min(10, "Hero subtitle must be at least 10 characters"),
  about: z.string().trim().min(20, "About section must be at least 20 characters"),
  avatar: z.instanceof(File).nullable(),
  resume: z.instanceof(File).nullable(),

  seoTitle: optionalString,
  seoDescription: optionalString,
  seoCanonicalUrl: optionalString,
  seoOgTitle: optionalString,
  seoOgDescription: optionalString,
  seoOgImage: optionalString,

  authorName: optionalString,
  authorAlternateName: optionalString,
  authorJobTitle: optionalString,
  authorDescription: optionalString,

  googleSiteVerification: optionalString,
  bingSiteVerification: optionalString,

  robotsIndex: z.boolean(),
  robotsFollow: z.boolean(),
});
