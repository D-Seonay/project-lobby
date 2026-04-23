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

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    wide: 'col-span-2 row-span-1',
    big: 'col-span-2 row-span-2',
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
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative group p-8 rounded-3xl overflow-hidden flex flex-col justify-between",
        "bg-zinc-950 border border-white/5 hover:border-white/10 transition-all duration-500",
        sizeClasses[project.size],
        project.bg
      )}
    >
      <div className="flex justify-between items-start">
        {Icon && <Icon className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />}
        {project.isLive && <StatusBadge />}
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
          {project.title}
        </h3>
        <p className="text-xs font-mono text-zinc-500 mt-2 uppercase tracking-wider">{project.description}</p>
      </div>
    </motion.a>
  );
}
