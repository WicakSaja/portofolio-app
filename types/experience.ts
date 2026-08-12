import { z } from "zod";
import { experienceFormSchema } from "@/lib/validations/experience";

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;
