import { v } from "convex/values";
import { githubLoginFromIdentity } from "./lib/githubIdentity";
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

    const githubUsername = githubLoginFromIdentity(identity);
    const name = identity.name ?? githubUsername ?? "Builder";
    const avatarUrl =
      typeof identity.pictureUrl === "string" ? identity.pictureUrl : undefined;

    if (existing) {
      await ctx.db.patch(existing._id, {
        clerkUserId: identity.subject,
        githubUsername: githubUsername ?? existing.githubUsername,
        name: name === "Builder" ? existing.name : name,
        avatarUrl: avatarUrl ?? existing.avatarUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("members", {
      tokenIdentifier: identity.tokenIdentifier,
      clerkUserId: identity.subject,
      githubUsername,
      name,
      avatarUrl,
      isBuilder: false,
      joinedAt: Date.now(),
    });
  },
});
