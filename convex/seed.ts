import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

const INMONEXO = {
  slug: "inmonexo",
  name: "InmoNExo",
  description:
    "Open-source real estate market intelligence for Lima. Scrapes public supply, normalizes pricing and history, and exposes an API plus dashboard. Published so anyone can see how the network builds.",
  kind: "oss" as const,
  liveUrl: "https://inmonexo-xi.vercel.app",
  githubRepo: "Andy18acaro/InmoNExo",
  visible: true,
  needs: [
    { title: "MarketEvents feed on the dashboard", status: "done" as const },
    { title: "Price history chart per project", status: "open" as const },
    { title: "Live scrape via Apify", status: "open" as const },
    {
      title: "District and developer compare",
      status: "done" as const,
    },
  ],
  accent: "#67e8f9",
  featured: true,
  language: "TypeScript",
};

const AICONSTRUCTOR = {
  slug: "aiconstructor",
  name: "AIConstructor",
  description:
    "Mobile-first pre-construction assistant for Lima: anonymous assessment, grounded normative answers, saved cases, and a verified professional directory. It does not certify a home.",
  kind: "oss" as const,
  githubRepo: "Andy18acaro/AIConstructor",
  visible: true,
  needs: [],
  accent: "#e85d2a",
  featured: false,
  language: "JavaScript",
};

export const run = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await ctx.runMutation(internal.projects.replaceCommunitySeed, {
      projects: [INMONEXO, AICONSTRUCTOR],
    });
    return null;
  },
});
