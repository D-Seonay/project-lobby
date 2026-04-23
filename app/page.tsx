import { BentoGrid } from '@/components/BentoGrid';
import { BentoCard } from '@/components/BentoCard';
import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';

export default function Home() {
  const projects = projectsData as Project[];

  return (
    <main className="min-h-screen">
      {/* Floating Navigation Pill */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl">
          <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Index</a>
          <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Projects</a>
          <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* Header Section */}
      <section className="pt-48 pb-32 px-8 md:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-12">
            <div className="flex flex-col gap-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-600 flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-pulse" />
                SYSTEM_READY // EXECUTION_GRANTED
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-700">
                System_Lobby // v2.0.6
              </div>
            </div>
            <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.7] text-zinc-100">
              Seonay<br />
              <span className="text-zinc-900 outline-text">Studio</span>
            </h1>
          </div>
          
          <div className="max-w-xs space-y-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 leading-loose italic">
              // Radical dark mode experiments. High-performance digital architectural frameworks.
            </p>
            <div className="flex gap-8 font-mono text-[9px] uppercase tracking-widest text-zinc-700">
              <span>Nantes / FR</span>
              <span>127.0.0.1</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Section */}
      <section className="pb-64 px-8 md:px-24">
        <BentoGrid>
          {projects.map((project) => (
            <BentoCard key={project.id} project={project} />
          ))}
        </BentoGrid>
      </section>

      {/* Footer */}
      <footer className="py-24 px-8 md:px-24 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-zinc-600">
          <div className="font-black text-2xl tracking-tighter italic uppercase">
            Seonay<span className="text-zinc-800">_</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.4em]">
            © 2026 Absolute Dark Design // All Rights Reserved
          </div>
        </div>
      </footer>
    </main>
  );
}
