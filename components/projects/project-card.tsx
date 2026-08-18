import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    images: string[];
    thumbnail: string | null;
    category: string;
    github: string | null;
    demo: string | null;
    skills?: { id: string; name: string; icon?: string | null }[];
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const coverImage = project.thumbnail || (project.images && project.images.length > 0 ? project.images[0] : null);

  return (
    <div className="group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:shadow-lg hover:border-[var(--color-primary)] transition-all duration-300 flex flex-col h-full">
      <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10">
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
        
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-4">
            {project.skills.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-text-secondary)]"
              >
                {skill.icon && (
                  <div className="relative w-3 h-3 shrink-0">
                    <Image
                      src={skill.icon}
                      alt={`${skill.name} icon`}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                )}
                <span>{skill.name}</span>
              </span>
            ))}
            {project.skills.length > 3 && (
              <span className="text-[10px] text-[var(--color-text-secondary)] self-center font-medium">
                +{project.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const PortfolioCard = ProjectCard;
