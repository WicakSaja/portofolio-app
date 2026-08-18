interface SkillItem {
  name: string;
}

interface MarqueeProps {
  skills: SkillItem[];
}

export function Marquee({ skills }: MarqueeProps) {
  if (!skills || skills.length === 0) return null;

  // Ensure there are enough items to create a rich and seamless continuous strip on all screen sizes
  let repeatedList = [...skills];
  while (repeatedList.length < 10) {
    repeatedList = [...repeatedList, ...skills];
  }

  const renderTrackItems = () =>
    repeatedList.map((skill, index) => (
      <div
        key={index}
        className="flex items-center gap-6 sm:gap-10 shrink-0"
      >
        <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-white/95">
          {skill.name}
        </span>
        <span className="text-[10px] sm:text-xs text-white/50 select-none">✦</span>
      </div>
    ));

  return (
    <div className="w-full overflow-hidden bg-[var(--color-accent)] text-white py-3 sm:py-3.5 border-y border-white/10 shadow-sm select-none relative">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {/* Track 1 */}
        <div className="flex shrink-0 items-center gap-6 sm:gap-10 pr-6 sm:pr-10">
          {renderTrackItems()}
        </div>
        {/* Track 2 (Duplicate for seamless infinite loop) */}
        <div className="flex shrink-0 items-center gap-6 sm:gap-10 pr-6 sm:pr-10" aria-hidden="true">
          {renderTrackItems()}
        </div>
      </div>
    </div>
  );
}

