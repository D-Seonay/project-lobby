'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useSpotlight } from './SpotlightGrid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SKILLS = [
  { name: 'TypeScript', value: 0.9, angle: -90 },
  { name: 'React', value: 0.95, angle: -18 },
  { name: 'Design', value: 0.7, angle: 54 },
  { name: 'Backend', value: 0.85, angle: 126 },
  { name: 'DevOps', value: 0.6, angle: 198 },
];

export function TechRadarWidget({ size = 'wide' }: { size?: 'small' | 'wide' | 'big' }) {
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

  const centerX = 50;
  const centerY = 50;
  const maxRadius = 40;

  const getPoint = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  };

  const polygonPoints = SKILLS.map(s => {
    const p = getPoint(s.angle, s.value * maxRadius);
    return `${p.x},${p.y}`;
  }).join(' ');

  const gridCircles = [0.25, 0.5, 0.75, 1];

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
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-widest">Stack_Analysis</span>
          <span className={cn(
            "font-black text-[var(--fg)] italic uppercase",
            size === 'small' ? "text-sm" : "text-xl"
          )}>Tech Radar</span>
        </div>
      </div>

      <div className="relative z-20 flex justify-center items-center my-4" style={{ transform: 'translateZ(60px)' }}>
        <svg viewBox="0 0 100 100" className={cn(
          "drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-500",
          size === 'small' ? "w-24 h-24" : size === 'wide' ? "w-32 h-32" : "w-48 h-48"
        )}>
          {/* Grid Circles */}
          {gridCircles.map((r, i) => (
            <circle
              key={i}
              cx={centerX}
              cy={centerY}
              r={r * maxRadius}
              fill="none"
              className="stroke-[var(--meta)] opacity-20"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Axis lines */}
          {SKILLS.map((s, i) => {
            const p = getPoint(s.angle, maxRadius);
            return (
              <line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={p.x}
                y2={p.y}
                className="stroke-[var(--meta)] opacity-20"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Radar Polygon */}
          <motion.polygon
            points={polygonPoints}
            className="fill-[var(--fg)] opacity-20 stroke-[var(--fg)]"
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Radar Vertices */}
          {SKILLS.map((s, i) => {
            const p = getPoint(s.angle, s.value * maxRadius);
            return (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="1.5"
                className="fill-[var(--fg)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              />
            );
          })}

          {/* Labels */}
          {size !== 'small' && SKILLS.map((s, i) => {
            const p = getPoint(s.angle, maxRadius + 8);
            return (
              <text
                key={i}
                x={p.x}
                y={p.y}
                className="fill-[var(--meta)] text-[4px] font-mono uppercase tracking-tighter"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {s.name}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="relative z-10 mt-auto" style={{ transform: 'translateZ(50px)' }}>
        <h3 className={cn(
          "font-black tracking-tighter text-[var(--fg)] uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700",
          titleStyles[size]
        )}>
          Expertise_Map
        </h3>
        <p className="text-[9px] font-mono text-[var(--meta)] group-hover:text-[var(--fg)] transition-all duration-700 uppercase tracking-[0.3em] mt-3 opacity-60 group-hover:opacity-100 line-clamp-1">
          {SKILLS.map(s => s.name.slice(0, 2)).join(' / ')} // core_stack
        </p>
      </div>
    </motion.div>
  );
}
