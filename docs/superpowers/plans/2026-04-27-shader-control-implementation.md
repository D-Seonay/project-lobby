# Global Shader Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a global toggle for liquid shaders, accessible via the Command Palette and persistent in localStorage.

**Architecture:** Use a React Context (`SettingsProvider`) to manage the `shadersEnabled` state. Modify `LiquidShader` to conditionally render based on this state.

**Tech Stack:** Next.js, React Context, LocalStorage.

---

### Task 1: SettingsProvider & Layout Integration

**Files:**
- Create: `components/SettingsProvider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create SettingsProvider with persistence**

```tsx
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
      const settings = JSON.parse(saved);
      if (settings.shadersEnabled !== undefined) {
        setShadersEnabled(settings.shadersEnabled);
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
```

- [ ] **Step 2: Wrap RootLayout with SettingsProvider**

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx components/SettingsProvider.tsx
git commit -m "feat: add SettingsProvider for global UI control"
```

---

### Task 2: Conditional Shader Rendering

**Files:**
- Modify: `components/LiquidShader.tsx`

- [ ] **Step 1: Update LiquidShader to respect global state**

```tsx
// Inside LiquidShader component
const { shadersEnabled } = useSettings();

if (!shadersEnabled) return null;
```

- [ ] **Step 2: Commit**

```bash
git add components/LiquidShader.tsx
git commit -m "feat: make LiquidShader respect global shadersEnabled state"
```

---

### Task 3: Command Palette Integration

**Files:**
- Modify: `components/CommandPalette.tsx`

- [ ] **Step 1: Add "Toggle Effects" command**

```tsx
// Around entry logic
{
  id: 'toggle-shaders',
  title: shadersEnabled ? 'DISABLE_FX_ENGINE' : 'ENABLE_FX_ENGINE',
  icon: 'Zap',
  action: () => toggleShaders(),
}
```

- [ ] **Step 2: Commit**

```bash
git add components/CommandPalette.tsx
git commit -m "feat: add shader toggle to command palette"
```
