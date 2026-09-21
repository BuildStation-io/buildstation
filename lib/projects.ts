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
  {
    slug: "aiconstructor",
    name: "AIConstructor",
    description:
      "Mobile-first pre-construction assistant for Lima: anonymous assessment, grounded normative answers, saved cases, and a verified professional directory. It does not certify a home.",
    kind: "oss",
    githubRepo: "Andy18acaro/AIConstructor",
    visible: true,
    needs: [],
    accent: "#e85d2a",
    featured: false,
    language: "JavaScript",
  },
];

type RemoteProject = {
  slug?: string;
  name?: string;
  description?: string;
  kind?: Project["kind"];
  liveUrl?: string;
  githubRepo?: string;
  visible?: boolean;
  needs?: ProjectNeed[];
  accent?: string;
  featured?: boolean;
  language?: string;
};

export function catalogProjects(remote: RemoteProject[] | undefined): Project[] {
  const seedSlugs = new Set(SEED_PROJECTS.map((project) => project.slug));
  const extras = (remote ?? []).flatMap((project): Project[] => {
    if (!project.slug || seedSlugs.has(project.slug)) {
      return [];
    }
    if (!project.name || !project.description || !project.kind || !project.accent) {
      return [];
    }
    return [
      {
        slug: project.slug,
        name: project.name,
        description: project.description,
        kind: project.kind,
        liveUrl: project.liveUrl,
        githubRepo: project.githubRepo,
        visible: project.visible !== false,
        needs: project.needs ?? [],
        accent: project.accent,
        featured: project.featured ?? false,
        language: project.language,
      },
    ];
  });
  return [...SEED_PROJECTS, ...extras];
}

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
