"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const Y_AXIS_LEVELS = [
  { label: 'Expert', val: 99 },
  { label: 'Advanced', val: 75 },
  { label: 'Proficient', val: 51 },
  { label: 'Developing', val: 25 },
];

function getLevelLabel(level: number): string {
  if (level >= 99) return 'Expert';
  if (level >= 75) return 'Advanced';
  if (level >= 51) return 'Proficient';
  return 'Developing';
}

export function Skills({ skills = [] }: SkillsProps) {
  const safeSkills = skills ?? [];
  // Extract unique categories
  const uniqueCategories = Array.from(new Set(safeSkills.map((s) => s.category)));
  const categories = ['All', ...uniqueCategories];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSkills =
    selectedCategory === 'All'
      ? safeSkills
      : safeSkills.filter((s) => s.category === selectedCategory);

  const gradientString = `conic-gradient(from var(--gradient-angle), transparent 0%, #8b5cf6 40%, #06b6d4 50%, transparent 60%, transparent 100%)`;

  // Scroll Container Ref & State
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mouse Drag State
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [filteredSkills, selectedCategory]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftPos.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  if (safeSkills.length === 0) return null;

  return (
    <section id="skills" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[var(--color-background)]">
      <style>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-spin {
          from { --gradient-angle: 0deg; }
          to { --gradient-angle: 360deg; }
        }
        .animate-border-spin {
          animation: border-spin 2s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll>
          <SectionHeader
            label="02 — SKILLS"
            title="Technologies & Tools"
            description="The technologies, languages, and tools I use to bring ideas to life."
          />
        </AnimateOnScroll>

        {/* Category Filter Tabs */}
        {uniqueCategories.length > 1 && (
          <AnimateOnScroll delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--color-accent)] text-white shadow-[0_0_15px_-3px_rgba(139,92,246,0.5)] scale-105'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/40'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </AnimateOnScroll>
        )}

        {/* Bar Chart Container */}
        <AnimateOnScroll delay={0.2}>
          <div className="group/chart mt-10 sm:mt-14 rounded-2xl bg-[var(--color-surface)]/60 border border-[var(--color-border)] p-4 sm:p-8 backdrop-blur-sm relative isolate shadow-xl overflow-hidden">
            {/* Ambient Chart Surface Background */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.06)_0%,transparent_70%)]" />

            <div className="relative flex flex-col md:flex-row gap-4 sm:gap-6">
              {/* Chart Main Display Area */}
              <div className="relative flex-1 min-h-[360px] sm:min-h-[420px] flex overflow-hidden">
                {/* Top Padding Reserved for Floating Badges */}
                <div className="w-full flex pt-9 pb-0">
                  {/* Y-AXIS LEVEL LABELS COLUMN (No background overlay) */}
                  <div className="w-24 sm:w-28 shrink-0 relative border-r border-[var(--color-border)] select-none z-20 h-[320px] sm:h-[360px]">
                    {Y_AXIS_LEVELS.map((lvl) => (
                      <div
                        key={lvl.label}
                        style={{ bottom: `${lvl.val}%` }}
                        className="absolute right-3 sm:right-4 translate-y-1/2 flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[var(--color-text-secondary)] tracking-wide whitespace-nowrap"
                      >
                        <span>{lvl.label}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]/70" />
                      </div>
                    ))}
                  </div>

                  {/* CHART GRID & BARS AREA */}
                  <div className="relative flex-1 flex flex-col justify-between overflow-hidden h-[320px] sm:h-[360px]">
                    {/* Grid Horizontal Dotted Lines */}
                    <div className="absolute inset-0 pointer-events-none z-0 pl-2 sm:pl-4">
                      {Y_AXIS_LEVELS.map((lvl) => (
                        <div
                          key={lvl.val}
                          style={{ bottom: `${lvl.val}%` }}
                          className="absolute inset-x-0 border-t border-dashed border-[var(--color-border)]/60"
                        />
                      ))}
                      {/* Baseline Line */}
                      <div className="absolute inset-x-0 bottom-0 border-t-2 border-[var(--color-border)]" />
                    </div>

                    {/* CAROUSEL PREVIOUS BUTTON */}
                    {canScrollLeft && (
                      <button
                        onClick={handleScrollLeft}
                        aria-label="Scroll left"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 rounded-full bg-[var(--color-surface)]/95 border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-lg backdrop-blur-md opacity-0 group-hover/chart:opacity-100 hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-all duration-300 cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}

                    {/* CAROUSEL NEXT BUTTON */}
                    {canScrollRight && (
                      <button
                        onClick={handleScrollRight}
                        aria-label="Scroll right"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 rounded-full bg-[var(--color-surface)]/95 border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-lg backdrop-blur-md opacity-0 group-hover/chart:opacity-100 hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-all duration-300 cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}

                    {/* Scrollable Container without default scrollbar */}
                    <div
                      ref={scrollRef}
                      onScroll={checkScroll}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUpOrLeave}
                      onMouseLeave={handleMouseUpOrLeave}
                      className="relative flex-1 h-full overflow-x-auto no-scrollbar touch-pan-x cursor-grab active:cursor-grabbing select-none"
                    >
                      {/* Vertical Bars Container */}
                      <div
                        key={selectedCategory}
                        className="relative z-10 w-full h-full flex items-end justify-around gap-4 sm:gap-6 min-w-max"
                      >
                        {filteredSkills.map((skill, index) => {
                          const levelLabel = getLevelLabel(skill.level);

                          return (
                            <div
                              key={skill.id}
                              className="relative flex flex-col items-center justify-end h-full w-[90px] sm:w-[110px] max-w-[120px] shrink-0 group"
                            >
                              {/* FLOATING LEVEL BADGE ON HOVER */}
                              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 group-hover:-top-8 transition-all duration-300 z-30 pointer-events-none">
                                <div className="bg-[var(--color-accent)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                                  {levelLabel} ({skill.level}%)
                                </div>
                              </div>

                              {/* BAR COLUMN CARD WITH HOVER EFFECT & INITIAL BOTTOM-UP ANIMATION */}
                              <motion.div
                                initial={{ height: '0%', opacity: 0 }}
                                whileInView={{ height: `${skill.level}%`, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.85,
                                  delay: index * 0.08,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="w-full relative isolate flex flex-col justify-end p-2 sm:p-3 rounded-t-xl rounded-b-none bg-[var(--color-surface)] transition-all duration-300 group-hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.35)] group-hover:-translate-y-1 overflow-hidden cursor-pointer"
                              >
                                {/* Default Static Border */}
                                <div className="absolute inset-0 -z-10 rounded-t-xl rounded-b-none border border-b-0 border-[var(--color-border)] group-hover:border-transparent transition-colors" />

                                {/* Rotating Light Beam Gradient Border on Hover */}
                                <div
                                  className="absolute inset-0 -z-10 rounded-t-xl rounded-b-none p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-border-spin"
                                  style={{
                                    '--gradient-angle': '0deg',
                                    background: gradientString,
                                  } as React.CSSProperties}
                                />

                                {/* Inner Surface Mask */}
                                <div className="absolute inset-[1px] bottom-0 -z-10 rounded-t-[11px] rounded-b-none bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/90 to-[var(--color-accent)]/20" />

                                {/* Subtle Inner Glow Overlay */}
                                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.25)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-xl rounded-b-none" />

                                {/* Gradient Fill Accent Line at top of bar */}
                                <div className="absolute top-0 inset-x-0 h-1 bg-[var(--color-accent)] rounded-t-xl group-hover:h-1.5 transition-all duration-300" />

                                {/* CONTENT INSIDE BAR (PERCENTAGE & ICON & NAME) */}
                                <div className="relative z-20 flex flex-col items-center justify-end h-full text-center gap-1 sm:gap-1.5 pb-1.5">
                                  {/* Icon */}
                                  {skill.icon ? (
                                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0 drop-shadow">
                                      <Image
                                        src={skill.icon}
                                        alt={`${skill.name} icon`}
                                        fill
                                        unoptimized
                                        className="object-contain pointer-events-none"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[var(--color-border)]/80 flex items-center justify-center shrink-0">
                                      <span className="text-[10px] sm:text-xs font-bold text-[var(--color-text-primary)]">
                                        {skill.name.charAt(0)}
                                      </span>
                                    </div>
                                  )}

                                  {/* Large Percentage */}
                                  <div className="text-base sm:text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] group-hover:scale-110 transition-transform duration-300">
                                    {skill.level}
                                    <span className="text-xs sm:text-sm font-semibold opacity-75 ml-0.5">%</span>
                                  </div>

                                  {/* Skill Name */}
                                  <div className="text-[11px] sm:text-xs font-medium text-[var(--color-text-primary)] line-clamp-2 px-1 max-w-full leading-tight">
                                    {skill.name}
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
