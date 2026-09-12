import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("members"),
      name: v.string(),
      avatarUrl: v.optional(v.string()),
      githubUsername: v.optional(v.string()),
      joinedAt: v.number(),
    }),
  ),
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
