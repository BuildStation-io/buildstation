import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { githubLoginFromIdentity } from "./githubIdentity";

const PLACEHOLDER_NAME = "Builder";
const NAME_MAX = 40;
const AVATAR_MAX = 500;

export function publishableName(name: string | null | undefined): string | undefined {
  if (typeof name !== "string") {
    return undefined;
  }
  const trimmed = name.trim();
  if (!trimmed || trimmed === PLACEHOLDER_NAME) {
    return undefined;
  }
  return trimmed;
}

export function normalizeDisplayName(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length > NAME_MAX) {
    throw new Error(`Name must be between 1 and ${NAME_MAX} characters`);
  }
  if (trimmed === PLACEHOLDER_NAME) {
    throw new Error("Choose a name other than Builder.");
  }
  return trimmed;
}

export function httpsAvatar(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > AVATAR_MAX) {
    return undefined;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") {
      return undefined;
    }
    return trimmed;
  } catch {
    return undefined;
  }
}

export type AuthorSnapshot = {
  authorName: string;
  authorAvatarUrl?: string;
  githubUsername?: string;
};

export function authorSnapshot(member: Doc<"members">): AuthorSnapshot {
  const authorName = publishableName(member.name);
  if (!authorName) {
    throw new Error("Add the name you want on the card.");
  }
  const githubUsername = member.githubUsername?.trim();
  return {
    authorName,
    ...(member.avatarUrl ? { authorAvatarUrl: member.avatarUrl } : {}),
    ...(githubUsername ? { githubUsername } : {}),
  };
}

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

type EnsureOptions = {
  displayName?: string;
  avatarUrl?: string;
};

export async function syncAuthoredIdentity(
  ctx: MutationCtx,
  member: Doc<"members">,
): Promise<{ patchedIdeas: number; patchedComments: number }> {
  const authorName = publishableName(member.name);
  const avatarUrl = member.avatarUrl;
  const githubUsername = member.githubUsername?.trim();
  if (!authorName && !avatarUrl && !githubUsername) {
    return { patchedIdeas: 0, patchedComments: 0 };
  }

  let patchedIdeas = 0;
  let patchedComments = 0;

  const ideas = await ctx.db
    .query("ideas")
    .withIndex("by_author", (q) => q.eq("authorId", member._id))
    .collect();
  for (const idea of ideas) {
    const patch: {
      authorName?: string;
      authorAvatarUrl?: string;
      githubUsername?: string;
    } = {};
    if (authorName && idea.authorName === PLACEHOLDER_NAME) {
      patch.authorName = authorName;
    }
    if (avatarUrl && !idea.authorAvatarUrl) {
      patch.authorAvatarUrl = avatarUrl;
    }
    if (githubUsername && !idea.githubUsername) {
      patch.githubUsername = githubUsername;
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(idea._id, patch);
      patchedIdeas += 1;
    }
  }

  const comments = await ctx.db
    .query("ideaComments")
    .withIndex("by_author", (q) => q.eq("authorId", member._id))
    .collect();
  for (const comment of comments) {
    const patch: {
      authorName?: string;
      authorAvatarUrl?: string;
      githubUsername?: string;
    } = {};
    if (authorName && comment.authorName === PLACEHOLDER_NAME) {
      patch.authorName = authorName;
    }
    if (avatarUrl && !comment.authorAvatarUrl) {
      patch.authorAvatarUrl = avatarUrl;
    }
    if (githubUsername && !comment.githubUsername) {
      patch.githubUsername = githubUsername;
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(comment._id, patch);
      patchedComments += 1;
    }
  }

  return { patchedIdeas, patchedComments };
}

export async function ensureMember(
  ctx: MutationCtx,
  options?: EnsureOptions,
): Promise<Doc<"members">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const githubUsername = githubLoginFromIdentity(identity);
  const providedName = normalizeDisplayName(options?.displayName);
  const fromIdentity = publishableName(identity.name);
  const picture =
    httpsAvatar(typeof identity.pictureUrl === "string" ? identity.pictureUrl : undefined) ??
    httpsAvatar(options?.avatarUrl);

  const existing = await ctx.db
    .query("members")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  let memberId: Id<"members">;
  if (existing) {
    const name = fromIdentity ?? providedName ?? existing.name;
    await ctx.db.patch(existing._id, {
      clerkUserId: identity.subject,
      ...(githubUsername ? { githubUsername } : {}),
      name,
      ...(picture ? { avatarUrl: picture } : {}),
    });
    memberId = existing._id;
  } else {
    memberId = await ctx.db.insert("members", {
      tokenIdentifier: identity.tokenIdentifier,
      clerkUserId: identity.subject,
      ...(githubUsername ? { githubUsername } : {}),
      name: fromIdentity ?? providedName ?? PLACEHOLDER_NAME,
      ...(picture ? { avatarUrl: picture } : {}),
      isBuilder: false,
      joinedAt: Date.now(),
    });
  }

  const member = await ctx.db.get(memberId);
  if (!member) {
    throw new Error("Member not found");
  }
  await syncAuthoredIdentity(ctx, member);
  return member;
}
