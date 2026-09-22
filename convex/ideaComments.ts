import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authorSnapshot, ensureMember } from "./lib/auth";

const LIMITS = {
  body: 2000,
} as const;

function requiredText(value: string, max: number, label: string) {
  const trimmed = value.trim();
  if (trimmed.length < 1 || trimmed.length > max) {
    throw new Error(`${label} must be between 1 and ${max} characters`);
  }
  return trimmed;
}

const publicComment = v.object({
  _id: v.id("ideaComments"),
  ideaId: v.id("ideas"),
  authorName: v.string(),
  authorAvatarUrl: v.optional(v.string()),
  githubUsername: v.optional(v.string()),
  body: v.string(),
  createdAt: v.number(),
});

export const list = query({
  args: {},
  returns: v.array(publicComment),
  handler: async (ctx) => {
    const comments = await ctx.db.query("ideaComments").withIndex("by_idea_and_createdAt").collect();
    return comments
      .filter((comment) => !comment.hidden)
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((comment) => ({
        _id: comment._id,
        ideaId: comment.ideaId,
        authorName: comment.authorName,
        ...(comment.authorAvatarUrl ? { authorAvatarUrl: comment.authorAvatarUrl } : {}),
        ...(comment.githubUsername ? { githubUsername: comment.githubUsername } : {}),
        body: comment.body,
        createdAt: comment.createdAt,
      }));
  },
});

export const add = mutation({
  args: {
    ideaId: v.id("ideas"),
    body: v.string(),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  returns: v.id("ideaComments"),
  handler: async (ctx, args) => {
    const member = await ensureMember(ctx, {
      displayName: args.displayName,
      avatarUrl: args.avatarUrl,
    });
    const idea = await ctx.db.get(args.ideaId);
    if (!idea || idea.hidden) {
      throw new Error("Idea not found");
    }

    const author = authorSnapshot(member);
    return await ctx.db.insert("ideaComments", {
      ideaId: idea._id,
      authorId: member._id,
      authorName: author.authorName,
      ...(author.authorAvatarUrl ? { authorAvatarUrl: author.authorAvatarUrl } : {}),
      ...(author.githubUsername ? { githubUsername: author.githubUsername } : {}),
      body: requiredText(args.body, LIMITS.body, "Comment"),
      createdAt: Date.now(),
      hidden: false,
    });
  },
});
