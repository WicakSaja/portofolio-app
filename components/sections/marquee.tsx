interface MarqueeProps {
  skills: { name: string }[];
}

export function Marquee({ skills }: MarqueeProps) {
  if (!skills || skills.length === 0) return null;

  const content = skills.map((skill, index) => (
    <span key={index} className="inline-flex items-center">
      <span className="mx-4">{skill.name}</span>
      <span className="text-xs opacity-75">✦</span>
    </span>
  ));

  return (
    <div className="w-full overflow-hidden bg-[var(--color-accent)] text-white py-3 flex">
      <div className="animate-marquee flex whitespace-nowrap uppercase font-semibold tracking-wider text-sm min-w-full">
        {content}
      </div>
      <div className="animate-marquee flex whitespace-nowrap uppercase font-semibold tracking-wider text-sm min-w-full" aria-hidden="true">
        {content}
      </div>
    </div>
  );
}
