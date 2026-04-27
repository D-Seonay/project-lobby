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

  // Load achievements on mount
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
    if (!ACHIEVEMENTS[id]) return;
    setUnlockedIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  // Persist achievements and trigger notifications
  useEffect(() => {
    if (unlockedIds.length === 0) return;
    
    const saved = localStorage.getItem('seonay_achievements');
    const parsedSaved: string[] = saved ? JSON.parse(saved) : [];
    
    // Find new achievements not yet in localStorage
    const newlyUnlocked = unlockedIds.filter(id => !parsedSaved.includes(id));
    
    if (newlyUnlocked.length > 0) {
      localStorage.setItem('seonay_achievements', JSON.stringify(unlockedIds));
      
      // Trigger toast for the most recent one
      const latestId = newlyUnlocked[newlyUnlocked.length - 1];
      const achievement = ACHIEVEMENTS[latestId];
      if (achievement) {
        setActiveToast(achievement);
        console.log(`🏆 Achievement Unlocked: ${achievement.title}`);
      }
    }
  }, [unlockedIds]);

  const incrementProjectClicks = useCallback(() => {
    setClickCount(prev => prev + 1);
  }, []);

  // Explorer achievement logic
  useEffect(() => {
    if (clickCount >= 5) {
      unlock('explorer');
    }
  }, [clickCount, unlock]);

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
