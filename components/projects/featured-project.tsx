import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Code, ArrowRight } from 'lucide-react';

interface FeaturedProjectProps {
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

export function FeaturedProject({ project }: FeaturedProjectProps) {
  const coverImage = project.thumbnail || (project.images && project.images.length > 0 ? project.images[0] : null);

  return (
    <div className="flex flex-col lg:flex-row bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden mb-12 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full lg:w-[55%] xl:w-[58%] relative aspect-video sm:aspect-[16/10] lg:aspect-auto min-h-[220px] sm:min-h-[300px] lg:min-h-[360px] bg-[var(--color-background)] overflow-hidden group">
        <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View {project.title} details</span>
        </Link>
        {coverImage ? (
          <Image
            src={coverImage}
            alt={project.title}
            fill
            unoptimized
            className="object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full min-h-[220px] bg-[var(--color-background)] flex items-center justify-center text-[var(--color-text-secondary)]">
            No image
          </div>
        )}
      </div>

      <div className="w-full lg:w-[45%] xl:w-[42%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[var(--color-accent)] text-white text-xs font-bold tracking-wider uppercase rounded-full">
              Featured
            </span>
            <span className="text-[var(--color-primary)] text-sm font-medium">
              {project.category}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] text-[var(--color-text-primary)] mb-3">
            <Link href={`/projects/${project.id}`} className="hover:text-[var(--color-primary)] transition-colors">
              {project.title}
            </Link>
          </h3>

          <p 
            className="text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed mb-6 line-clamp-3 sm:line-clamp-4"
            title={project.description}
          >
            {project.description}
          </p>

          {project.skills && project.skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {project.skills.slice(0, 6).map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {skill.icon && (
                    <div className="relative w-3.5 h-3.5 shrink-0">
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
              {project.skills.length > 6 && (
                <span className="text-xs text-[var(--color-text-secondary)] self-center font-medium">
                  +{project.skills.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
          <Link 
            href={`/projects/${project.id}`}
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-text-primary)] text-[var(--color-surface)] px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors relative z-20"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          {project.github && (
            <a 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg font-medium hover:bg-[var(--color-background)] hover:border-[var(--color-primary)] transition-all relative z-20"
              aria-label="GitHub Repository"
            >
              <Code className="w-4 h-4" />
              <span className="sr-only">GitHub</span>
            </a>
          )}
          
          {project.demo && (
            <a 
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg font-medium hover:bg-[var(--color-background)] hover:border-[var(--color-primary)] transition-all relative z-20"
              aria-label="Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="sr-only">Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
