'use client';

import { useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useSpotlight } from './SpotlightGrid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Size = 'small' | 'wide' | 'big';

interface SocialMediaWidgetProps {
  size?: Size;
  platform?: string;
}

export function SocialMediaWidget({ size = 'small', platform = 'Github' }: SocialMediaWidgetProps) {
  const spotlight = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const fallbackMouse = useMotionValue(0);
  const [elementOffset, setElementOffset] = useState({ x: 0, y: 0 });

  // Dynamic icon access
  const getIcon = (name: string) => {
    return (Icons as any)[name] || (Icons as any)[`${name}Icon`] || Icons.Globe;
  };

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

  const cardStyles = {
    small: 'col-span-1 row-span-1 p-6 items-center justify-center',
    wide: 'col-span-2 row-span-1 p-8 justify-between',
    big: 'col-span-2 row-span-2 p-10 justify-between',
  };

  if (size === 'small') {
    const Icon = getIcon(platform);
    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '1000px' }}
        className={cn(
          "relative group overflow-hidden flex flex-col cursor-pointer transition-all duration-800",
          "bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] hover:border-zinc-400 dark:bg-zinc-950/50 dark:border-white/5 dark:hover:border-white/20 rounded-3xl",
          cardStyles.small
        )}
      >
        {spotlight && <motion.div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500" style={{ background: spotlightBg }} />}
        <motion.div style={{ transform: 'translateZ(60px)' }} className="text-[var(--meta)] group-hover:text-[var(--fg)] transition-colors duration-500">
          <Icon size={64} strokeWidth={1} />
        </motion.div>
        <div className="absolute bottom-4 text-[8px] font-mono text-[var(--meta)] uppercase tracking-[0.4em] opacity-40">{platform}_LINK</div>
      </motion.div>
    );
  }

  if (size === 'wide') {
    const platforms = ['Github', 'Linkedin', 'Twitter', 'Mail'];
    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '1000px' }}
        className={cn(
          "relative group overflow-hidden flex flex-col cursor-pointer transition-all duration-800",
          "bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] hover:border-zinc-400 dark:bg-zinc-950/50 dark:border-white/5 dark:hover:border-white/20 rounded-3xl",
          cardStyles.wide
        )}
      >
        {spotlight && <motion.div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500" style={{ background: spotlightBg }} />}
        
        <div className="relative z-10 flex justify-between items-start w-full">
          <div className="text-[var(--meta)] uppercase font-mono text-[9px] tracking-widest">Network_Index</div>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 flex justify-between items-end w-full" style={{ transform: 'translateZ(50px)' }}>
          {platforms.map((p) => {
            const Icon = getIcon(p);
            return (
              <div key={p} className="flex flex-col items-center gap-3 group/item">
                <div className="p-3 bg-[var(--accent)]/30 border border-[var(--card-border)] rounded-xl group-hover/item:text-[var(--fg)] group-hover/item:border-zinc-400 transition-all">
                  <Icon size={20} />
                </div>
                <span className="text-[8px] font-mono text-[var(--meta)] uppercase tracking-wider">{p}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // BIG 2x2
  const items = [
    { name: 'Github', label: 'CODEBASE', status: 'ACTIVE' },
    { name: 'Linkedin', label: 'NETWORK', status: 'OPEN' },
    { name: 'Twitter', label: 'BROADCAST', status: 'LIVE' },
    { name: 'Mail', label: 'COMMS', status: 'SECURE' },
  ];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '1000px' }}
      className={cn(
        "relative group overflow-hidden flex flex-col cursor-pointer transition-all duration-800",
        "bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] hover:border-zinc-400 dark:bg-zinc-950/50 dark:border-white/5 dark:hover:border-white/20 rounded-3xl",
        cardStyles.big
      )}
    >
      {spotlight && <motion.div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500" style={{ background: spotlightBg }} />}
      
      <div className="relative z-10 flex justify-between items-start w-full">
        <div className="text-[var(--meta)] uppercase font-mono text-[9px] tracking-widest">Global_Social_Array</div>
        <Icons.Activity size={14} className="text-[var(--meta)] opacity-40 animate-pulse" />
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-4 w-full" style={{ transform: 'translateZ(40px)' }}>
        {items.map((item) => {
          const Icon = getIcon(item.name);
          return (
            <div key={item.name} className="p-4 bg-[var(--accent)]/20 border border-[var(--card-border)] rounded-2xl flex flex-col gap-4 hover:border-zinc-500 transition-colors">
              <div className="flex justify-between items-center">
                <Icon size={16} className="text-[var(--meta)]" />
                <span className="text-[7px] font-mono text-emerald-500">{item.status}</span>
              </div>
              <div>
                <div className="text-[10px] font-black text-[var(--fg)] uppercase italic">{item.label}</div>
                <div className="text-[8px] font-mono text-[var(--meta)] uppercase tracking-tighter">View_Profile</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 w-full pt-6 border-t border-[var(--card-border)]">
        <h3 className="text-2xl font-black tracking-tighter text-[var(--fg)] uppercase italic leading-none group-hover:translate-x-1 transition-transform duration-500">
          Social_Station
        </h3>
        <p className="text-[9px] font-mono text-[var(--meta)] uppercase tracking-[0.3em] mt-2 opacity-60">
          Encrypted social endpoints // multi-platform
        </p>
      </div>
    </motion.div>
  );
}
