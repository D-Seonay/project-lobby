'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useEffect } from 'react';
import { Achievement } from './AchievementProvider';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const Icon = (Icons as any)[achievement.icon];

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-8 left-0 right-0 z-[10000] flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="pointer-events-auto flex items-center gap-4 px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border rounded-2xl shadow-2xl"
        style={{ borderColor: `${achievement.color}33` }}
      >
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${achievement.color}22`, color: achievement.color }}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-[8px] font-mono uppercase tracking-[0.2em] opacity-40 mb-1" style={{ color: achievement.color }}>
            Achievement_Unlocked
          </p>
          <h4 className="text-lg font-black italic tracking-tighter uppercase text-white">
            {achievement.title}
          </h4>
        </div>
      </motion.div>
    </div>
  );
}
