import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const experienceFormSchema = z
  .object({
    company: z.string().trim().min(2, "Company must be at least 2 characters"),
    position: z.string().trim().min(2, "Position must be at least 2 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean(),
    images: z.custom<FileList>().nullable(),

    seoTitle: optionalString,
    seoDescription: optionalString,
    seoKeywords: optionalString,
    seoOgTitle: optionalString,
    seoOgDescription: optionalString,
    seoOgImage: optionalString,
    seoCanonicalUrl: optionalString,
    seoIndex: z.boolean(),
    seoFollow: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required if this is not your current job",
      path: ["endDate"],
    }
  );

export const experienceUploadSchema = z
  .object({
    company: z.string().trim().min(2, "Company must be at least 2 characters"),
    position: z.string().trim().min(2, "Position must be at least 2 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean(),
    images: z.array(z.instanceof(File)).max(10, "You can upload up to 10 images"),

    seoTitle: optionalString,
    seoDescription: optionalString,
    seoKeywords: optionalString,
    seoOgTitle: optionalString,
    seoOgDescription: optionalString,
    seoOgImage: optionalString,
    seoCanonicalUrl: optionalString,
    seoIndex: z.boolean(),
    seoFollow: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required if this is not your current job",
      path: ["endDate"],
    }
  );
