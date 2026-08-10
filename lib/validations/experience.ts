import { z } from "zod";

export const experienceFormSchema = z
  .object({
    company: z.string().trim().min(2, "Company must be at least 2 characters"),
    position: z.string().trim().min(2, "Position must be at least 2 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    images: z.custom<FileList>().nullable(),
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
    current: z.boolean().default(false),
    images: z.array(z.instanceof(File)).max(10, "You can upload up to 10 images"),
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
