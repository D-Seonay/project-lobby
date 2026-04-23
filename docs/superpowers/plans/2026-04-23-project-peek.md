# Project Peek Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a live preview "peek" mode for project cards that expands into a modal with an iframe and technical overlays.

**Architecture:** Each `BentoCard` manages its own `isPeeking` state. Expanding into a modal is handled by Framer Motion's `layoutId` within an `AnimatePresence` block.

**Tech Stack:** Next.js, Framer Motion, Tailwind CSS, Lucide React.

---

### Task 1: Global Aesthetic Overlays

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add scanline and noise animations/styles**

```css
@layer utilities {
  .peek-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.1) 50%
    ), linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.03),
      rgba(0, 255, 0, 0.01),
      rgba(0, 0, 255, 0.03)
    );
    background-size: 100% 4px, 3px 100%;
  }

  .noise-bg {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    pointer-events: none;
    z-index: 11;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  @keyframes pulse-text {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .connecting-text {
    animation: pulse-text 2s infinite;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: add scanline and noise utilities for project peek"
```

---

### Task 2: BentoCard Peek Button & State

**Files:**
- Modify: `components/BentoCard.tsx`

- [ ] **Step 1: Add `isPeeking` state and imports**

```typescript
// Add to imports
import { AnimatePresence, Portal } from 'framer-motion'; // Check if Portal is needed or just fixed
import { Eye, X, Monitor } from 'lucide-react';

// Inside BentoCard component
const [isPeeking, setIsPeeking] = useState(false);
```

- [ ] **Step 2: Add the Peek button next to StatusBadge**

```tsx
<div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(50px)' }}>
  <motion.div layoutId={`icon-${project.id}`} className="text-[var(--meta)] group-hover:text-[var(--fg)] transition-colors duration-800">
    {Icon && <Icon className="w-5 h-5" />}
  </motion.div>
  <div className="flex items-center gap-2">
    {/* New Peek Button */}
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsPeeking(true);
      }}
      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 backdrop-blur-md"
      title="Live Peek"
    >
      <Monitor className="w-3.5 h-3.5 text-[var(--meta)] hover:text-[var(--fg)]" />
    </button>
    {project.isLive && currentSize !== 'small' && <StatusBadge url={project.link} />}
    {project.isLive && currentSize === 'small' && (
      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
    )}
  </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add components/BentoCard.tsx
git commit -m "feat: add isPeeking state and peek button to BentoCard"
```

---

### Task 3: Peek Modal Implementation

**Files:**
- Modify: `components/BentoCard.tsx`

- [ ] **Step 1: Wrap the entire return with AnimatePresence and add the Modal**

```tsx
return (
  <>
    <motion.a ...>
      {/* Existing Card Content */}
    </motion.a>

    <AnimatePresence>
      {isPeeking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPeeking(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Expanded Modal Content */}
          <motion.div
            layoutId={`card-${project.id}`}
            className="relative w-full max-w-6xl aspect-video bg-[#050507] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Header / Controls */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-4">
                <motion.div layoutId={`icon-${project.id}`}>
                  {Icon && <Icon className="w-5 h-5 text-[var(--meta)]" />}
                </motion.div>
                <motion.h3 layoutId={`title-${project.id}`} className="text-xl font-black italic uppercase tracking-tighter">
                  {project.title}
                </motion.h3>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500">Live_Stream</span>
                </div>
              </div>

              <button
                onClick={() => setIsPeeking(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Iframe & Overlays */}
            <div className="relative w-full h-full pt-16">
              <iframe
                src={project.link}
                className="w-full h-full border-none"
                loading="lazy"
              />
              
              {/* Technical Overlays */}
              <div className="peek-overlay" />
              <div className="noise-bg" />
              
              <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--meta)] connecting-text">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  Connecting_Stream...
                </div>
                <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
                  Encryption: AES-256-GCM | Protocol: WEBRTC_PEER
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </>
);
```

- [ ] **Step 2: Commit**

```bash
git add components/BentoCard.tsx
git commit -m "feat: implement project peek modal with iframe engine"
```

---

### Task 4: Interaction Refinement

**Files:**
- Modify: `components/BentoCard.tsx`

- [ ] **Step 1: Add ESC key listener and disable tilt when peeking**

```typescript
// Inside BentoCard component
useEffect(() => {
  if (isPeeking) {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPeeking(false);
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }
}, [isPeeking]);

// Update handleMouseMove to check for isPeeking
const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
  if (!cardRef.current || isPeeking) return; // Disable tilt during peek
  // ... rest of logic
};
```

- [ ] **Step 2: Commit**

```bash
git add components/BentoCard.tsx
git commit -m "feat: add ESC key support and disable tilt during peek"
```
