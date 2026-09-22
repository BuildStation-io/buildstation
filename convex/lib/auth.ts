import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { githubLoginFromIdentity } from "./githubIdentity";

export async function getCurrentMember(
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<"members">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const member = await ctx.db
    .query("members")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  if (!member) {
    throw new Error("Member not found");
  }

  return member;
}

export async function ensureMember(ctx: MutationCtx): Promise<Doc<"members">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const githubUsername = githubLoginFromIdentity(identity);
  const name = identity.name ?? githubUsername ?? "Builder";
  const avatarUrl =
    typeof identity.pictureUrl === "string" ? identity.pictureUrl : undefined;

  const existing = await ctx.db
    .query("members")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, {
      clerkUserId: identity.subject,
      ...(githubUsername ? { githubUsername } : {}),
      name: name === "Builder" ? existing.name : name,
      ...(avatarUrl ? { avatarUrl } : {}),
    });
    const updated = await ctx.db.get(existing._id);
    if (!updated) {
      throw new Error("Member not found");
    }
    return updated;
  }

  const memberId = await ctx.db.insert("members", {
    tokenIdentifier: identity.tokenIdentifier,
    clerkUserId: identity.subject,
    ...(githubUsername ? { githubUsername } : {}),
    name,
    ...(avatarUrl ? { avatarUrl } : {}),
    isBuilder: false,
    joinedAt: Date.now(),
  });
  const created = await ctx.db.get(memberId);
  if (!created) {
    throw new Error("Member not found");
  }
  return created;
}
