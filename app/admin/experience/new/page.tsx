import Link from "next/link";

import { ExperienceForm } from "@/components/admin/experience-form";

export default function NewExperiencePage() {
  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Add Experience</h2>
          <p className="mt-1 text-sm text-slate-300">Add a new career entry and gallery showcase for the website.</p>
        </div>
        <Link
          href="/admin/experience"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-slate-200 transition-colors hover:bg-white/10"
        >
          Back to Timeline
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <ExperienceForm />
      </div>
    </div>
  );
}
