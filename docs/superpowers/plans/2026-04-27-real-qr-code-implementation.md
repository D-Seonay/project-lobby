# Real Contact QR Code (VCard) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static QR icon with a functional, scannable VCard QR code.

**Architecture:** Use `qrcode.react` to generate an SVG-based QR code containing a formatted VCard 3.0 string.

**Tech Stack:** React, qrcode.react, Lucide React.

---

### Task 1: Dependencies & Base Component

**Files:**
- Modify: `package.json`
- Create: `components/ContactQRCode.tsx`

- [ ] **Step 1: Install qrcode.react**

Run: `npm install qrcode.react`

- [ ] **Step 2: Create ContactQRCode component with VCard logic**

```tsx
'use client';

import { QRCodeSVG } from 'qrcode.react';
import React from 'react';

export function ContactQRCode({ size = 120 }: { size?: number }) {
  // VCard 3.0 format
  const vCardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Mathéo Delaunay',
    'ORG:Seonay Studio',
    'TITLE:Next.js Developer & Digital Designer',
    'EMAIL;TYPE=work:contact@seonay.studio',
    'URL:https://seonay.com',
    'ADR;TYPE=work:;;Nantes;;;France',
    'X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/matheo-delaunay/',
    'END:VCARD'
  ].join('\n');

  return (
    <div className="relative bg-white p-2 rounded-lg shadow-inner">
      <QRCodeSVG 
        value={vCardData} 
        size={size}
        level="H" // High error correction
        includeMargin={false}
        imageSettings={{
            src: "/favicon.svg",
            x: undefined,
            y: undefined,
            height: 20,
            width: 20,
            excavate: true,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json components/ContactQRCode.tsx
git commit -m "feat: add qrcode.react and ContactQRCode component"
```

---

### Task 2: Integration in QuickAccessWidget

**Files:**
- Modify: `components/QuickAccessWidget.tsx`

- [ ] **Step 1: Replace placeholder icon with ContactQRCode**

```tsx
// Around line 13
import { ContactQRCode } from './ContactQRCode';

// Replace the <QrCode /> div (around line 196) with:
<div className="relative w-12 h-12 flex items-center justify-center overflow-hidden rounded-md border border-zinc-200">
  <ContactQRCode size={48} />
</div>
```

- [ ] **Step 2: Update the hover/expanded view if necessary**

- [ ] **Step 3: Commit**

```bash
git add components/QuickAccessWidget.tsx
git commit -m "feat: integrate real ContactQRCode into QuickAccessWidget"
```
