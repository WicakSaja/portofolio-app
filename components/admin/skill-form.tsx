"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createSkill, updateSkill } from "@/lib/actions/skills";
import { skillFormSchema } from "@/lib/validations/skills";
import type { SkillFormValues } from "@/types/skills";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string | null;
}

interface SkillFormProps {
  skill?: Skill;
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-white/35";

export function SkillForm({ skill }: SkillFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [levelValue, setLevelValue] = useState(skill?.level ?? 50);

  const isEdit = !!skill;

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "",
      level: skill?.level ?? 50,
      icon: null,
    },
  });

  const onSubmit = (values: SkillFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("level", String(values.level));

      const iconFile = values.icon?.item(0);
      if (iconFile) {
        formData.append("icon", iconFile);
      }

      const result = isEdit
        ? await updateSkill(skill.id, formData)
        : await createSkill(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/admin/skills");
      router.refresh();
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    form.setValue("icon", files);
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
        <label htmlFor="name" className="text-sm text-slate-200">
          Skill Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. React, Node.js"
          {...form.register("name")}
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-rose-300">{form.formState.errors.name?.message}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="text-sm text-slate-200">
            Category
          </label>
          <input
            id="category"
            type="text"
            placeholder="e.g. Frontend, Backend, Tools"
            {...form.register("category")}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.category?.message}</p>
        </div>

        <div>
          <label htmlFor="level" className="text-sm text-slate-200 flex justify-between items-center">
            <span>Proficiency Level</span>
            <span className="font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-md text-xs">
              {levelValue}% — {
                levelValue >= 99 ? "Expert" : levelValue >= 75 ? "Advanced" : levelValue >= 51 ? "Proficient" : "Developing"
              }
            </span>
          </label>
          <div className="flex items-center gap-3 mt-3">
            <input
              id="level"
              type="range"
              min="1"
              max="100"
              {...form.register("level", {
                valueAsNumber: true,
                onChange: (e) => setLevelValue(Number(e.target.value)),
              })}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-white"
            />
          </div>
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.level?.message}</p>

          {/* Keterangan Rentang Level */}
          <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1.5">
            <p className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider">Note Keterangan Level:</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-400">
              <div><span className="text-white font-medium">Developing:</span> 25% – 50%</div>
              <div><span className="text-white font-medium">Proficient:</span> 51% – 74%</div>
              <div><span className="text-white font-medium">Advanced:</span> 75% – 98%</div>
              <div><span className="text-white font-medium">Expert:</span> 99% – 100%</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="icon" className="text-sm text-slate-200">
          Skill Icon / Logo
        </label>
        <input
          id="icon"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-rose-300">{form.formState.errors.icon?.message}</p>

        {previewUrl ? (
          <div className="mt-3">
            <p className="text-xs text-slate-400">New Icon Preview:</p>
            <div className="relative mt-1.5 h-16 w-16 overflow-hidden rounded-lg border border-white/20 bg-slate-900 flex items-center justify-center">
              <Image
                src={previewUrl}
                alt="New icon preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        ) : (
          skill?.icon && (
            <div className="mt-3">
              <p className="text-xs text-slate-400">Current Icon:</p>
              <div className="relative mt-1.5 h-16 w-16 overflow-hidden rounded-lg border border-white/10 bg-slate-900 flex items-center justify-center">
                <Image
                  src={skill.icon}
                  alt="Current icon"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>
          )
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Skill"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/skills")}
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
