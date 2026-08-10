import Image from 'next/image';
import { LightBeamButton } from '@/components/ui/light-beam-button';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  settings: {
    heroTitle: string;
    heroSubtitle: string;
    avatar: string | null;
    resume: string | null;
  } | null;
}

export function Hero({ settings }: HeroProps) {
  const title = settings?.heroTitle || "Full-Stack Developer & Data Analyst";
  const subtitle = settings?.heroSubtitle || "Building digital experiences that matter.";
  const avatar = settings?.avatar;

  return (
    <section id="hero" className="min-h-screen flex items-center pt-24 pb-12 sm:pt-32 sm:pb-16 lg:py-20 overflow-hidden relative">
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-text { animation: hero-fade-up 0.6s ease-out both; }
        .hero-text-d1 { animation-delay: 0.05s; }
        .hero-text-d2 { animation-delay: 0.15s; }
        .hero-text-d3 { animation-delay: 0.25s; }
        .hero-text-d4 { animation-delay: 0.35s; }
        @keyframes hero-fade-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        .hero-image { animation: hero-fade-in 0.7s ease-out 0.1s both; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8">
          {/* Left Text Content (52%) */}
          <div className="w-full lg:w-[52%] flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <span className="hero-text hero-text-d1 text-[var(--color-accent)] font-semibold lg:text-[30px] tracking-wider uppercase text-sm mb-3 block">
              Hello, I&apos;m
            </span>
            <h1 className="hero-text hero-text-d2 text-4xl sm:text-5xl lg:text-[72px] leading-[1.1] font-bold text-[var(--color-text-primary)] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              {title}
            </h1>
            <p className="hero-text hero-text-d3 text-lg sm:text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl">
              {subtitle}
            </p>
            <div className="hero-text hero-text-d4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
              <LightBeamButton href="#portfolio">
                View My Work <ArrowRight className="w-4 h-4" />
              </LightBeamButton>
            </div>
          </div>

          {/* Right Profile Image (48%) */}
          <div className="hero-image w-full lg:w-[48%] flex justify-center lg:justify-end z-10 relative mb-8 lg:mb-0">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[440px] lg:h-[440px] xl:w-[480px] xl:h-[480px] rounded-full p-2.5 sm:p-3 border-4 border-[var(--color-surface)] shadow-2xl bg-[var(--color-background)] transition-transform duration-300 hover:scale-[1.02]">
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
              {/* Decorative Accent Ring */}
              <div className="absolute -inset-4 rounded-full border border-[var(--color-accent)] opacity-30 -z-10 animate-[spin_10s_linear_infinite]" />
              <div className="absolute -inset-8 rounded-full border border-[var(--color-border)] opacity-50 -z-10 animate-[spin_15s_linear_infinite_reverse]" />
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
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)',
          opacity: 0.25,
        }}
      />
    </section>
  );
}
