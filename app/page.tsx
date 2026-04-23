'use client';

import { motion } from 'framer-motion';
import { BentoGrid } from '@/components/BentoGrid';
import { BentoCard } from '@/components/BentoCard';
import { ProjectSkeleton } from '@/components/ProjectSkeleton';
import { SpotlightGrid } from '@/components/SpotlightGrid';
import { GitHubGraph } from '@/components/GitHubGraph';
import { CommandPalette } from '@/components/CommandPalette';
import { ControlCenterWidget } from '@/components/ControlCenterWidget';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const jsonLd = {
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
      "@type": "Organization",
      "name": "Seonay Studio"
    },
    "description": "Expert Next.js developer and digital designer specializing in high-performance architectural frameworks and radical dark mode experiments."
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CommandPalette />

      {/* Floating Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-800 ease-in-out">
        <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl">
          <div className="flex items-center gap-8">
            <a href="#home" className="text-[10px] font-mono uppercase tracking-widest text-[var(--fg)] hover:opacity-60 transition-all duration-300">Index</a>
            <a href="#work" className="text-[10px] font-mono uppercase tracking-widest text-[var(--meta)] hover:text-[var(--fg)] transition-all duration-300">Projects</a>
            <a href="#contact" className="text-[10px] font-mono uppercase tracking-widest text-[var(--meta)] hover:text-[var(--fg)] transition-all duration-300">Contact</a>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section id="home" className="pt-32 sm:pt-48 pb-32 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-12"
          >
            <div className="flex flex-col gap-4">
              <motion.div variants={itemVariants} className="font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--meta)] dark:text-zinc-500 flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-[var(--meta)] dark:bg-zinc-500 rounded-full animate-pulse" />
                SYSTEM_READY // EXECUTION_GRANTED
              </motion.div>
              <div className="flex flex-col gap-1">
                <motion.div variants={itemVariants} className="font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--meta)] dark:text-zinc-500 opacity-60">
                  System_Lobby // v2.0.6
                </motion.div>
                <motion.div variants={itemVariants} className="font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--meta)] dark:text-zinc-500 opacity-40">
                  System_Log // <span className="text-[var(--fg)] opacity-100">[K]</span> for Commands
                </motion.div>
              </div>
            </div>
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-8xl lg:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.7] text-[var(--fg)] dark:text-zinc-100">
              Seonay<br />
              <span className="text-[var(--accent)] outline-text opacity-40">Studio</span>
            </motion.h1>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="max-w-xs space-y-8"
          >
            <motion.p variants={itemVariants} className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--meta)] dark:text-zinc-500 leading-loose italic">
              // Radical dark mode experiments. High-performance digital architectural frameworks.
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-8 font-mono text-[9px] uppercase tracking-widest text-[var(--meta)] dark:text-zinc-500">
              <span>Nantes / FR</span>
              <span>127.0.0.1</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Section */}
      <section id="work" className="px-6 sm:px-12 lg:px-24">
        <h2 className="sr-only">Selected Projects</h2>
        <SpotlightGrid>
          <BentoGrid>
            {loading ? (
              <>
                <div className="lg:col-span-1 lg:row-span-1 p-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl animate-pulse min-h-[240px]" />
                {projects.map((p) => (
                  <ProjectSkeleton key={p.id} size={p.size} />
                ))}
                <div className="md:col-span-2 p-8 lg:p-12 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl animate-pulse flex flex-col justify-between min-h-[240px]">
                  <div className="w-8 h-8 bg-[var(--accent)] rounded-lg opacity-20" />
                  <div className="space-y-4">
                    <div className="h-8 w-48 bg-[var(--accent)] rounded opacity-20" />
                    <div className="h-20 w-full bg-[var(--accent)] rounded opacity-10" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <ControlCenterWidget />
                {projects.map((project) => (
                  <BentoCard key={project.id} project={project} />
                ))}
                <GitHubGraph />
              </>
            )}
          </BentoGrid>
        </SpotlightGrid>
      </section>

      {/* Contact Section */}
      <section id="contact" className="mt-32 sm:mt-[32rem] pb-32 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="flex flex-col gap-24"
          >
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-7xl lg:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.8] text-[var(--fg)] dark:text-zinc-100">
              PRÊT À<br />
              <span className="text-black dark:text-transparent outline-text dark:outline-text opacity-40">DÉPLOYER ?</span>
            </motion.h2>

            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
              <a
                href="mailto:matheodelaunay04@gmail.com"
                className="group relative px-12 py-6 bg-[var(--fg)] text-[var(--bg)] font-mono text-sm uppercase tracking-[0.2em] font-bold overflow-hidden transition-all hover:pr-16"
              >
                <span className="relative z-10">// Init_Communication</span>
                <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">→</span>
              </a>

              <div className="flex gap-12 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--meta)]">
                <a href="https://github.com/D-Seonay" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)] transition-colors duration-300 underline decoration-[var(--card-border)] underline-offset-8">GitHub</a>
                <a href="https://www.linkedin.com/in/matheo-delaunay/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)] transition-colors duration-300 underline decoration-[var(--card-border)] underline-offset-8">LinkedIn</a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 lg:px-24 border-t border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--meta)]">
          <div className="flex items-center gap-4">
            <div className="font-black text-xl tracking-tighter italic uppercase text-[var(--fg)]">
              Seonay<span className="text-[var(--meta)] opacity-40">_</span>
            </div>
            <span>// Terminal_Out</span>
          </div>
          <div>© 2026 Absolute Dark Design // All Rights Reserved</div>
        </div>
      </footer>
    </main>
  );
}
