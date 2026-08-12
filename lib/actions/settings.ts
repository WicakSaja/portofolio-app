"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { settingsAssetsBucket, supabaseStorage } from "@/lib/storage/supabase";
import { settingsUploadSchema } from "@/lib/validations/settings";
import type { ActionState } from "@/types/projects";

export async function saveSettings(formData: FormData): Promise<ActionState> {
  const values = {
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    about: String(formData.get("about") ?? ""),
    avatar: formData.get("avatar") instanceof File ? formData.get("avatar") : null,
    resume: formData.get("resume") instanceof File ? formData.get("resume") : null,

    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    seoCanonicalUrl: String(formData.get("seoCanonicalUrl") ?? ""),
    seoOgTitle: String(formData.get("seoOgTitle") ?? ""),
    seoOgDescription: String(formData.get("seoOgDescription") ?? ""),
    seoOgImage: String(formData.get("seoOgImage") ?? ""),

    authorName: String(formData.get("authorName") ?? ""),
    authorAlternateName: String(formData.get("authorAlternateName") ?? ""),
    authorJobTitle: String(formData.get("authorJobTitle") ?? ""),
    authorDescription: String(formData.get("authorDescription") ?? ""),

    googleSiteVerification: String(formData.get("googleSiteVerification") ?? ""),
    bingSiteVerification: String(formData.get("bingSiteVerification") ?? ""),

    robotsIndex: String(formData.get("robotsIndex") ?? "true") === "true",
    robotsFollow: String(formData.get("robotsFollow") ?? "true") === "true",
  };

  const parsed = settingsUploadSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  try {
    const existing = await prisma.settings.findFirst();

    let avatarUrl: string | undefined = undefined;
    let resumeUrl: string | undefined = undefined;

    const avatarFile = parsed.data.avatar;
    const resumeFile = parsed.data.resume;

    // Handle avatar file upload
    if (avatarFile) {
      const fileExtension = avatarFile.name.split(".").pop() ?? "png";
      const fileName = `avatar-${crypto.randomUUID()}.${fileExtension}`;

      const uploadResult = await supabaseStorage.storage
        .from(settingsAssetsBucket)
        .upload(fileName, avatarFile, {
          contentType: avatarFile.type,
          upsert: false,
        });

      if (uploadResult.error) {
        return {
          success: false,
          message: `Avatar upload failed: ${uploadResult.error.message}`,
        };
      }

      const publicUrl = supabaseStorage.storage.from(settingsAssetsBucket).getPublicUrl(fileName);
      avatarUrl = publicUrl.data.publicUrl;

      // Delete old avatar from storage if it exists
      if (existing?.avatar) {
        try {
          const oldFileName = existing.avatar.split("/").pop();
          if (oldFileName) {
            await supabaseStorage.storage.from(settingsAssetsBucket).remove([oldFileName]);
          }
        } catch (e) {
          console.error("Failed to delete old avatar", e);
        }
      }
    }

    // Handle resume file upload
    if (resumeFile) {
      const fileExtension = resumeFile.name.split(".").pop() ?? "pdf";
      const fileName = `resume-${crypto.randomUUID()}.${fileExtension}`;

      const uploadResult = await supabaseStorage.storage
        .from(settingsAssetsBucket)
        .upload(fileName, resumeFile, {
          contentType: resumeFile.type,
          upsert: false,
        });

      if (uploadResult.error) {
        return {
          success: false,
          message: `Resume upload failed: ${uploadResult.error.message}`,
        };
      }

      const publicUrl = supabaseStorage.storage.from(settingsAssetsBucket).getPublicUrl(fileName);
      resumeUrl = publicUrl.data.publicUrl;

      // Delete old resume from storage if it exists
      if (existing?.resume) {
        try {
          const oldFileName = existing.resume.split("/").pop();
          if (oldFileName) {
            await supabaseStorage.storage.from(settingsAssetsBucket).remove([oldFileName]);
          }
        } catch (e) {
          console.error("Failed to delete old resume", e);
        }
      }
    }

    const dataPayload = {
      heroTitle: parsed.data.heroTitle,
      heroSubtitle: parsed.data.heroSubtitle,
      about: parsed.data.about,
      ...(avatarUrl !== undefined ? { avatar: avatarUrl } : {}),
      ...(resumeUrl !== undefined ? { resume: resumeUrl } : {}),

      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
      seoCanonicalUrl: parsed.data.seoCanonicalUrl || null,
      seoOgTitle: parsed.data.seoOgTitle || null,
      seoOgDescription: parsed.data.seoOgDescription || null,
      seoOgImage: parsed.data.seoOgImage || null,

      authorName: parsed.data.authorName || null,
      authorAlternateName: parsed.data.authorAlternateName || null,
      authorJobTitle: parsed.data.authorJobTitle || null,
      authorDescription: parsed.data.authorDescription || null,

      googleSiteVerification: parsed.data.googleSiteVerification || null,
      bingSiteVerification: parsed.data.bingSiteVerification || null,

      robotsIndex: parsed.data.robotsIndex,
      robotsFollow: parsed.data.robotsFollow,
    };

    if (existing) {
      await prisma.settings.update({
        where: { id: existing.id },
        data: dataPayload,
      });
    } else {
      await prisma.settings.create({
        data: dataPayload,
      });
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/settings");

    return {
      success: true,
      message: "Site settings saved successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to save site settings",
    };
  }
}
