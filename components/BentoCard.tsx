'use client';

import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Project } from '@/types/project';
import { StatusBadge } from './StatusBadge';
import * as Icons from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSpotlight } from './SpotlightGrid';
import { useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function BentoCard({ project }: { project: Project }) {
  const Icon = project.icon ? (Icons as any)[project.icon] : null;
  const spotlight = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const fallbackMouse = useMotionValue(0);
  const [elementOffset, setElementOffset] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsOpen] = useState(false);

  // Local mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothing the tilt
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXRelative = (e.clientX - rect.left) / width - 0.5;
    const mouseYRelative = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(mouseXRelative);
    mouseY.set(mouseYRelative);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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

  // Track relative mouse position for the internal spotlight
  const relativeMouseX = useTransform(spotlight?.mouseX || fallbackMouse, (val) => val - elementOffset.x);
  const relativeMouseY = useTransform(spotlight?.mouseY || fallbackMouse, (val) => val - elementOffset.y);

  const spotlightBg = useMotionTemplate`
    radial-gradient(
      450px circle at ${relativeMouseX}px ${relativeMouseY}px,
      var(--spotlight-color),
      transparent 80%
    )
  `;

  return (
    <>
      <motion.div
        ref={cardRef}
        layoutId={`card-${project.id}`}
        onClick={() => setIsOpen(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          zIndex: isExpanded ? 40 : 0,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        onViewportEnter={(entry) => {
          if (entry?.target) {
            const rect = entry.target.getBoundingClientRect();
            if (spotlight?.gridRef.current) {
              const gridRect = spotlight.gridRef.current.getBoundingClientRect();
              setElementOffset({
                x: rect.left - gridRect.left,
                y: rect.top - gridRect.top
              });
            }
          }
        }}
        variants={{
          hidden: { opacity: 0, y: 30, scale: 0.94 },
          show: { opacity: 1, y: 0, scale: 1 }
        }}
        transition={{ 
          type: "spring",
          stiffness: 400,
          damping: 40,
          mass: 1
        }}
        whileHover={{ y: -4 }}
        className={cn(
          "relative group overflow-hidden flex flex-col justify-between cursor-pointer",
          "bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors duration-700 rounded-3xl",
          cardStyles[project.size]
        )}
      >
        {spotlight && (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover/grid:opacity-100 transition duration-500"
            style={{ background: spotlightBg }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative z-10 flex justify-between items-start">
          <motion.div layoutId={`icon-${project.id}`} className="text-zinc-600 group-hover:text-zinc-200 transition-colors duration-700">
            {Icon && <Icon className="w-5 h-5" />}
          </motion.div>
          {project.isLive && <StatusBadge url={project.link} />}
        </div>

        <div className="relative z-10 mt-12 space-y-4">
          <motion.h3 layoutId={`title-${project.id}`} className={cn(
            "font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700",
            titleStyles[project.size]
          )}>
            {project.title}
          </motion.h3>
          
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag) => (
              <span key={tag} className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-zinc-500 uppercase tracking-widest group-hover:border-white/10 group-hover:text-zinc-400 transition-all">
                {tag}
              </span>
            ))}
          </div>

          <motion.p layoutId={`desc-${project.id}`} className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors duration-700 uppercase tracking-[0.3em] leading-relaxed max-w-[90%] line-clamp-2">
            {project.description}
          </motion.p>
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] cursor-zoom-out"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-8 lg:p-24 z-[201] pointer-events-none">
              <motion.div
                layoutId={`card-${project.id}`}
                transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-5xl h-full max-h-[800px] rounded-[40px] overflow-hidden pointer-events-auto flex flex-col md:flex-row shadow-2xl"
              >
                <div className="flex-1 p-8 sm:p-12 lg:p-20 flex flex-col justify-between relative overflow-y-auto">
                  <motion.button 
                    layout
                    onClick={() => setIsOpen(false)}
                    className="absolute top-8 right-8 p-3 rounded-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all hover:rotate-90"
                  >
                    <Icons.X className="w-5 h-5" />
                  </motion.button>

                  <div>
                    <motion.div layoutId={`icon-${project.id}`} className="text-zinc-900/20 dark:text-white/20 mb-12">
                      {Icon && <Icon className="w-12 h-12" />}
                    </motion.div>
                    
                    <motion.h3 layoutId={`title-${project.id}`} className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase italic leading-[0.8] mb-8">
                      {project.title}
                    </motion.h3>

                    <motion.div layout className="flex flex-wrap gap-3 mb-12">
                      {project.tags?.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 uppercase tracking-[0.2em]">
                          {tag}
                        </span>
                      ))}
                    </motion.div>

                    <motion.p layoutId={`desc-${project.id}`} className="text-sm sm:text-lg font-mono text-zinc-500 uppercase tracking-widest leading-relaxed max-w-2xl">
                      {project.description}
                    </motion.p>
                  </div>

                  <motion.div layout className="mt-12 pt-12 border-t border-zinc-900 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      className="px-8 py-4 bg-zinc-100 text-zinc-950 font-black uppercase italic tracking-tighter hover:bg-white transition-all rounded-sm flex items-center gap-4"
                    >
                      Access_Project <Icons.ArrowRight className="w-4 h-4" />
                    </a>
                    {project.isLive && <StatusBadge url={project.link} />}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
