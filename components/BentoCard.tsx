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
      whileHover={{ scale: 1.02, rotate: 0.5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative group p-6 rounded-3xl overflow-hidden flex flex-col justify-between",
        "bg-zinc-900/50 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors",
        sizeClasses[project.size],
        project.bg
      )}
    >
      <div className="flex justify-between items-start">
        {Icon && <Icon className="w-6 h-6 text-white/70" />}
        {project.isLive && <StatusBadge />}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-white/60 mt-1">{project.description}</p>
      </div>
    </motion.a>
  );
}
