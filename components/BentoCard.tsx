'use client';

import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Project } from '@/types/project';
import { StatusBadge } from './StatusBadge';
import * as Icons from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSpotlight } from './SpotlightGrid';
import { useEffect, useState, useRef } from 'react';

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

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseXRelative = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseYRelative = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(mouseXRelative);
    mouseY.set(mouseYRelative);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const cardStyles = {
    small: 'col-span-1 row-span-1 p-6',
    wide: 'col-span-2 row-span-1 p-8',
    big: 'col-span-2 row-span-2 p-10',
  };

  const titleStyles = {
    small: 'text-lg sm:text-xl',
    wide: 'text-2xl sm:text-3xl',
    big: 'text-4xl sm:text-6xl',
  };

  const relativeMouseX = useTransform(spotlight?.mouseX || fallbackMouse, (val) => val - elementOffset.x);
  const relativeMouseY = useTransform(spotlight?.mouseY || fallbackMouse, (val) => val - elementOffset.y);

  const spotlightBg = useMotionTemplate`
    radial-gradient(
      350px circle at ${relativeMouseX}px ${relativeMouseY}px,
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
        transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
        whileHover={{ y: -4 }}
        className={cn(
          "relative group overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-800",
          "bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] hover:border-zinc-400 dark:bg-zinc-950/50 dark:border-white/5 dark:hover:border-white/20 rounded-3xl",
          "group-hover/grid:opacity-40 group-hover/grid:hover:opacity-100",
          cardStyles[project.size]
        )}
      >
        {spotlight && (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover/grid:opacity-100 transition duration-500"
            style={{ background: spotlightBg }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] dark:from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(40px)' }}>
          <motion.div layoutId={`icon-${project.id}`} className="text-[var(--meta)] group-hover:text-[var(--fg)] transition-colors duration-800">
            {Icon && <Icon className="w-5 h-5" />}
          </motion.div>
          {project.isLive && project.size !== 'small' && <StatusBadge url={project.link} />}
          {project.isLive && project.size === 'small' && (
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          )}
        </div>

        <div className="relative z-10 mt-auto space-y-4" style={{ transform: 'translateZ(50px)' }}>
          <div className="space-y-2">
            <motion.h3 layoutId={`title-${project.id}`} className={cn(
              "font-black tracking-tighter text-[var(--fg)] uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700",
              titleStyles[project.size]
            )}>
              {project.title}
            </motion.h3>
            
            {project.size !== 'small' && (
              <div className="flex flex-wrap gap-2">
                {project.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent)] border border-[var(--card-border)] text-[var(--meta)] uppercase tracking-widest group-hover:text-[var(--fg)] transition-all opacity-40 group-hover:opacity-100">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <motion.p layoutId={`desc-${project.id}`} className={cn(
            "font-mono text-[var(--meta)] group-hover:text-[var(--fg)] opacity-60 group-hover:opacity-100 transition-all duration-700 uppercase tracking-[0.2em] leading-relaxed max-w-[95%]",
            project.size === 'small' ? "text-[8px] line-clamp-1" : "text-[10px] line-clamp-2"
          )}>
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
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-[200] cursor-zoom-out"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[201] pointer-events-none">
              <motion.div
                layoutId={`card-${project.id}`}
                transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
                className="bg-[var(--bg)] border border-[var(--card-border)] w-full max-w-5xl h-fit rounded-[40px] overflow-hidden pointer-events-auto flex flex-col md:flex-row shadow-2xl"
              >
                <div className="flex-1 p-8 sm:p-12 lg:p-20 flex flex-col justify-between relative overflow-y-auto">
                  <motion.button 
                    layout
                    onClick={() => setIsOpen(false)}
                    className="absolute top-8 right-8 p-3 rounded-full bg-[var(--accent)] border border-[var(--card-border)] text-[var(--meta)] hover:text-[var(--fg)] transition-all hover:rotate-90"
                  >
                    <Icons.X className="w-5 h-5" />
                  </motion.button>

                  <div>
                    <motion.div layoutId={`icon-${project.id}`} className="text-[var(--meta)] opacity-20 mb-12">
                      {Icon && <Icon className="w-12 h-12" />}
                    </motion.div>
                    
                    <motion.h3 layoutId={`title-${project.id}`} className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-[var(--fg)] uppercase italic leading-[0.8] mb-8">
                      {project.title}
                    </motion.h3>

                    <motion.div layout className="flex flex-wrap gap-3 mb-12">
                      {project.tags?.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono px-4 py-1.5 rounded-full bg-[var(--accent)] border border-[var(--card-border)] text-[var(--meta)] uppercase tracking-[0.2em]">
                          {tag}
                        </span>
                      ))}
                    </motion.div>

                    <motion.p layoutId={`desc-${project.id}`} className="text-sm sm:text-lg font-mono text-[var(--meta)] uppercase tracking-widest leading-relaxed max-w-2xl">
                      {project.description}
                    </motion.p>
                  </div>

                  <motion.div layout className="mt-12 pt-12 border-t border-[var(--card-border)] flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      className="px-8 py-4 bg-[var(--fg)] text-[var(--bg)] font-black uppercase italic tracking-tighter hover:opacity-90 transition-all rounded-sm flex items-center gap-4"
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
