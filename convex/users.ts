import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const ensure = mutation({
  args: {},
  returns: v.id("members"),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("members")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    const nickname =
      typeof identity.nickname === "string" ? identity.nickname : undefined;
    const name = identity.name ?? nickname ?? "Builder";
    const avatarUrl =
      typeof identity.pictureUrl === "string" ? identity.pictureUrl : undefined;

    if (existing) {
      await ctx.db.patch(existing._id, {
        clerkUserId: identity.subject,
        githubUsername: nickname,
        name,
        avatarUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("members", {
      tokenIdentifier: identity.tokenIdentifier,
      clerkUserId: identity.subject,
      githubUsername: nickname,
      name,
      avatarUrl,
      joinedAt: Date.now(),
    });
  },
});
