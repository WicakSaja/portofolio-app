import { z } from "zod";

const optionalUrl = z.string().trim().optional().or(z.literal(""));

export const portfolioFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  thumbnail: z.custom<FileList>().nullable(),
  github: optionalUrl,
  demo: optionalUrl,
  category: z.string().trim().min(2, "Category is required"),
  featured: z.boolean(),
});

export const portfolioUploadSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  thumbnail: z.instanceof(File).nullable(),
  github: optionalUrl,
  demo: optionalUrl,
  category: z.string().trim().min(2, "Category is required"),
  featured: z.boolean(),
});

export type PortfolioSchema = z.infer<typeof portfolioFormSchema>;