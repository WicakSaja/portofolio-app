interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-12 max-w-2xl">
      <span
        className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </span>
      <h2
        className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-[var(--color-text-secondary)]">
          {description}
        </p>
      )}
    </div>
  );
}
