"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createPortfolio } from "@/lib/actions/portfolio";
import { portfolioFormSchema } from "@/lib/validations/portfolio";
import type { PortfolioFormValues } from "@/types/portfolio";

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-white/35";

export function PortfolioCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: "",
      description: "",
        thumbnail: null,
      github: "",
      demo: "",
      category: "",
      featured: false,
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

      const result = await createPortfolio(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      form.reset();
      router.push("/admin");
      router.refresh();
    });
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

        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              {...form.register("featured")}
              className="h-4 w-4 rounded border-white/20 bg-white/5"
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
            onChange={(event) => {
              form.setValue("thumbnail", event.target.files);
            }}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.thumbnail?.message}</p>
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

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Create Portfolio"}
      </button>
    </form>
  );
}