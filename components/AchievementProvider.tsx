'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AchievementToast } from './AchievementToast';

export type Achievement = {
  id: string;
  title: string;
  icon: string;
  color: string;
};

type AchievementContextType = {
  unlockedIds: string[];
  unlock: (id: string) => void;
  incrementProjectClicks: () => void;
};

const ACHIEVEMENTS: Record<string, Achievement> = {
  'night-owl': { id: 'night-owl', title: 'NIGHT_OWL', icon: 'Moon', color: '#60a5fa' },
  'explorer': { id: 'explorer', title: 'EXPLORER', icon: 'Compass', color: '#a78bfa' },
  'developer': { id: 'developer', title: 'DEVELOPER', icon: 'Code', color: '#f472b6' },
};

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('seonay_achievements');
    if (saved) {
      try {
        setUnlockedIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse achievements from localStorage', e);
      }
    }
  }, []);

  const unlock = useCallback((id: string) => {
    const achievement = ACHIEVEMENTS[id];
    if (!achievement) return;

    setUnlockedIds(prev => {
      if (prev.includes(id)) return prev;
      
      const newUnlocked = [...prev, id];
      localStorage.setItem('seonay_achievements', JSON.stringify(newUnlocked));
      
      // Trigger notification
      console.log(`🏆 Achievement Unlocked: ${achievement.title}`);
      setActiveToast(achievement);
      
      return newUnlocked;
    });
  }, []);

  const incrementProjectClicks = useCallback(() => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) unlock('explorer');
      return next;
    });
  }, [unlock]);

  const contextValue = useMemo(() => ({
    unlockedIds,
    unlock,
    incrementProjectClicks
  }), [unlockedIds, unlock, incrementProjectClicks]);

  return (
    <AchievementContext.Provider value={contextValue}>
      {children}
      <AnimatePresence>
        {activeToast && (
          <AchievementToast 
            achievement={activeToast} 
            onClose={() => setActiveToast(null)} 
          />
        )}
      </AnimatePresence>
    </AchievementContext.Provider>
  );
}

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) throw new Error('useAchievements must be used within AchievementProvider');
  return context;
};
