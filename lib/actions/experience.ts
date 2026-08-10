"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { experienceImagesBucket, supabaseStorage } from "@/lib/storage/supabase";
import { experienceUploadSchema } from "@/lib/validations/experience";
import type { ActionState } from "@/types/portfolio";

export async function createExperience(formData: FormData): Promise<ActionState> {
  const images = formData.getAll("images").filter((f) => f instanceof File && f.name !== "" && f.size > 0) as File[];

  const values = {
    company: String(formData.get("company") ?? ""),
    position: String(formData.get("position") ?? ""),
    description: String(formData.get("description") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    current: String(formData.get("current") ?? "false") === "true",
    images,
  };

  const parsed = experienceUploadSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  try {
    const imageUrls: string[] = [];

    for (const imageFile of parsed.data.images) {
      const fileExtension = imageFile.name.split(".").pop() ?? "png";
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const uploadResult = await supabaseStorage.storage
        .from(experienceImagesBucket)
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

      const publicUrl = supabaseStorage.storage.from(experienceImagesBucket).getPublicUrl(fileName);
      imageUrls.push(publicUrl.data.publicUrl);
    }

    await prisma.experience.create({
      data: {
        company: parsed.data.company,
        position: parsed.data.position,
        description: parsed.data.description,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.current || !parsed.data.endDate ? null : new Date(parsed.data.endDate),
        images: imageUrls,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/experience");

    return {
      success: true,
      message: "Experience created successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to create experience",
    };
  }
}

export async function updateExperience(id: string, formData: FormData): Promise<ActionState> {
  const images = formData.getAll("images").filter((f) => f instanceof File && f.name !== "" && f.size > 0) as File[];
  const retainedImages = formData.getAll("retainedImages").map(String);

  const values = {
    company: String(formData.get("company") ?? ""),
    position: String(formData.get("position") ?? ""),
    description: String(formData.get("description") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    current: String(formData.get("current") ?? "false") === "true",
    images,
  };

  const parsed = experienceUploadSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  try {
    const existing = await prisma.experience.findUnique({
      where: { id },
    });

    if (!existing) {
      return {
        success: false,
        message: "Experience record not found",
      };
    }

    // Identify and delete removed gallery images from Supabase storage
    const removedImages = existing.images.filter((img) => !retainedImages.includes(img));
    for (const url of removedImages) {
      try {
        const fileName = url.split("/").pop();
        if (fileName) {
          await supabaseStorage.storage.from(experienceImagesBucket).remove([fileName]);
        }
      } catch (e) {
        console.error("Failed to delete removed gallery image", e);
      }
    }

    const newImageUrls: string[] = [];
    for (const imageFile of parsed.data.images) {
      const fileExtension = imageFile.name.split(".").pop() ?? "png";
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const uploadResult = await supabaseStorage.storage
        .from(experienceImagesBucket)
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

      const publicUrl = supabaseStorage.storage.from(experienceImagesBucket).getPublicUrl(fileName);
      newImageUrls.push(publicUrl.data.publicUrl);
    }

    const updatedImages = [...retainedImages, ...newImageUrls].slice(0, 10);

    await prisma.experience.update({
      where: { id },
      data: {
        company: parsed.data.company,
        position: parsed.data.position,
        description: parsed.data.description,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.current || !parsed.data.endDate ? null : new Date(parsed.data.endDate),
        images: updatedImages,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/experience");

    return {
      success: true,
      message: "Experience updated successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update experience",
    };
  }
}

export async function deleteExperience(id: string): Promise<ActionState> {
  try {
    const existing = await prisma.experience.findUnique({
      where: { id },
    });

    if (!existing) {
      return {
        success: false,
        message: "Experience record not found",
      };
    }

    // Clean up all experience gallery images in Supabase
    for (const url of existing.images) {
      try {
        const fileName = url.split("/").pop();
        if (fileName) {
          await supabaseStorage.storage.from(experienceImagesBucket).remove([fileName]);
        }
      } catch (e) {
        console.error("Failed to delete gallery image on experience deletion", e);
      }
    }

    await prisma.experience.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/experience");

    return {
      success: true,
      message: "Experience deleted successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to delete experience",
    };
  }
}
