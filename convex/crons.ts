import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "sync-github-stats",
  { hourUTC: 6, minuteUTC: 0 },
  internal.github.sync,
);

export default crons;
