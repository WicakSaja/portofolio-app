"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const allCategories = ['All', ...categories.filter(c => c !== 'All')];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {allCategories.map(category => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selected === category
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
