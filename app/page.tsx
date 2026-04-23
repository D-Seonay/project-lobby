import { BentoGrid } from '@/components/BentoGrid';
import { BentoCard } from '@/components/BentoCard';
import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';

export default function Home() {
  const projects = projectsData as Project[];

  return (
    <main className="min-h-screen bg-zinc-950 py-32 px-6">
      <div className="max-w-6xl mx-auto mb-32">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-8 flex items-center gap-4">
          <span className="w-2 h-2 bg-zinc-800 rounded-full animate-pulse" />
          Digital Gallery / 2026 / Version 1.0.4
        </div>
        <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8]">
          Lobby<br />
          <span className="text-zinc-900 outline-text">System</span>
        </h1>
        <p className="text-zinc-500 mt-8 font-mono text-xs uppercase tracking-widest max-w-md leading-relaxed">
          Selective repository of digital experiments & architectural frameworks.
        </p>
      </div>
      
      <BentoGrid>
        {projects.map((project) => (
          <BentoCard key={project.id} project={project} />
        ))}
      </BentoGrid>
    </main>
  );
}
