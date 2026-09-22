import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import {
  authorSnapshot,
  ensureMember,
  httpsAvatar,
  publishableName,
  syncAuthoredIdentity,
} from "./lib/auth";

const LIMITS = {
  place: 160,
  process: 4000,
  why: 2000,
  projectSlug: 80,
} as const;

const sectorValidator = v.union(
  v.literal("construction"),
  v.literal("mining"),
  v.literal("energy"),
  v.literal("real estate"),
);

const statusValidator = v.union(
  v.literal("open"),
  v.literal("picked"),
  v.literal("shipped"),
);

function requiredText(value: string, max: number, label: string) {
  const trimmed = value.trim();
  if (trimmed.length < 1 || trimmed.length > max) {
    throw new Error(`${label} must be between 1 and ${max} characters`);
  }
  return trimmed;
}

function projectSlug(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length > LIMITS.projectSlug || !/^[a-z0-9-]+$/.test(trimmed)) {
    throw new Error(
      `Project slug must be 1 to ${LIMITS.projectSlug} lowercase letters, numbers, or hyphens`,
    );
  }
  return trimmed;
}

const publicIdea = v.object({
  _id: v.id("ideas"),
  authorName: v.string(),
  authorAvatarUrl: v.optional(v.string()),
  githubUsername: v.optional(v.string()),
  place: v.string(),
  process: v.string(),
  why: v.string(),
  sector: sectorValidator,
  status: statusValidator,
  projectSlug: v.optional(v.string()),
  createdAt: v.number(),
});

export const list = query({
  args: {},
  returns: v.array(publicIdea),
  handler: async (ctx) => {
    const ideas = await ctx.db.query("ideas").withIndex("by_createdAt").order("desc").collect();
    return ideas
      .filter((idea) => !idea.hidden)
      .map((idea) => ({
        _id: idea._id,
        authorName: idea.authorName,
        ...(idea.authorAvatarUrl ? { authorAvatarUrl: idea.authorAvatarUrl } : {}),
        ...(idea.githubUsername ? { githubUsername: idea.githubUsername } : {}),
        place: idea.place,
        process: idea.process,
        why: idea.why,
        sector: idea.sector,
        status: idea.status,
        ...(idea.projectSlug ? { projectSlug: idea.projectSlug } : {}),
        createdAt: idea.createdAt,
      }));
  },
});

export const viewer = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      name: v.string(),
      githubUsername: v.union(v.string(), v.null()),
      hasName: v.boolean(),
      avatarUrl: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    const name = publishableName(member?.name) ?? publishableName(identity.name) ?? "";
    const avatarUrl =
      httpsAvatar(member?.avatarUrl) ??
      httpsAvatar(typeof identity.pictureUrl === "string" ? identity.pictureUrl : undefined);

    return {
      name,
      githubUsername: member?.githubUsername ?? null,
      hasName: Boolean(name),
      ...(avatarUrl ? { avatarUrl } : {}),
    };
  },
});

export const submit = mutation({
  args: {
    place: v.string(),
    process: v.string(),
    why: v.string(),
    sector: sectorValidator,
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  returns: v.id("ideas"),
  handler: async (ctx, args) => {
    const member = await ensureMember(ctx, {
      displayName: args.displayName,
      avatarUrl: args.avatarUrl,
    });
    const author = authorSnapshot(member);

    return await ctx.db.insert("ideas", {
      authorId: member._id,
      authorName: author.authorName,
      ...(author.authorAvatarUrl ? { authorAvatarUrl: author.authorAvatarUrl } : {}),
      ...(author.githubUsername ? { githubUsername: author.githubUsername } : {}),
      place: requiredText(args.place, LIMITS.place, "Place"),
      process: requiredText(args.process, LIMITS.process, "Process"),
      why: requiredText(args.why, LIMITS.why, "Why"),
      sector: args.sector,
      status: "open",
      createdAt: Date.now(),
      hidden: false,
    });
  },
});

export const backfillAuthors = internalMutation({
  args: {},
  returns: v.object({
    patchedIdeas: v.number(),
    patchedComments: v.number(),
  }),
  handler: async (ctx) => {
    const members = await ctx.db.query("members").collect();
    let patchedIdeas = 0;
    let patchedComments = 0;
    for (const member of members) {
      const result = await syncAuthoredIdentity(ctx, member);
      patchedIdeas += result.patchedIdeas;
      patchedComments += result.patchedComments;
    }
    return { patchedIdeas, patchedComments };
  },
});

export const setStatus = internalMutation({
  args: {
    ideaId: v.id("ideas"),
    status: statusValidator,
    projectSlug: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const idea = await ctx.db.get(args.ideaId);
    if (!idea) {
      throw new Error("Idea not found");
    }

    const patch: {
      status: "open" | "picked" | "shipped";
      projectSlug?: string;
    } = { status: args.status };

    if (args.projectSlug !== undefined) {
      const slug = projectSlug(args.projectSlug);
      if (slug) {
        patch.projectSlug = slug;
      }
    }

    await ctx.db.patch(idea._id, patch);
    return null;
  },
});
