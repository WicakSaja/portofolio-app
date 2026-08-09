import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { SkillForm } from "@/components/admin/skill-form";

export const dynamic = "force-dynamic";

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params;

  const skill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!skill) {
    notFound();
  }

  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Edit Skill</h2>
          <p className="mt-1 text-sm text-slate-300">
            Modify the proficiency level or details for &quot;{skill.name}&quot;.
          </p>
        </div>
        <Link
          href="/admin/skills"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-slate-200 transition-colors hover:bg-white/10"
        >
          Back to Skills
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <SkillForm skill={skill} />
      </div>
    </div>
  );
}
