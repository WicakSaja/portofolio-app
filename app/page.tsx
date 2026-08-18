import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { buildGlobalMetadata } from "@/lib/seo/metadata";
import { generateHomepageSchema } from "@/lib/seo/schema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.settings.findFirst();
  return buildGlobalMetadata(settings, "/");
}

export default async function Home() {
  const [settings, skills, experiences, projects, contact] = await Promise.all([
    prisma.settings.findFirst(),
    prisma.skill.findMany({ orderBy: { name: "asc" } }),
    prisma.experience.findMany({ orderBy: { startDate: "desc" } }),
    prisma.portfolio.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        skills: {
          include: { skill: { select: { id: true, name: true, icon: true } } },
        },
      },
    }),
    prisma.contact.findFirst(),
  ]);

  const formattedSkills = skills.map((s) => ({
    ...s,
    categories: s.categories && s.categories.length > 0 ? s.categories : (s.category ? [s.category] : []),
    category: s.categories?.[0] ?? s.category ?? "General",
  }));

  const projectsWithSkills = projects.map((p) => ({
    ...p,
    skills: p.skills ? p.skills.map((ps) => ps.skill) : [],
  }));

  const earliestExpYear = experiences.length > 0
    ? new Date(Math.min(...experiences.map((e) => new Date(e.startDate).getTime()))).getFullYear()
    : new Date().getFullYear() - 2;
  const yearsExperience = Math.max(1, new Date().getFullYear() - earliestExpYear + 1);

  const heroStats = {
    projectsCount: projects.length,
    skillsCount: skills.length,
    yearsExperience,
  };

  const jsonLdSchemas = generateHomepageSchema(settings, contact);

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

      <Navbar />

      <main>
        <Hero settings={settings} stats={heroStats} />
        <Marquee skills={formattedSkills} />
        <About settings={settings} />
        <Skills skills={formattedSkills} />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={projectsWithSkills} />
        <Contact contact={contact} />
      </main>

      <Footer contact={contact} resume={settings?.resume} />
    </div>
  );
}
