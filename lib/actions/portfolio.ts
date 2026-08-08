"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { portfolioThumbnailBucket, supabaseStorage } from "@/lib/storage/supabase";
import { portfolioUploadSchema } from "@/lib/validations/portfolio";
import type { ActionState } from "@/types/portfolio";

export async function createPortfolio(formData: FormData): Promise<ActionState> {
  const values = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    thumbnail: formData.get("thumbnail") instanceof File ? formData.get("thumbnail") : null,
    github: String(formData.get("github") ?? ""),
    demo: String(formData.get("demo") ?? ""),
    category: String(formData.get("category") ?? ""),
    featured: String(formData.get("featured") ?? "false") === "true",
  };

  const parsed = portfolioUploadSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  try {
    let thumbnailUrl: string | null = null;

    const thumbnailFile = parsed.data.thumbnail;

    if (thumbnailFile) {
      const fileExtension = thumbnailFile.name.split(".").pop() ?? "png";
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const uploadResult = await supabaseStorage.storage
        .from(portfolioThumbnailBucket)
        .upload(fileName, thumbnailFile, {
          contentType: thumbnailFile.type,
          upsert: false,
        });

      if (uploadResult.error) {
        return {
          success: false,
          message: uploadResult.error.message,
        };
      }

      const publicUrl = supabaseStorage.storage.from(portfolioThumbnailBucket).getPublicUrl(fileName);
      thumbnailUrl = publicUrl.data.publicUrl;
    }

    await prisma.portfolio.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        thumbnail: thumbnailUrl,
        github: parsed.data.github || null,
        demo: parsed.data.demo || null,
        category: parsed.data.category,
        featured: parsed.data.featured,
      },
    });

    revalidatePath("/admin");

    return {
      success: true,
      message: "Portfolio created successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to create portfolio",
    };
  }
}

export async function updatePortfolio(id: string, formData: FormData): Promise<ActionState> {
  const values = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    thumbnail: formData.get("thumbnail") instanceof File ? formData.get("thumbnail") : null,
    github: String(formData.get("github") ?? ""),
    demo: String(formData.get("demo") ?? ""),
    category: String(formData.get("category") ?? ""),
    featured: String(formData.get("featured") ?? "false") === "true",
  };

  const parsed = portfolioUploadSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  try {
    const existing = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!existing) {
      return {
        success: false,
        message: "Portfolio project not found",
      };
    }

    let thumbnailUrl: string | undefined = undefined;
    const thumbnailFile = parsed.data.thumbnail;

    if (thumbnailFile) {
      const fileExtension = thumbnailFile.name.split(".").pop() ?? "png";
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const uploadResult = await supabaseStorage.storage
        .from(portfolioThumbnailBucket)
        .upload(fileName, thumbnailFile, {
          contentType: thumbnailFile.type,
          upsert: false,
        });

      if (uploadResult.error) {
        return {
          success: false,
          message: uploadResult.error.message,
        };
      }

      const publicUrl = supabaseStorage.storage.from(portfolioThumbnailBucket).getPublicUrl(fileName);
      thumbnailUrl = publicUrl.data.publicUrl;

      // Try to delete old thumbnail file from Supabase storage if it exists
      if (existing.thumbnail) {
        try {
          const oldFileName = existing.thumbnail.split("/").pop();
          if (oldFileName) {
            await supabaseStorage.storage.from(portfolioThumbnailBucket).remove([oldFileName]);
          }
        } catch (e) {
          console.error("Failed to delete old thumbnail", e);
        }
      }
    }

    await prisma.portfolio.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        ...(thumbnailUrl !== undefined ? { thumbnail: thumbnailUrl } : {}),
        github: parsed.data.github || null,
        demo: parsed.data.demo || null,
        category: parsed.data.category,
        featured: parsed.data.featured,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/portfolio");

    return {
      success: true,
      message: "Portfolio updated successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update portfolio",
    };
  }
}

export async function deletePortfolio(id: string): Promise<ActionState> {
  try {
    const existing = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!existing) {
      return {
        success: false,
        message: "Portfolio project not found",
      };
    }

    // Delete thumbnail file from Supabase storage if it exists
    if (existing.thumbnail) {
      try {
        const fileName = existing.thumbnail.split("/").pop();
        if (fileName) {
          await supabaseStorage.storage.from(portfolioThumbnailBucket).remove([fileName]);
        }
      } catch (e) {
        console.error("Failed to delete thumbnail from storage", e);
      }
    }

    await prisma.portfolio.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/portfolio");

    return {
      success: true,
      message: "Portfolio deleted successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to delete portfolio",
    };
  }
}