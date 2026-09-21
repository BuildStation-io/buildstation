import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const needValidator = v.object({
  title: v.string(),
  status: v.union(v.literal("open"), v.literal("done")),
});

export default defineSchema({
  members: defineTable({
    tokenIdentifier: v.string(),
    clerkUserId: v.string(),
    githubUsername: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    isBuilder: v.optional(v.boolean()),
    joinedAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_builder", ["isBuilder"]),

  projects: defineTable({
    slug: v.optional(v.string()),
    name: v.string(),
    description: v.string(),
    kind: v.optional(v.union(v.literal("product"), v.literal("oss"))),
    liveUrl: v.optional(v.string()),
    githubRepo: v.optional(v.string()),
    org: v.optional(v.string()),
    visible: v.optional(v.boolean()),
    needs: v.optional(v.array(needValidator)),
    accent: v.string(),
    featured: v.boolean(),
    language: v.optional(v.string()),
    stars: v.optional(v.number()),
    openIssues: v.optional(v.number()),
    addedBy: v.optional(v.id("members")),
  })
    .index("by_slug", ["slug"])
    .index("by_visible", ["visible"])
    .index("by_featured", ["featured"])
    .index("by_repo", ["githubRepo"]),

  syncState: defineTable({
    key: v.string(),
    lastSyncAt: v.number(),
  }).index("by_key", ["key"]),

  labLeads: defineTable({
    name: v.string(),
    company: v.string(),
    sector: v.string(),
    challenge: v.string(),
    email: v.optional(v.string()),
    createdAt: v.number(),
    source: v.string(),
  }),
});
