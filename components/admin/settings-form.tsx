"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileText, Eye } from "lucide-react";

import { saveSettings } from "@/lib/actions/settings";
import { settingsFormSchema } from "@/lib/validations/settings";
import type { SettingsFormValues } from "@/types/settings";

interface Settings {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  about: string;
  avatar: string | null;
  resume: string | null;
}

interface SettingsFormProps {
  settings?: Settings | null;
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-white/35";

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      heroTitle: settings?.heroTitle ?? "",
      heroSubtitle: settings?.heroSubtitle ?? "",
      about: settings?.about ?? "",
      avatar: null,
      resume: null,
    },
  });

  const onSubmit = (values: SettingsFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("heroTitle", values.heroTitle);
      formData.append("heroSubtitle", values.heroSubtitle);
      formData.append("about", values.about);

      const avatarFile = values.avatar?.item(0);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const resumeFile = values.resume?.item(0);
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const result = await saveSettings(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    form.setValue("avatar", files);
    if (files && files[0]) {
      setAvatarPreview(URL.createObjectURL(files[0]));
    } else {
      setAvatarPreview(null);
    }
  };

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    form.setValue("resume", files);
    if (files && files[0]) {
      setResumeName(files[0].name);
    } else {
      setResumeName(null);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="heroTitle" className="text-sm text-slate-200">
            Hero Title
          </label>
          <input
            id="heroTitle"
            type="text"
            placeholder="e.g. Hi, I'm John Doe"
            {...form.register("heroTitle")}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.heroTitle?.message}</p>
        </div>

        <div>
          <label htmlFor="heroSubtitle" className="text-sm text-slate-200">
            Hero Subtitle
          </label>
          <input
            id="heroSubtitle"
            type="text"
            placeholder="e.g. Full Stack Developer & Cloud Architect"
            {...form.register("heroSubtitle")}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.heroSubtitle?.message}</p>
        </div>
      </div>

      <div>
        <label htmlFor="about" className="text-sm text-slate-200">
          About Biography
        </label>
        <textarea
          id="about"
          rows={6}
          placeholder="Write a brief introduction about yourself, your background, coding philosophy, and goals..."
          {...form.register("about")}
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-rose-300">{form.formState.errors.about?.message}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="avatar" className="text-sm text-slate-200">
            Profile Avatar Image
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.avatar?.message}</p>

          {avatarPreview ? (
            <div className="mt-3">
              <p className="text-xs text-slate-400">New Avatar Preview:</p>
              <div className="relative mt-1.5 h-20 w-20 overflow-hidden rounded-full border border-white/20 bg-slate-900">
                <Image
                  src={avatarPreview}
                  alt="New avatar preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            settings?.avatar && (
              <div className="mt-3">
                <p className="text-xs text-slate-400">Current Avatar:</p>
                <div className="relative mt-1.5 h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-slate-900">
                  <Image
                    src={settings.avatar}
                    alt="Current avatar"
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
          <label htmlFor="resume" className="text-sm text-slate-200">
            Resume Document <span className="text-slate-400">(PDF format preferred)</span>
          </label>
          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-rose-300">{form.formState.errors.resume?.message}</p>

          {resumeName ? (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
              <FileText className="h-4 w-4 text-slate-400" />
              <span>Selected: {resumeName}</span>
            </div>
          ) : (
            settings?.resume && (
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={settings.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:bg-white/10"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Current Resume
                </a>
              </div>
            )
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
