"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { createExperience, updateExperience } from "@/lib/actions/experience";
import { experienceFormSchema } from "@/lib/validations/experience";
import type { ExperienceFormValues } from "@/types/experience";

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  images: string[];
}

interface ExperienceFormProps {
  experience?: Experience;
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-white/35 disabled:cursor-not-allowed disabled:opacity-40";

export function ExperienceForm({ experience }: ExperienceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [retainedImages, setRetainedImages] = useState<string[]>(experience?.images ?? []);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const isEdit = !!experience;

  // Format dates for html input YYYY-MM-DD
  const formatInputDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      company: experience?.company ?? "",
      position: experience?.position ?? "",
      description: experience?.description ?? "",
      startDate: formatInputDate(experience?.startDate ?? null),
      endDate: formatInputDate(experience?.endDate ?? null),
      current: experience ? !experience.endDate : false,
      images: null,
    },
  });

  const isCurrent = useWatch({ control: form.control, name: "current" });

  const onSubmit = (values: ExperienceFormValues) => {
    const selectedFiles = values.images;
    const newFilesCount = selectedFiles ? selectedFiles.length : 0;

    if (retainedImages.length + newFilesCount > 10) {
      toast.error("Maximum 10 gallery images are allowed per experience.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("company", values.company);
      formData.append("position", values.position);
      formData.append("description", values.description);
      formData.append("startDate", values.startDate);
      formData.append("endDate", isCurrent ? "" : values.endDate ?? "");
      formData.append("current", String(!!values.current));

      // Append retained images (URLs)
      retainedImages.forEach((url) => {
        formData.append("retainedImages", url);
      });

      // Append new image files
      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("images", selectedFiles[i]);
        }
      }

      const result = isEdit
        ? await updateExperience(experience.id, formData)
        : await createExperience(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/admin/experience");
      router.refresh();
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    form.setValue("images", files);

    // Generate preview URLs
    if (files) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        urls.push(URL.createObjectURL(files[i]));
      }
      setPreviewUrls(urls);
    } else {
      setPreviewUrls([]);
    }
  };

  const handleRemoveRetainedImage = (urlToRemove: string) => {
    setRetainedImages((prev) => prev.filter((url) => url !== urlToRemove));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="text-sm text-slate-200">
            Company Name
          </label>
          <input
            id="company"
            type="text"
            placeholder="e.g. Acme Corp"
            {...form.register("company")}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.company?.message}</p>
        </div>

        <div>
          <label htmlFor="position" className="text-sm text-slate-200">
            Job Position
          </label>
          <input
            id="position"
            type="text"
            placeholder="e.g. Senior Software Engineer"
            {...form.register("position")}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.position?.message}</p>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-sm text-slate-200">
          Job Description / Key Achievements
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="Describe your role, key responsibilities, achievements, and technology stack used..."
          {...form.register("description")}
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-rose-300">{form.formState.errors.description?.message}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="startDate" className="text-sm text-slate-200">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            {...form.register("startDate")}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.startDate?.message}</p>
        </div>

        <div>
          <label htmlFor="endDate" className="text-sm text-slate-200">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            disabled={isCurrent}
            {...form.register("endDate")}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.endDate?.message}</p>
        </div>

        <div className="flex items-end pb-2">
          <label className="inline-flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              {...form.register("current")}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-slate-900 focus:ring-0 focus:ring-offset-0"
            />
            I currently work here
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="images" className="text-sm text-slate-200">
          Gallery Images <span className="text-slate-400">(upload up to 10 images in total)</span>
        </label>
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-rose-300">{form.formState.errors.images?.message}</p>

        {/* Existing Images Gallery */}
        {retainedImages.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-slate-400">Current Gallery:</p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {retainedImages.map((url) => (
                <div key={url} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-slate-900">
                  <Image
                    src={url}
                    alt="Gallery item"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRetainedImage(url)}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-5 w-5 text-red-400 animate-pulse" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Previews */}
        {previewUrls.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-slate-400">New Image Previews ({previewUrls.length}):</p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {previewUrls.map((url, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/20 bg-slate-900">
                  <Image
                    src={url}
                    alt={`Preview ${i}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Entry"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/experience")}
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
