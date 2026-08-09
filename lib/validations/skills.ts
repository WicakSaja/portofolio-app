import { z } from "zod";

export const skillFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  category: z.string().trim().min(2, "Category is required"),
  level: z
    .number()
    .int()
    .min(1, "Level must be at least 1")
    .max(100, "Level cannot exceed 100"),
  icon: z.custom<FileList>().nullable(),
});

export const skillUploadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  category: z.string().trim().min(2, "Category is required"),
  level: z
    .number()
    .int()
    .min(1, "Level must be at least 1")
    .max(100, "Level cannot exceed 100"),
  icon: z.instanceof(File).nullable(),
});
