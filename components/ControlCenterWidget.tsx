'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Clock, Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';
import { useSpotlight } from './SpotlightGrid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ControlCenterWidget({ size = 'small' }: { size?: 'small' | 'wide' | 'big' }) {
  const [time, setTime] = useState<string>('');
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
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
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Fetch weather (Open-Meteo for Nantes: 47.2184, -1.5536)
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=47.2184&longitude=-1.5536&current_weather=true');
        const data = await res.json();
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          code: data.current_weather.weathercode
        });
      } catch (err) {
        console.error('Weather fetch error:', err);
      }
    };

    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 600000); // 10 min

    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
    };
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-5 h-5 text-yellow-500" />;
    if (code <= 3) return <Cloud className="w-5 h-5 text-zinc-400" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-5 h-5 text-blue-400" />;
    return <Wind className="w-5 h-5 text-zinc-500" />;
  };

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
      
      <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(50px)' }}>
        <div className="text-[var(--meta)] group-hover:text-[var(--fg)] transition-colors duration-800">
          <Clock className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-widest">Nantes_Local</span>
          <span className="text-xl font-black text-[var(--fg)] italic">{time || '00:00:00'}</span>
        </div>
      </div>

      <div className="relative z-10 mt-auto flex flex-col gap-6" style={{ transform: 'translateZ(50px)' }}>
        <div 
          className={cn(
            "flex items-center bg-[var(--accent)]/30 border border-[var(--card-border)] rounded-2xl transition-all duration-700",
            size === 'small' ? "gap-2 p-2" : "gap-4 p-4"
          )} 
        >
          {weather ? (
            <>
              {getWeatherIcon(weather.code)}
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-[var(--meta)] uppercase tracking-widest leading-none mb-1">Meteo_Sync</span>
                <span className={cn(
                  "font-black text-[var(--fg)] italic leading-none",
                  size === 'small' ? "text-lg" : "text-2xl"
                )}>{weather.temp}°C</span>
              </div>
              {size !== 'small' && (
                <div className="ml-auto flex gap-2">
                  <div className="w-1 h-8 bg-[var(--card-border)] rounded-full overflow-hidden">
                    <motion.div 
                      className="w-full bg-emerald-500"
                      initial={{ height: "0%" }}
                      animate={{ height: "65%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                  <div className="w-1 h-8 bg-[var(--card-border)] rounded-full overflow-hidden">
                    <motion.div 
                      className="w-full bg-blue-500"
                      initial={{ height: "0%" }}
                      animate={{ height: "40%" }}
                      transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="animate-pulse flex items-center gap-4">
              <div className="w-5 h-5 bg-zinc-800 rounded-full" />
              <div className="h-6 w-12 bg-zinc-800 rounded" />
            </div>
          )}
        </div>

        <div>
          <h3 className={cn(
            "font-black tracking-tighter text-[var(--fg)] uppercase italic leading-[0.8] group-hover:translate-x-1 transition-transform duration-700",
            titleStyles[size]
          )}>
            Control_Station
          </h3>
          <p className="text-[9px] font-mono text-[var(--meta)] group-hover:text-[var(--fg)] transition-all duration-700 uppercase tracking-[0.3em] mt-3 opacity-60 group-hover:opacity-100 line-clamp-1">
            Environment telemetry // calibrated
          </p>
        </div>
      </div>
    </motion.div>
  );
}
