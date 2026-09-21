import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const doneNeeds = project.needs.filter((need) => need.status === "done");
  const openNeeds = project.needs.filter((need) => need.status === "open");
  const sourceUrl = project.githubRepo
    ? `https://github.com/${project.githubRepo}`
    : undefined;
  const kindLabel = project.kind === "oss" ? "Open source" : project.kind;

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
        {kindLabel}
      </p>
      <h3 className="mt-5 text-2xl font-medium tracking-tight">{project.name}</h3>
      <p className="mt-4 text-sm leading-6 text-muted">
        {project.description}
      </p>
      {doneNeeds.length > 0 ? (
        <ul className="mt-6 space-y-2 text-sm leading-6 text-muted">
          {doneNeeds.map((need) => (
            <li key={need.title}>✓ {need.title}</li>
          ))}
        </ul>
      ) : null}
      {openNeeds.length > 0 ? (
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Next
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {openNeeds.map((need) => (
              <li key={need.title}>· {need.title}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-auto flex flex-col gap-3 pt-8">
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-sm hover:text-foreground"
          >
            View source
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line">
              ↗
            </span>
          </a>
        ) : null}
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
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
