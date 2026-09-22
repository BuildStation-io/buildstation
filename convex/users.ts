import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { ensureMember } from "./lib/auth";

export const ensure = mutation({
  args: {},
  returns: v.id("members"),
  handler: async (ctx) => {
    const member = await ensureMember(ctx);
    return member._id;
  },
});
