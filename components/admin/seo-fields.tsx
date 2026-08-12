"use client";

import { useWatch, UseFormReturn } from "react-hook-form";
import { Search, CheckCircle2, AlertTriangle, Globe } from "lucide-react";

interface SeoFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  defaultTitle?: string;
  defaultDescription?: string;
  pathPrefix: string; // e.g. "/projects/" or "/experience/"
  entityId?: string;
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-white/35";

export function SeoFields({ form, defaultTitle = "", defaultDescription = "", pathPrefix, entityId }: SeoFieldsProps) {
  const seoTitle = useWatch({ control: form.control, name: "seoTitle" }) || "";
  const seoDescription = useWatch({ control: form.control, name: "seoDescription" }) || "";
  const seoCanonicalUrl = useWatch({ control: form.control, name: "seoCanonicalUrl" }) || "";
  const seoOgTitle = useWatch({ control: form.control, name: "seoOgTitle" }) || "";
  const seoOgDescription = useWatch({ control: form.control, name: "seoOgDescription" }) || "";
  const seoOgImage = useWatch({ control: form.control, name: "seoOgImage" }) || "";
  const seoIndex = useWatch({ control: form.control, name: "seoIndex" });

  const mainTitle = useWatch({ control: form.control, name: "title" }) || useWatch({ control: form.control, name: "position" }) || defaultTitle;
  const mainDesc = useWatch({ control: form.control, name: "description" }) || defaultDescription;

  // Computed preview values
  const previewTitle = seoTitle.trim() !== "" ? seoTitle : `${mainTitle} | Bayu Wicaksono`;
  const previewDesc = seoDescription.trim() !== "" ? seoDescription : mainDesc;
  const previewUrl =
    seoCanonicalUrl.trim() !== ""
      ? seoCanonicalUrl
      : `https://wicaksaja.my.id${pathPrefix}${entityId || "new-item"}`;

  // Warnings calculation
  const warnings: string[] = [];
  if (previewTitle.length > 60) {
    warnings.push("SEO Title disarankan 50–60 karakter untuk mencegah pemotongan oleh Google (saat ini: " + previewTitle.length + " karakter).");
  }
  if (previewDesc.length > 160) {
    warnings.push("SEO Description disarankan 140–160 karakter (saat ini: " + previewDesc.length + " karakter).");
  }
  if (!seoOgImage && !useWatch({ control: form.control, name: "images" })) {
    warnings.push("OG Image belum tersedia. Fallback akan menggunakan gambar utama atau gambar global.");
  }
  if (seoCanonicalUrl.includes("localhost")) {
    warnings.push("Canonical URL menunjuk ke localhost. Gunakan domain production https://wicaksaja.my.id.");
  }
  if (seoIndex === false) {
    warnings.push("Halaman ini di-set NOINDEX. Google TIDAK akan meng-index halaman ini!");
  }

  // Checklist indicator
  const hasTitle = previewTitle.trim().length > 0;
  const hasDesc = previewDesc.trim().length > 0;
  const validCanonical = !seoCanonicalUrl.includes("localhost");
  const isIndexed = seoIndex !== false;

  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 mt-8">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <Search className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">SEO & Indexing Settings</h3>
      </div>

      {/* GOOGLE SEARCH PREVIEW */}
      <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Globe className="h-3.5 w-3.5 text-blue-400" />
          <span>Google Search Preview</span>
        </div>
        <div className="font-sans">
          <div className="text-xs text-slate-400 truncate">{previewUrl}</div>
          <div className="text-base font-medium text-blue-400 hover:underline cursor-pointer truncate mt-0.5">
            {previewTitle}
          </div>
          <div className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
            {previewDesc}
          </div>
        </div>
      </div>

      {/* SEO READINESS CHECKLIST */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">SEO Readiness Indicator</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className={`h-4 w-4 ${hasTitle ? "text-emerald-400" : "text-slate-600"}`} />
            <span>Title tersedia</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className={`h-4 w-4 ${hasDesc ? "text-emerald-400" : "text-slate-600"}`} />
            <span>Description tersedia</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className={`h-4 w-4 ${validCanonical ? "text-emerald-400" : "text-amber-400"}`} />
            <span>Canonical URL valid</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className={`h-4 w-4 ${isIndexed ? "text-emerald-400" : "text-amber-400"}`} />
            <span>Indexing enabled ({isIndexed ? "Index" : "Noindex"})</span>
          </div>
        </div>
      </div>

      {/* WARNINGS GUIDANCE */}
      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            <span>Catatan / Guidance SEO:</span>
          </div>
          <ul className="list-disc list-inside text-xs text-amber-200/90 space-y-0.5 pl-1">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* SEO INPUT FIELDS */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="seoTitle" className="text-sm text-slate-200">
              SEO Title
            </label>
            <span className="text-xs text-slate-400">{seoTitle.length} / ~50-60</span>
          </div>
          <input
            id="seoTitle"
            type="text"
            placeholder={`Fallback: ${mainTitle} | Bayu Wicaksono`}
            {...form.register("seoTitle")}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="seoCanonicalUrl" className="text-sm text-slate-200">
            Canonical URL Custom
          </label>
          <input
            id="seoCanonicalUrl"
            type="url"
            placeholder={`Fallback: https://wicaksaja.my.id${pathPrefix}${entityId || ""}`}
            {...form.register("seoCanonicalUrl")}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="seoDescription" className="text-sm text-slate-200">
            SEO Description
          </label>
          <span className="text-xs text-slate-400">{seoDescription.length} / ~140-160</span>
        </div>
        <textarea
          id="seoDescription"
          rows={3}
          placeholder="Fallback: menggunakan deskripsi utama"
          {...form.register("seoDescription")}
          className={inputClassName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="seoKeywords" className="text-sm text-slate-200">
            Internal Target Keywords <span className="text-slate-400">(Admin note only)</span>
          </label>
          <input
            id="seoKeywords"
            type="text"
            placeholder="e.g. data visualization, superstore analytics, python"
            {...form.register("seoKeywords")}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-slate-400">
            Hanya untuk manajemen admin. Tidak akan di-render sebagai meta tag keywords.
          </p>
        </div>

        <div>
          <label htmlFor="seoOgImage" className="text-sm text-slate-200">
            Custom OG Image URL
          </label>
          <input
            id="seoOgImage"
            type="text"
            placeholder="e.g. https://... (fallback ke gambar utama)"
            {...form.register("seoOgImage")}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="seoOgTitle" className="text-sm text-slate-200">
            OG Title
          </label>
          <input
            id="seoOgTitle"
            type="text"
            placeholder="Fallback: SEO Title / Title utama"
            {...form.register("seoOgTitle")}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="seoOgDescription" className="text-sm text-slate-200">
            OG Description
          </label>
          <input
            id="seoOgDescription"
            type="text"
            placeholder="Fallback: SEO Description / Deskripsi utama"
            {...form.register("seoOgDescription")}
            className={inputClassName}
          />
        </div>
      </div>

      {/* ROBOTS DIRECTIVES */}
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <label className="inline-flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
          <input
            type="checkbox"
            {...form.register("seoIndex")}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-slate-900 focus:ring-0"
          />
          Index page in Search Engines (index)
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
          <input
            type="checkbox"
            {...form.register("seoFollow")}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-slate-900 focus:ring-0"
          />
          Follow links on this page (follow)
        </label>
      </div>
    </div>
  );
}
