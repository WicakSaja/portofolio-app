import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Globe, GitBranch } from "lucide-react";

import { prisma } from "@/lib/db/prisma";
import { PortfolioDeleteButton } from "@/components/admin/portfolio-delete-button";

export const dynamic = "force-dynamic";

export default async function PortfolioAdminPage() {
  const projects = await prisma.portfolio.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Portfolio Projects</h2>
          <p className="mt-1 text-sm text-slate-300">
            Manage your project entries shown on the public portfolio website.
          </p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          Create Portfolio
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-12 text-center">
          <p className="text-base text-slate-400">No portfolio projects found.</p>
          <p className="mt-1 text-sm text-slate-500">Get started by creating a new project entry.</p>
          <Link
            href="/admin/portfolio/new"
            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            Create Portfolio
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Project</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Category</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Featured</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Links</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {projects.map((project) => {
                  const displayImages =
                    project.images && project.images.length > 0
                      ? project.images
                      : project.thumbnail
                        ? [project.thumbnail]
                        : [];

                  return (
                    <tr key={project.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-900">
                            {displayImages[0] ? (
                              <Image
                                src={displayImages[0]}
                                alt={project.title}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                                No image
                              </div>
                            )}
                            {displayImages.length > 1 && (
                              <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 py-0.2 text-[10px] font-medium text-white">
                                +{displayImages.length - 1}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{project.title}</div>
                            <div className="mt-0.5 line-clamp-1 max-w-[250px] text-xs text-slate-400">
                              {project.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {project.featured ? (
                          <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
                            Featured
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full border border-white/10 bg-transparent px-2.5 py-0.5 text-xs text-slate-500">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {project.github ? (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
                            >
                              <GitBranch className="h-3.5 w-3.5" />
                              <span>Code</span>
                            </a>
                          ) : (
                            <span className="text-xs text-slate-600">-</span>
                          )}
                          {project.demo ? (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
                            >
                              <Globe className="h-3.5 w-3.5" />
                              <span>Demo</span>
                            </a>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/portfolio/${project.id}/edit`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                            title="Edit project"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <PortfolioDeleteButton id={project.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
