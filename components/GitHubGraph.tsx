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

export function GitHubGraph() {
  const [data, setData] = useState<ContributionCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const spotlight = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Local mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothing the tilt
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const fallbackMouse = useMotionValue(0);
  const [elementOffset, setElementOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXRelative = (e.clientX - rect.left) / width - 0.5;
    const mouseYRelative = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(mouseXRelative);
    mouseY.set(mouseYRelative);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Track relative mouse position for the internal spotlight
  const relativeMouseX = useTransform(spotlight?.mouseX || fallbackMouse, (val) => val - elementOffset.x);
  const relativeMouseY = useTransform(spotlight?.mouseY || fallbackMouse, (val) => val - elementOffset.y);

  const spotlightBg = useMotionTemplate`
    radial-gradient(
      450px circle at ${relativeMouseX}px ${relativeMouseY}px,
      rgba(255, 255, 255, 0.04),
      transparent 80%
    )
  `;

  // Dynamic icon fallback
  const Github = (Icons as any).Github || (Icons as any).GithubIcon || (Icons as any).Code;

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

  if (loading) {
    return (
      <div className="md:col-span-2 p-8 lg:p-12 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl animate-pulse flex flex-col justify-between min-h-[240px]">
        <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
        <div className="space-y-4">
          <div className="h-8 w-48 bg-zinc-800 rounded" />
          <div className="h-20 w-full bg-zinc-800/50 rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Flatten last 14 weeks for the wall
  const allDays = data.weeks.slice(-14).flatMap(w => w.contributionDays);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onViewportEnter={(entry) => {
        if (entry?.target) {
          const rect = entry.target.getBoundingClientRect();
          // We need to account for the grid parent offset
          if (spotlight?.gridRef.current) {
            const gridRect = spotlight.gridRef.current.getBoundingClientRect();
            setElementOffset({
              x: rect.left - gridRect.left,
              y: rect.top - gridRect.top
            });
          }
        }
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={cn(
        "md:col-span-2 p-8 lg:p-12 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl flex flex-col justify-between min-h-[240px] group overflow-hidden relative transition-all duration-700 ease-[var(--ease-out-expo)]",
        "group-hover/grid:opacity-40 group-hover/grid:hover:opacity-100"
      )}
    >
      {/* Global Spotlight Effect */}
      {spotlight && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover/grid:opacity-100 transition duration-500"
          style={{ background: spotlightBg }}
        />
      )}

      {/* Local Hover Gradient (complementary) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="text-zinc-600 group-hover:text-zinc-200 transition-colors duration-700">
          <Github className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Global_Commits</span>
          <span className="text-xl font-black text-zinc-900 dark:text-zinc-100 italic">{data.totalContributions}</span>
        </div>
      </div>

      <div className="relative z-10 mt-8">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-fit">
          {allDays.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.005, duration: 0.5 }}
              className={cn(
                "w-2.5 h-2.5 rounded-[2px] transition-colors duration-500",
                day.contributionCount === 0 ? "bg-zinc-300 dark:bg-zinc-800/50" : 
                day.contributionCount < 3 ? "bg-emerald-900/40" :
                day.contributionCount < 6 ? "bg-emerald-700/60" : "bg-emerald-500"
              )}
              title={`${day.contributionCount} commits on ${day.date}`}
            />
          ))}
        </div>
        <div className="mt-6">
          <h3 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase italic leading-none group-hover:translate-x-1 transition-transform duration-700">
            Commit_History
          </h3>
          <p className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors duration-700 uppercase tracking-[0.3em] mt-3">
            Real-time contribution engine // system_sync active
          </p>
        </div>
      </div>
    </motion.div>
  );
}
