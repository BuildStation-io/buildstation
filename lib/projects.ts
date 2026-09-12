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
      "Real estate market intelligence for Lima developers. Scrapes public supply, normalizes pricing and history, and exposes an API plus dashboard. Not a marketplace.",
    kind: "product",
    liveUrl: "https://inmonexo-xi.vercel.app",
    visible: true,
    needs: [
      { title: "MarketEvents feed on the dashboard", status: "open" },
      { title: "Price history chart per project", status: "open" },
      { title: "Live scrape via Apify", status: "open" },
      { title: "District and developer compare", status: "open" },
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
    members: 0,
    projects: projects.filter((project) => project.visible).length,
    openNeeds: projects.reduce(
      (sum, project) =>
        sum + project.needs.filter((need) => need.status === "open").length,
      0,
    ),
  };
}
