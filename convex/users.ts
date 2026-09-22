import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { ensureMember } from "./lib/auth";

export const ensure = mutation({
  args: {
    avatarUrl: v.optional(v.string()),
  },
  returns: v.id("members"),
  handler: async (ctx, args) => {
    const member = await ensureMember(ctx, { avatarUrl: args.avatarUrl });
    return member._id;
  },
});
