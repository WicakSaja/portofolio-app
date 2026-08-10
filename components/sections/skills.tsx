import Image from 'next/image';
import { SectionHeader } from '@/components/ui/section-header';
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll';

interface Skill {
  id: string;
  name: string;
  icon: string | null;
  category: string;
  level: number;
}

interface SkillsProps {
  skills: Skill[];
}

export function Skills({ skills }: SkillsProps) {
  if (!skills || skills.length === 0) return null;

  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const gradientString = `conic-gradient(from 0deg, transparent 0%, #8b5cf6 40%, #06b6d4 50%, transparent 60%, transparent 100%)`;

  return (
    <section id="skills" className="py-12 sm:py-16 lg:py-20 px-6 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll>
          <SectionHeader 
            label="02 — SKILLS" 
            title="Technologies & Tools" 
            description="The technologies, languages, and tools I use to bring ideas to life."
          />
        </AnimateOnScroll>

        <div className="mt-12 space-y-16">
          {Object.entries(categories).map(([category, categorySkills], index) => (
            <AnimateOnScroll key={category} delay={index * 0.1}>
              <div>
                <h3 className="text-xl font-bold mb-6 text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {category}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categorySkills.map((skill) => (
                    <div 
                      key={skill.id} 
                      className="group relative isolate flex flex-col p-4 rounded-lg bg-[var(--color-surface)] transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.25)] overflow-hidden"
                    >
                      {/* Default Static Border */}
                      <div className="absolute inset-0 -z-10 rounded-lg border border-[var(--color-border)] group-hover:border-transparent transition-colors" />

                      {/* Hardware-Accelerated Light Beam Gradient Border on Hover */}
                      <div className="absolute inset-0 -z-20 overflow-hidden rounded-lg p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div 
                          className="absolute -inset-[100%] animate-[spin_3s_linear_infinite]"
                          style={{
                            background: gradientString,
                            transformOrigin: "center center",
                            willChange: "transform"
                          }}
                        />
                      </div>

                      {/* Inner Surface Mask */}
                      <div className="absolute inset-[1px] -z-10 rounded-[7px] bg-[var(--color-surface)]" />

                      {/* Subtle Inner Glow Overlay */}
                      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.12)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

                      <div className="flex items-center gap-3 mb-4 z-10">
                        {skill.icon ? (
                          <div className="relative w-8 h-8 shrink-0">
                            <Image 
                              src={skill.icon} 
                              alt={`${skill.name} icon`} 
                              fill 
                              unoptimized
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[var(--color-border)] flex items-center justify-center shrink-0">
                            <span className="text-xs font-medium text-[var(--color-text-secondary)]">{skill.name.charAt(0)}</span>
                          </div>
                        )}
                        <span className="font-medium text-[var(--color-text-primary)]">{skill.name}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--color-background)] rounded-full overflow-hidden mt-auto z-10">
                        <div 
                          className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500" 
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
