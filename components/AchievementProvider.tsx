'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

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
    if (unlockedIds.includes(id)) return;
    
    const achievement = ACHIEVEMENTS[id];
    if (!achievement) return;

    const newUnlocked = [...unlockedIds, id];
    setUnlockedIds(newUnlocked);
    localStorage.setItem('seonay_achievements', JSON.stringify(newUnlocked));
    
    // Trigger notification
    console.log(`🏆 Achievement Unlocked: ${achievement.title}`);
    setActiveToast(achievement);
  }, [unlockedIds]);

  const incrementProjectClicks = useCallback(() => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) unlock('explorer');
      return next;
    });
  }, [unlock]);

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => setActiveToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const contextValue = useMemo(() => ({
    unlockedIds,
    unlock,
    incrementProjectClicks
  }), [unlockedIds, unlock, incrementProjectClicks]);

  return (
    <AchievementContext.Provider value={contextValue}>
      {children}
      {/* AchievementToast will be integrated here in Task 2 */}
      {activeToast && (
        <div className="hidden">
          {/* Temporary placeholder to acknowledge activeToast exists in state */}
        </div>
      )}
    </AchievementContext.Provider>
  );
}

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) throw new Error('useAchievements must be used within AchievementProvider');
  return context;
};
