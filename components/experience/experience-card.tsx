import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight, Building2 } from 'lucide-react';

interface ExperienceCardProps {
  experience: {
    id: string;
    company: string;
    position: string;
    description: string;
    startDate: Date;
    endDate: Date | null;
    images: string[];
  };
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const start = formatDate(new Date(experience.startDate));
  const end = experience.endDate ? formatDate(new Date(experience.endDate)) : 'Present';
  const thumbnail = experience.images && experience.images.length > 0 ? experience.images[0] : null;

  return (
    <div className="relative pl-8 md:pl-0">
      {/* Timeline connector dot for mobile layout */}
      <div className="absolute left-3 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--color-primary)] z-10 md:hidden"></div>
      
      <div className="md:grid md:grid-cols-[250px_1fr] md:gap-8 lg:gap-12 md:items-start relative">
        <div className="hidden md:flex flex-col text-[var(--color-text-secondary)] text-sm sticky top-24 pt-2 pr-6 relative">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="font-mono">{start} &ndash; {end}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="font-medium text-[var(--color-text-primary)]">{experience.company}</span>
          </div>
          <div className="absolute right-0 translate-x-1/2 top-4 h-3 w-3 rounded-full bg-[var(--color-primary)] z-10"></div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors duration-300">
          <div className="md:hidden flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
            <Calendar className="w-4 h-4" />
            <span>{start} &ndash; {end}</span>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold font-[family-name:var(--font-heading)] text-[var(--color-text-primary)] mb-1">
            {experience.position}
          </h3>
          <p className="text-[var(--color-primary)] font-medium mb-4 md:hidden">
            {experience.company}
          </p>

          <p className="text-[var(--color-text-secondary)] line-clamp-3 mb-6">
            {experience.description}
          </p>

          {thumbnail && (
            <div className="relative w-24 h-24 mb-6 rounded-lg overflow-hidden border border-[var(--color-border)]">
              <Image 
                src={thumbnail} 
                alt={`${experience.company} thumbnail`}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}

          <Link 
            href={`/experience/${experience.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors"
          >
            View Details
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
