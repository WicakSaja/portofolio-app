import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Code } from "lucide-react";

import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

interface PortfolioDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.portfolio.findUnique({ where: { id } });

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} — Portfolio`,
    description: project.description.slice(0, 160),
    openGraph: {
      title: `${project.title} — Portfolio`,
      description: project.description.slice(0, 160),
      images: project.images[0] ? [{ url: project.images[0] }] : [],
    },
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { id } = await params;

  const project = await prisma.portfolio.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  const displayImages =
    project.images && project.images.length > 0
      ? project.images
      : project.thumbnail
        ? [project.thumbnail]
        : [];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
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
              alt={project.title}
              fill
              unoptimized
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
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-border)]"
              >
                <Code className="h-4 w-4" />
                View Source
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
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
                    alt={`${project.title} screenshot ${i + 2}`}
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
