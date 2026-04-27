'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

type SettingsContextType = {
  shadersEnabled: boolean;
  toggleShaders: () => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [shadersEnabled, setShadersEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('seonay_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.shadersEnabled !== undefined) {
          setShadersEnabled(settings.shadersEnabled);
        }
      } catch (e) {
        console.error('Failed to parse settings from localStorage', e);
      }
    }
  }, []);

  const toggleShaders = useCallback(() => {
    setShadersEnabled(prev => {
      const next = !prev;
      localStorage.setItem('seonay_settings', JSON.stringify({ shadersEnabled: next }));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ shadersEnabled, toggleShaders }), [shadersEnabled, toggleShaders]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
