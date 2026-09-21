"use client";

import { useQuery } from "convex/react";
import { ContributeSteps } from "./ContributeSteps";
import { OssHero } from "./OssHero";
import { ProjectGrid } from "./ProjectGrid";
import { StatsStrip } from "./StatsStrip";
import { api } from "@/convex/_generated/api";
import { WHATSAPP_INVITE } from "@/lib/community";
import { SEED_PROJECTS, projectStats, type Project } from "@/lib/projects";

function CatalogView({
  projects,
  stats,
}: {
  projects: Project[];
  stats: { members: number; projects: number; openNeeds: number };
}) {
  return (
    <>
      <OssHero
        eyebrow="Projects"
        title="Built in the open."
        description="InmoNExo is the first project the network published: an open-source example of the solutions being built here."
        primaryHref="#projects"
        primaryLabel="See InmoNExo"
        secondaryHref={WHATSAPP_INVITE}
        secondaryLabel="Join WhatsApp"
      />
      <StatsStrip
        members={stats.members}
        projects={stats.projects}
        openNeeds={stats.openNeeds}
      />
      <ProjectGrid projects={projects} />
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

export function ProjectsCatalog() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return (
      <CatalogView projects={SEED_PROJECTS} stats={projectStats(SEED_PROJECTS)} />
    );
  }
  return <LiveCatalog />;
}
