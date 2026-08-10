"use client";

import { useState, useMemo } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { CategoryFilter } from '@/components/portfolio/category-filter';
import { FeaturedProject } from '@/components/portfolio/featured-project';
import { PortfolioCard } from '@/components/portfolio/portfolio-card';

interface PortfolioSectionProps {
  projects: {
    id: string;
    title: string;
    description: string;
    images: string[];
    thumbnail: string | null;
    category: string;
    featured: boolean;
    github: string | null;
    demo: string | null;
  }[];
}

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(projects.map(p => p.category)));
    return uniqueCats;
  }, [projects]);

  if (!projects || projects.length === 0) {
    return null;
  }

  const filteredProjects = projects.filter(p => 
    selectedCategory === 'All' ? true : p.category === selectedCategory
  );

  const firstFeatured = projects.find(p => p.featured);
  
  const remainingProjects = filteredProjects.filter(p => p.id !== firstFeatured?.id);

  return (
    <section id="portfolio" className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-6">
      <SectionHeader label="04 — PORTFOLIO" title="Featured Projects" />
      
      <div className="mt-8 mb-12">
        <CategoryFilter 
          categories={categories} 
          selected={selectedCategory} 
          onSelect={setSelectedCategory} 
        />
      </div>

      {firstFeatured && (selectedCategory === 'All' || firstFeatured.category === selectedCategory) && (
        <FeaturedProject project={firstFeatured} />
      )}

      {remainingProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingProjects.map(project => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      )}
      
      {remainingProjects.length === 0 && (!firstFeatured || (firstFeatured.category !== selectedCategory && selectedCategory !== 'All')) && (
        <div className="text-center py-20 text-[var(--color-text-secondary)]">
          No projects found in this category.
        </div>
      )}
    </section>
  );
}
