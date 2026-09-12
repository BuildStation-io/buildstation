"use client";

import { useQuery } from "convex/react";
import { StatsStrip } from "./StatsStrip";
import { api } from "@/convex/_generated/api";
import { SEED_PROJECTS, projectStats } from "@/lib/projects";

function StaticStats() {
  const stats = projectStats(SEED_PROJECTS);
  return (
    <StatsStrip
      members={stats.members}
      projects={stats.projects}
      openNeeds={stats.openNeeds}
    />
  );
}

function LiveStats() {
  const remote = useQuery(api.projects.stats, {});
  const fallback = projectStats(SEED_PROJECTS);
  const stats = remote ?? fallback;
  return (
    <StatsStrip
      members={stats.members}
      projects={stats.projects}
      openNeeds={stats.openNeeds}
    />
  );
}

export function HomeStats() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <StaticStats />;
  }
  return <LiveStats />;
}
