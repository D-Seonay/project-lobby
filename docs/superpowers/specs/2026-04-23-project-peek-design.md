# Project Peek (Live Preview) Design Spec

Implementing a technical live preview "engine" that allows users to peek into projects via an expanded iframe modal without leaving the gallery.

## Goals
- Provide a "live preview" mode for projects.
- Use `layoutId` for a seamless expansion animation from the card.
- Maintain a "technical/cyberpunk" aesthetic with persistent overlays.
- Preserving direct navigation behavior.

## Components & Changes

### 1. `components/BentoCard.tsx`
- **State**: `isPeeking` (boolean).
- **Icons**: Use `Monitor` or `Eye` from `lucide-react`.
- **Button**: 
  - Positioned next to `StatusBadge`.
  - Visible only on hover.
  - Triggers `setIsPeeking(true)`.
- **Modal View**:
  - Rendered within `AnimatePresence`.
  - Uses `layoutId={`card-${project.id}}`.
  - `fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10`.
  - Contains:
    - `<iframe>` with `src={project.link}` and `loading="lazy"`.
    - `Close` button with icon.
    - Technical overlay layer.

### 2. `app/globals.css`
- **`.peek-overlay`**: Persistent scanline/noise effect.
- **`.connecting-overlay`**: Aesthetic "Connecting_Stream..." text and loading indicator.

### 3. Interaction Logic
- Clicking the Peek button stops propagation to prevent opening the link in a new tab.
- Escape key listener to close the modal.
- Disable 3D tilt while in peek mode for better usability within the modal.

## Architecture & Data Flow
- `BentoCard` manages its own modal state.
- `layoutId` handles the transition between the grid item and the modal.

## Tech Stack
- Next.js (App Router)
- Framer Motion (`layoutId`, `AnimatePresence`)
- Lucide React (Icons)
- Tailwind CSS

## Testing Strategy
- Manual verification of expansion animation.
- Check iframe loading and visibility of technical overlays.
- Verify ESC key behavior.
- Ensure direct clicks still work.
