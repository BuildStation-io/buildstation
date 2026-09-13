"use node";

import { v } from "convex/values";
import { isFounderGithub } from "./founders";
import { githubLoginFromIdentity } from "./lib/githubIdentity";
import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

type GithubUserResponse = {
  login?: string;
  name?: string | null;
  avatar_url?: string;
  bio?: string | null;
  html_url?: string;
};

async function fetchGithubUser(login: string): Promise<GithubUserResponse> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "buildstation",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`https://api.github.com/users/${login}`, {
    headers,
  });
  if (!response.ok) {
    throw new Error(`GitHub profile not found for ${login}`);
  }
  return (await response.json()) as GithubUserResponse;
}

export const claimFromGitHub = action({
  args: {},
  returns: v.object({
    claimed: v.boolean(),
    reason: v.optional(v.string()),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const login = githubLoginFromIdentity(identity);
    if (!login) {
      return { claimed: false, reason: "Join with GitHub" };
    }
    if (isFounderGithub(login)) {
      return { claimed: false, reason: "founder" };
    }

    const existing = await ctx.runQuery(internal.members.getByToken, {
      tokenIdentifier: identity.tokenIdentifier,
    });
    if (existing?.isBuilder === true && existing.githubUrl) {
      return { claimed: true, reason: "already" };
    }

    const profile = await fetchGithubUser(login);
    const githubUsername = profile.login ?? login;
    await ctx.runMutation(internal.members.applyBuilderClaim, {
      tokenIdentifier: identity.tokenIdentifier,
      githubUsername,
      name: profile.name ?? undefined,
      avatarUrl: profile.avatar_url,
      bio: profile.bio ?? undefined,
      githubUrl: profile.html_url ?? `https://github.com/${githubUsername}`,
    });

    return { claimed: true };
  },
});

export const backfillExisting = internalAction({
  args: {},
  returns: v.object({
    claimed: v.number(),
    skipped: v.number(),
  }),
  handler: async (ctx) => {
    const candidates = await ctx.runQuery(
      internal.members.listClaimCandidates,
      {},
    );

    let claimed = 0;
    let skipped = 0;

    for (const candidate of candidates) {
      try {
        const profile = await fetchGithubUser(candidate.githubUsername);
        const githubUsername = profile.login ?? candidate.githubUsername;
        if (isFounderGithub(githubUsername)) {
          skipped += 1;
          continue;
        }
        await ctx.runMutation(internal.members.applyBuilderClaim, {
          memberId: candidate._id,
          githubUsername,
          name: profile.name ?? undefined,
          avatarUrl: profile.avatar_url,
          bio: profile.bio ?? undefined,
          githubUrl: profile.html_url ?? `https://github.com/${githubUsername}`,
        });
        claimed += 1;
      } catch (error) {
        console.error(
          `Builder backfill failed for ${candidate.githubUsername}:`,
          error,
        );
        skipped += 1;
      }
    }

    return { claimed, skipped };
  },
});
