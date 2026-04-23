'use client';

import { motion } from 'framer-motion';
import { Project } from '@/types/project';
import { StatusBadge } from './StatusBadge';
import * as Icons from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function BentoCard({ project }: { project: Project }) {
  const Icon = project.icon ? (Icons as any)[project.icon] : null;

  const cardStyles = {
    small: 'lg:col-span-1 lg:row-span-1 p-6 sm:p-8 lg:p-12',
    wide: 'sm:col-span-2 lg:col-span-2 lg:row-span-1 p-6 sm:p-8 lg:p-12',
    big: 'sm:col-span-2 lg:col-span-2 sm:row-span-2 p-6 sm:p-8 lg:p-12',
  };

  const titleStyles = {
    small: 'text-xl sm:text-2xl',
    wide: 'text-xl sm:text-3xl',
    big: 'text-3xl sm:text-5xl',
  };

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.94 },
        show: { opacity: 1, y: 0, scale: 1 }
      }}
      transition={{ 
        type: "spring",
        stiffness: 70,
        damping: 24,
        mass: 1.2
      }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative group overflow-hidden flex flex-col justify-between",
        "bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 transition-colors duration-700 ease-[var(--ease-out-expo)] rounded-3xl",
        cardStyles[project.size]
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[var(--ease-out-expo)]" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="text-zinc-600 group-hover:text-zinc-200 transition-colors duration-700 ease-[var(--ease-out-expo)]">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {project.isLive && <StatusBadge url={project.link} />}
      </div>

      <div className="relative z-10 mt-12 space-y-4">
        <h3 className={cn(
          "font-black tracking-tighter text-zinc-100 uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700 ease-[var(--ease-out-expo)]",
          titleStyles[project.size]
        )}>
          {project.title}
        </h3>
        <p className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors duration-700 ease-[var(--ease-out-expo)] uppercase tracking-[0.3em] leading-relaxed max-w-[90%]">
          {project.description}
        </p>
      </div>
    </motion.a>
  );
}
