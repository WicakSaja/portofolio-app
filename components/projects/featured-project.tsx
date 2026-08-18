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
    skills?: { id: string; name: string }[];
  };
}

export function FeaturedProject({ project }: FeaturedProjectProps) {
  const coverImage = project.thumbnail || (project.images && project.images.length > 0 ? project.images[0] : null);

  return (
    <div className="flex flex-col lg:flex-row bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden mb-12">
      <div className="w-full lg:w-[60%] relative aspect-[4/3] lg:aspect-auto overflow-hidden group">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={project.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full min-h-[300px] bg-[var(--color-background)] flex items-center justify-center text-[var(--color-text-secondary)]">
            No image
          </div>
        )}
      </div>

      <div className="w-full lg:w-[40%] p-8 lg:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-[var(--color-accent)] text-white text-xs font-bold tracking-wider uppercase rounded-full">
            Featured
          </span>
          <span className="text-[var(--color-primary)] text-sm font-medium">
            {project.category}
          </span>
        </div>

        <h3 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-heading)] text-[var(--color-text-primary)] mb-6">
          {project.title}
        </h3>

        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
          {project.description}
        </p>

        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 px-3 py-1 text-xs font-medium text-[var(--color-accent)]"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-auto">
          <Link 
            href={`/projects/${project.id}`}
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-text-primary)] text-[var(--color-surface)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          {project.github && (
            <a 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] px-4 py-3 rounded-lg font-medium hover:bg-[var(--color-background)] hover:border-[var(--color-primary)] transition-all"
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
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] px-4 py-3 rounded-lg font-medium hover:bg-[var(--color-background)] hover:border-[var(--color-primary)] transition-all"
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
