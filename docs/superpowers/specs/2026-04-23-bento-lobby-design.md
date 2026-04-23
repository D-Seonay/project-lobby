# Design Spec: Creative Minimalist Bento Lobby

## 1. Executive Summary
A premium, single-page "lobby" built with Next.js and Tailwind CSS, featuring a minimalist Bento Grid layout. The project focuses on high-end aesthetics, smooth animations via Framer Motion, and a "live" feel through status badges and interactive widgets.

## 2. Technical Stack
*   **Framework:** Next.js 14+ (App Router, TypeScript)
*   **Styling:** Tailwind CSS (Vanilla CSS for custom animations if needed)
*   **Animations:** Framer Motion (staggered entry, hover tilts, layout transitions)
*   **Icons:** Lucide React
*   **Typography:** Geist Sans (default Vercel font)
*   **Deployment:** Vercel

## 3. Architecture & Data Flow
### Data Strategy
*   **Local Content:** All projects and card metadata stored in `/content/projects.json`.
*   **Dynamic Client-side:** "Live" status badges and GitHub stats fetched via standard browser `fetch` on the client to avoid blocking the initial SSR render.

### Grid Layout
*   **Grid System:** 4-column layout on desktop, 1-column on mobile.
*   **Density:** Minimalist (fewer, larger cards).
*   **Tile Types:**
    *   `big`: 2x2 grid (Primary projects)
    *   `wide`: 2x1 grid (Secondary info/Widgets)
    *   `small`: 1x1 grid (Social links/Small stats)

## 4. Components
### BentoGrid
The parent container managing the Responsive CSS Grid and Framer Motion staggered animation logic.

### BentoCard
A reusable component for all tiles, featuring:
*   Glassmorphism (Glass-blur, subtle borders).
*   Hover interactions (0.2s transition, subtle scale and tilt).
*   Dynamic background gradients or image overlays.

### StatusBadge
A pulsing "Live" indicator for services or "Available for work" status.

## 5. Visual Specifications
*   **Background:** Deep zinc/black (`bg-zinc-950`).
*   **Corner Radius:** `rounded-3xl` (24px).
*   **Glass Effect:** `bg-zinc-900/50 backdrop-blur-md border border-white/10`.
*   **Hover Glow:** A radial gradient following the cursor (optional polish).

## 6. Implementation Phases
1.  **Scaffolding:** Initialize Next.js app and install dependencies.
2.  **Data Layer:** Set up `projects.json` and basic TypeScript interfaces.
3.  **Core Components:** Build `BentoCard` and the responsive `BentoGrid`.
4.  **Animations:** Implement Framer Motion transitions and entry effects.
5.  **Status Features:** Integrate client-side fetching for "Live" indicators.

## 7. Success Criteria
*   Lighthouse Performance score > 90.
*   Fully responsive (Desktop, Tablet, Mobile).
*   Staggered loading animation works flawlessly.
