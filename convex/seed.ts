import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

const INMONEXO = {
  slug: "inmonexo",
  name: "InmoNExo",
  description:
    "Real estate market intelligence for Lima developers. Scrapes public supply, normalizes pricing and history, and exposes an API plus dashboard. Not a marketplace.",
  kind: "product" as const,
  liveUrl: "https://inmonexo-xi.vercel.app",
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

export const run = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await ctx.runMutation(internal.projects.replaceCommunitySeed, {
      projects: [INMONEXO],
    });
    return null;
  },
});
