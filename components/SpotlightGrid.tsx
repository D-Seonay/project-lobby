'use client';

import React, { useRef, useState, createContext, useContext } from 'react';
import { motion, useMotionTemplate, useMotionValue, MotionValue } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SpotlightContextType {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  gridRef: React.RefObject<HTMLDivElement | null>;
}

const SpotlightContext = createContext<SpotlightContextType | null>(null);

export function useSpotlight() {
  const context = useContext(SpotlightContext);
  if (!context) return null;
  return context;
}

export function SpotlightGrid({ children, className }: { children: React.ReactNode, className?: string }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
    if (!gridRef.current) return;
    const { left, top } = gridRef.current.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <SpotlightContext.Provider value={{ mouseX, mouseY, gridRef }}>
      <div 
        ref={gridRef}
        onMouseMove={handleMouseMove}
        className={cn("relative group", className)}
      >
        {children}
      </div>
    </SpotlightContext.Provider>
  );
}

export function SpotlightOverlay() {
  const spotlight = useSpotlight();
  if (!spotlight) return null;

  const { mouseX, mouseY } = spotlight;

  return (
    <motion.div
      className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-10"
      style={{
        background: useMotionTemplate`
          radial-gradient(
            450px circle at ${mouseX}px ${mouseY}px,
            rgba(255, 255, 255, 0.04),
            transparent 80%
          )
        `,
      }}
    />
  );
}
