import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

const SEED = [
  {
    githubRepo: "vercel/next.js",
    org: "vercel",
    name: "next.js",
    description:
      "The React framework for the web — App Router, Server Components, and production defaults we ship with.",
    language: "TypeScript",
    stars: 136000,
    openIssues: 3200,
    accent: "#f5e6a8",
    featured: true,
  },
  {
    githubRepo: "facebook/react",
    org: "facebook",
    name: "react",
    description:
      "The library for web and native user interfaces. Every BuildStation surface starts here.",
    language: "JavaScript",
    stars: 241000,
    openIssues: 1000,
    accent: "#f472b6",
    featured: true,
  },
  {
    githubRepo: "get-convex/convex-js",
    org: "get-convex",
    name: "convex-js",
    description:
      "Reactive TypeScript backend: queries, mutations, and scheduled jobs without standing up a server.",
    language: "TypeScript",
    stars: 1800,
    openIssues: 80,
    accent: "#67e8f9",
    featured: true,
  },
  {
    githubRepo: "clerk/javascript",
    org: "clerk",
    name: "javascript",
    description:
      "Drop-in authentication for Next.js. GitHub login, sessions, and user profiles we wire into Convex.",
    language: "TypeScript",
    stars: 1700,
    openIssues: 120,
    accent: "#ffffff",
    featured: true,
  },
  {
    githubRepo: "tailwindlabs/tailwindcss",
    org: "tailwindlabs",
    name: "tailwindcss",
    description:
      "Utility-first CSS. The tokens and rhythm behind this site’s dark editorial layout.",
    language: "TypeScript",
    stars: 92000,
    openIssues: 140,
    accent: "#38bdf8",
    featured: true,
  },
  {
    githubRepo: "shadcn-ui/ui",
    org: "shadcn-ui",
    name: "ui",
    description:
      "Accessible component primitives. Copy, own, and restyle — no black-box design system.",
    language: "TypeScript",
    stars: 104000,
    openIssues: 900,
    accent: "#a3e635",
    featured: true,
  },
  {
    githubRepo: "motiondivision/motion",
    org: "motiondivision",
    name: "motion",
    description:
      "A production-ready motion library for React. Springs, gestures, and layout animations.",
    language: "TypeScript",
    stars: 30000,
    openIssues: 200,
    accent: "#fb923c",
    featured: true,
  },
  {
    githubRepo: "pmndrs/react-three-fiber",
    org: "pmndrs",
    name: "react-three-fiber",
    description:
      "A React renderer for Three.js. When a ship needs a scene, this is the canvas.",
    language: "TypeScript",
    stars: 29000,
    openIssues: 150,
    accent: "#c4b5fd",
    featured: true,
  },
];

export const run = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await ctx.runMutation(internal.projects.upsertSeed, { projects: SEED });
    await ctx.runAction(internal.github.sync, {});
    return null;
  },
});
