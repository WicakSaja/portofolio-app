"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { contactFormSchema } from "@/lib/validations/contact";
import type { ActionState } from "@/types/portfolio";

export async function saveContact(formData: FormData): Promise<ActionState> {
  const values = {
    email: String(formData.get("email") ?? ""),
    phone: formData.get("phone") ? String(formData.get("phone")) : undefined,
    linkedin: formData.get("linkedin") ? String(formData.get("linkedin")) : undefined,
    github: formData.get("github") ? String(formData.get("github")) : undefined,
  };

  const parsed = contactFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  try {
    const existing = await prisma.contact.findFirst();

    if (existing) {
      await prisma.contact.update({
        where: { id: existing.id },
        data: {
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          linkedin: parsed.data.linkedin || null,
          github: parsed.data.github || null,
        },
      });
    } else {
      await prisma.contact.create({
        data: {
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          linkedin: parsed.data.linkedin || null,
          github: parsed.data.github || null,
        },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/contact");

    return {
      success: true,
      message: "Contact information saved successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to save contact information",
    };
  }
}
