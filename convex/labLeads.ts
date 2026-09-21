import { v } from "convex/values";
import { internalQuery, mutation } from "./_generated/server";

const LIMITS = {
  name: 120,
  company: 160,
  sector: 80,
  challenge: 4000,
  email: 200,
} as const;

function requiredText(value: string, max: number, label: string) {
  const trimmed = value.trim();
  if (trimmed.length < 1 || trimmed.length > max) {
    throw new Error(`${label} must be between 1 and ${max} characters`);
  }
  return trimmed;
}

export const submit = mutation({
  args: {
    name: v.string(),
    company: v.string(),
    sector: v.string(),
    challenge: v.string(),
    email: v.optional(v.string()),
  },
  returns: v.id("labLeads"),
  handler: async (ctx, args) => {
    const email = args.email?.trim();
    if (email && (email.length > LIMITS.email || !email.includes("@"))) {
      throw new Error(`Email must include @ and be at most ${LIMITS.email} characters`);
    }

    return await ctx.db.insert("labLeads", {
      name: requiredText(args.name, LIMITS.name, "Name"),
      company: requiredText(args.company, LIMITS.company, "Company"),
      sector: requiredText(args.sector, LIMITS.sector, "Sector"),
      challenge: requiredText(args.challenge, LIMITS.challenge, "Challenge"),
      email: email || undefined,
      createdAt: Date.now(),
      source: "build-lab",
    });
  },
});

const leadDoc = v.object({
  _id: v.id("labLeads"),
  _creationTime: v.number(),
  name: v.string(),
  company: v.string(),
  sector: v.string(),
  challenge: v.string(),
  email: v.optional(v.string()),
  createdAt: v.number(),
  source: v.string(),
});

export const list = internalQuery({
  args: {},
  returns: v.array(leadDoc),
  handler: async (ctx) => {
    return await ctx.db.query("labLeads").collect();
  },
});
