# Bento Lobby Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, single-page minimalist Bento Lobby using Next.js 14+, Tailwind CSS, and Framer Motion.

**Architecture:** Single-page Next.js app with a centralized `projects.json` for content. Uses a responsive 4-column grid (desktop) that collapses to 1-column (mobile).

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React.

---

### Task 1: Project Initialization

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

- [ ] **Step 1: Scaffold Next.js project**

Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --yes`

- [ ] **Step 2: Install additional dependencies**

Run: `npm install framer-motion lucide-react clsx tailwind-merge`

- [ ] **Step 3: Configure Tailwind for Bento**

Modify `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '3xl': '1.5rem', // 24px
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Commit initialization**

```bash
git add .
git commit -m "chore: initialize next.js project with bento config"
```

---

### Task 2: Data Schema & Content

**Files:**
- Create: `types/project.ts`
- Create: `content/projects.json`

- [ ] **Step 1: Define Project interface**

Create `types/project.ts`:
```typescript
export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  size: 'small' | 'wide' | 'big';
  tags?: string[];
  bg?: string; // Tailwind class or hex
  icon?: string; // Lucide icon name
  isLive?: boolean;
}
```

- [ ] **Step 2: Create initial content**

Create `content/projects.json`:
```json
[
  {
    "id": "portfolio",
    "title": "Portfolio 2026",
    "description": "Mon univers créatif",
    "link": "https://example.com",
    "size": "big",
    "tags": ["Design", "Next.js"],
    "bg": "bg-gradient-to-br from-indigo-500 to-purple-600",
    "isLive": true
  },
  {
    "id": "github",
    "title": "GitHub",
    "description": "82 Repos",
    "link": "https://github.com",
    "size": "small",
    "icon": "Github"
  }
]
```

- [ ] **Step 3: Commit data layer**

```bash
git add types/project.ts content/projects.json
git commit -m "feat: add project types and initial content"
```

---

### Task 3: StatusBadge Component (Live Indicator)

**Files:**
- Create: `components/StatusBadge.tsx`

- [ ] **Step 1: Write the StatusBadge component**

Create `components/StatusBadge.tsx`:
```tsx
'use client';

export function StatusBadge({ text = "Live" }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
        {text}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Commit StatusBadge**

```bash
git add components/StatusBadge.tsx
git commit -m "feat: add pulsing StatusBadge component"
```

---

### Task 4: BentoCard Component

**Files:**
- Create: `components/BentoCard.tsx`

- [ ] **Step 1: Implement BentoCard with Framer Motion**

Create `components/BentoCard.tsx`:
```tsx
'use client';

import { motion } from 'framer-motion';
import { Project } from '@/types/project';
import { StatusBadge } from './StatusBadge';
import * as Icons from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function BentoCard({ project }: { project: Project }) {
  const Icon = project.icon ? (Icons as any)[project.icon] : null;

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    wide: 'col-span-2 row-span-1',
    big: 'col-span-2 row-span-2',
  };

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02, rotate: 0.5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative group p-6 rounded-3xl overflow-hidden flex flex-col justify-between",
        "bg-zinc-900/50 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors",
        sizeClasses[project.size],
        project.bg
      )}
    >
      <div className="flex justify-between items-start">
        {Icon && <Icon className="w-6 h-6 text-white/70" />}
        {project.isLive && <StatusBadge />}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-white/60 mt-1">{project.description}</p>
      </div>
    </motion.a>
  );
}
```

- [ ] **Step 2: Commit BentoCard**

```bash
git add components/BentoCard.tsx
git commit -m "feat: add interactive BentoCard component"
```

---

### Task 5: BentoGrid & Main Page

**Files:**
- Create: `components/BentoGrid.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Implement BentoGrid**

Create `components/BentoGrid.tsx`:
```tsx
'use client';

import { motion } from 'framer-motion';

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto p-4"
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Set up Main Page**

Modify `app/page.tsx`:
```tsx
import { BentoGrid } from '@/components/BentoGrid';
import { BentoCard } from '@/components/BentoCard';
import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';

export default function Home() {
  const projects = projectsData as Project[];

  return (
    <main className="min-h-screen bg-zinc-950 py-20 px-4">
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Lobby <span className="text-zinc-500">/ 2026</span>
        </h1>
        <p className="text-zinc-400 mt-2">Mes projets & univers créatif.</p>
      </div>
      
      <BentoGrid>
        {projects.map((project) => (
          <BentoCard key={project.id} project={project} />
        ))}
      </BentoGrid>
    </main>
  );
}
```

- [ ] **Step 3: Add Global Styles**

Modify `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

body {
  background: #09090b; /* zinc-950 */
}
```

- [ ] **Step 4: Commit UI Assembly**

```bash
git add components/BentoGrid.tsx app/page.tsx app/globals.css
git commit -m "feat: assemble bento grid and main page"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Run dev server**

Run: `npm run dev`

- [ ] **Step 2: Check responsiveness**
- [ ] **Step 3: Verify animations**
- [ ] **Step 4: Build project**

Run: `npm run build`
Expected: Successful production build.
