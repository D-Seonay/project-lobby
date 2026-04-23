'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ProjectSkeleton({ size = 'small' }: { size?: 'small' | 'wide' | 'big' }) {
  const cardStyles = {
    small: 'lg:col-span-1 lg:row-span-1 p-6 sm:p-8 lg:p-12',
    wide: 'sm:col-span-2 lg:col-span-2 lg:row-span-1 p-6 sm:p-8 lg:p-12',
    big: 'sm:col-span-2 lg:col-span-2 sm:row-span-2 p-6 sm:p-8 lg:p-12',
  };

  return (
    <div className={cn(
      "relative overflow-hidden flex flex-col justify-between rounded-3xl bg-zinc-900/40 border border-zinc-800/50",
      cardStyles[size as keyof typeof cardStyles]
    )}>
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Icon Placeholder */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="w-5 h-5 bg-zinc-800 rounded-md" />
      </div>

      {/* Content Placeholders */}
      <div className="relative z-10 mt-12 space-y-4">
        {/* Title */}
        <div className={cn(
          "bg-zinc-800 rounded-lg",
          size === 'big' ? "h-12 w-3/4" : "h-8 w-2/3"
        )} />
        
        {/* Tags */}
        <div className="flex gap-2">
          <div className="w-12 h-4 bg-zinc-800/50 rounded-full" />
          <div className="w-16 h-4 bg-zinc-800/50 rounded-full" />
          <div className="w-10 h-4 bg-zinc-800/50 rounded-full" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-zinc-800/30 rounded" />
          <div className="w-4/5 h-3 bg-zinc-800/30 rounded" />
        </div>
      </div>
    </div>
  );
}
