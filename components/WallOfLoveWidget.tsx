'use client';

import { useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Heart, Terminal, Star } from 'lucide-react';
import { useSpotlight } from './SpotlightGrid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FEEDBACKS = [
  {
    id: 1,
    user: "Lead_Eng",
    role: "Core_Architect",
    content: "System stability improved by 40% using the new architecture. Radical optimization.",
    timestamp: "2024.04.12",
    status: "CRITICAL_SUCCESS"
  },
  {
    id: 2,
    user: "Design_Dir",
    role: "Visual_Ops",
    content: "The radical dark mode is exactly what we needed for the NOC. Aesthetic parity achieved.",
    timestamp: "2024.04.15",
    status: "SYNC_COMPLETE"
  },
  {
    id: 3,
    user: "DevOps_X",
    role: "Deployment_Unit",
    content: "Deployment times reduced to seconds. Phenomenal throughput on all nodes.",
    timestamp: "2024.04.18",
    status: "LOG_READY"
  },
  {
    id: 4,
    user: "Alpha_Client",
    role: "Stakeholder",
    content: "UI responsiveness is top-notch. The 3D effects are subtle yet impactful.",
    timestamp: "2024.04.20",
    status: "VERIFIED"
  },
  {
    id: 5,
    user: "Talent_S",
    role: "Recruitment_Log",
    content: "Best portfolio I've seen in years. Truly unique aesthetic and technical depth.",
    timestamp: "2024.04.22",
    status: "RECOGNIZED"
  }
];

export function WallOfLoveWidget({ size = 'wide' }: { size?: 'small' | 'wide' | 'big' }) {
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
        "relative group overflow-hidden flex flex-col cursor-pointer transition-colors duration-500",
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
      
      <div className="relative z-10 flex justify-between items-start mb-4" style={{ transform: 'translateZ(50px)' }}>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <span className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-[0.2em]">Wall_Of_Love</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-mono text-[var(--meta)] uppercase tracking-widest opacity-60">Status: TRANSMITTING</span>
        </div>
      </div>

      <div 
        className="relative z-10 overflow-hidden flex-1" 
        style={{ 
          transform: 'translateZ(30px)',
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
        }}
      >
        <motion.div 
          className="flex flex-col gap-3"
          animate={{
            y: ["0%", "-50%"]
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity
          }}
        >
          {[...FEEDBACKS, ...FEEDBACKS].map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`}
              className={cn(
                "p-3 rounded-xl border border-[var(--card-border)] bg-zinc-900/40 backdrop-blur-sm transition-all duration-500",
                "group-hover:border-zinc-700/50 group-hover:bg-zinc-800/40"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-tighter leading-none">{item.user}</span>
                  <span className="text-[7px] font-mono text-[var(--meta)] uppercase tracking-[0.2em] leading-none mt-1">{item.role}</span>
                </div>
                <div className="text-[7px] font-mono text-[var(--meta)] opacity-40 italic">[{item.timestamp}]</div>
              </div>
              <p className="text-[10px] font-mono text-[var(--fg)] opacity-80 leading-relaxed mb-2 line-clamp-2">
                {item.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2 h-2 text-yellow-500/50" fill="currentColor" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[6px] font-mono text-[var(--meta)] uppercase tracking-widest">{item.status}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 mt-4 pt-4 border-t border-[var(--card-border)]/50" style={{ transform: 'translateZ(50px)' }}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
             <h3 className="font-black text-lg tracking-tighter text-[var(--fg)] uppercase italic leading-none">Feedback_Loop</h3>
             <p className="text-[8px] font-mono text-[var(--meta)] uppercase tracking-[0.2em] mt-1">External signals detected</p>
          </div>
          <div className="w-8 h-8 rounded-full border border-[var(--card-border)] flex items-center justify-center bg-[var(--accent)]/30">
            <Terminal className="w-4 h-4 text-[var(--meta)]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
