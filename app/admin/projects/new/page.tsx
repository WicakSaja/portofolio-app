import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
import { ProjectCreateForm } from "@/components/admin/project-create-form";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const rawSkills = await prisma.skill.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, category: true, categories: true },
  });

  const allSkills = rawSkills.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.categories?.[0] ?? s.category ?? "General",
  }));

  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Create Project</h2>
          <p className="mt-1 text-sm text-slate-300">Add a new project for the public website.</p>
        </div>
        <Link
          href="/admin/projects"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-slate-200 transition-colors hover:bg-white/10"
        >
          Back to Projects
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <ProjectCreateForm allSkills={allSkills} />
      </div>
    </div>
  );
}
