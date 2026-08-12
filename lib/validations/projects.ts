import { z } from "zod";

const optionalUrl = z.string().trim().optional().or(z.literal(""));
const optionalString = z.string().trim().optional().or(z.literal(""));

export const projectFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  images: z.custom<FileList>().nullable(),
  github: optionalUrl,
  demo: optionalUrl,
  category: z.string().trim().min(2, "Category is required"),
  featured: z.boolean(),

  seoTitle: optionalString,
  seoDescription: optionalString,
  seoKeywords: optionalString,
  seoOgTitle: optionalString,
  seoOgDescription: optionalString,
  seoOgImage: optionalString,
  seoCanonicalUrl: optionalString,
  seoIndex: z.boolean(),
  seoFollow: z.boolean(),
});

export const projectUploadSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  images: z.array(z.instanceof(File)).max(10, "Maximum 10 images allowed"),
  github: optionalUrl,
  demo: optionalUrl,
  category: z.string().trim().min(2, "Category is required"),
  featured: z.boolean(),

  seoTitle: optionalString,
  seoDescription: optionalString,
  seoKeywords: optionalString,
  seoOgTitle: optionalString,
  seoOgDescription: optionalString,
  seoOgImage: optionalString,
  seoCanonicalUrl: optionalString,
  seoIndex: z.boolean(),
  seoFollow: z.boolean(),
});

export const portfolioFormSchema = projectFormSchema;
export const portfolioUploadSchema = projectUploadSchema;

export type ProjectSchema = z.infer<typeof projectFormSchema>;
export type PortfolioSchema = ProjectSchema;
