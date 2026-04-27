'use client';

import { useEffect } from 'react';
import { useAchievements } from './AchievementProvider';

export function ConsoleDetector() {
  const { unlock, unlockedIds } = useAchievements();
  const isUnlocked = unlockedIds.includes('developer');

  useEffect(() => {
    if (isUnlocked) return;

    // Clever trick to detect DevTools: using a getter on a console.log object
    let devtoolsOpen = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: () => {
        devtoolsOpen = true;
        unlock('developer');
      },
    });

    const interval = setInterval(() => {
      console.log(element);
    }, 1000);

    // Another trick: check window dimensions
    const checkDimensions = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        unlock('developer');
      }
    };

    window.addEventListener('resize', checkDimensions);
    checkDimensions();

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkDimensions);
    };
  }, [unlock, isUnlocked]);

  return null;
}
