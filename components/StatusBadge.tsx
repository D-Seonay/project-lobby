'use client';

import { useState, useEffect } from 'react';

export function StatusBadge({ url, text = "Live" }: { url?: string; text?: string }) {
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
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/20 w-fit animate-pulse">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
        </span>
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Checking
        </span>
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 w-fit">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="text-xs font-medium text-red-400 uppercase tracking-wider">
          Offline
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
        {text}
      </span>
    </div>
  );
}
