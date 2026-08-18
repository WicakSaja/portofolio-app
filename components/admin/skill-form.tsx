"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";

import { createSkill, updateSkill } from "@/lib/actions/skills";
import { skillFormSchema } from "@/lib/validations/skills";
import type { SkillFormValues } from "@/types/skills";

interface Skill {
  id: string;
  name: string;
  category?: string | null;
  categories?: string[];
  level: number;
  icon: string | null;
}

interface SkillFormProps {
  skill?: Skill;
}

const PRESET_CATEGORIES = [
  "Data Science",
  "AI/ML",
  "Web Development",
  "Tools",
  "UI/UX",
];

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-white/35";

export function SkillForm({ skill }: SkillFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [levelValue, setLevelValue] = useState(skill?.level ?? 50);

  const initialCategories = skill?.categories && skill.categories.length > 0
    ? skill.categories
    : skill?.category
      ? [skill.category]
      : [];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [customCategory, setCustomCategory] = useState("");

  const isEdit = !!skill;

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: skill?.name ?? "",
      categories: initialCategories,
      level: skill?.level ?? 50,
      icon: null,
    },
  });

  const handleAddCategory = (categoryToAdd: string) => {
    const trimmed = categoryToAdd.trim();
    if (!trimmed) return;
    if (selectedCategories.includes(trimmed)) {
      toast.info(`"${trimmed}" is already added.`);
      return;
    }
    const updated = [...selectedCategories, trimmed];
    setSelectedCategories(updated);
    form.setValue("categories", updated, { shouldValidate: true });
    setCustomCategory("");
  };

  const handleRemoveCategory = (indexToRemove: number) => {
    const updated = selectedCategories.filter((_, i) => i !== indexToRemove);
    setSelectedCategories(updated);
    form.setValue("categories", updated, { shouldValidate: true });
  };

  const handleMoveCategory = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === selectedCategories.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...selectedCategories];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setSelectedCategories(updated);
    form.setValue("categories", updated, { shouldValidate: true });
  };

  const onSubmit = (values: SkillFormValues) => {
    if (selectedCategories.length === 0) {
      toast.error("Please select or add at least 1 category.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("level", String(values.level));

      // Append categories in preserved order (1st is primary)
      selectedCategories.forEach((cat) => {
        formData.append("categories", cat);
      });

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="text-sm text-slate-200">
          Skill Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Python, React, Looker"
          {...form.register("name")}
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-rose-300">{form.formState.errors.name?.message}</p>
      </div>

      {/* MULTI-CATEGORY SELECTION */}
      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-200 font-medium">
            Categories <span className="text-slate-400 font-normal">(select multiple in order)</span>
          </label>
          <p className="text-xs text-slate-400 mt-0.5">
            The first category will be the skill&apos;s <span className="text-indigo-400 font-semibold">Primary Category</span> shown on the &quot;All&quot; view.
          </p>
        </div>

        {/* Selected Categories List with Ordering */}
        {selectedCategories.length > 0 ? (
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/15 space-y-2">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Selected Categories ({selectedCategories.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((cat, idx) => (
                <div
                  key={cat}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    idx === 0
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-200"
                      : "bg-white/10 border-white/20 text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span className="font-bold opacity-75">{idx + 1}.</span>
                    <span>{cat}</span>
                    {idx === 0 && (
                      <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.2 rounded font-semibold ml-1">
                        Primary
                      </span>
                    )}
                  </span>

                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-0.5 ml-1.5 pl-1.5 border-l border-white/20">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveCategory(idx, "up")}
                      className="p-0.5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === selectedCategories.length - 1}
                      onClick={() => handleMoveCategory(idx, "down")}
                      className="p-0.5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(idx)}
                      className="p-0.5 hover:text-rose-400 text-slate-400 cursor-pointer ml-1"
                      title="Remove category"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-white/5 border border-dashed border-white/15 text-xs text-amber-300/90">
            No category selected yet. Choose from presets below or type a custom category.
          </div>
        )}
        <p className="text-xs text-rose-300">{form.formState.errors.categories?.message}</p>

        {/* Preset Category Badges to click/add */}
        <div className="space-y-1.5">
          <p className="text-xs text-slate-400">Quick presets to add:</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CATEGORIES.map((preset) => {
              const isSelected = selectedCategories.includes(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      const idx = selectedCategories.indexOf(preset);
                      handleRemoveCategory(idx);
                    } else {
                      handleAddCategory(preset);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Category Input */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCategory(customCategory);
              }
            }}
            placeholder="Type custom category and press Enter..."
            className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-white/35"
          />
          <button
            type="button"
            onClick={() => handleAddCategory(customCategory)}
            className="inline-flex h-9 items-center gap-1 px-3 rounded-xl bg-white/10 border border-white/15 text-xs font-medium text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
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
          className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Skill"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/skills")}
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
