'use client';

import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
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
  const cardRef = useRef<HTMLAnchorElement>(null);
  
  // Local mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothing the tilt
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const fallbackMouse = useMotionValue(0);
  const [elementOffset, setElementOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
      rgba(255, 255, 255, 0.04),
      transparent 80%
    )
  `;

  return (
    <motion.a
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileInView="show"
      viewport={{ once: true }}
      onViewportEnter={(entry) => {
        if (entry?.target) {
          const rect = entry.target.getBoundingClientRect();
          // We need to account for the grid parent offset
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
        stiffness: 70,
        damping: 24,
        mass: 1.2
      }}
      whileHover={{ scale: 1.01 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={cn(
        "relative group overflow-hidden flex flex-col justify-between",
        "bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 transition-all duration-700 ease-[var(--ease-out-expo)] rounded-3xl",
        "group-hover/grid:opacity-40 hover:!opacity-100",
        cardStyles[project.size]
      )}
    >
      {/* Global Spotlight Effect */}
      {spotlight && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover/grid:opacity-100 transition duration-500"
          style={{ background: spotlightBg }}
        />
      )}

      {/* Local Hover Gradient (complementary) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[var(--ease-out-expo)]" />
      
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
