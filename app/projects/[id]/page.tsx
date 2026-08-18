import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Code, ChevronRight, Home as HomeIcon } from "lucide-react";

import { prisma } from "@/lib/db/prisma";
import { buildProjectMetadata } from "@/lib/seo/metadata";
import { generateProjectSchema } from "@/lib/seo/schema";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const [project, globalSettings] = await Promise.all([
    prisma.portfolio.findUnique({ where: { id } }),
    prisma.settings.findFirst(),
  ]);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return buildProjectMetadata(project, globalSettings);
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;

  const project = await prisma.portfolio.findUnique({
    where: { id },
    include: {
      skills: {
        include: { skill: { select: { id: true, name: true, icon: true } } },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const displayImages =
    project.images && project.images.length > 0
      ? project.images
      : project.thumbnail
        ? [project.thumbnail]
        : [];

  const jsonLdSchemas = generateProjectSchema(project);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      {/* Structured Data (JSON-LD) */}
      {jsonLdSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Navigation & Breadcrumb */}
      <nav className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--color-text-secondary)]">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors"
            >
              <HomeIcon className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            <Link
              href="/#projects"
              className="hover:text-[var(--color-text-primary)] transition-colors"
            >
              Projects
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[var(--color-text-primary)] font-medium truncate max-w-[150px] sm:max-w-[300px]">
              {project.title}
            </span>
          </div>

          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-20">
        {/* Hero Image */}
        {displayImages[0] && (
          <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Image
              src={displayImages[0]}
              alt={`${project.title} - Portofolio Bayu Wicaksono`}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <span className="mb-3 inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
            {project.category}
          </span>
          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {project.title}
          </h1>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Lihat kode sumber repository ${project.title} di GitHub`}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-border)]"
              >
                <Code className="h-4 w-4" />
                View Source Code
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buka demo aplikasi live ${project.title}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-12 max-w-3xl">
          <h2
            className="mb-4 text-xl font-semibold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            About this Project
          </h2>
          <div className="prose max-w-none text-[var(--color-text-secondary)] leading-7 whitespace-pre-line">
            {project.description}
          </div>
        </div>

        {/* Technologies Used */}
        {project.skills && project.skills.length > 0 && (
          <div className="mb-12 max-w-3xl">
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Technologies Used
            </h2>
            <div className="flex flex-wrap items-center gap-2.5">
              {project.skills.map((ps) => (
                <span
                  key={ps.skill.id}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] shadow-sm hover:border-[var(--color-accent)] transition-colors"
                >
                  {ps.skill.icon && (
                    <div className="relative w-4 h-4 shrink-0">
                      <Image
                        src={ps.skill.icon}
                        alt={`${ps.skill.name} icon`}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span>{ps.skill.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {displayImages.length > 1 && (
          <div className="mb-12">
            <h2
              className="mb-6 text-xl font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Project Gallery
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayImages.slice(1).map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-video overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
                >
                  <Image
                    src={url}
                    alt={`${project.title} screenshot tangkapan layar ${i + 2}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export const PortfolioDetailPage = ProjectDetailPage;
