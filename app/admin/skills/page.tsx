import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Award } from "lucide-react";

import { prisma } from "@/lib/db/prisma";
import { SkillDeleteButton } from "@/components/admin/skill-delete-button";

export const dynamic = "force-dynamic";

export default async function SkillsAdminPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [
      { name: "asc" },
    ],
  });

  // Group skills by primary category
  const categories = skills.reduce((acc, skill) => {
    const primaryCat = skill.categories?.[0] ?? skill.category ?? "Uncategorized";
    if (!acc[primaryCat]) {
      acc[primaryCat] = [];
    }
    acc[primaryCat].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Skills</h2>
          <p className="mt-1 text-sm text-slate-300">
            Manage your technical skills and proficiency levels shown on the public site.
          </p>
        </div>
        <Link
          href="/admin/skills/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          Create Skill
        </Link>
      </div>

      {skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-12 text-center">
          <p className="text-base text-slate-400">No skills found.</p>
          <p className="mt-1 text-sm text-slate-500">Get started by creating a new skill entry.</p>
          <Link
            href="/admin/skills/new"
            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            Create Skill
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-medium text-white px-1">{category}</h3>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-slate-300">
                    <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                      <tr>
                        <th scope="col" className="px-6 py-3.5 font-semibold w-24">Icon</th>
                        <th scope="col" className="px-6 py-3.5 font-semibold">Name</th>
                        <th scope="col" className="px-6 py-3.5 font-semibold">Proficiency</th>
                        <th scope="col" className="px-6 py-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {items.map((skill) => (
                        <tr key={skill.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
                              {skill.icon ? (
                                <Image
                                  src={skill.icon}
                                  alt={skill.name}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              ) : (
                                <Award className="h-5 w-5 text-slate-500" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="space-y-1">
                              <span className="font-medium text-white block">{skill.name}</span>
                              <div className="flex flex-wrap gap-1">
                                {(skill.categories && skill.categories.length > 0 ? skill.categories : [skill.category || "General"]).map((cat, idx) => (
                                  <span
                                    key={cat}
                                    className={`inline-flex text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                      idx === 0
                                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                        : "bg-white/5 text-slate-400 border border-white/10"
                                    }`}
                                  >
                                    {cat}{idx === 0 && " (Primary)"}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3 max-w-xs">
                              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full bg-white rounded-full"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-slate-400 shrink-0">
                                {skill.level}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/skills/${skill.id}/edit`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                                title="Edit skill"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <SkillDeleteButton id={skill.id} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
