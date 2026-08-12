"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FileText, Eye, Search, ShieldCheck, UserCheck, Bot } from "lucide-react";

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
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoCanonicalUrl?: string | null;
  seoOgTitle?: string | null;
  seoOgDescription?: string | null;
  seoOgImage?: string | null;
  authorName?: string | null;
  authorAlternateName?: string | null;
  authorJobTitle?: string | null;
  authorDescription?: string | null;
  googleSiteVerification?: string | null;
  bingSiteVerification?: string | null;
  robotsIndex?: boolean | null;
  robotsFollow?: boolean | null;
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
      seoTitle: settings?.seoTitle ?? "",
      seoDescription: settings?.seoDescription ?? "",
      seoCanonicalUrl: settings?.seoCanonicalUrl ?? "",
      seoOgTitle: settings?.seoOgTitle ?? "",
      seoOgDescription: settings?.seoOgDescription ?? "",
      seoOgImage: settings?.seoOgImage ?? "",
      authorName: settings?.authorName ?? "",
      authorAlternateName: settings?.authorAlternateName ?? "",
      authorJobTitle: settings?.authorJobTitle ?? "",
      authorDescription: settings?.authorDescription ?? "",
      googleSiteVerification: settings?.googleSiteVerification ?? "",
      bingSiteVerification: settings?.bingSiteVerification ?? "",
      robotsIndex: settings?.robotsIndex ?? true,
      robotsFollow: settings?.robotsFollow ?? true,
    },
  });

  const watchedSeoTitle = useWatch({ control: form.control, name: "seoTitle" }) || "";
  const watchedSeoDesc = useWatch({ control: form.control, name: "seoDescription" }) || "";

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

      formData.append("seoTitle", values.seoTitle ?? "");
      formData.append("seoDescription", values.seoDescription ?? "");
      formData.append("seoCanonicalUrl", values.seoCanonicalUrl ?? "");
      formData.append("seoOgTitle", values.seoOgTitle ?? "");
      formData.append("seoOgDescription", values.seoOgDescription ?? "");
      formData.append("seoOgImage", values.seoOgImage ?? "");

      formData.append("authorName", values.authorName ?? "");
      formData.append("authorAlternateName", values.authorAlternateName ?? "");
      formData.append("authorJobTitle", values.authorJobTitle ?? "");
      formData.append("authorDescription", values.authorDescription ?? "");

      formData.append("googleSiteVerification", values.googleSiteVerification ?? "");
      formData.append("bingSiteVerification", values.bingSiteVerification ?? "");

      formData.append("robotsIndex", String(values.robotsIndex));
      formData.append("robotsFollow", String(values.robotsFollow));

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
      {/* SECTION 1: HERO & ABOUT */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-white">Hero & Bio Settings</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="heroTitle" className="text-sm text-slate-200">
              Hero Title
            </label>
            <input
              id="heroTitle"
              type="text"
              placeholder="e.g. Hi, I'm Bayu Wicaksono"
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
              placeholder="e.g. Data Analyst & Fullstack Developer"
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
            rows={5}
            placeholder="Write a brief introduction about yourself..."
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
            {avatarPreview ? (
              <div className="mt-3">
                <p className="text-xs text-slate-400">New Avatar Preview:</p>
                <div className="relative mt-1.5 h-20 w-20 overflow-hidden rounded-full border border-white/20 bg-slate-900">
                  <Image src={avatarPreview} alt="New avatar preview" fill unoptimized className="object-cover" />
                </div>
              </div>
            ) : (
              settings?.avatar && (
                <div className="mt-3">
                  <p className="text-xs text-slate-400">Current Avatar:</p>
                  <div className="relative mt-1.5 h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-slate-900">
                    <Image src={settings.avatar} alt="Current avatar" fill unoptimized className="object-cover" />
                  </div>
                </div>
              )
            )}
          </div>

          <div>
            <label htmlFor="resume" className="text-sm text-slate-200">
              Resume Document <span className="text-slate-400">(PDF format)</span>
            </label>
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className={inputClassName}
            />
            {resumeName ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                <FileText className="h-4 w-4 text-slate-400" />
                <span>Selected: {resumeName}</span>
              </div>
            ) : (
              settings?.resume && (
                <div className="mt-3">
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
      </div>

      <hr className="border-white/10" />

      {/* SECTION 2: GENERAL SEO */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">General SEO Settings</h3>
        </div>
        <p className="text-xs text-slate-400">
          Konfigurasi default meta tag global untuk seluruh halaman public portfolio.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="seoTitle" className="text-sm text-slate-200">
                SEO Title
              </label>
              <span className="text-xs text-slate-400">{watchedSeoTitle.length} / ~50-60 karakter</span>
            </div>
            <input
              id="seoTitle"
              type="text"
              placeholder="Bayu Wicaksono | Data Analyst & Fullstack Developer | WicakSaja"
              {...form.register("seoTitle")}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-slate-400">
              Judul utama website yang ditampilkan di hasil pencarian Google.
            </p>
          </div>

          <div>
            <label htmlFor="seoCanonicalUrl" className="text-sm text-slate-200">
              Canonical URL Global
            </label>
            <input
              id="seoCanonicalUrl"
              type="url"
              placeholder="https://wicaksaja.my.id/"
              {...form.register("seoCanonicalUrl")}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-slate-400">
              URL resmi domain production (hindari localhost).
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="seoDescription" className="text-sm text-slate-200">
              SEO Description
            </label>
            <span className="text-xs text-slate-400">{watchedSeoDesc.length} / ~140-160 karakter</span>
          </div>
          <textarea
            id="seoDescription"
            rows={3}
            placeholder="Portfolio online Bayu Wicaksono, mahasiswa Teknik Informatika ITN Malang dengan fokus Data Analytics, Data Visualization, dan Fullstack Development."
            {...form.register("seoDescription")}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-slate-400">
            Deskripsi singkat rangkuman portfolio untuk cuplikan Google Search.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="seoOgTitle" className="text-sm text-slate-200">
              Open Graph (OG) Title
            </label>
            <input
              id="seoOgTitle"
              type="text"
              placeholder="Fallback: menggunakan SEO Title"
              {...form.register("seoOgTitle")}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="seoOgImage" className="text-sm text-slate-200">
              Open Graph (OG) Image URL
            </label>
            <input
              id="seoOgImage"
              type="text"
              placeholder="https://wicaksaja.my.id/BW.png"
              {...form.register("seoOgImage")}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="seoOgDescription" className="text-sm text-slate-200">
            Open Graph (OG) Description
          </label>
          <textarea
            id="seoOgDescription"
            rows={2}
            placeholder="Fallback: menggunakan SEO Description"
            {...form.register("seoOgDescription")}
            className={inputClassName}
          />
        </div>
      </div>

      <hr className="border-white/10" />

      {/* SECTION 3: PERSON / BRAND */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Person & Brand Knowledge Graph</h3>
        </div>
        <p className="text-xs text-slate-400">
          Informasi entitas personal untuk Schema.org JSON-LD agar Google mengenali pemilik portfolio.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="authorName" className="text-sm text-slate-200">
              Author Name
            </label>
            <input
              id="authorName"
              type="text"
              placeholder="Bayu Wicaksono"
              {...form.register("authorName")}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="authorAlternateName" className="text-sm text-slate-200">
              Brand / Alternate Name
            </label>
            <input
              id="authorAlternateName"
              type="text"
              placeholder="WicakSaja"
              {...form.register("authorAlternateName")}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="authorJobTitle" className="text-sm text-slate-200">
              Job Title
            </label>
            <input
              id="authorJobTitle"
              type="text"
              placeholder="Data Analyst & Fullstack Developer"
              {...form.register("authorJobTitle")}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="authorDescription" className="text-sm text-slate-200">
            Author Bio / Entity Description
          </label>
          <textarea
            id="authorDescription"
            rows={3}
            placeholder="Data Analyst dan Fullstack Developer yang berfokus pada analisis data, visualisasi interaktif, dan pengembangan aplikasi web terintegrasi."
            {...form.register("authorDescription")}
            className={inputClassName}
          />
        </div>
      </div>

      <hr className="border-white/10" />

      {/* SECTION 4: SEARCH ENGINE VERIFICATION */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Search Engine Verification</h3>
        </div>
        <p className="text-xs text-slate-400">
          Token verifikasi meta tag dari Google Search Console dan Bing Webmaster Tools.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="googleSiteVerification" className="text-sm text-slate-200">
              Google Site Verification Code
            </label>
            <input
              id="googleSiteVerification"
              type="text"
              placeholder="e.g. google1234567890abc"
              {...form.register("googleSiteVerification")}
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-slate-400">
              Isi atribut <code>content</code> dari tag <code>google-site-verification</code>.
            </p>
          </div>

          <div>
            <label htmlFor="bingSiteVerification" className="text-sm text-slate-200">
              Bing Site Verification Code
            </label>
            <input
              id="bingSiteVerification"
              type="text"
              placeholder="e.g. BING1234567890ABC"
              {...form.register("bingSiteVerification")}
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* SECTION 5: ROBOTS SETTINGS */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-sky-400" />
          <h3 className="text-lg font-semibold text-white">Global Robots Indexing</h3>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              {...form.register("robotsIndex")}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-slate-900 focus:ring-0"
            />
            Allow Search Engines to Index Homepage (index)
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              {...form.register("robotsFollow")}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-slate-900 focus:ring-0"
            />
            Allow Search Engines to Follow Links (follow)
          </label>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving Settings..." : "Save All Settings"}
        </button>
      </div>
    </form>
  );
}
