'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useSpotlight } from './SpotlightGrid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function MoonPhaseWidget({ size = 'small' }: { size?: 'small' | 'wide' | 'big' }) {
  const [phase, setPhase] = useState<number>(0);
  const [phaseName, setPhaseName] = useState<string>('');
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
    wide: 'col-span-2 row-span-1 p-6',
    big: 'col-span-2 row-span-2 p-8',
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

  useEffect(() => {
    const calculateMoonPhase = () => {
      const date = new Date();
      const referenceDate = new Date('2000-01-06T18:14:00Z');
      const diff = (date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
      const lp = 2551442.8; // Lunar period in seconds
      const phaseValue = (diff / 29.530588853) % 1;
      const normalizedPhase = phaseValue < 0 ? phaseValue + 1 : phaseValue;
      
      setPhase(normalizedPhase);

      // Determine phase name
      if (normalizedPhase < 0.03 || normalizedPhase > 0.97) setPhaseName('New_Moon');
      else if (normalizedPhase < 0.22) setPhaseName('Waxing_Crescent');
      else if (normalizedPhase < 0.28) setPhaseName('First_Quarter');
      else if (normalizedPhase < 0.47) setPhaseName('Waxing_Gibbous');
      else if (normalizedPhase < 0.53) setPhaseName('Full_Moon');
      else if (normalizedPhase < 0.72) setPhaseName('Waning_Gibbous');
      else if (normalizedPhase < 0.78) setPhaseName('Last_Quarter');
      else setPhaseName('Waning_Crescent');
    };

    calculateMoonPhase();
    const timer = setInterval(calculateMoonPhase, 3600000); // Update every hour
    return () => clearInterval(timer);
  }, []);

  // Function to generate moon path based on phase
  // Phase 0-1: 0 (New), 0.5 (Full), 1 (New)
  const getMoonPath = (p: number) => {
    const r = 40;
    const sweep = p <= 0.5 ? 1 : 0;
    const mag = Math.abs(Math.cos(p * 2 * Math.PI) * r);
    
    // A complex path to represent the moon phase accurately
    // Left arc is always a semi-circle
    // Right arc is an ellipse that changes width
    return `M 50 10 A 40 40 0 1 ${sweep === 1 ? 0 : 1} 50 90 A ${mag} 40 0 1 ${sweep} 50 10`;
  };

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
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-widest">Phase_State</span>
          <span className={cn(
            "font-black text-[var(--fg)] italic uppercase",
            size === 'small' ? "text-sm" : "text-xl"
          )}>{phaseName.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="relative z-20 flex justify-center items-center my-4" style={{ transform: 'translateZ(70px)' }}>
        <svg viewBox="0 0 100 100" className={cn(
          "drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-500",
          size === 'small' ? "w-20 h-20" : size === 'wide' ? "w-24 h-24" : "w-40 h-40"
        )}>
          {/* Background circle (dark part of the moon) */}
          <circle cx="50" cy="50" r="40" className="fill-zinc-800/50 stroke-zinc-700/30" strokeWidth="0.5" />
          
          {/* Illuminated part */}
          <path 
            d={getMoonPath(phase)}
            className="fill-zinc-100 dark:fill-zinc-200"
          />
          
          {/* Technical UI elements */}
          <circle cx="50" cy="50" r="45" fill="none" className="stroke-zinc-500/20" strokeWidth="0.5" strokeDasharray="2 4" />
          {[...Array(8)].map((_, i) => (
            <line 
              key={i}
              x1="50" y1="5" x2="50" y2="8"
              transform={`rotate(${i * 45} 50 50)`}
              className="stroke-zinc-500/40"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 mt-auto" style={{ transform: 'translateZ(50px)' }}>
        <h3 className={cn(
          "font-black tracking-tighter text-[var(--fg)] uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700",
          titleStyles[size]
        )}>
          Lunar_Telemetry
        </h3>
        <p className="text-[9px] font-mono text-[var(--meta)] group-hover:text-[var(--fg)] transition-all duration-700 uppercase tracking-[0.3em] mt-3 opacity-60 group-hover:opacity-100 line-clamp-1">
          SYNC: { (phase * 100).toFixed(2) }% // illumination
        </p>
      </div>
    </motion.div>
  );
}
