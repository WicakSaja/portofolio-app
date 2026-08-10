"use client";

import React from 'react';
// Framer Motion removed – using CSS hover scaling
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LightBeamButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  gradientColors?: [string, string, string];
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * LightBeamButton
 * 
 * A high-performance button with a rotating light beam border effect.
 * Uses CSS @property for smooth gradient rotation animations on the border.
 */
export function LightBeamButton({ 
  children, 
  className, 
  onClick,
  href,
  target,
  rel,
  gradientColors = ["#8b5cf6", "#06b6d4", "#8b5cf6"], // Violet -> Cyan -> Violet
  ...props 
}: LightBeamButtonProps) {
  const gradientString = `conic-gradient(from var(--gradient-angle), transparent 0%, ${gradientColors[0]} 40%, ${gradientColors[1]} 50%, transparent 60%, transparent 100%)`;

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2 font-medium">{children}</span>
      
      {/* Gradient Border Simulation */}
      <div 
        className="absolute inset-0 -z-10 rounded-full p-[1px] animate-border-spin" 
        style={{ 
          '--gradient-angle': '0deg',
          background: gradientString
        } as React.CSSProperties} 
      />
      
      {/* Inner Background (keeps text readable) */}
      <div className="absolute inset-[1px] -z-10 rounded-full bg-neutral-950" />
      
      {/* Shine Effect Overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.15)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </>
  );

  const baseClassName = cn(
    "group relative isolate overflow-hidden rounded-full bg-neutral-950 px-8 py-3 text-sm font-medium text-white transition-transform hover:bg-neutral-900",
    "shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.5)] cursor-pointer inline-flex items-center justify-center gap-2",
    "hover:scale-105 active:scale-95",
    className
  );

  return (
    <>
      <style>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-spin {
          from { --gradient-angle: 0deg; }
          to { --gradient-angle: 360deg; }
        }
        .animate-border-spin {
          animation: border-spin 2s linear infinite;
        }
      `}</style>
      
      {href ? (
        <a
          href={href}
          target={target}
          rel={rel}
          onClick={onClick as any}
          className={baseClassName}
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        >
          {content}
        </a>
      ) : (
        <button
          onClick={onClick}
          className={baseClassName}
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
          {...(props as any)}
        >
          {content}
        </button>
      )}
    </>
  );
}

export default LightBeamButton;
