'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring, useMotionValueEvent } from 'framer-motion';
import { Music, ExternalLink } from 'lucide-react';
import { useSpotlight } from './SpotlightGrid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LiquidShader } from './LiquidShader';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export function SpotifyWidget({ size = 'wide' }: { size?: 'small' | 'wide' | 'big' }) {
  const [data, setData] = useState<SpotifyData | null>(null);
  const spotlight = useSpotlight();
  const cardRef = useRef<HTMLDivElement>(null);
  const fallbackMouse = useMotionValue(0);
  const [elementOffset, setElementOffset] = useState({ x: 0, y: 0 });

  // Local mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Liquid Shader normalized mouse position (0 to 1)
  const [mX, setMX] = useState(0.5);
  const [mY, setMY] = useState(0.5);

  useMotionValueEvent(mouseX, "change", (latest) => setMX(latest + 0.5));
  useMotionValueEvent(mouseY, "change", (latest) => setMY(latest + 0.5));

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
    const fetchSpotify = async () => {
      try {
        const res = await fetch('/api/spotify');
        const spotifyData = await res.json();
        setData(spotifyData);
      } catch (err) {
        console.error('Spotify fetch error:', err);
      }
    };

    fetchSpotify();
    const interval = setInterval(fetchSpotify, 10000); // Poll every 10s
    return () => clearInterval(interval);
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
      aria-label="Spotify Playing Module"
      className={cn(
        "relative group overflow-hidden flex flex-col justify-between cursor-pointer transition-colors duration-500",
        "bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] hover:border-zinc-400 dark:bg-[#050507] dark:border-white/5 dark:hover:border-white/20 rounded-3xl",
        cardStyles[size as keyof typeof cardStyles]
      )}
    >
      <LiquidShader color="#1db954" mouseX={mX} mouseY={mY} />
      {spotlight && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"
          style={{ background: spotlightBg }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(50px)' }}>
        <div className="text-[var(--meta)] group-hover:text-[#1DB954] transition-colors duration-800">
          <Music className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-widest">Spotify_Sync</span>
          <div className="flex items-center gap-2 mt-1">
            {data?.isPlaying ? (
              <div className="flex items-center gap-1 h-3">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-[#1DB954]"
                    animate={{ height: ["20%", "100%", "20%"] }}
                    transition={{
                      duration: 0.6 + i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            ) : (
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest italic">Offline</span>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto flex flex-col gap-6" style={{ transform: 'translateZ(50px)' }}>
        <div 
          className={cn(
            "flex items-center bg-[var(--accent)]/30 border border-[var(--card-border)] rounded-2xl transition-all duration-700 overflow-hidden",
            size === 'small' ? "gap-2 p-2" : "gap-4 p-4"
          )} 
        >
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors" style={{ transform: 'translateZ(30px)' }}>
            {data?.albumImageUrl ? (
              <>
                <img src={data.albumImageUrl} alt={data.album} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="peek-overlay opacity-50" />
              </>
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <Music className="w-6 h-6 text-zinc-800" />
              </div>
            )}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[9px] font-mono text-[var(--meta)] uppercase tracking-widest leading-none mb-1 truncate">
              {data?.isPlaying ? 'Now_Playing' : 'Last_Session'}
            </span>
            <h4 className={cn(
              "font-black text-[var(--fg)] italic leading-tight truncate",
              size === 'small' ? "text-sm" : "text-xl"
            )}>
              {data?.title || 'Not Playing'}
            </h4>
            <p className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-wider truncate mt-0.5">
              {data?.artist || 'Spotify'}
            </p>
          </div>

          {data?.songUrl && size !== 'small' && (
            <a 
              href={data.songUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`Open ${data.title} on Spotify`}
              title={`Open ${data.title} on Spotify`}
              className="ml-auto p-2 rounded-full bg-white/5 hover:bg-[#1DB954]/20 border border-white/5 hover:border-[#1DB954]/30 transition-all group/link"
            >
              <ExternalLink className="w-4 h-4 text-[var(--meta)] group-hover/link:text-[#1DB954]" />
            </a>
          )}
        </div>

        <div>
          <h3 className={cn(
            "font-black tracking-tighter text-[var(--fg)] uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700",
            titleStyles[size as keyof typeof titleStyles]
          )}>
            Audio_Module
          </h3>
          <div className="flex items-center gap-3 mt-3">
             <div className="flex-1 h-px bg-[var(--card-border)] relative overflow-hidden">
                {data?.isPlaying && (
                  <motion.div 
                    className="absolute inset-0 bg-[#1DB954]/30"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                )}
             </div>
             <p className="text-[8px] font-mono text-[var(--meta)] group-hover:text-[var(--fg)] transition-all duration-700 uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 whitespace-nowrap">
               Stream: 320kbps_Enc
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
