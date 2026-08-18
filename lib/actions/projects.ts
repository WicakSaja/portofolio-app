"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { portfolioThumbnailBucket, supabaseStorage } from "@/lib/storage/supabase";
import { projectUploadSchema } from "@/lib/validations/projects";
import type { ActionState } from "@/types/projects";

export async function createProject(formData: FormData): Promise<ActionState> {
  const images = formData.getAll("images").filter((f) => f instanceof File && f.name !== "" && f.size > 0) as File[];

  const values = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    images,
    github: String(formData.get("github") ?? ""),
    demo: String(formData.get("demo") ?? ""),
    category: String(formData.get("category") ?? ""),
    featured: String(formData.get("featured") ?? "false") === "true",
    skillIds: formData.getAll("skillIds").map(String).filter(Boolean),

    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    seoKeywords: String(formData.get("seoKeywords") ?? ""),
    seoOgTitle: String(formData.get("seoOgTitle") ?? ""),
    seoOgDescription: String(formData.get("seoOgDescription") ?? ""),
    seoOgImage: String(formData.get("seoOgImage") ?? ""),
    seoCanonicalUrl: String(formData.get("seoCanonicalUrl") ?? ""),
    seoIndex: String(formData.get("seoIndex") ?? "true") === "true",
    seoFollow: String(formData.get("seoFollow") ?? "true") === "true",
  };

  const parsed = projectUploadSchema.safeParse(values);

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

        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        seoKeywords: parsed.data.seoKeywords || null,
        seoOgTitle: parsed.data.seoOgTitle || null,
        seoOgDescription: parsed.data.seoOgDescription || null,
        seoOgImage: parsed.data.seoOgImage || null,
        seoCanonicalUrl: parsed.data.seoCanonicalUrl || null,
        seoIndex: parsed.data.seoIndex,
        seoFollow: parsed.data.seoFollow,

        skills: {
          create: (parsed.data.skillIds ?? []).map((skillId) => ({
            skillId,
          })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/projects");

    return {
      success: true,
      message: "Project created successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to create project",
    };
  }
}

export async function updateProject(id: string, formData: FormData): Promise<ActionState> {
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
    skillIds: formData.getAll("skillIds").map(String).filter(Boolean),

    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    seoKeywords: String(formData.get("seoKeywords") ?? ""),
    seoOgTitle: String(formData.get("seoOgTitle") ?? ""),
    seoOgDescription: String(formData.get("seoOgDescription") ?? ""),
    seoOgImage: String(formData.get("seoOgImage") ?? ""),
    seoCanonicalUrl: String(formData.get("seoCanonicalUrl") ?? ""),
    seoIndex: String(formData.get("seoIndex") ?? "true") === "true",
    seoFollow: String(formData.get("seoFollow") ?? "true") === "true",
  };

  const parsed = projectUploadSchema.safeParse(values);

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
        message: "Project not found",
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

        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        seoKeywords: parsed.data.seoKeywords || null,
        seoOgTitle: parsed.data.seoOgTitle || null,
        seoOgDescription: parsed.data.seoOgDescription || null,
        seoOgImage: parsed.data.seoOgImage || null,
        seoCanonicalUrl: parsed.data.seoCanonicalUrl || null,
        seoIndex: parsed.data.seoIndex,
        seoFollow: parsed.data.seoFollow,

        skills: {
          deleteMany: {},
          create: (parsed.data.skillIds ?? []).map((skillId) => ({
            skillId,
          })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/projects");
    revalidatePath(`/projects/${id}`);

    return {
      success: true,
      message: "Project updated successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update project",
    };
  }
}

export async function deleteProject(id: string): Promise<ActionState> {
  try {
    const existing = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!existing) {
      return {
        success: false,
        message: "Project not found",
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

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/projects");

    return {
      success: true,
      message: "Project deleted successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to delete project",
    };
  }
}

export const createPortfolio = createProject;
export const updatePortfolio = updateProject;
export const deletePortfolio = deleteProject;
