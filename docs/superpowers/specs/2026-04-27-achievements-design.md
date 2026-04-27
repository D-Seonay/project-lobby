# Design Spec: Secret Achievements System

Implementation of a hidden gamification layer with persistent secret badges.

## Purpose
To reward user curiosity and exploration through "Easter Egg" style achievements, reinforcing the technical and mysterious aesthetic of the lobby.

## Architecture

### AchievementProvider (Context API)
- A global React Context to manage:
  - `unlockedIds`: Array of achievement IDs stored in `localStorage`.
  - `unlock(id)`: Function to trigger an unlock and show notification.
  - `stats`: In-memory counters (e.g., project clicks) to track progress during a session.

### Persistent Storage
- Use `localStorage` to keep achievements unlocked across visits.
- Key: `seonay_achievements`

## Achievements Definitions
1.  **Night Owl** (`night-owl`):
    - Trigger: Visiting between 00:00 and 05:00.
    - Icon: Moon (Lucide).
    - Color: `#60a5fa` (Blue).
2.  **Explorer** (`explorer`):
    - Trigger: Clicking on 5 different projects (`BentoCard`).
    - Icon: Compass (Lucide).
    - Color: `#a78bfa` (Violet).
3.  **Developer** (`developer`):
    - Trigger: Opening browser DevTools.
    - Detection: Monitoring window resize threshold or console access property.
    - Icon: Code (Lucide).
    - Color: `#f472b6` (Pink).

## UI/UX: Achievement Toast
- **Component**: `AchievementToast.tsx`
- **Location**: Top-center of the screen.
- **Style**: 
  - Backdrop blur, `050507` background (semi-transparent).
  - Minimalist border matching the achievement color.
  - "ACHIEVEMENT_UNLOCKED" label in small monospace.
- **Animation**: `framer-motion` for slide-down entrance and fade-out exit.

## Success Criteria
- Achievements unlock only once.
- Data persists after page refresh.
- Toasts appear smoothly without breaking the grid layout.
