import Image from 'next/image';
import Link from 'next/link';

interface PortfolioCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    images: string[];
    thumbnail: string | null;
    category: string;
    github: string | null;
    demo: string | null;
  };
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  const coverImage = project.thumbnail || (project.images && project.images.length > 0 ? project.images[0] : null);

  return (
    <div className="group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:shadow-lg hover:border-[var(--color-primary)] transition-all duration-300 flex flex-col h-full">
      <Link href={`/portfolio/${project.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {project.title} details</span>
      </Link>
      
      {coverImage ? (
        <div className="relative w-full aspect-video overflow-hidden border-b border-[var(--color-border)]">
          <Image
            src={coverImage}
            alt={project.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full aspect-video bg-[var(--color-background)] border-b border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)]">
          No image
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-background)] text-[var(--color-primary)] text-xs font-medium border border-[var(--color-border)]">
            {project.category}
          </span>
        </div>
        <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-[var(--color-text-primary)] mb-2">
          {project.title}
        </h3>
        <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2 mt-auto">
          {project.description}
        </p>
      </div>
    </div>
  );
}
