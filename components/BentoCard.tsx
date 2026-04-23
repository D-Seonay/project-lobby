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
    small: 'col-span-1 row-span-1 p-6',
    wide: 'col-span-2 row-span-1 p-8',
    big: 'col-span-2 row-span-2 p-12',
  };

  const titleStyles = {
    small: 'text-xl',
    wide: 'text-2xl',
    big: 'text-4xl',
  };

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative group rounded-3xl overflow-hidden flex flex-col justify-between",
        "bg-zinc-950 border border-white/5 hover:border-white/10 transition-all duration-1000",
        cardStyles[project.size],
        project.bg
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition-colors duration-1000">
          {Icon && <Icon className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors duration-1000" />}
        </div>
        {project.isLive && <StatusBadge />}
      </div>

      <div className="relative z-10 mt-8">
        <h3 className={cn(
          "font-black tracking-tighter text-white uppercase leading-none",
          titleStyles[project.size]
        )}>
          {project.title}
        </h3>
        <p className="text-xs font-mono text-zinc-500 mt-3 uppercase tracking-[0.2em] leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.a>
  );
}
