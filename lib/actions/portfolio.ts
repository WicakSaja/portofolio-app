"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { portfolioThumbnailBucket, supabaseStorage } from "@/lib/storage/supabase";
import { portfolioUploadSchema } from "@/lib/validations/portfolio";
import type { ActionState } from "@/types/portfolio";

export async function createPortfolio(formData: FormData): Promise<ActionState> {
  const images = formData.getAll("images").filter((f) => f instanceof File && f.name !== "" && f.size > 0) as File[];

  const values = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    images,
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

  if (parsed.data.images.length === 0) {
    return {
      success: false,
      message: "At least 1 project image is required",
    };
  }

  try {
    const imageUrls: string[] = [];

    for (const imageFile of parsed.data.images) {
      const fileExtension = imageFile.name.split(".").pop() ?? "png";
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const uploadResult = await supabaseStorage.storage
        .from(portfolioThumbnailBucket)
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (uploadResult.error) {
        return {
          success: false,
          message: `Failed to upload image: ${uploadResult.error.message}`,
        };
      }

      const publicUrl = supabaseStorage.storage.from(portfolioThumbnailBucket).getPublicUrl(fileName);
      imageUrls.push(publicUrl.data.publicUrl);
    }

    await prisma.portfolio.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        thumbnail: imageUrls[0] ?? null,
        images: imageUrls,
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
  const images = formData.getAll("images").filter((f) => f instanceof File && f.name !== "" && f.size > 0) as File[];
  const retainedImages = formData.getAll("retainedImages").map(String);

  const values = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    images,
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

    // Identify and delete removed images from Supabase storage
    const allExistingImages = [...existing.images, ...(existing.thumbnail ? [existing.thumbnail] : [])];
    const uniqueExistingImages = Array.from(new Set(allExistingImages));
    const removedImages = uniqueExistingImages.filter((img) => !retainedImages.includes(img));

    for (const url of removedImages) {
      try {
        const fileName = url.split("/").pop();
        if (fileName) {
          await supabaseStorage.storage.from(portfolioThumbnailBucket).remove([fileName]);
        }
      } catch (e) {
        console.error("Failed to delete removed image from storage", e);
      }
    }

    const newImageUrls: string[] = [];
    for (const imageFile of parsed.data.images) {
      const fileExtension = imageFile.name.split(".").pop() ?? "png";
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const uploadResult = await supabaseStorage.storage
        .from(portfolioThumbnailBucket)
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (uploadResult.error) {
        return {
          success: false,
          message: `Failed to upload image: ${uploadResult.error.message}`,
        };
      }

      const publicUrl = supabaseStorage.storage.from(portfolioThumbnailBucket).getPublicUrl(fileName);
      newImageUrls.push(publicUrl.data.publicUrl);
    }

    const updatedImages = [...retainedImages, ...newImageUrls].slice(0, 10);

    if (updatedImages.length === 0) {
      return {
        success: false,
        message: "At least 1 project image is required",
      };
    }

    await prisma.portfolio.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        thumbnail: updatedImages[0] ?? null,
        images: updatedImages,
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

    const allImages = [...existing.images, ...(existing.thumbnail ? [existing.thumbnail] : [])];
    const uniqueImages = Array.from(new Set(allImages));

    for (const url of uniqueImages) {
      try {
        const fileName = url.split("/").pop();
        if (fileName) {
          await supabaseStorage.storage.from(portfolioThumbnailBucket).remove([fileName]);
        }
      } catch (e) {
        console.error("Failed to delete project image on deletion", e);
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