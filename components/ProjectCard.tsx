import { formatCompact } from "@/lib/format";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a
      href={`https://github.com/${project.githubRepo}`}
      target="_blank"
      rel="noreferrer"
      data-goo-target
      data-goo-color={project.accent}
      className="group relative flex min-h-[280px] flex-col border-b border-r border-line p-6 transition-colors hover:bg-surface/60 sm:p-8"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px transition-all duration-300 group-hover:h-0.5"
        style={{ background: project.accent }}
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {project.githubRepo}
      </p>
      <h3 className="mt-5 text-3xl font-medium tracking-tight">{project.name}</h3>
      <p className="mt-4 max-w-md text-sm leading-6 text-muted">
        {project.description}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        <span className="rounded-full border border-line px-2.5 py-1">
          ★ {formatCompact(project.stars)}
        </span>
        <span className="rounded-full border border-line px-2.5 py-1">
          {project.openIssues} open issues + PRs
        </span>
        <span className="rounded-full border border-line px-2.5 py-1">
          {project.language}
        </span>
      </div>
      <p className="mt-8 flex items-center justify-between text-sm">
        Contribute
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          ↗
        </span>
      </p>
    </a>
  );
}
