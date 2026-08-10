import { prisma } from "@/lib/db/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { ExperienceSection } from "@/components/sections/experience";
import { PortfolioSection } from "@/components/sections/portfolio";
import { Contact } from "@/components/sections/contact";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, skills, experiences, projects, contact] = await Promise.all([
    prisma.settings.findFirst(),
    prisma.skill.findMany({ orderBy: { category: "asc" } }),
    prisma.experience.findMany({ orderBy: { startDate: "desc" } }),
    prisma.portfolio.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.contact.findFirst(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <Navbar />

      <main>
        <Hero settings={settings} />
        <Marquee skills={skills} />
        <About settings={settings} />
        <Skills skills={skills} />
        <ExperienceSection experiences={experiences} />
        <PortfolioSection projects={projects} />
        <Contact contact={contact} />
      </main>

      <Footer contact={contact} resume={settings?.resume} />
    </div>
  );
}
