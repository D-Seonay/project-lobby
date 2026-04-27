'use client';

import { useEffect, useState, useRef } from 'react';
import Pusher from 'pusher-js';
import { Users } from 'lucide-react';
import { motion, AnimatePresence, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useSpotlight } from './SpotlightGrid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function PresenceWidget({ size = 'small' }: { size?: 'small' | 'wide' | 'big' }) {
  const [count, setCount] = useState(0);
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

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      console.warn('PresenceWidget: Pusher environment variables are missing. Real-time presence is disabled.');
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: '/api/presence/auth',
    });

    const channel = pusher.subscribe('presence-lobby');

    channel.bind('pusher:subscription_succeeded', (members: any) => {
      setCount(members.count);
    });

    channel.bind('pusher:member_added', () => {
      setCount((prev) => prev + 1);
    });

    channel.bind('pusher:member_removed', () => {
      setCount((prev) => Math.max(0, prev - 1));
    });

    return () => {
      pusher.unsubscribe('presence-lobby');
      pusher.disconnect();
    };
  }, []);

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
        "bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] hover:border-zinc-400 dark:bg-[#050507] dark:border-white/5 dark:hover:border-white/20 rounded-3xl",
        cardStyles[size]
      )}
    >
      {spotlight && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"
          style={{ background: spotlightBg }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] dark:from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Top: Users icon + "Live" badge with pulsing dot */}
      <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(50px)' }}>
        <div className="text-[var(--meta)] group-hover:text-[var(--fg)] transition-colors duration-800">
          <Users className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500">Live</span>
        </div>
      </div>

      {/* Bottom: Large bold italic counter + "Explorers_Online" label */}
      <div className="relative z-10 mt-auto space-y-1" style={{ transform: 'translateZ(50px)' }}>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "font-black italic tracking-tighter text-white leading-none",
                size === 'small' ? "text-5xl" : "text-7xl"
              )}
            >
              {count.toString().padStart(2, '0')}
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="font-mono text-[10px] text-[var(--meta)] uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity duration-700">
          Explorers_Online
        </p>
      </div>
    </motion.div>
  );
}
