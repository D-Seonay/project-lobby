'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import * as Icons from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSpotlight } from './SpotlightGrid';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
}

export function GitHubGraph({ size = 'wide' }: { size?: 'small' | 'wide' | 'big' }) {
  const [data, setData] = useState<ContributionCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const spotlight = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const fallbackMouse = useMotionValue(0);
  const [elementOffset, setElementOffset] = useState({ x: 0, y: 0 });

  const Github = (Icons as any).Github || (Icons as any).GithubIcon || (Icons as any).Code;

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
    async function fetchData() {
      try {
        const res = await fetch('/api/github');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return null;
  if (!data) return null;

  const weeksToSlice = size === 'small' ? -8 : -14;
  const allDays = data.weeks.slice(weeksToSlice).flatMap(w => w.contributionDays);

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

      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] dark:from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(50px)' }}>
        <div className="text-[var(--meta)] group-hover:text-[var(--fg)] transition-colors duration-800">
          <Github className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-widest">Global_Commits</span>
          <span className="text-xl font-black text-[var(--fg)] italic leading-none">{data.totalContributions}</span>
        </div>
      </div>

      <div className="relative z-10 mt-auto" style={{ transform: 'translateZ(50px)' }}>
        <div className="grid grid-flow-col grid-rows-7 gap-1 w-fit mb-6">
          {allDays.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.005, duration: 0.5 }}
              className={cn(
                "w-2 h-2 rounded-[1px] transition-colors duration-800",
                day.contributionCount === 0 ? "bg-[var(--accent)] dark:bg-zinc-800/50 opacity-20 dark:opacity-100" : 
                day.contributionCount < 3 ? "bg-emerald-900/40" :
                day.contributionCount < 6 ? "bg-emerald-700/60" : "bg-emerald-500"
              )}
              title={`${day.contributionCount} commits on ${day.date}`}
            />
          ))}
        </div>
        <div>
          <h3 className={cn(
            "font-black tracking-tighter text-[var(--fg)] uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700",
            titleStyles[size]
          )}>
            Commit_History
          </h3>
          <p className="text-[10px] font-mono text-[var(--meta)] group-hover:text-[var(--fg)] transition-all duration-700 uppercase tracking-[0.3em] mt-3 opacity-60 group-hover:opacity-100 line-clamp-1">
            Real-time contribution engine // system_sync active
          </p>
        </div>
      </div>
    </motion.div>
  );
}
