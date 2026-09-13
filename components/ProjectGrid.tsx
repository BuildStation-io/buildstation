import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/projects";

type ProjectGridProps = {
  projects: Project[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <section id="projects" className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          The projects
        </p>
        <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
          What the network is shipping.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
          One live product today. Open features below are the real backlog —
          pick one and talk to the group.
        </p>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
