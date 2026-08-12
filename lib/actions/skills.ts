"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { skillIconBucket, supabaseStorage } from "@/lib/storage/supabase";
import { skillUploadSchema } from "@/lib/validations/skills";
import type { ActionState } from "@/types/projects";

export async function createSkill(formData: FormData): Promise<ActionState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    level: formData.get("level") ? Number(formData.get("level")) : NaN,
    icon: formData.get("icon") instanceof File ? formData.get("icon") : null,
  };

  const parsed = skillUploadSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  try {
    let iconUrl: string | null = null;
    const iconFile = parsed.data.icon;

    if (iconFile) {
      const fileExtension = iconFile.name.split(".").pop() ?? "png";
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const uploadResult = await supabaseStorage.storage
        .from(skillIconBucket)
        .upload(fileName, iconFile, {
          contentType: iconFile.type,
          upsert: false,
        });

      if (uploadResult.error) {
        return {
          success: false,
          message: uploadResult.error.message,
        };
      }

      const publicUrl = supabaseStorage.storage.from(skillIconBucket).getPublicUrl(fileName);
      iconUrl = publicUrl.data.publicUrl;
    }

    await prisma.skill.create({
      data: {
        name: parsed.data.name,
        category: parsed.data.category,
        level: parsed.data.level,
        icon: iconUrl,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/skills");

    return {
      success: true,
      message: "Skill created successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to create skill",
    };
  }
}

export async function updateSkill(id: string, formData: FormData): Promise<ActionState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    level: formData.get("level") ? Number(formData.get("level")) : NaN,
    icon: formData.get("icon") instanceof File ? formData.get("icon") : null,
  };

  const parsed = skillUploadSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  try {
    const existing = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existing) {
      return {
        success: false,
        message: "Skill not found",
      };
    }

    let iconUrl: string | undefined = undefined;
    const iconFile = parsed.data.icon;

    if (iconFile) {
      const fileExtension = iconFile.name.split(".").pop() ?? "png";
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const uploadResult = await supabaseStorage.storage
        .from(skillIconBucket)
        .upload(fileName, iconFile, {
          contentType: iconFile.type,
          upsert: false,
        });

      if (uploadResult.error) {
        return {
          success: false,
          message: uploadResult.error.message,
        };
      }

      const publicUrl = supabaseStorage.storage.from(skillIconBucket).getPublicUrl(fileName);
      iconUrl = publicUrl.data.publicUrl;

      // Try to delete old icon file from Supabase storage if it exists
      if (existing.icon) {
        try {
          const oldFileName = existing.icon.split("/").pop();
          if (oldFileName) {
            await supabaseStorage.storage.from(skillIconBucket).remove([oldFileName]);
          }
        } catch (e) {
          console.error("Failed to delete old icon", e);
        }
      }
    }

    await prisma.skill.update({
      where: { id },
      data: {
        name: parsed.data.name,
        category: parsed.data.category,
        level: parsed.data.level,
        ...(iconUrl !== undefined ? { icon: iconUrl } : {}),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/skills");

    return {
      success: true,
      message: "Skill updated successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update skill",
    };
  }
}

export async function deleteSkill(id: string): Promise<ActionState> {
  try {
    const existing = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existing) {
      return {
        success: false,
        message: "Skill not found",
      };
    }

    // Delete icon file from Supabase storage if it exists
    if (existing.icon) {
      try {
        const fileName = existing.icon.split("/").pop();
        if (fileName) {
          await supabaseStorage.storage.from(skillIconBucket).remove([fileName]);
        }
      } catch (e) {
        console.error("Failed to delete icon from storage", e);
      }
    }

    await prisma.skill.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/skills");

    return {
      success: true,
      message: "Skill deleted successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to delete skill",
    };
  }
}
