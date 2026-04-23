'use client';

import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Project } from '@/types/project';
import { StatusBadge } from './StatusBadge';
import * as Icons from 'lucide-react';
import { Monitor, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSpotlight } from './SpotlightGrid';
import { useEffect, useState, useRef } from 'react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function BentoCard({ project, size }: { project: Project, size?: 'small' | 'wide' | 'big' | 'xl' }) {
  const Icon = project.icon ? (Icons as any)[project.icon] : null;
  const spotlight = useSpotlight();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const fallbackMouse = useMotionValue(0);
  const [elementOffset, setElementOffset] = useState({ x: 0, y: 0 });
  const [isPeeking, setIsPeeking] = useState(false);

  const currentSize = size || project.size;
  const isHolographic = currentSize === 'big' || project.holographic;

  // Local mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);

  const holoX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const holoY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);
  const holoAngle = useSpring(useTransform(mouseX, [-0.5, 0.5], [-45, 45]), springConfig);

  const holographicBg = useMotionTemplate`
    linear-gradient(
      ${holoAngle}deg,
      transparent 0%,
      var(--holographic-silver) ${holoX}%,
      var(--holographic-violet) ${holoY}%,
      var(--holographic-cyan) 100%
    )
  `;

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
    xl: 'col-span-4 row-span-2 p-10',
  };

  const titleStyles = {
    small: 'text-lg sm:text-xl',
    wide: 'text-2xl sm:text-3xl',
    big: 'text-4xl sm:text-6xl',
    xl: 'text-4xl sm:text-6xl',
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
      <motion.a
        ref={cardRef}
        href={project.link}
        target="_blank"
        layoutId={`card-${project.id}`}
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
        variants={{
          hidden: { opacity: 0, y: 30, scale: 0.94 },
          show: { opacity: 1, y: 0, scale: 1 }
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
        whileHover={{ y: -4 }}
        className={cn(
          "relative group overflow-hidden flex flex-col justify-between cursor-pointer transition-colors duration-500",
          "bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] hover:border-zinc-400 dark:bg-[#050507] dark:border-white/5 dark:hover:border-white/20 rounded-3xl",
          cardStyles[currentSize]
        )}
      >
        {spotlight && (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"
            style={{ background: spotlightBg }}
          />
        )}

        {isHolographic && (
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-color-dodge z-0"
            style={{
              background: holographicBg,
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] dark:from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(50px)' }}>
          <motion.div layoutId={`icon-${project.id}`} className="text-[var(--meta)] group-hover:text-[var(--fg)] transition-colors duration-800">
            {Icon && <Icon className="w-5 h-5" />}
          </motion.div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPeeking(true);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 backdrop-blur-md"
              title="Live Peek"
            >
              <Monitor className="w-3.5 h-3.5 text-[var(--meta)] hover:text-[var(--fg)]" />
            </button>
            {project.isLive && currentSize !== 'small' && <StatusBadge url={project.link} />}
            {project.isLive && currentSize === 'small' && (
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            )}
          </div>
        </div>

        <div className="relative z-10 mt-auto space-y-4" style={{ transform: 'translateZ(50px)' }}>
          <div className="space-y-2">
            <motion.h3 layoutId={`title-${project.id}`} className={cn(
              "font-black tracking-tighter text-[var(--fg)] uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700",
              titleStyles[currentSize]
            )}>
              {project.title}
            </motion.h3>

            {currentSize !== 'small' && (
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
            currentSize === 'small' ? "text-[8px] line-clamp-1" : "text-[10px] line-clamp-2"
          )}>
            {project.description}
          </motion.p>
        </div>
      </motion.a>

      <AnimatePresence>
        {isPeeking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPeeking(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl pointer-events-auto"
            />

            <motion.div
              layoutId={`card-${project.id}`}
              className="relative w-full max-w-6xl aspect-video bg-[#050507] rounded-3xl border border-white/10 overflow-hidden shadow-2xl pointer-events-auto"
            >
              <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
                <div className="flex items-center gap-4">
                  <motion.div layoutId={`icon-${project.id}`}>
                    {Icon && <Icon className="w-5 h-5 text-[var(--meta)]" />}
                  </motion.div>
                  <motion.h3 layoutId={`title-${project.id}`} className="text-2xl font-black italic uppercase tracking-tighter text-white">
                    {project.title}
                  </motion.h3>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500">Live_Stream</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsPeeking(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group/close"
                >
                  <X className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                </button>
              </div>

              <div className="relative w-full h-full pt-20">
                <iframe
                  src={project.link}
                  className="w-full h-full border-none"
                  loading="lazy"
                />
                
                <div className="peek-overlay" />
                <div className="noise-bg" />
                
                <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--meta)] connecting-text">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                    Connecting_Stream...
                  </div>
                  <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
                    Encryption: AES-256-GCM | Protocol: WEBRTC_PEER
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
