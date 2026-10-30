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
  category?: string;
  preview?: { src: string; alt: string; caption: string };
};

export const SEED_PROJECTS: Project[] = [
  {
    slug: "inmonexo",
    name: "InmoNExo",
    description:
      "Inteligencia del mercado inmobiliario de Lima. Reúne oferta pública, organiza precios e historial y los acerca a los builders a través de una API y un dashboard.",
    category: "REAL ESTATE",
    preview: {
      src: "/projects/inmonexo-dashboard.webp",
      alt: "Dashboard de InmoNExo con cobertura del mercado inmobiliario de Lima, distribución por distrito y estados de los proyectos.",
      caption: "Dashboard público · Captura de octubre de 2026",
    },
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
    language: "Python",
  },
  {
    slug: "aiconstructor",
    name: "AIConstructor",
    description:
      "Asistente de preconstrucción pensado para el móvil y el contexto de Lima: evaluación anónima, orientación con fuentes normativas, casos guardados y directorio profesional. No certifica viviendas.",
    category: "CONSTRUCCIÓN + IA",
    preview: {
      src: "/projects/aiconstructor-app.webp",
      alt: "Portada de AIConstructor con orientación de preconstrucción y acceso a la evaluación del proyecto.",
      caption: "Demo local · Captura del repositorio oficial",
    },
    kind: "oss",
    githubRepo: "Andy18acaro/AIConstructor",
    visible: true,
    needs: [],
    accent: "#e85d2a",
    featured: true,
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
