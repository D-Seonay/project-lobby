'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Activity, Shield, Wifi, MessageSquare } from 'lucide-react';
import { useSpotlight } from './SpotlightGrid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Replace with your actual Discord ID
const DISCORD_ID = '592987413891252229';

export function DiscordStatusWidget({ size = 'small' }: { size?: 'small' | 'wide' }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const spotlight = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const fallbackMouse = useMotionValue(0);
  const [elementOffset, setElementOffset] = useState({ x: 0, y: 0 });

  // Local mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Lanyard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

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
      250px circle at ${relativeMouseX}px ${relativeMouseY}px,
      rgba(255, 255, 255, 0.08),
      transparent 80%
    )
  `;

  if (loading) {
    return (
      <div className={cn(
        "bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 animate-pulse min-h-[200px]",
        size === 'small' ? "col-span-1 row-span-1" : "col-span-2 row-span-1"
      )} />
    );
  }

  // If ID is not on Lanyard server yet
  if (!data) {
    return (
      <div className={cn(
        "bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col justify-center items-center text-center gap-2",
        size === 'small' ? "col-span-1 row-span-1" : "col-span-2 row-span-1"
      )}>
        <Wifi className="w-5 h-5 text-red-500/50" />
        <span className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-widest leading-tight">
          Signal_Lost<br/>
          <span className="opacity-40">Join discord.gg/lanyard</span>
        </span>
      </div>
    );
  }

  const statusColor = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    dnd: 'bg-red-500',
    offline: 'bg-zinc-500',
  }[data.discord_status as string] || 'bg-zinc-500';

  const activity = data.activities?.find((a: any) => a.type === 0) || data.activities?.[0];

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
        "relative group overflow-hidden flex flex-col justify-between transition-colors duration-500",
        "bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] hover:border-zinc-400 dark:bg-zinc-950/50 dark:border-white/5 dark:hover:border-white/20 rounded-3xl p-5",
        size === 'small' ? "col-span-1 row-span-1" : "col-span-2 row-span-1"
      )}
    >
      {spotlight && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"
          style={{ background: spotlightBg }}
        />
      )}

      {/* Header Tags */}
      <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-[7px] font-mono text-[var(--meta)] uppercase tracking-[0.2em] opacity-50">Comms_Monitor</span>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-[var(--meta)]" />
            <span className="text-[9px] font-black text-[var(--fg)] italic uppercase tracking-tighter">Signal_Status</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-full">
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", statusColor)} />
          <span className="text-[7px] font-mono text-[var(--meta)] uppercase tracking-widest">{data.discord_status}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "relative z-10 flex gap-4 mt-4",
        size === 'small' ? "flex-col items-center text-center" : "items-center"
      )} style={{ transform: 'translateZ(50px)' }}>

        {/* Avatar with Scanner Border */}
        <div className="relative p-1">
          <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-[-4px] border border-dashed border-emerald-500/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
          <img
            src={`https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data.discord_user.avatar}.png`}
            alt={data.discord_user.username}
            className="w-12 h-12 rounded-full border-2 border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700"
          />
          <div className={cn("absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-zinc-900", statusColor)} />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-xs font-black text-[var(--fg)] uppercase tracking-tight truncate">
            {data.discord_user.global_name || data.discord_user.username}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <Wifi className="w-3 h-3 text-emerald-500" />
            <span className="text-[8px] font-mono text-[var(--meta)] uppercase tracking-tighter truncate">
              {activity ? `${activity.type === 0 ? 'Playing' : 'Doing'}: ${activity.name}` : 'Awaiting_Signal'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="relative z-10 mt-auto flex justify-between items-end border-t border-white/5 pt-3" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex flex-col">
          <span className="text-[6px] font-mono text-[var(--meta)] opacity-40 uppercase tracking-[0.3em]">Lat_Sync</span>
          <span className="text-[8px] font-mono text-emerald-500/50 group-hover:text-emerald-500 transition-colors uppercase">Stable_Connection</span>
        </div>
        <MessageSquare className="w-3 h-3 text-[var(--meta)] opacity-20 group-hover:animate-pulse" />
      </div>

    </motion.div>
  );
}
