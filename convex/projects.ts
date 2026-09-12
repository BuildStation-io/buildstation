import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";

const projectDoc = v.object({
  _id: v.id("projects"),
  _creationTime: v.number(),
  githubRepo: v.string(),
  org: v.string(),
  name: v.string(),
  description: v.string(),
  language: v.string(),
  stars: v.number(),
  openIssues: v.number(),
  accent: v.string(),
  featured: v.boolean(),
  addedBy: v.optional(v.id("members")),
});

export const list = query({
  args: {
    org: v.optional(v.string()),
    paginationOpts: v.optional(paginationOptsValidator),
  },
  returns: v.array(projectDoc),
  handler: async (ctx, args) => {
    if (args.org) {
      return await ctx.db
        .query("projects")
        .withIndex("by_org", (q) => q.eq("org", args.org!))
        .collect();
    }

    return await ctx.db.query("projects").withIndex("by_featured").collect();
  },
});

export const stats = query({
  args: {},
  returns: v.object({
    stars: v.number(),
    repos: v.number(),
    openIssues: v.number(),
  }),
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    return {
      stars: projects.reduce((sum, project) => sum + project.stars, 0),
      repos: projects.length,
      openIssues: projects.reduce((sum, project) => sum + project.openIssues, 0),
    };
  },
});

export const upsertSeed = internalMutation({
  args: {
    projects: v.array(
      v.object({
        githubRepo: v.string(),
        org: v.string(),
        name: v.string(),
        description: v.string(),
        language: v.string(),
        stars: v.number(),
        openIssues: v.number(),
        accent: v.string(),
        featured: v.boolean(),
      }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    for (const project of args.projects) {
      const existing = await ctx.db
        .query("projects")
        .withIndex("by_repo", (q) => q.eq("githubRepo", project.githubRepo))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, project);
      } else {
        await ctx.db.insert("projects", project);
      }
    }
    return null;
  },
});

export const applyGithubStats = internalMutation({
  args: {
    githubRepo: v.string(),
    stars: v.number(),
    openIssues: v.number(),
    description: v.optional(v.string()),
    language: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_repo", (q) => q.eq("githubRepo", args.githubRepo))
      .unique();

    if (!existing) {
      return null;
    }

    await ctx.db.patch(existing._id, {
      stars: args.stars,
      openIssues: args.openIssues,
      description: args.description ?? existing.description,
      language: args.language ?? existing.language,
    });
    return null;
  },
});

export const markSynced = internalMutation({
  args: { at: v.number() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("syncState")
      .withIndex("by_key", (q) => q.eq("key", "github"))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { lastSyncAt: args.at });
    } else {
      await ctx.db.insert("syncState", { key: "github", lastSyncAt: args.at });
    }
    return null;
  },
});

export const listReposInternal = internalQuery({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    return projects.map((project) => project.githubRepo);
  },
});
