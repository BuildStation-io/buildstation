import { WHATSAPP_INVITE } from "@/lib/community";

export const labContact = {
  /** Placeholder until the real lab inbox is provided. */
  email: "lab@buildstation.io",
  whatsapp: WHATSAPP_INVITE,
};

export const hero = {
  eyebrow: "Build Lab",
  title: "Build Lab turns field problems into working software.",
  lead:
    "A partnership program for construction, mining, energy and real-estate companies. You bring one real operational problem. A BuildStation squad ships a solution in two-week sprints, run on Scrum and a PMO handbook written for the people who use the tool.",
  primary: { label: "Propose a partnership", href: "#partner" },
  secondary: { label: "How it works", href: "#process" },
};

export const principles = [
  {
    kicker: "Agile, not slideware",
    text: "Scrum in two-week sprints. Every sprint ends with something a site foreman, a geologist or a plant operator can open and use.",
  },
  {
    kicker: "PMO for users, not for reports",
    text: "We keep the discipline of a PMO: scope, risk, cadence. Every artifact is written for the crew on the ground, not for a steering committee.",
  },
  {
    kicker: "Alliances, not vendors",
    text: "Partners give access: sites, data, airspace for drones, domain experts. We give back builders, prototypes in production and a handbook you keep.",
  },
];

export const stats = [
  { value: "2 wk", label: "sprint cadence" },
  { value: "4", label: "sectors in scope" },
  { value: "6–8 wk", label: "typical pilot" },
  { value: "1", label: "handbook per engagement" },
];

export const process = [
  {
    step: "01",
    name: "Discovery",
    duration: "Sprint 0 · 1 week",
    text: "On-site or remote. We map the problem, the users and the data you already have. Output: a one-page charter both sides sign.",
  },
  {
    step: "02",
    name: "Build",
    duration: "Sprints 1–3 · 2 weeks each",
    text: "A squad of 2–4 builders plus your product owner. A public backlog, a demo every sprint, a retro every sprint.",
  },
  {
    step: "03",
    name: "Field test",
    duration: "Runs inside sprints",
    text: "The tool runs on your site with the real input: drone captures, sensor exports, spreadsheets. We measure adoption, not feature count.",
  },
  {
    step: "04",
    name: "Handoff",
    duration: "Final sprint",
    text: "You keep the code, the data pipelines and the handbook. Scale it, extend it with the community, or stop. No lock-in.",
  },
];

export const sectors = [
  {
    name: "Construction",
    problems: ["Progress tracking from drone captures", "Daily site reports that write themselves", "Plan vs. as-built comparisons"],
    access: "Airspace over active sites, schedules, plan sets.",
  },
  {
    name: "Mining",
    problems: ["Stockpile volumetrics", "Haul-road and slope inspection", "HSE checklists in the field"],
    access: "Pit imagery, dispatch data, safety logs.",
  },
  {
    name: "Energy",
    problems: ["Solar and wind asset inspection", "Substation digital twins", "O&M ticketing that operators actually fill in"],
    access: "SCADA extracts, inspection reports, asset registers.",
  },
  {
    name: "Real estate",
    problems: ["Land-bank scoring", "Rent-roll and occupancy analytics", "Tenant onboarding flows"],
    access: "Portfolio data, floor plans, occupancy history.",
  },
];

export const alliance = {
  partner: {
    title: "What a partner brings",
    items: [
      "One real problem with a real owner",
      "A product owner for ~4 hours a week",
      "Access to the site, the data and the people who use it",
      "Permission to fly drones or place sensors where the problem lives",
      "Honest feedback at every sprint review",
    ],
  },
  buildstation: {
    title: "What BuildStation brings",
    items: [
      "A squad of builders from the network",
      "Scrum cadence and a Scrum lead",
      "Prototypes deployed, not decks",
      "The Build Lab handbook, adapted to your teams",
      "A showcase in the community when you allow it",
    ],
  },
};

export const handbook = {
  title: "The Build Lab handbook",
  lead: "Short, opinionated, written for users. Every engagement leaves with a copy adapted to the partner.",
  chapters: [
    { id: "00", name: "Charter", text: "One page. Problem, users, success metric, what is out of scope." },
    { id: "01", name: "Roles", text: "Product owner, Scrum lead, builders, field champion. Who decides what." },
    { id: "02", name: "Cadence", text: "Sprint planning, daily sync, review, retro, plus a field day per sprint." },
    { id: "03", name: "Definition of done", text: "Deployed and used by a real user on a real site. Nothing less." },
    { id: "04", name: "Data & risk agreement", text: "NDAs, data ownership, drone permits, safety induction. Agreed before Sprint 1." },
    { id: "05", name: "Handoff checklist", text: "Repo, credentials, pipelines, runbook, and the next three backlog items." },
  ],
};

export const sectorOptions = sectors.map((s) => s.name);

export type Partner = {
  name: string;
  sector: string;
  /** Path under /public. When omitted, the name is rendered as a text wordmark. */
  logo?: string;
  href?: string;
};

/**
 * Companies that trust us. Empty array = the wall renders founding-partner slots.
 * Add entries as alliances are signed.
 */
export const partners: Partner[] = [];

export const trustWall = {
  title: "Companies that trust us",
  lead: "The first cohort is forming. Eight founding-partner slots across four sectors.",
  slots: 8,
};
