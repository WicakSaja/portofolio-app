"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updatePortfolio } from "@/lib/actions/portfolio";
import { portfolioFormSchema } from "@/lib/validations/portfolio";
import type { PortfolioFormValues } from "@/types/portfolio";

interface Portfolio {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  github: string | null;
  demo: string | null;
  category: string;
  featured: boolean;
}

interface PortfolioEditFormProps {
  portfolio: Portfolio;
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-white/35";

export function PortfolioEditForm({ portfolio }: PortfolioEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: portfolio.title,
      description: portfolio.description,
      thumbnail: null,
      github: portfolio.github ?? "",
      demo: portfolio.demo ?? "",
      category: portfolio.category,
      featured: portfolio.featured,
    },
  });

  const onSubmit = (values: PortfolioFormValues) => {
    startTransition(async () => {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("github", values.github ?? "");
      formData.append("demo", values.demo ?? "");
      formData.append("category", values.category);
      formData.append("featured", String(values.featured));

      const thumbnailFile = values.thumbnail?.item(0);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const result = await updatePortfolio(portfolio.id, formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/admin/portfolio");
      router.refresh();
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    form.setValue("thumbnail", files);
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
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
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-slate-900 focus:ring-0 focus:ring-offset-0"
            />
            Featured project
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="thumbnail" className="text-sm text-slate-200">
            Thumbnail Image
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.thumbnail?.message}</p>

          {/* Image Previews */}
          {previewUrl ? (
            <div className="mt-3">
              <p className="text-xs text-slate-400">New Image Preview:</p>
              <div className="relative mt-1.5 h-20 w-32 overflow-hidden rounded-lg border border-white/20">
                <Image
                  src={previewUrl}
                  alt="New thumbnail preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            portfolio.thumbnail && (
              <div className="mt-3">
                <p className="text-xs text-slate-400">Current Thumbnail:</p>
                <div className="relative mt-1.5 h-20 w-32 overflow-hidden rounded-lg border border-white/10">
                  <Image
                    src={portfolio.thumbnail}
                    alt="Current thumbnail"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            )
          )}
        </div>

        <div>
          <label htmlFor="github" className="text-sm text-slate-200">
            GitHub URL <span className="text-slate-400">(optional)</span>
          </label>
          <input id="github" type="url" {...form.register("github")} className={inputClassName} />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.github?.message}</p>
        </div>
      </div>

      <div>
        <label htmlFor="demo" className="text-sm text-slate-200">
          Demo URL <span className="text-slate-400">(optional)</span>
        </label>
        <input id="demo" type="url" {...form.register("demo")} className={inputClassName} />
        <p className="mt-1 text-xs text-rose-300">{form.formState.errors.demo?.message}</p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/portfolio")}
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
