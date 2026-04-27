# Design Spec: Live Presence Widget

Implementation of a real-time visitor counter as a Bento widget for the Project Lobby.

## Purpose
To make the lobby feel "alive" and less solitary by displaying the number of active visitors currently exploring the site.

## Architecture

### Backend: Pusher (Realtime Channels)
- Use **Pusher Channels** for easy management of presence.
- **Presence Channel**: `presence-lobby`
- **Authentication**: A Next.js API route `/api/presence/auth` to authorize users to join the presence channel with a unique (but anonymous) user ID.

### Frontend: PresenceWidget Component
- **Component**: `components/PresenceWidget.tsx`
- **Grid Size**: `small` (1x1)
- **Library**: `pusher-js` for the client-side connection.
- **Animations**: `framer-motion` for number transitions and the "Live" status pulse.

## Component Design (UI/UX)
- **Style**: Consistent with existing Bento widgets (`#050507` background, `white/5` border).
- **Layout**: 
  - Top left: Users icon (lucide-react).
  - Top right: "LIVE" status badge with a green pulsing dot.
  - Bottom: Large, bold, italic counter (e.g., "03") with "EXPLORERS_ONLINE" label in monospace.
- **Behavior**:
  - Shows a loading skeleton while connecting.
  - Smoothly increments/decrements the counter as people join or leave.

## Data Flow
1. User lands on `/`.
2. `PresenceWidget` initializes Pusher client.
3. Client calls `/api/presence/auth` to get a token.
4. Client joins `presence-lobby` channel.
5. Pusher returns the current member count.
6. Real-time updates via `member_added` and `member_removed` events.

## Security & Configuration
- **Credentials**: Store `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, and `PUSHER_CLUSTER` in `.env.local`.
- **Public Keys**: Expose `NEXT_PUBLIC_PUSHER_KEY` and `NEXT_PUBLIC_PUSHER_CLUSTER` to the client.
- **Anonymity**: The `/api/presence/auth` route will generate random IDs (e.g., `user_${Math.random()}`) to ensure visitor privacy.

## Dependencies
- `pusher-js`: Client library.
- `pusher`: Server-side SDK (for auth).

## Success Criteria
- Accurate real-time count of active visitors.
- Seamless integration into the existing Bento grid.
- Zero impact on performance for non-realtime parts of the lobby.
