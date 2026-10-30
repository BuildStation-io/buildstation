// Founders updated with the user's confirmations on 2026-10-30.
// Portraits refreshed from the public GitHub profiles on the same date.
// Founders are editorial content, independent of GitHub sign-ins and the DB.
export type TeamMember = {
  name: string;
  role: "Founder";
  location?: string;
  image: string;
  company?: { name: string; logo?: string; width?: number; height?: number; theme?: "dark" };
  github: string;
};

const unitelec = {
  name: "Unitelec",
  logo: "/companies/unitelec.png",
  width: 287,
  height: 62,
};

export const team: TeamMember[] = [
  {
    name: "Andy Acaro",
    role: "Founder",
    location: "Lima, Perú",
    image: "/team/github-andy18acaro-20261030.webp",
    company: unitelec,
    github: "https://github.com/Andy18acaro",
  },
  {
    name: "Alex Rodrigo Salhua Vicuña",
    role: "Founder",
    location: "Perú",
    image: "/team/github-alex10114-20261030.webp",
    company: unitelec,
    github: "https://github.com/Alex10114",
  },
  {
    name: "Coralie Figueroa",
    role: "Founder",
    location: "Perú",
    image: "/team/github-coraliefigue11-20261030.webp",
    company: { name: "Ausenco", logo: "/companies/ausenco-white.png", width: 640, height: 119, theme: "dark" },
    github: "https://github.com/coraliefigue11",
  },
  {
    name: "Franklin Rosas",
    role: "Founder",
    location: "Perú",
    image: "/team/github-franklin-rosas-20261030.webp",
    company: { name: "GRAPCO S.A.C.", logo: "/companies/grapco.png", width: 260, height: 65 },
    github: "https://github.com/Franklin-Rosas",
  },
  {
    name: "GabMun",
    role: "Founder",
    image: "/team/github-gabgabogabito-20261030.webp",
    company: { name: "Draftel+" },
    github: "https://github.com/gabgabogabito",
  },
];

export const communityWhatsApp = "https://chat.whatsapp.com/L3uUQcDyvwW9w6D0RBoD1l";

// Existing Convex/member counters share the same editorial founder catalog.
export const TEAM = team;
