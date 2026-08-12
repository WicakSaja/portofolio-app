import { z } from "zod";
import { settingsFormSchema } from "@/lib/validations/settings";

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
