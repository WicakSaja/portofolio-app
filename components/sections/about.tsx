import { SectionHeader } from '@/components/ui/section-header';
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll';

interface AboutProps {
  settings: {
    about: string;
    avatar: string | null;
  } | null;
}

export function About({ settings }: AboutProps) {
  const aboutText = settings?.about || "I am a passionate developer with a love for creating beautiful and functional web applications. My journey started with a curiosity for how things work on the internet, and it has evolved into a career focused on building excellent digital experiences. I believe in writing clean, maintainable code and always striving to learn new technologies.";

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="lg:w-1/3 shrink-0">
              <SectionHeader 
                label="01 — ABOUT" 
                title="A little about me" 
              />
            </div>
            
            <div className="lg:w-2/3">
              <div className="prose prose-lg text-[var(--color-text-secondary)]">
                {aboutText.split('\n').map((paragraph, index) => (
                  paragraph.trim() ? (
                    <p key={index} className="mb-6 leading-relaxed">
                      {paragraph}
                    </p>
                  ) : null
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
