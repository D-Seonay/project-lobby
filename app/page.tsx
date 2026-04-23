'use client';

import { motion } from 'framer-motion';
import { BentoGrid } from '@/components/BentoGrid';
import { BentoCard } from '@/components/BentoCard';
import { SpotlightGrid } from '@/components/SpotlightGrid';
import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';

export default function Home() {
  const projects = projectsData as Project[];

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
      {/* Floating Navigation Pill */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl">
          <a href="#home" className="text-[10px] font-mono uppercase tracking-widest text-white hover:text-white transition-colors">Index</a>
          <a href="#work" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Projects</a>
          <a href="#contact" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* Header Section */}
      <section id="home" className="pt-32 sm:pt-48 pb-32 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div 
            initial="hidden"
            animate="show"
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
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-8xl lg:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.7] text-zinc-100">
              Seonay<br />
              <span className="text-zinc-900 outline-text">Studio</span>
            </motion.h1>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="show"
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
            {projects.map((project) => (
              <BentoCard key={project.id} project={project} />
            ))}
          </BentoGrid>
        </SpotlightGrid>
      </section>

      {/* Contact Section */}
      <section id="contact" className="mt-32 sm:mt-[32rem] pb-32 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-24">
            <h2 className="text-4xl sm:text-7xl lg:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.8] text-zinc-100">
              PRÊT À<br />
              <span className="text-zinc-900 outline-text">DÉPLOYER ?</span>
            </h2>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
              <a
                href="mailto:matheodelaunay04@gmail.com"
                className="group relative px-12 py-6 bg-zinc-100 text-zinc-900 font-mono text-sm uppercase tracking-[0.2em] font-bold overflow-hidden transition-all hover:pr-16 hover:bg-white"
              >
                <span className="relative z-10">// Init_Communication</span>
                <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">→</span>
              </a>

              <div className="flex gap-12 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                <a href="https://github.com/D-Seonay" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-zinc-800 underline-offset-8">GitHub</a>
                <a href="https://www.linkedin.com/in/matheo-delaunay/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-zinc-800 underline-offset-8">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 lg:px-24 border-t border-zinc-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-700">
          <div className="flex items-center gap-4">
            <div className="font-black text-xl tracking-tighter italic uppercase text-zinc-100">
              Seonay<span className="text-zinc-800">_</span>
            </div>
            <span>// Terminal_Out</span>
          </div>
          <div>© 2026 Absolute Dark Design // All Rights Reserved</div>
        </div>
      </footer>
    </main>
  );
}
