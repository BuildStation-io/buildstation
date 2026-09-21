import { v } from "convex/values";
import { TEAM } from "../lib/team";
import { isFounderGithub } from "./founders";
import { needValidator } from "./schema";
import { internalMutation, internalQuery, query } from "./_generated/server";

const projectDoc = v.object({
  _id: v.id("projects"),
  _creationTime: v.number(),
  slug: v.string(),
  name: v.string(),
  description: v.string(),
  kind: v.union(v.literal("product"), v.literal("oss")),
  liveUrl: v.optional(v.string()),
  githubRepo: v.optional(v.string()),
  visible: v.boolean(),
  needs: v.array(needValidator),
  accent: v.string(),
  featured: v.boolean(),
  language: v.optional(v.string()),
  addedBy: v.optional(v.id("members")),
});

const seedProject = v.object({
  slug: v.string(),
  name: v.string(),
  description: v.string(),
  kind: v.union(v.literal("product"), v.literal("oss")),
  liveUrl: v.optional(v.string()),
  githubRepo: v.optional(v.string()),
  visible: v.boolean(),
  needs: v.array(needValidator),
  accent: v.string(),
  featured: v.boolean(),
  language: v.optional(v.string()),
});

export const list = query({
  args: {},
  returns: v.array(projectDoc),
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    return projects.flatMap((project) => {
      if (!project.visible || !project.slug || !project.kind) {
        return [];
      }
      return [
        {
          _id: project._id,
          _creationTime: project._creationTime,
          slug: project.slug,
          name: project.name,
          description: project.description,
          kind: project.kind,
          liveUrl: project.liveUrl,
          githubRepo: project.githubRepo,
          visible: true,
          needs: project.needs ?? [],
          accent: project.accent,
          featured: project.featured,
          language: project.language,
          addedBy: project.addedBy,
        },
      ];
    });
  },
});

export const stats = query({
  args: {},
  returns: v.object({
    members: v.number(),
    projects: v.number(),
    openNeeds: v.number(),
  }),
  handler: async (ctx) => {
    const [members, projects] = await Promise.all([
      ctx.db.query("members").collect(),
      ctx.db
        .query("projects")
        .withIndex("by_visible", (q) => q.eq("visible", true))
        .collect(),
    ]);

    const builders = members.filter(
      (member) =>
        member.isBuilder === true && !isFounderGithub(member.githubUsername),
    );

    return {
      members: TEAM.length + builders.length,
      projects: projects.length,
      openNeeds: projects.reduce(
        (sum, project) =>
          sum +
          (project.needs ?? []).filter((need) => need.status === "open").length,
        0,
      ),
    };
  },
});

export const replaceCommunitySeed = internalMutation({
  args: { projects: v.array(seedProject) },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("projects").collect();
    for (const project of existing) {
      await ctx.db.delete(project._id);
    }

    for (const project of args.projects) {
      await ctx.db.insert("projects", project);
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
    return projects.flatMap((project) =>
      project.githubRepo ? [project.githubRepo] : [],
    );
  },
});
