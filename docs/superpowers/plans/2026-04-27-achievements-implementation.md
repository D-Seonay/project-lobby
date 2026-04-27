# Secret Achievements System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a hidden achievement system with persistent secret badges and ephemeral notifications.

**Architecture:** Use a React Context (`AchievementProvider`) to manage unlocked badges and a toast system for notifications.

**Tech Stack:** Next.js, Framer Motion, Lucide React, LocalStorage.

---

### Task 1: AchievementProvider & Persistence

**Files:**
- Create: `components/AchievementProvider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create AchievementProvider with context and localStorage logic**

```tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
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
    if (saved) setUnlockedIds(JSON.parse(saved));
  }, []);

  const unlock = (id: string) => {
    if (unlockedIds.includes(id)) return;
    
    const newUnlocked = [...unlockedIds, id];
    setUnlockedIds(newUnlocked);
    localStorage.setItem('seonay_achievements', JSON.stringify(newUnlocked));
    setActiveToast(ACHIEVEMENTS[id]);
  };

  const incrementProjectClicks = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) unlock('explorer');
      return next;
    });
  };

  return (
    <AchievementContext.Provider value={{ unlockedIds, unlock, incrementProjectClicks }}>
      {children}
      {activeToast && (
        <AchievementToast 
          achievement={activeToast} 
          onClose={() => setActiveToast(null)} 
        />
      )}
    </AchievementContext.Provider>
  );
}

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) throw new Error('useAchievements must be used within AchievementProvider');
  return context;
};
```

- [ ] **Step 2: Wrap RootLayout with AchievementProvider**

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx components/AchievementProvider.tsx
git commit -m "feat: add AchievementProvider and layout integration"
```

---

### Task 2: AchievementToast Component

**Files:**
- Create: `components/AchievementToast.tsx`

- [ ] **Step 1: Implement the minimalist toast UI**

```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useEffect } from 'react';

export function AchievementToast({ achievement, onClose }: { achievement: any, onClose: () => void }) {
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
```

- [ ] **Step 2: Commit**

```bash
git add components/AchievementToast.tsx
git commit -m "feat: add AchievementToast component"
```

---

### Task 3: Trigger Implementation

**Files:**
- Modify: `app/page.tsx` (Night Owl)
- Modify: `components/BentoCard.tsx` (Explorer)
- Create: `components/ConsoleDetector.tsx` (Developer)

- [ ] **Step 1: Trigger Night Owl in Home component**

```tsx
const { unlock } = useAchievements();
useEffect(() => {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) unlock('night-owl');
}, []);
```

- [ ] **Step 2: Trigger Explorer in BentoCard**

```tsx
const { incrementProjectClicks } = useAchievements();
// In onClick handler
incrementProjectClicks();
```

- [ ] **Step 3: Implement ConsoleDetector**

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/BentoCard.tsx components/ConsoleDetector.tsx
git commit -m "feat: implement achievement triggers"
```
