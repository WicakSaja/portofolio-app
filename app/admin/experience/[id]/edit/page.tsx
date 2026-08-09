import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { ExperienceForm } from "@/components/admin/experience-form";

export const dynamic = "force-dynamic";

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  const { id } = await params;

  const experience = await prisma.experience.findUnique({
    where: { id },
  });

  if (!experience) {
    notFound();
  }

  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Edit Experience</h2>
          <p className="mt-1 text-sm text-slate-300">
            Modify the role details or manage gallery images for &quot;{experience.position} at {experience.company}&quot;.
          </p>
        </div>
        <Link
          href="/admin/experience"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-slate-200 transition-colors hover:bg-white/10"
        >
          Back to Timeline
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <ExperienceForm experience={experience} />
      </div>
    </div>
  );
}
