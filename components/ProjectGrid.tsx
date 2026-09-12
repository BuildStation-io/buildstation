"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/projects";
import { uniqueOrgs } from "@/lib/projects";

type ProjectGridProps = {
  projects: Project[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [org, setOrg] = useState("all");
  const orgs = useMemo(() => uniqueOrgs(projects), [projects]);
  const visible = useMemo(
    () => (org === "all" ? projects : projects.filter((item) => item.org === org)),
    [org, projects],
  );

  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          The repos
        </p>
        <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
          Maintained, public, and waiting for your PR.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
          Live data from GitHub. Stars and open work update on their own; the
          list itself is curated by the team.
        </p>
        <label className="mt-8 block max-w-md">
          <span className="sr-only">Filter by organization</span>
          <select
            value={org}
            onChange={(event) => setOrg(event.target.value)}
            className="h-10 w-full border border-line bg-transparent px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground outline-none focus:ring-1 focus:ring-foreground/30"
          >
            <option value="all">Filter by organization</option>
            {orgs.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid border-t border-line sm:grid-cols-2">
        {visible.map((project) => (
          <ProjectCard key={project.githubRepo} project={project} />
        ))}
      </div>
    </section>
  );
}
