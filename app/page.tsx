import { BentoGrid } from '@/components/BentoGrid';
import { BentoCard } from '@/components/BentoCard';
import projectsData from '@/content/projects.json';
import { Project } from '@/types/project';

export default function Home() {
  const projects = projectsData as Project[];

  return (
    <main className="min-h-screen bg-zinc-950 py-20 px-4">
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Lobby <span className="text-zinc-500">/ 2026</span>
        </h1>
        <p className="text-zinc-400 mt-2">Mes projets & univers créatif.</p>
      </div>
      
      <BentoGrid>
        {projects.map((project) => (
          <BentoCard key={project.id} project={project} />
        ))}
      </BentoGrid>
    </main>
  );
}
