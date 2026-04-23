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
    small: 'col-span-1 row-span-1 p-8',
    wide: 'col-span-2 row-span-1 p-10',
    big: 'col-span-2 row-span-2 p-12',
  };

  const titleStyles = {
    small: 'text-2xl',
    wide: 'text-3xl',
    big: 'text-6xl',
  };

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative group overflow-hidden flex flex-col justify-between",
        "bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 transition-all duration-700 rounded-3xl stealth-glow",
        cardStyles[project.size]
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="text-zinc-500 group-hover:text-zinc-200 transition-colors duration-700">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {project.isLive && <StatusBadge />}
      </div>

      <div className="relative z-10 mt-12 space-y-4">
        <h3 className={cn(
          "font-black tracking-tighter text-zinc-100 uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700",
          titleStyles[project.size]
        )}>
          {project.title}
        </h3>
        <p className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors duration-700 uppercase tracking-[0.3em] leading-relaxed max-w-[90%]">
          {project.description}
        </p>
      </div>
    </motion.a>
  );
}
