import Image from 'next/image';
import Link from 'next/link';
import { LightBeamButton } from '@/components/ui/light-beam-button';
import { ArrowRight, Sparkles, FolderGit2, Briefcase, Cpu } from 'lucide-react';

interface HeroProps {
  settings: {
    heroTitle: string;
    heroSubtitle: string;
    avatar: string | null;
    resume: string | null;
  } | null;
  stats?: {
    projectsCount?: number;
    skillsCount?: number;
    yearsExperience?: number;
  };
}

export function Hero({ settings, stats }: HeroProps) {
  const title = settings?.heroTitle || "Full-Stack Developer & Data Analyst";
  const subtitle = settings?.heroSubtitle || "Building digital experiences that matter.";
  const avatar = settings?.avatar;

  const projectsCount = stats?.projectsCount ?? 10;
  const skillsCount = stats?.skillsCount ?? 15;
  const yearsExp = stats?.yearsExperience ?? 3;

  return (
    <section id="hero" className="min-h-screen flex items-center pt-28 pb-16 sm:pt-36 sm:pb-20 lg:py-28 overflow-hidden relative isolate">
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-text { animation: hero-fade-up 0.6s ease-out both; }
        .hero-text-d1 { animation-delay: 0.05s; }
        .hero-text-d2 { animation-delay: 0.15s; }
        .hero-text-d3 { animation-delay: 0.25s; }
        .hero-text-d4 { animation-delay: 0.35s; }
        .hero-text-d5 { animation-delay: 0.45s; }
        @keyframes hero-fade-in {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .hero-image { animation: hero-fade-in 0.7s ease-out 0.1s both; }
      `}</style>

      {/* Ambient Radial Glows in Background */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[300px] sm:h-[450px] bg-gradient-to-tr from-[var(--color-accent)]/20 via-[var(--color-primary)]/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[300px] sm:w-[500px] h-[250px] sm:h-[400px] bg-[var(--color-accent)]/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-14 xl:gap-20">
          {/* Left Text Content (55%) */}
          <div className="w-full lg:w-[56%] flex flex-col items-center lg:items-start text-center lg:text-left z-10 pt-2 sm:pt-4 lg:pt-8 xl:pt-10">
            {/* Main Headline */}
            <h1 
              className="hero-text hero-text-d1 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--color-text-primary)] tracking-tight leading-[1.15] mb-4" 
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h1>

            {/* Subtitle & Value Proposition Sentence */}
            <div className="hero-text hero-text-d2 space-y-2 mb-8 max-w-xl">
              <p className="text-base sm:text-lg font-medium text-[var(--color-primary)]">
                {subtitle}
              </p>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                Transforming complex ideas into scalable, high-performing web applications and data-driven solutions built for real-world impact.
              </p>
            </div>

            {/* Action CTA Buttons */}
            <div className="hero-text hero-text-d3 flex flex-wrap items-center gap-4 w-full justify-center lg:justify-start">
              <LightBeamButton href="#projects">
                View My Work <ArrowRight className="w-4 h-4" />
              </LightBeamButton>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface)]/90 transition-all duration-300 shadow-sm"
              >
                Contact Me
              </Link>
            </div>

            {/* Quick Stats / Highlights Strip */}
            <div className="hero-text hero-text-d4 pt-8 sm:pt-10 mt-8 sm:mt-10 border-t border-[var(--color-border)]/60 w-full grid grid-cols-3 gap-4 sm:gap-8 lg:gap-12 max-w-xl lg:max-w-2xl">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent)] hidden sm:inline-block" />
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {projectsCount}+
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium mt-1">
                  Projects Done
                </span>
              </div>

              <div className="flex flex-col items-center lg:items-start border-x border-[var(--color-border)]/50 px-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent)] hidden sm:inline-block" />
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {yearsExp}+
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium mt-1">
                  Years Exp.
                </span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent)] hidden sm:inline-block" />
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {skillsCount}+
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium mt-1">
                  Tech Stack
                </span>
              </div>
            </div>
          </div>

          {/* Right Profile Image (44%) */}
          <div className="hero-image w-full lg:w-[44%] flex justify-center lg:justify-end z-10 relative mb-4 lg:mb-0">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px] xl:w-[420px] xl:h-[420px] rounded-full p-2.5 sm:p-3 border-4 border-[var(--color-surface)] shadow-2xl bg-[var(--color-background)] transition-transform duration-300 hover:scale-[1.02]">
              {avatar ? (
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image 
                    src={avatar} 
                    alt="Profile Avatar" 
                    fill 
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-[var(--color-primary)] opacity-80 flex items-center justify-center">
                  <span className="text-white font-bold text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>Hello</span>
                </div>
              )}
              {/* Decorative Accent Rings */}
              <div className="absolute -inset-3.5 sm:-inset-4 rounded-full border border-[var(--color-accent)] opacity-30 -z-10 animate-[spin_10s_linear_infinite]" />
              <div className="absolute -inset-7 sm:-inset-8 rounded-full border border-[var(--color-border)] opacity-40 -z-10 animate-[spin_15s_linear_infinite_reverse]" />

              {/* Floating Status Pill */}
              <div className="absolute -bottom-2 right-2 sm:right-6 bg-[var(--color-surface)]/95 border border-[var(--color-border)] px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 select-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-[var(--color-text-primary)] tracking-wide">
                  Available for new project
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Dots Background — spotlight in center fades to edges */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-text-primary) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 0%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 0%, transparent 100%)',
          opacity: 0.2,
        }}
      />
    </section>
  );
}
