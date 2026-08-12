import { z } from "zod";
import { projectFormSchema } from "@/lib/validations/projects";

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type PortfolioFormValues = ProjectFormValues;

export type ActionState = {
  success: boolean;
  message: string;
};
