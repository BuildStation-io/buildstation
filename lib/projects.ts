import { TEAM } from "./team";

export type ProjectNeed = {
  title: string;
  status: "open" | "done";
};

export type Project = {
  slug: string;
  name: string;
  description: string;
  kind: "product" | "oss";
  liveUrl?: string;
  githubRepo?: string;
  visible: boolean;
  needs: ProjectNeed[];
  accent: string;
  featured: boolean;
  language?: string;
};

export const SEED_PROJECTS: Project[] = [
  {
    slug: "inmonexo",
    name: "InmoNExo",
    description:
      "Open-source real estate market intelligence for Lima. Scrapes public supply, normalizes pricing and history, and exposes an API plus dashboard. Published so anyone can see how the network builds.",
    kind: "oss",
    liveUrl: "https://inmonexo-xi.vercel.app",
    githubRepo: "Andy18acaro/InmoNExo",
    visible: true,
    needs: [
      { title: "MarketEvents feed on the dashboard", status: "done" },
      { title: "Price history chart per project", status: "open" },
      { title: "Live scrape via Apify", status: "open" },
      { title: "District and developer compare", status: "done" },
    ],
    accent: "#67e8f9",
    featured: true,
    language: "TypeScript",
  },
];

export function projectStats(projects: Project[]): {
  members: number;
  projects: number;
  openNeeds: number;
} {
  return {
    members: TEAM.length,
    projects: projects.filter((project) => project.visible).length,
    openNeeds: projects.reduce(
      (sum, project) =>
        sum + project.needs.filter((need) => need.status === "open").length,
      0,
    ),
  };
}
