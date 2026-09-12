import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  members: defineTable({
    tokenIdentifier: v.string(),
    clerkUserId: v.string(),
    githubUsername: v.optional(v.string()),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    joinedAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  projects: defineTable({
    githubRepo: v.string(),
    org: v.string(),
    name: v.string(),
    description: v.string(),
    language: v.string(),
    stars: v.number(),
    openIssues: v.number(),
    accent: v.string(),
    featured: v.boolean(),
    addedBy: v.optional(v.id("members")),
  })
    .index("by_featured", ["featured"])
    .index("by_org", ["org"])
    .index("by_repo", ["githubRepo"]),

  syncState: defineTable({
    key: v.string(),
    lastSyncAt: v.number(),
  }).index("by_key", ["key"]),
});
