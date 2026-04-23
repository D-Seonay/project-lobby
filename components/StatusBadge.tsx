'use client';

import { useState, useEffect } from 'react';

export function StatusBadge({ url, text = "System_Online" }: { url?: string; text?: string }) {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>(url ? 'loading' : 'online');

  useEffect(() => {
    if (!url) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/ping?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        setStatus(data.status === 'online' ? 'online' : 'offline');
      } catch (error) {
        setStatus('offline');
      }
    };

    checkStatus();
  }, [url]);

  if (status === 'loading') {
    return (
      <div className="relative flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/5 dark:bg-zinc-900/50 border border-zinc-900/10 dark:border-zinc-800/50 overflow-hidden min-w-[100px]">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-zinc-900/[0.03] dark:via-white/[0.03] to-transparent animate-shimmer" />
        
        <div className="relative z-10 flex items-center gap-2 w-full">
          <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-700 rounded-full animate-pulse" />
          <span className="text-[9px] font-mono font-medium text-zinc-500 dark:text-zinc-600 uppercase tracking-widest flex justify-between w-full">
            Scanning_Status...
          </span>
        </div>
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/5 border border-red-500/20 w-fit group-hover:border-red-500/40 transition-colors duration-700">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500/80"></span>
        </span>
        <span className="text-[9px] font-mono font-bold text-red-500/80 uppercase tracking-widest">
          System_Offline
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 w-fit group-hover:border-emerald-500/40 transition-colors duration-700">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
      </span>
      <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
        {text}
      </span>
    </div>
  );
}
