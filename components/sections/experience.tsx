import { SectionHeader } from '@/components/ui/section-header';
import { ExperienceCard } from '@/components/experience/experience-card';
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll';

interface ExperienceProps {
  experiences: {
    id: string;
    company: string;
    position: string;
    description: string;
    startDate: Date;
    endDate: Date | null;
    images: string[];
  }[];
}

export function ExperienceSection({ experiences }: ExperienceProps) {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-6">
      <SectionHeader label="03 — EXPERIENCE" title="Career Timeline" />
      <div className="mt-12 relative border-l border-[var(--color-border)] ml-3 md:ml-0 md:border-l-0">
        <div className="flex flex-col gap-8 md:gap-12">
          {experiences.map((exp, index) => (
            <AnimateOnScroll key={exp.id} delay={index * 0.1}>
              <ExperienceCard experience={exp} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
