"use client";

import React from 'react';
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

export function LightBeamButton({ 
  children, 
  className, 
  onClick,
  href,
  target,
  rel,
  gradientColors = ["#8b5cf6", "#06b6d4", "#8b5cf6"],
  ...props 
}: LightBeamButtonProps) {
  const gradientString = `conic-gradient(from 0deg, transparent 0%, ${gradientColors[0]} 40%, ${gradientColors[1]} 50%, transparent 60%, transparent 100%)`;

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2 font-medium">{children}</span>
      
      {/* 100% GPU-Accelerated Rotating Beam Border */}
      <div className="absolute inset-0 -z-20 overflow-hidden rounded-full p-[1px]">
        <div 
          className="absolute -inset-[100%] animate-[spin_3s_linear_infinite]"
          style={{
            background: gradientString,
            transformOrigin: "center center",
            willChange: "transform"
          }}
        />
      </div>
      
      {/* Inner Mask (creates 1px border effect) */}
      <div className="absolute inset-[1px] -z-10 rounded-full bg-neutral-950" />
      
      {/* Subtle Shine Overlay on Hover */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.15)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
    </>
  );

  const baseClassName = cn(
    "group relative isolate overflow-hidden rounded-full bg-neutral-950 px-8 py-3 text-sm font-medium text-white transition-transform duration-200 hover:bg-neutral-900",
    "shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.5)] cursor-pointer inline-flex items-center justify-center gap-2",
    "hover:scale-105 active:scale-95",
    className
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick as any}
        className={baseClassName}
        style={{ transform: 'translateZ(0)' }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={baseClassName}
      style={{ transform: 'translateZ(0)' }}
      {...(props as any)}
    >
      {content}
    </button>
  );
}

export default LightBeamButton;
