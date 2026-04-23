'use client';

import { useState, useRef } from 'react';
import { motion, useMotionTemplate, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, QrCode, Copy, Check } from 'lucide-react';
import { useSpotlight } from './SpotlightGrid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function QuickAccessWidget() {
  const [copiedType, setCopiedType] = useState<'email' | 'discord' | null>(null);
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

  const handleCopy = (text: string, type: 'email' | 'discord') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
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
        "bg-zinc-100/80 backdrop-blur-md border border-zinc-200 hover:border-zinc-400 dark:bg-zinc-900/50 dark:border-white/5 dark:hover:border-white/20 rounded-3xl p-5",
        "col-span-1 row-span-1"
      )}
    >
      {spotlight && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"
          style={{ background: spotlightBg }}
        />
      )}

      {/* Header Info */}
      <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-none mb-1">Efficiency_Module</span>
          <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 italic">QUICK_ACCESS</span>
        </div>
        <div className="p-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700">
          <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-col gap-2 mt-4" style={{ transform: 'translateZ(40px)' }}>
        <button
          onClick={() => handleCopy('matheodelaunay04@gmail.com', 'email')}
          className="group/btn relative flex items-center justify-between p-2.5 bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-700/50 rounded-xl hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 transition-all duration-300 outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/20"
        >
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:text-zinc-900 dark:group-hover/btn:text-zinc-100 transition-colors" />
            <span className="text-[9px] font-mono font-bold text-zinc-600 dark:text-zinc-400 group-hover/btn:text-zinc-900 dark:group-hover/btn:text-zinc-100 uppercase tracking-tighter">Copy_Email</span>
          </div>
          <AnimatePresence mode="wait">
            {copiedType === 'email' ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-1 text-[8px] font-mono text-emerald-600 dark:text-emerald-400 font-black"
              >
                <Check className="w-3 h-3" />
                <span>COPIED</span>
              </motion.div>
            ) : (
              <motion.div key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Copy className="w-3 h-3 text-zinc-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => handleCopy('d_seonay', 'discord')}
          className="group/btn relative flex items-center justify-between p-2.5 bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-700/50 rounded-xl hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 transition-all duration-300 outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/20"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:text-zinc-900 dark:group-hover/btn:text-zinc-100 transition-colors" />
            <span className="text-[9px] font-mono font-bold text-zinc-600 dark:text-zinc-400 group-hover/btn:text-zinc-900 dark:group-hover/btn:text-zinc-100 uppercase tracking-tighter">Copy_Discord</span>
          </div>
          <AnimatePresence mode="wait">
            {copiedType === 'discord' ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-1 text-[8px] font-mono text-emerald-600 dark:text-emerald-400 font-black"
              >
                <Check className="w-3 h-3" />
                <span>COPIED</span>
              </motion.div>
            ) : (
              <motion.div key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Copy className="w-3 h-3 text-zinc-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* QR Code */}
      <div className="relative z-10 mt-auto flex justify-center" style={{ transform: 'translateZ(20px)' }}>
        <motion.div
          whileHover={{
            scale: 1.25,
            translateZ: 80,
            rotateZ: [0, 5, -5, 0],
            transition: { duration: 0.4, ease: "easeOut" }
          }}
          className="relative p-2 bg-white dark:bg-zinc-100 rounded-lg shadow-xl border border-zinc-200 dark:border-white/10"
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <QrCode className="w-10 h-10 text-zinc-900" />
            {/* Stylized QR bits */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-zinc-900" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-zinc-900" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-zinc-900" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-zinc-900" />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-zinc-900 text-white text-[6px] font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            SCAN_VCARD
          </div>
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
        <QrCode className="w-24 h-24 text-zinc-900 dark:text-white" />
      </div>
    </motion.div>
  );
}
