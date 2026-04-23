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
        "bg-zinc-900 border border-white/[0.05] hover:border-white/20 transition-all duration-1000 rounded-sm stealth-glow",
        cardStyles[project.size]
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="text-white/20 group-hover:text-white/80 transition-colors duration-1000">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {project.isLive && <StatusBadge />}
      </div>

      <div className="relative z-10 mt-12 space-y-4">
        <h3 className={cn(
          "font-black tracking-tighter text-white uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-1000",
          titleStyles[project.size]
        )}>
          {project.title}
        </h3>
        <p className="text-[10px] font-mono text-white/30 group-hover:text-white/60 transition-colors duration-1000 uppercase tracking-[0.3em] leading-relaxed max-w-[90%]">
          {project.description}
        </p>
      </div>
    </motion.a>
  );
}
