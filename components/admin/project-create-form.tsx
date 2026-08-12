"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createProject } from "@/lib/actions/projects";
import { projectFormSchema } from "@/lib/validations/projects";
import type { ProjectFormValues } from "@/types/projects";
import { SeoFields } from "./seo-fields";

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-white/35";

export function ProjectCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      images: null,
      github: "",
      demo: "",
      category: "",
      featured: false,

      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      seoOgTitle: "",
      seoOgDescription: "",
      seoOgImage: "",
      seoCanonicalUrl: "",
      seoIndex: true,
      seoFollow: true,
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    const selectedFiles = values.images;
    const fileCount = selectedFiles ? selectedFiles.length : 0;

    if (fileCount === 0) {
      toast.error("Please upload at least 1 image for the project.");
      return;
    }

    if (fileCount > 10) {
      toast.error("Maximum 10 project images are allowed.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("github", values.github ?? "");
      formData.append("demo", values.demo ?? "");
      formData.append("category", values.category);
      formData.append("featured", String(values.featured));

      formData.append("seoTitle", values.seoTitle ?? "");
      formData.append("seoDescription", values.seoDescription ?? "");
      formData.append("seoKeywords", values.seoKeywords ?? "");
      formData.append("seoOgTitle", values.seoOgTitle ?? "");
      formData.append("seoOgDescription", values.seoOgDescription ?? "");
      formData.append("seoOgImage", values.seoOgImage ?? "");
      formData.append("seoCanonicalUrl", values.seoCanonicalUrl ?? "");
      formData.append("seoIndex", String(values.seoIndex));
      formData.append("seoFollow", String(values.seoFollow));

      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("images", selectedFiles[i]);
        }
      }

      const result = await createProject(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      form.reset();
      router.push("/admin/projects");
      router.refresh();
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    form.setValue("images", files);

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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="title" className="text-sm text-slate-200">
          Title
        </label>
        <input id="title" type="text" {...form.register("title")} className={inputClassName} />
        <p className="mt-1 text-xs text-rose-300">{form.formState.errors.title?.message}</p>
      </div>

      <div>
        <label htmlFor="description" className="text-sm text-slate-200">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...form.register("description")}
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-rose-300">{form.formState.errors.description?.message}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="text-sm text-slate-200">
            Category
          </label>
          <input id="category" type="text" {...form.register("category")} className={inputClassName} />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.category?.message}</p>
        </div>

        <div className="flex items-end pb-2">
          <label className="inline-flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              {...form.register("featured")}
              className="h-4 w-4 rounded border-white/20 bg-white/5"
            />
            Featured project
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="images" className="text-sm text-slate-200">
          Project Images <span className="text-slate-400">(upload 1 to 10 images)</span>
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

        {previewUrls.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-slate-400">Selected Image Previews ({previewUrls.length}):</p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {previewUrls.map((url, i) => (
                <div key={i} className="relative aspect-video overflow-hidden rounded-lg border border-white/20 bg-slate-900">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="github" className="text-sm text-slate-200">
            GitHub URL <span className="text-slate-400">(optional)</span>
          </label>
          <input id="github" type="url" {...form.register("github")} className={inputClassName} />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.github?.message}</p>
        </div>

        <div>
          <label htmlFor="demo" className="text-sm text-slate-200">
            Demo URL <span className="text-slate-400">(optional)</span>
          </label>
          <input id="demo" type="url" {...form.register("demo")} className={inputClassName} />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.demo?.message}</p>
        </div>
      </div>

      {/* SEO SECTION */}
      <SeoFields form={form} pathPrefix="/projects/" />

      <div className="pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}

export const PortfolioCreateForm = ProjectCreateForm;
