'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProjectSkeletonProps {
  size: 'small' | 'wide' | 'big' | 'xl';
}

export function ProjectSkeleton({ size }: ProjectSkeletonProps) {
  const cardStyles = {
    small: 'col-span-1 row-span-1 p-6',
    wide: 'col-span-2 row-span-1 p-6',
    big: 'col-span-2 row-span-2 p-8',
    xl: 'col-span-4 row-span-2 p-10',
  };

  return (
    <div
      className={cn(
        "relative group overflow-hidden flex flex-col justify-between",
        "bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl",
        cardStyles[size]
      )}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[var(--fg)] opacity-[0.03] to-transparent animate-shimmer" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="w-10 h-10 bg-[var(--accent)] rounded-xl opacity-20" />
        <div className="w-20 h-6 bg-[var(--accent)] rounded-full opacity-10" />
      </div>

      <div className="relative z-10 mt-12 space-y-4">
        <div className={cn(
          "bg-[var(--accent)] rounded-lg opacity-20",
          size === 'big' ? 'h-12 w-3/4' : 'h-8 w-1/2',
          size === 'xl' ? 'h-12 w-3/4' : 'h-8 w-1/2'
        )} />

        <div className="flex gap-2">
          <div className="h-4 w-12 bg-[var(--accent)] rounded-full opacity-10" />
          <div className="h-4 w-16 bg-[var(--accent)] rounded-full opacity-10" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full bg-[var(--accent)] rounded opacity-10" />
          <div className="h-3 w-5/6 bg-[var(--accent)] rounded opacity-10" />
        </div>
      </div>
    </div>
  );
}
