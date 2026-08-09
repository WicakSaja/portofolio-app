import { z } from "zod";

export const settingsFormSchema = z.object({
  heroTitle: z.string().trim().min(5, "Hero title must be at least 5 characters"),
  heroSubtitle: z.string().trim().min(10, "Hero subtitle must be at least 10 characters"),
  about: z.string().trim().min(20, "About section must be at least 20 characters"),
  avatar: z.custom<FileList>().nullable(),
  resume: z.custom<FileList>().nullable(),
});

export const settingsUploadSchema = z.object({
  heroTitle: z.string().trim().min(5, "Hero title must be at least 5 characters"),
  heroSubtitle: z.string().trim().min(10, "Hero subtitle must be at least 10 characters"),
  about: z.string().trim().min(20, "About section must be at least 20 characters"),
  avatar: z.instanceof(File).nullable(),
  resume: z.instanceof(File).nullable(),
});
