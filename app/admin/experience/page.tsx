import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Calendar, Briefcase } from "lucide-react";

import { prisma } from "@/lib/db/prisma";
import { ExperienceDeleteButton } from "@/components/admin/experience-delete-button";

export const dynamic = "force-dynamic";

export default async function ExperienceAdminPage() {
  const experiences = await prisma.experience.findMany({
    orderBy: {
      startDate: "desc",
    },
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Work Experience</h2>
          <p className="mt-1 text-sm text-slate-300">
            Manage your professional career timeline and project galleries shown on the public site.
          </p>
        </div>
        <Link
          href="/admin/experience/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </Link>
      </div>

      {experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-12 text-center">
          <p className="text-base text-slate-400">No work experiences found.</p>
          <p className="mt-1 text-sm text-slate-500">Get started by creating your first experience entry.</p>
          <Link
            href="/admin/experience/new"
            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Role & Company</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Duration</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Gallery</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-slate-400">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{exp.position}</div>
                          <div className="text-xs text-slate-400">{exp.company}</div>
                          <div className="mt-1.5 line-clamp-1 max-w-[300px] text-xs text-slate-500">
                            {exp.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>
                          {formatDate(exp.startDate)} –{" "}
                          {exp.endDate ? formatDate(exp.endDate) : "Present"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {exp.images && exp.images.length > 0 ? (
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[200px]">
                          {exp.images.map((url, i) => (
                            <div key={i} className="relative h-8 w-12 shrink-0 overflow-hidden rounded border border-white/10 bg-slate-950">
                              <Image
                                src={url}
                                alt={`Gallery image ${i}`}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">No images</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/experience/${exp.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                          title="Edit experience"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <ExperienceDeleteButton id={exp.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
