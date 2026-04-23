# SEONAY_LOBBY // V2.0.6

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-black?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-black?style=for-the-badge&logo=framer)

A premium, high-performance **Bento Grid Lobby** designed for the Seonay Studio ecosystem. This project serves as a technical command center and architectural archive, implementing a radical **Dark Mode Absolute** aesthetic.

## ⚡ Core Features

- **Real-Time Status Monitoring:** Integrated Ping API to monitor subdomains (`dev.`, `api.`, `github-readme.`) in real-time with dynamic visual indicators.
- **Radical Motion Design:** High-end orchestration using Framer Motion with custom cubic-bezier easing for a "Stealth" transition feel.
- **Brutalist Aesthetics:** Deep Zinc palette (#09090b), radical whitespace, and oversized typography inspired by digital galleries.
- **Tailwind 4 Architecture:** Optimized for the latest Next.js 15 features and the Tailwind CSS v4-alpha/beta theme engine.
- **Full SEO & Metadata:** Comprehensive OpenGraph configuration, JSON-LD structured data, and automated sitemap generation.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Typography:** Geist Sans & Mono
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/D-Seonay/project-lobby.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
├── app/
│   ├── api/ping/     # Real-time subdomain checker
│   ├── globals.css   # Tailwind 4 theme & radical styles
│   ├── layout.tsx    # SVG Grid background & Noise overlay
│   └── page.tsx      # Main digital gallery layout
├── components/       # Premium UI units (BentoGrid, BentoCard)
├── content/          # Source of truth (projects.json)
└── public/           # Branding assets (favicon.svg)
```

## 📡 Live Monitoring Logic

The system uses an internal API route to bypass CORS and check the availability of linked projects. 
- **System_Online:** Site responded with a 2xx status.
- **System_Offline:** Connection timed out or returned an error.

## ⚖️ License

© 2026 Mathéo Delaunay // Seonay Studio. All Rights Reserved.
Designed with surgical precision for the modern web.
