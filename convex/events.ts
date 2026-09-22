import { v } from "convex/values";
import { sortEvents } from "../lib/events";
import { mutation, query } from "./_generated/server";
import { isFounderGithub } from "./founders";
import { ensureMember } from "./lib/auth";
import { githubLoginFromIdentity } from "./lib/githubIdentity";

const LIMITS = {
  title: 120,
  place: 160,
  summary: 2000,
  whenLabel: 80,
  url: 500,
} as const;

const statusValidator = v.union(
  v.literal("confirmed"),
  v.literal("possible"),
  v.literal("past"),
);

function requiredText(value: string, max: number, label: string) {
  const trimmed = value.trim();
  if (trimmed.length < 1 || trimmed.length > max) {
    throw new Error(`${label} must be between 1 and ${max} characters`);
  }
  return trimmed;
}

function optionalUrl(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length > LIMITS.url) {
    throw new Error(`Details link must be between 1 and ${LIMITS.url} characters`);
  }
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Details link must be an http or https URL");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Details link must be an http or https URL");
  }
  return trimmed;
}

function optionalWhen(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length > LIMITS.whenLabel) {
    throw new Error(`Date label must be between 1 and ${LIMITS.whenLabel} characters`);
  }
  return trimmed;
}

function optionalStart(value: number | undefined) {
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isFinite(value)) {
    throw new Error("Date must be a real day");
  }
  return value;
}

async function requireFounder(ctx: Parameters<typeof ensureMember>[0]) {
  const member = await ensureMember(ctx);
  if (!isFounderGithub(member.githubUsername)) {
    throw new Error("Only the team can post a date.");
  }
  return member;
}

const publicEvent = v.object({
  _id: v.id("events"),
  title: v.string(),
  place: v.string(),
  summary: v.string(),
  startsAt: v.optional(v.number()),
  whenLabel: v.optional(v.string()),
  status: statusValidator,
  url: v.optional(v.string()),
  createdAt: v.number(),
});

export const list = query({
  args: {},
  returns: v.array(publicEvent),
  handler: async (ctx) => {
    const events = await ctx.db.query("events").withIndex("by_createdAt").collect();
    const visible = events.flatMap((event) => {
      if (event.hidden) {
        return [];
      }
      return [
        {
          _id: event._id,
          title: event.title,
          place: event.place,
          summary: event.summary,
          ...(event.startsAt !== undefined ? { startsAt: event.startsAt } : {}),
          ...(event.whenLabel ? { whenLabel: event.whenLabel } : {}),
          status: event.status,
          ...(event.url ? { url: event.url } : {}),
          createdAt: event.createdAt,
        },
      ];
    });
    return sortEvents(visible);
  },
});

export const viewer = query({
  args: {},
  returns: v.union(v.null(), v.object({ isFounder: v.boolean() })),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    const handle = member?.githubUsername ?? githubLoginFromIdentity(identity);
    return { isFounder: isFounderGithub(handle) };
  },
});

export const submit = mutation({
  args: {
    title: v.string(),
    place: v.string(),
    summary: v.string(),
    status: statusValidator,
    startsAt: v.optional(v.number()),
    whenLabel: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  returns: v.id("events"),
  handler: async (ctx, args) => {
    const member = await requireFounder(ctx);
    const startsAt = optionalStart(args.startsAt);
    const whenLabel = optionalWhen(args.whenLabel) ?? (startsAt === undefined ? "Date TBA" : undefined);
    const url = optionalUrl(args.url);
    if (args.status === "confirmed" && startsAt === undefined) {
      throw new Error("A confirmed date needs a day.");
    }
    return await ctx.db.insert("events", {
      authorId: member._id,
      title: requiredText(args.title, LIMITS.title, "Title"),
      place: requiredText(args.place, LIMITS.place, "Place"),
      summary: requiredText(args.summary, LIMITS.summary, "Summary"),
      ...(startsAt !== undefined ? { startsAt } : {}),
      ...(whenLabel ? { whenLabel } : {}),
      status: args.status,
      ...(url ? { url } : {}),
      createdAt: Date.now(),
      hidden: false,
    });
  },
});

export const setStatus = mutation({
  args: {
    eventId: v.id("events"),
    status: statusValidator,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireFounder(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event || event.hidden) {
      throw new Error("Event not found");
    }
    if (args.status === "confirmed" && event.startsAt === undefined) {
      throw new Error("A confirmed date needs a day.");
    }
    await ctx.db.patch(event._id, { status: args.status });
    return null;
  },
});
