# Live Presence Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a real-time visitor counter as a Bento widget using Pusher Presence Channels.

**Architecture:** Use Pusher's presence channels to track online users. A Next.js API route will handle authentication for these channels, and a client-side component will display the live count with smooth animations.

**Tech Stack:** Next.js (App Router), Pusher (pusher-js, pusher SDK), Framer Motion, Lucide React.

---

### Task 1: Environment & Dependencies

**Files:**
- Modify: `package.json`
- Modify: `.env.local` (create if missing)

- [ ] **Step 1: Install Pusher dependencies**

Run: `npm install pusher pusher-js`

- [ ] **Step 2: Add Pusher credentials to .env.local**

```bash
# Add these (user will need to provide actual values)
PUSHER_APP_ID="your_app_id"
NEXT_PUBLIC_PUSHER_KEY="your_key"
PUSHER_SECRET="your_secret"
NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install pusher dependencies"
```

---

### Task 2: Backend Authentication Route

**Files:**
- Create: `app/api/presence/auth/route.ts`

- [ ] **Step 1: Implement the auth route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const socketId = body.get('socket_id') as string;
  const channelName = body.get('channel_name') as string;

  // Generate a random user ID for anonymity
  const userId = `user_${Math.random().toString(36).slice(2, 9)}`;
  const presenceData = {
    user_id: userId,
    user_info: { name: 'Anonymous Explorer' },
  };

  const authResponse = pusher.authenticate(socketId, channelName, presenceData);
  return NextResponse.json(authResponse);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/presence/auth/route.ts
git commit -m "feat: add pusher presence auth route"
```

---

### Task 3: PresenceWidget Component

**Files:**
- Create: `components/PresenceWidget.tsx`

- [ ] **Step 1: Implement PresenceWidget with Pusher logic and UI**

```tsx
'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function PresenceWidget({ size = 'small' }: { size?: 'small' }) {
  const [count, setCount] = useState<number>(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/presence/auth',
    });

    const channel = pusher.subscribe('presence-lobby');

    channel.bind('pusher:subscription_succeeded', (members: any) => {
      setCount(members.count);
      setConnected(true);
    });

    channel.bind('pusher:member_added', () => {
      setCount((prev) => prev + 1);
    });

    channel.bind('pusher:member_removed', () => {
      setCount((prev) => Math.max(0, prev - 1));
    });

    return () => {
      pusher.unsubscribe('presence-lobby');
      pusher.disconnect();
    };
  }, []);

  return (
    <div className={cn(
      "relative group overflow-hidden flex flex-col justify-between",
      "bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] dark:bg-[#050507] dark:border-white/5 rounded-3xl p-6 col-span-1 row-span-1"
    )}>
      <div className="flex justify-between items-start relative z-10">
        <div className="text-[var(--meta)]">
          <Users className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
          />
          <span className="text-[8px] font-mono font-bold text-emerald-500 uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="mt-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-4xl sm:text-5xl font-black italic tracking-tighter text-[var(--fg)] leading-none"
          >
            {connected ? count.toString().padStart(2, '0') : '--'}
          </motion.div>
        </AnimatePresence>
        <p className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-[0.2em] mt-2">
          Explorers_Online
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/PresenceWidget.tsx
git commit -m "feat: implement PresenceWidget with Pusher integration"
```

---

### Task 4: Integration in Main Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add PresenceWidget to the Bento grid**

```tsx
// Around line 13
import { PresenceWidget } from '@/components/PresenceWidget';

// In the grid (around line 120)
<PresenceWidget />
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: integrate PresenceWidget into the lobby grid"
```
