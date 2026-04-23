'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface GitHubData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export default function GitHubGraph() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/github');
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub data');
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="sm:col-span-2 lg:col-span-2 lg:row-span-1 p-6 sm:p-8 lg:p-12 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl flex items-center justify-center">
        <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Error loading GitHub data</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.94 },
        show: { opacity: 1, y: 0, scale: 1 }
      }}
      transition={{ 
        type: "spring",
        stiffness: 70,
        damping: 24,
        mass: 1.2
      }}
      className={cn(
        "relative group overflow-hidden flex flex-col justify-between",
        "bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 transition-colors duration-700 ease-[var(--ease-out-expo)] rounded-3xl",
        "sm:col-span-2 lg:col-span-2 lg:row-span-1 p-6 sm:p-8 lg:p-12"
      )}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div className="text-zinc-600 group-hover:text-zinc-200 transition-colors duration-700 ease-[var(--ease-out-expo)]">
          <Github className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Contributions</span>
          <span className="font-mono text-sm text-zinc-100 font-bold">{data?.totalContributions ?? '0'}</span>
        </div>
      </div>

      <div className="relative z-10 mt-8">
        {loading ? (
          <div className="grid grid-cols-10 gap-1 animate-pulse">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-800 rounded-[2px]" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {data?.weeks.slice(-14).flatMap(week => week.contributionDays).map((day, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-3 h-3 rounded-[2px] transition-all duration-500 ease-out",
                  day.contributionCount > 0 
                    ? "bg-emerald-500/80 group-hover:bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
                    : "bg-zinc-800/50"
                )}
                title={`${day.contributionCount} contributions on ${day.date}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 mt-8 space-y-4">
        <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-zinc-100 uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700 ease-[var(--ease-out-expo)]">
          GitHub Activity
        </h3>
        <p className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors duration-700 ease-[var(--ease-out-expo)] uppercase tracking-[0.3em] leading-relaxed">
          Real-time synchronization with D-Seonay&apos;s repository activity.
        </p>
      </div>
    </motion.div>
  );
}
