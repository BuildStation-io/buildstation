import "server-only";
import { cache } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { catalogProjects, type ProjectNeed } from "./projects";
import { catalogEvents } from "./events";
import { toEventRow, mergeEventRows, isPastEvent } from "./event-feed";
import { getLumaConfig, getLumaEvents } from "./luma";

export type ProjectRow = {
  id: string;
  githubRepo?: string;
  name: string;
  description: string;
  language?: string;
  stars: number | null;
  openIssues: number | null;
  featured: boolean;
  category?: string;
  website?: string;
  preview?: { src: string; alt: string; caption: string };
  needs: ProjectNeed[];
};

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  date: Date | null;
  location: string | null;
  url: string | null;
  endDate?: Date;
  timezone?: string;
  source: "convex" | "catalog" | "luma";
  status?: "confirmed" | "possible" | "past";
  dateOnly?: boolean;
  whenLabel?: string;
  registrationOpen?: boolean;
};

export const getProjects = cache(async (): Promise<ProjectRow[]> => {
  let remote;
  if (process.env.NEXT_PUBLIC_CONVEX_URL) {
    try {
      remote = await fetchQuery(api.projects.list, {});
    } catch {
      console.error("Project feed unavailable; showing the editorial catalog.");
    }
  }
  return catalogProjects(remote).filter((project) => project.visible).map((project) => ({
    id: project.slug,
    githubRepo: project.githubRepo,
    name: project.name,
    description: project.description,
    language: project.language,
    stars: null,
    openIssues: null,
    featured: project.featured,
    category: project.category,
    website: project.liveUrl,
    preview: project.preview,
    needs: project.needs,
  }));
});

export const getExternalEvents = cache(async () => {
  const now = Date.now();
  if (!getLumaConfig().apiEnabled) return { events: [] as EventRow[], unavailable: false, now };
  try {
    return { events: await getLumaEvents(), unavailable: false, now };
  } catch {
    console.error("Luma event feed unavailable.");
    return { events: [] as EventRow[], unavailable: true, now };
  }
});

export const getEventTimeline = cache(async () => {
  const [external, local] = await Promise.all([
    getExternalEvents(),
    (async () => {
      try {
        const remote = process.env.NEXT_PUBLIC_CONVEX_URL ? await fetchQuery(api.events.list, {}) : undefined;
        return { events: catalogEvents(remote).map(toEventRow), unavailable: false };
      } catch {
        console.error("Convex event feed unavailable.");
        return { events: catalogEvents(undefined).map(toEventRow), unavailable: true };
      }
    })(),
  ]);
  const events = mergeEventRows(local.events, external.events);
  const now = Date.now();
  return {
    events,
    upcoming: events.filter((event) => !isPastEvent(event, now)),
    past: events.filter((event) => isPastEvent(event, now)).reverse(),
    unavailable: external.unavailable || local.unavailable,
  };
});
