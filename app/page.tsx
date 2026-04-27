'use client';

import { motion } from 'framer-motion';
import { BentoGrid } from '@/components/BentoGrid';
import { BentoCard } from '@/components/BentoCard';
import { SocialMediaWidget } from '@/components/SocialMediaWidget';
import { ProjectSkeleton } from '@/components/ProjectSkeleton';
import { SpotlightGrid } from '@/components/SpotlightGrid';
import { GitHubGraph } from '@/components/GitHubGraph';
import { CommandPalette } from '@/components/CommandPalette';
import { ControlCenterWidget } from '@/components/ControlCenterWidget';
import { MoonPhaseWidget } from '@/components/MoonPhaseWidget';
import { DayNightCycleWidget } from '@/components/DayNightCycleWidget';
import { WallOfLoveWidget } from '@/components/WallOfLoveWidget';
import { QuickAccessWidget } from '@/components/QuickAccessWidget';
import { TechRadarWidget } from '@/components/TechRadarWidget';
import { BuildStatsWidget } from '@/components/BuildStatsWidget';
import { SpotifyWidget } from '@/components/SpotifyWidget';
import { DiscordStatusWidget } from '@/components/DiscordStatusWidget';
import { PresenceWidget } from '@/components/PresenceWidget';
import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';
import { useEffect, useState } from 'react';

export default function Home() {
  const projects = projectsData as Project[];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mathéo Delaunay",
    "jobTitle": "Next.js Developer & Digital Designer",
    "url": "https://lobby.seonay.com",
    "sameAs": [
      "https://github.com/D-Seonay",
      "https://www.linkedin.com/in/matheo-delaunay/"
    ],
    "worksFor": {
      "@id": "https://lobby.seonay.com/#organization"
    },
    "description": "Expert Next.js developer and digital designer specializing in high-performance architectural frameworks and radical dark mode experiments."
  };

  const studioJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://lobby.seonay.com/#organization",
    "name": "Seonay Studio",
    "url": "https://lobby.seonay.com",
    "logo": "https://lobby.seonay.com/favicon.svg",
    "image": "https://lobby.seonay.com/api/og",
    "description": "Studio de création digitale spécialisé dans le développement Next.js et le design d'interfaces haute performance.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nantes",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.2184,
      "longitude": -1.5536
    },
    "priceRange": "$$$"
  };

  return (
    <main className="min-h-screen pt-12 pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studioJsonLd) }}
      />
      <CommandPalette />

      <section id="hero" className="sr-only">
        <h1>Mathéo Delaunay — Seonay Studio</h1>
        <p>Développeur Next.js & Designer Digital à Nantes. Création d'écosystèmes numériques radicaux et performants.</p>
      </section>

      {/* Bento Grid Only */}
      <section id="work" className="px-4 sm:px-12 lg:px-24">
        <div className="mb-8 sr-only">
          <h2>Portfolio & Projets</h2>
          <p>Exploration de mes derniers travaux en développement web et design architectural.</p>
        </div>
        <SpotlightGrid>
          <BentoGrid>
            {loading ? (
              <>
                <ProjectSkeleton size="xl" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="wide" />
                <ProjectSkeleton size="wide" />
                <ProjectSkeleton size="big" />
                <ProjectSkeleton size="big" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="wide" />
                <ProjectSkeleton size="wide" />
                <ProjectSkeleton size="wide" />
              </>
            ) : (
              <>
                <BentoCard project={projects[0]} size="xl" />
                <ControlCenterWidget size="small" />
                <QuickAccessWidget />
                <PresenceWidget />
                <BentoCard project={projects[1]} size="wide" />
                <BentoCard project={projects[3]} size="wide" />
                <SpotifyWidget size="wide" />
                <SocialMediaWidget size="big" />
                <BentoCard project={projects[4]} size="big" />
                <BentoCard project={projects[2]} size="small" />
                <BentoCard project={projects[5]} size="small" />
                <BentoCard project={projects[6]} size="wide" />
                <GitHubGraph size="wide" />
                <DiscordStatusWidget size="wide" />
                <MoonPhaseWidget size="wide" />
                <DayNightCycleWidget />
                <BuildStatsWidget size="small" />
              </>
            )}
          </BentoGrid>
        </SpotlightGrid>
      </section>

      {/* Minimal Technical Footer */}
      <footer className="mt-32 py-12 px-6 sm:px-12 lg:px-24 border-t border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--meta)]">
          <div className="flex items-center gap-4">
            <div className="font-black text-xl tracking-tighter italic uppercase text-[var(--fg)]">
              Seonay<span className="text-[var(--meta)] opacity-40">_</span>
            </div>
            <span>// LOBBY.V2</span>
          </div>
          <div>© 2026 // [K] FOR COMMANDS</div>
        </div>
      </footer>
    </main>
  );
}
