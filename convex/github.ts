"use node";

import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

type GithubRepoResponse = {
  stargazers_count?: number;
  open_issues_count?: number;
  description?: string | null;
  language?: string | null;
};

export const sync = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const repos = await ctx.runQuery(internal.projects.listReposInternal, {});
    if (repos.length === 0) {
      return null;
    }
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "buildstation",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    for (const githubRepo of repos) {
      const response = await fetch(`https://api.github.com/repos/${githubRepo}`, {
        headers,
      });
      if (!response.ok) {
        console.error(`GitHub sync failed for ${githubRepo}: ${response.status}`);
        continue;
      }
      const data = (await response.json()) as GithubRepoResponse;
      await ctx.runMutation(internal.projects.applyGithubStats, {
        githubRepo,
        stars: data.stargazers_count ?? 0,
        openIssues: data.open_issues_count ?? 0,
        description: data.description ?? undefined,
        language: data.language ?? undefined,
      });
    }

    await ctx.runMutation(internal.projects.markSynced, { at: Date.now() });
    return null;
  },
});
