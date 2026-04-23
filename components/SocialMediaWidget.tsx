'use client';

import { useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Github, Linkedin, Twitter, Globe, Mail, ExternalLink } from 'lucide-react';
import { useSpotlight } from './SpotlightGrid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PLATFORMS = {
  github: {
    icon: Github,
    label: 'CODEBASE',
    handle: '@D-Seonay',
    color: '#24292e',
    url: 'https://github.com/D-Seonay'
  },
  linkedin: {
    icon: Linkedin,
    label: 'NETWORK',
    handle: 'Mathéo Delaunay',
    color: '#0077b5',
    url: 'https://www.linkedin.com/in/matheo-delaunay/'
  },
  twitter: {
    icon: Twitter,
    label: 'FEED',
    handle: '@D_Seonay',
    color: '#1da1f2',
    url: 'https://twitter.com/'
  },
  website: {
    icon: Globe,
    label: 'PORTFOLIO',
    handle: 'lobby.seonay.com',
    color: '#6366f1',
    url: 'https://lobby.seonay.com'
  }
};

type PlatformKey = keyof typeof PLATFORMS;

interface SocialMediaWidgetProps {
  size?: 'small' | 'wide' | 'big';
  platform?: PlatformKey;
}

export function SocialMediaWidget({ size = 'small', platform = 'github' }: SocialMediaWidgetProps) {
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

  const SelectedIcon = PLATFORMS[platform].icon;

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
      
      {size === 'small' && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <motion.div 
            style={{ transform: 'translateZ(60px)' }}
            className="text-[var(--fg)] group-hover:scale-110 transition-transform duration-700"
          >
            <SelectedIcon className="w-16 h-16" strokeWidth={1.5} />
          </motion.div>
          <div className="absolute top-0 right-0">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
          <div className="absolute bottom-0 left-0">
             <span className="text-[8px] font-mono text-[var(--meta)] uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity">
               {PLATFORMS[platform].label}_LINK
             </span>
          </div>
        </div>
      )}

      {size === 'wide' && (
        <>
          <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(50px)' }}>
            <div className="text-[var(--meta)] group-hover:text-[var(--fg)] transition-colors duration-800">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-widest">Social_Pulse</span>
              <span className="text-xl font-black text-[var(--fg)] italic uppercase italic">Connected</span>
            </div>
          </div>

          <div className="relative z-10 mt-auto flex justify-between items-center" style={{ transform: 'translateZ(50px)' }}>
             {Object.entries(PLATFORMS).map(([key, data]) => {
               const Icon = data.icon;
               return (
                 <a 
                   key={key}
                   href={data.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="group/item flex flex-col items-center gap-2 hover:translate-y--1 transition-transform"
                 >
                   <div className="p-3 rounded-2xl bg-[var(--accent)]/30 border border-[var(--card-border)] group-hover/item:border-[var(--fg)] transition-colors">
                     <Icon className="w-5 h-5 text-[var(--meta)] group-hover/item:text-[var(--fg)] transition-colors" />
                   </div>
                   <span className="text-[8px] font-mono text-[var(--meta)] group-hover/item:text-[var(--fg)] transition-colors uppercase tracking-widest">
                     {data.label}
                   </span>
                 </a>
               );
             })}
          </div>
        </>
      )}

      {size === 'big' && (
        <>
          <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(50px)' }}>
            <div className="text-[var(--meta)] group-hover:text-[var(--fg)] transition-colors duration-800">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-4xl font-black tracking-tighter text-[var(--fg)] uppercase italic leading-[0.8]">
                Social_Hub
              </h3>
              <p className="text-[9px] font-mono text-[var(--meta)] uppercase tracking-[0.3em] mt-3 opacity-60">
                Cross-Platform Telemetry
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 h-full" style={{ transform: 'translateZ(50px)' }}>
            {Object.entries(PLATFORMS).map(([key, data]) => {
              const Icon = data.icon;
              return (
                <a 
                  key={key}
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-between p-4 rounded-2xl bg-[var(--accent)]/20 border border-[var(--card-border)] hover:border-zinc-400 dark:hover:border-white/20 transition-all group/card"
                >
                  <div className="flex justify-between items-start">
                    <Icon className="w-6 h-6 text-[var(--meta)] group-hover/card:text-[var(--fg)] transition-colors" />
                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 uppercase tracking-widest">
                      Active
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-[var(--meta)] uppercase tracking-widest leading-none mb-1">
                      {data.label}
                    </span>
                    <span className="block text-xs font-black text-[var(--fg)] italic truncate">
                      {data.handle}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}
