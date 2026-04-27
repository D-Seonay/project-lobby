# Design Spec: Real Contact QR Code (VCard)

Implementation of a dynamic QR code that, when scanned, imports contact details (VCard) directly into the user's phone.

## Purpose
To replace the static placeholder QR icon with a functional networking tool, allowing visitors to instantly save contact information.

## Architecture

### Data Format: VCard 3.0
- Format: `BEGIN:VCARD`, `VERSION:3.0`, `FN:Mathéo Delaunay`, etc.
- Content:
  - Name: Mathéo Delaunay
  - Job: Next.js Developer & Digital Designer
  - Email: matheo@seonay.com (Placeholder)
  - URL: https://seonay.com
  - LinkedIn: https://www.linkedin.com/in/matheo-delaunay/

### QR Generation: qrcode.react
- Library: `qrcode.react` (lightweight, SVG support).
- Implementation: A dedicated component `ContactQRCode.tsx` to handle the string generation and rendering.

## UI/UX: QuickAccessWidget Integration
- **Container**: The existing white/glass square in the `QuickAccessWidget`.
- **Styling**: 
  - Render as SVG for maximum sharpness.
  - Transparent background or white container to ensure readability.
  - Subtle hover animation (scale/lift) consistent with other Bento cards.
- **Labels**: Small monospace "SCAN_TO_CONNECT" or "VCARD_SYNC" label.

## Dependencies
- `qrcode.react`: For SVG QR code generation.

## Success Criteria
- QR code is scannable by iOS and Android native cameras.
- Scanning triggers the "Add Contact" prompt on mobile devices.
- Integration is seamless with the existing `QuickAccessWidget` layout.
