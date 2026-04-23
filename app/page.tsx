'use client';

import { motion } from 'framer-motion';
import { BentoGrid } from '@/components/BentoGrid';
import { BentoCard } from '@/components/BentoCard';
import { ProjectSkeleton } from '@/components/ProjectSkeleton';
import { SpotlightGrid } from '@/components/SpotlightGrid';
import { GitHubGraph } from '@/components/GitHubGraph';
import { CommandPalette } from '@/components/CommandPalette';
import { ThemeToggle } from '@/components/ThemeToggle';
import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';
import { useEffect, useState } from 'react';

export default function Home() {
  const projects = projectsData as Project[];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial delay for UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
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
      {/* Floating Navigation Pill */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out">
        <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl">
          <div className="flex items-center gap-8">
            <a href="#home" className="text-[10px] font-mono uppercase tracking-widest text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Index</a>
            <a href="#work" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Projects</a>
            <a href="#contact" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800/50" />
          <ThemeToggle />
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
              <motion.div variants={itemVariants} className="font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-600 flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-pulse" />
                SYSTEM_READY // EXECUTION_GRANTED
              </motion.div>
              <motion.div variants={itemVariants} className="font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-700">
                System_Lobby // v2.0.6
              </motion.div>
            </div>
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-8xl lg:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.7] text-zinc-900 dark:text-zinc-100">
              Seonay<br />
              <span className="text-zinc-900 outline-text">Studio</span>
            </motion.h1>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="max-w-xs space-y-8"
          >
            <motion.p variants={itemVariants} className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 leading-loose italic">
              // Radical dark mode experiments. High-performance digital architectural frameworks.
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-8 font-mono text-[9px] uppercase tracking-widest text-zinc-700">
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
                {projects.map((p) => (
                  <ProjectSkeleton key={p.id} size={p.size} />
                ))}
                {/* Skeleton for GitHubGraph */}
                <div className="md:col-span-2 p-8 lg:p-12 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl animate-pulse flex flex-col justify-between min-h-[240px]">
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
                  <div className="space-y-4">
                    <div className="h-8 w-48 bg-zinc-800 rounded" />
                    <div className="h-20 w-full bg-zinc-800/50 rounded" />
                  </div>
                </div>
              </>
            ) : (
              <>
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
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-7xl lg:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.8] text-zinc-900 dark:text-zinc-100">
              PRÊT À<br />
              <span className="text-zinc-900 outline-text">DÉPLOYER ?</span>
            </motion.h2>

            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
              <a
                href="mailto:matheodelaunay04@gmail.com"
                className="group relative px-12 py-6 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-mono text-sm uppercase tracking-[0.2em] font-bold overflow-hidden transition-all hover:pr-16 hover:bg-zinc-800 dark:hover:bg-white"
              >
                <span className="relative z-10">// Init_Communication</span>
                <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">→</span>
              </a>

              <div className="flex gap-12 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                <a href="https://github.com/D-Seonay" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors underline decoration-zinc-200 dark:decoration-zinc-800 underline-offset-8">GitHub</a>
                <a href="https://www.linkedin.com/in/matheo-delaunay/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors underline decoration-zinc-200 dark:decoration-zinc-800 underline-offset-8">LinkedIn</a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 lg:px-24 border-t border-zinc-200 dark:border-zinc-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-700">
          <div className="flex items-center gap-4">
            <div className="font-black text-xl tracking-tighter italic uppercase text-zinc-900 dark:text-zinc-100">
              Seonay<span className="text-zinc-300 dark:text-zinc-800">_</span>
            </div>
            <span>// Terminal_Out</span>
          </div>
          <div>© 2026 Absolute Dark Design // All Rights Reserved</div>
        </div>
      </footer>
    </main>
  );
}
