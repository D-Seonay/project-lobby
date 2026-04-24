'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useSpotlight } from './SpotlightGrid';
import { Sun, Moon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function DayNightCycleWidget() {
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState<'Dawn' | 'Daylight' | 'Dusk' | 'Deep_Night'>('Deep_Night');
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
    const updateTime = () => {
      const now = new Date();
      // Nantes/Paris time
      const nantesTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
      setTime(nantesTime);

      const hours = nantesTime.getHours();
      if (hours >= 5 && hours < 7) setStatus('Dawn');
      else if (hours >= 7 && hours < 18) setStatus('Daylight');
      else if (hours >= 18 && hours < 20) setStatus('Dusk');
      else setStatus('Deep_Night');
    };

    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const totalHours = hours + minutes / 60;
  
  // 12:00 at Top (-90 deg), 00:00 at Bottom (90 deg)
  const sunAngle = (totalHours * 15) - 270;
  const moonAngle = sunAngle + 180;

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
      aria-label="Day/Night Astro Cycle"
      className={cn(
        "relative group overflow-hidden flex flex-col justify-between cursor-pointer transition-colors duration-500",
        "bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] hover:border-zinc-400 dark:bg-zinc-950/50 dark:border-white/5 dark:hover:border-white/20 rounded-3xl",
        "col-span-1 row-span-1 p-6"
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-widest">Cycle_Status</span>
          <span className="font-black text-[var(--fg)] italic uppercase text-sm">
            {status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="relative z-20 flex justify-center items-center my-4" style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
        <div className="relative w-24 h-24">
          {/* Dial / Circular Path */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="none" className="stroke-[var(--card-border)] opacity-20" strokeWidth="0.5" />
            
            {/* 24 Markers */}
            {[...Array(24)].map((_, i) => (
              <line 
                key={i}
                x1="50" y1="8" x2="50" y2={i % 6 === 0 ? "12" : "10"}
                transform={`rotate(${i * 15} 50 50)`}
                className={cn(
                  "stroke-[var(--meta)]",
                  i % 6 === 0 ? "opacity-60" : "opacity-20"
                )}
                strokeWidth={i % 6 === 0 ? "1" : "0.5"}
              />
            ))}
          </svg>

          {/* Sun Orbit */}
          <motion.div 
            className="absolute inset-0 flex justify-center items-start"
            style={{ 
              rotate: sunAngle,
              transformStyle: 'preserve-3d'
            }}
          >
            <div style={{ transform: 'translateZ(60px)' }}>
              <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            </div>
          </motion.div>

          {/* Moon Orbit */}
          <motion.div 
            className="absolute inset-0 flex justify-center items-start"
            style={{ 
              rotate: moonAngle,
              transformStyle: 'preserve-3d'
            }}
          >
            <div style={{ transform: 'translateZ(60px)' }}>
              <Moon className="w-5 h-5 text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.5)]" />
            </div>
          </motion.div>

          {/* Center Dot */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-1 h-1 rounded-full bg-[var(--meta)] opacity-40" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto" style={{ transform: 'translateZ(50px)' }}>
        <h3 className="font-black tracking-tighter text-[var(--fg)] uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700 text-lg sm:text-xl">
          Astro_Telemetry
        </h3>
        <div className="flex justify-between items-center mt-3">
          <p className="text-[9px] font-mono text-[var(--meta)] group-hover:text-[var(--fg)] transition-all duration-700 uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 line-clamp-1">
            {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} // LMT
          </p>
          <div className="flex gap-1">
            <div className={cn("w-1 h-1 rounded-full", status === 'Dawn' ? "bg-orange-500 animate-pulse" : "bg-zinc-800")} />
            <div className={cn("w-1 h-1 rounded-full", status === 'Daylight' ? "bg-yellow-500 animate-pulse" : "bg-zinc-800")} />
            <div className={cn("w-1 h-1 rounded-full", status === 'Dusk' ? "bg-indigo-500 animate-pulse" : "bg-zinc-800")} />
            <div className={cn("w-1 h-1 rounded-full", status === 'Deep_Night' ? "bg-blue-500 animate-pulse" : "bg-zinc-800")} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
