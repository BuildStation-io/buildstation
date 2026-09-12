import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const openNeeds = project.needs.filter((need) => need.status === "open");
  const href = project.liveUrl ?? "#projects";

  return (
    <article
      data-goo-target
      data-goo-color={project.accent}
      className="relative flex min-h-[280px] flex-col border-b border-r border-line p-6 sm:p-8"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: project.accent }}
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {project.kind}
      </p>
      <h3 className="mt-5 text-3xl font-medium tracking-tight">{project.name}</h3>
      <p className="mt-4 max-w-md text-sm leading-6 text-muted">
        {project.description}
      </p>
      {openNeeds.length > 0 ? (
        <ul className="mt-6 space-y-2 text-sm leading-6 text-muted">
          {openNeeds.map((need) => (
            <li key={need.title}>— {need.title}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto pt-8">
        {project.liveUrl ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-sm hover:text-foreground"
          >
            Open dashboard
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line">
              ↗
            </span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
