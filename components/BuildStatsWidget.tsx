'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useSpotlight } from './SpotlightGrid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STATS = [
  { label: 'Active_Deployments', value: 12, max: 20, unit: '' },
  { label: 'Commit_Velocity', value: 85, max: 100, unit: '%' },
  { label: 'Monthly_Builds', value: 428, max: 500, unit: '' },
];

export function BuildStatsWidget({ size = 'small' }: { size?: 'small' | 'wide' | 'big' }) {
  const spotlight = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const fallbackMouse = useMotionValue(0);
  const [elementOffset, setElementOffset] = useState({ x: 0, y: 0 });

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
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
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
      transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative group overflow-hidden flex flex-col justify-between cursor-pointer transition-colors duration-500",
        "bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] hover:border-zinc-400 dark:bg-zinc-950/50 dark:border-white/5 dark:hover:border-white/20 rounded-3xl",
        cardStyles[size]
      )}
    >
      {spotlight && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"
          style={{ background: spotlightBg }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(50px)' }}>
        <div className="text-[var(--meta)] group-hover:text-[var(--fg)] transition-colors duration-800">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-widest">Sys_Status</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Live</span>
          </div>
        </div>
      </div>

      <div className="relative z-20 space-y-4 my-2" style={{ transform: 'translateZ(60px)' }}>
        {STATS.map((stat, i) => (
          <div key={stat.label} className="space-y-1.5">
            <div className="flex justify-between items-end">
              <span className="text-[8px] font-mono text-[var(--meta)] uppercase tracking-wider">{stat.label}</span>
              <span className="text-[10px] font-black text-[var(--fg)] font-mono">{stat.value}{stat.unit}</span>
            </div>
            <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                className="h-full bg-[var(--fg)] opacity-80"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-auto" style={{ transform: 'translateZ(50px)' }}>
        <h3 className={cn(
          "font-black tracking-tighter text-[var(--fg)] uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700",
          titleStyles[size]
        )}>
          Telemetry
        </h3>
        <p className="text-[9px] font-mono text-[var(--meta)] group-hover:text-[var(--fg)] transition-all duration-700 uppercase tracking-[0.3em] mt-3 opacity-60 group-hover:opacity-100 line-clamp-1">
          Build_Stats_v2.0.4 // monitor
        </p>
      </div>
    </motion.div>
  );
}
