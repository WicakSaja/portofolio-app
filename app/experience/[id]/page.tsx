import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Building2, ChevronRight, Home as HomeIcon } from "lucide-react";

import { prisma } from "@/lib/db/prisma";
import { buildExperienceMetadata } from "@/lib/seo/metadata";
import { generateExperienceSchema } from "@/lib/seo/schema";

export const dynamic = "force-dynamic";

interface ExperienceDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const [experience, globalSettings] = await Promise.all([
    prisma.experience.findUnique({ where: { id } }),
    prisma.settings.findFirst(),
  ]);

  if (!experience) {
    return { title: "Experience Not Found" };
  }

  return buildExperienceMetadata(experience, globalSettings);
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { id } = await params;

  const experience = await prisma.experience.findUnique({ where: { id } });

  if (!experience) {
    notFound();
  }

  const dateRange = `${formatDate(experience.startDate)} – ${experience.endDate ? formatDate(experience.endDate) : "Present"}`;
  const jsonLdSchemas = generateExperienceSchema(experience);

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

      {/* Navigation & Breadcrumbs */}
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
              href="/#experience"
              className="hover:text-[var(--color-text-primary)] transition-colors"
            >
              Experience
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[var(--color-text-primary)] font-medium truncate max-w-[150px] sm:max-w-[300px]">
              {experience.position}
            </span>
          </div>

          <Link
            href="/#experience"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Experience
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {experience.position}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-[var(--color-text-secondary)]">
            <span className="inline-flex items-center gap-1.5 text-sm">
              <Building2 className="h-4 w-4" />
              {experience.company}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm">
              <Calendar className="h-4 w-4" />
              {dateRange}
            </span>
            {!experience.endDate && (
              <span className="inline-flex rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-500">
                Current Position
              </span>
            )}
          </div>
        </div>

        {/* Hero Image */}
        {experience.images.length > 0 && (
          <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Image
              src={experience.images[0]}
              alt={`Dokumentasi posisi ${experience.position} di ${experience.company} - Bayu Wicaksono`}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-12 max-w-3xl">
          <h2
            className="mb-4 text-xl font-semibold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            About this Role
          </h2>
          <div className="text-[var(--color-text-secondary)] leading-7 whitespace-pre-line">
            {experience.description}
          </div>
        </div>

        {/* Image Gallery */}
        {experience.images.length > 1 && (
          <div className="mb-12">
            <h2
              className="mb-6 text-xl font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Gallery
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {experience.images.slice(1).map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-video overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
                >
                  <Image
                    src={url}
                    alt={`Dokumentasi ${experience.company} foto ${i + 2}`}
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
