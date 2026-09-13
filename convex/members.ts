import { v } from "convex/values";
import { isFounderGithub } from "./founders";
import { internalMutation, internalQuery, query } from "./_generated/server";

const publicMember = v.object({
  _id: v.id("members"),
  name: v.string(),
  avatarUrl: v.optional(v.string()),
  githubUsername: v.optional(v.string()),
  joinedAt: v.number(),
});

const publicBuilder = v.object({
  _id: v.id("members"),
  name: v.string(),
  avatarUrl: v.optional(v.string()),
  githubUsername: v.optional(v.string()),
  githubUrl: v.optional(v.string()),
  bio: v.optional(v.string()),
  joinedAt: v.number(),
});

export const list = query({
  args: {},
  returns: v.array(publicMember),
  handler: async (ctx) => {
    const members = await ctx.db.query("members").collect();
    return members
      .map((member) => ({
        _id: member._id,
        name: member.name,
        avatarUrl: member.avatarUrl,
        githubUsername: member.githubUsername,
        joinedAt: member.joinedAt,
      }))
      .sort((a, b) => a.joinedAt - b.joinedAt);
  },
});

export const listBuilders = query({
  args: {},
  returns: v.array(publicBuilder),
  handler: async (ctx) => {
    const builders = await ctx.db
      .query("members")
      .withIndex("by_builder", (q) => q.eq("isBuilder", true))
      .collect();

    return builders
      .filter((member) => !isFounderGithub(member.githubUsername))
      .map((member) => ({
        _id: member._id,
        name: member.name,
        avatarUrl: member.avatarUrl,
        githubUsername: member.githubUsername,
        githubUrl: member.githubUrl,
        bio: member.bio,
        joinedAt: member.joinedAt,
      }))
      .sort((a, b) => a.joinedAt - b.joinedAt);
  },
});

export const applyBuilderClaim = internalMutation({
  args: {
    tokenIdentifier: v.optional(v.string()),
    memberId: v.optional(v.id("members")),
    githubUsername: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    githubUrl: v.string(),
  },
  returns: v.union(v.id("members"), v.null()),
  handler: async (ctx, args) => {
    if (isFounderGithub(args.githubUsername)) {
      return null;
    }

    let member = null;
    if (args.memberId) {
      member = await ctx.db.get(args.memberId);
    } else if (args.tokenIdentifier) {
      const tokenIdentifier = args.tokenIdentifier;
      member = await ctx.db
        .query("members")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .unique();
    }

    if (!member) {
      throw new Error("Member not found");
    }

    const patch: {
      isBuilder: true;
      githubUsername: string;
      githubUrl: string;
      avatarUrl?: string;
      bio?: string;
      name?: string;
    } = {
      isBuilder: true,
      githubUsername: args.githubUsername,
      githubUrl: args.githubUrl,
    };

    if (args.avatarUrl) {
      patch.avatarUrl = args.avatarUrl;
    }
    if (args.bio) {
      patch.bio = args.bio;
    }
    if (args.name && member.name === "Builder") {
      patch.name = args.name;
    }

    await ctx.db.patch(member._id, patch);
    return member._id;
  },
});

export const getByToken = internalQuery({
  args: { tokenIdentifier: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("members"),
      isBuilder: v.optional(v.boolean()),
      githubUsername: v.optional(v.string()),
      githubUrl: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("members")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();
    if (!member) {
      return null;
    }
    return {
      _id: member._id,
      isBuilder: member.isBuilder,
      githubUsername: member.githubUsername,
      githubUrl: member.githubUrl,
    };
  },
});

export const listClaimCandidates = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("members"),
      githubUsername: v.string(),
    }),
  ),
  handler: async (ctx) => {
    const members = await ctx.db.query("members").collect();
    return members.flatMap((member) => {
      if (
        !member.githubUsername ||
        member.isBuilder === true ||
        isFounderGithub(member.githubUsername)
      ) {
        return [];
      }
      return [
        {
          _id: member._id,
          githubUsername: member.githubUsername,
        },
      ];
    });
  },
});
