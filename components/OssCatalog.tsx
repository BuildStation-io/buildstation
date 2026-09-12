"use client";

import { useQuery } from "convex/react";
import { ContributeSteps } from "./ContributeSteps";
import { OssHero } from "./OssHero";
import { ProjectGrid } from "./ProjectGrid";
import { StatsStrip } from "./StatsStrip";
import { api } from "@/convex/_generated/api";
import { SEED_PROJECTS, projectStats, type Project } from "@/lib/projects";

function CatalogView({
  projects,
  stats,
}: {
  projects: Project[];
  stats: { stars: number; repos: number; openIssues: number };
}) {
  return (
    <>
      <OssHero
        title="Open source, open to contributors."
        description="These repos across the BuildStation network are maintained and accepting outside contributors: CLIs, design systems, editor tools, and community infrastructure. Pick one and ship."
        primaryHref="#repos"
        primaryLabel="Suggest a project"
        secondaryHref="https://github.com/Andy18acaro/buildstation"
        secondaryLabel="Open GitHub org"
        tertiaryHref="#repos"
        tertiaryLabel="See OSS metrics"
      />
      <StatsStrip
        stars={stats.stars}
        repos={stats.repos}
        openIssues={stats.openIssues}
      />
      <div id="repos">
        <ProjectGrid projects={projects} />
      </div>
      <ContributeSteps />
    </>
  );
}

function LiveCatalog() {
  const remote = useQuery(api.projects.list, {});
  const remoteStats = useQuery(api.projects.stats, {});
  const projects = remote && remote.length > 0 ? remote : SEED_PROJECTS;
  const stats = remoteStats ?? projectStats(projects);
  return <CatalogView projects={projects} stats={stats} />;
}

export function OssCatalog() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return (
      <CatalogView projects={SEED_PROJECTS} stats={projectStats(SEED_PROJECTS)} />
    );
  }
  return <LiveCatalog />;
}
