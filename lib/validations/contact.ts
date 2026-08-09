import { z } from "zod";

const optionalUrl = z.string().trim().url("Must be a valid URL").optional().or(z.literal(""));

export const contactFormSchema = z.object({
  email: z.string().trim().email("Must be a valid email address"),
  phone: z.string().trim().optional(),
  linkedin: optionalUrl,
  github: optionalUrl,
});
