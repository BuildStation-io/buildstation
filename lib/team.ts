export type TeamCompany = {
  name: string;
  logoUrl: string;
};

export type TeamMember = {
  name: string;
  role: string;
  location: string;
  githubUsername: string;
  bio: string;
  avatarUrl: string;
  company: TeamCompany;
};

export const TEAM: TeamMember[] = [
  {
    name: "Andy Acaro",
    role: "Founder",
    location: "Lima, Peru",
    githubUsername: "Andy18acaro",
    bio: "Constructor applying AI to infrastructure projects: construction, mining, energy, and real estate.",
    avatarUrl: "https://github.com/Andy18acaro.png",
    company: { name: "Unitelec", logoUrl: "/companies/unitelec.png" },
  },
  {
    name: "Alex Rodrigo Salhua Vicuña",
    role: "Founder",
    location: "Peru",
    githubUsername: "Alex10114",
    bio: "Founder. Building AI for infrastructure projects with the team.",
    avatarUrl: "/team/alex-pixel.png",
    company: { name: "Unitelec", logoUrl: "/companies/unitelec.png" },
  },
  {
    name: "Coralie Figueroa",
    role: "Cofounder",
    location: "Peru",
    githubUsername: "coraliefigue11",
    bio: "Cofounder. Building AI for infrastructure projects with the team.",
    avatarUrl: "https://github.com/coraliefigue11.png",
    company: { name: "GCAQ", logoUrl: "/companies/gcaq.png" },
  },
  {
    name: "Franklin Rosas",
    role: "Cofounder",
    location: "Peru",
    githubUsername: "Franklin-Rosas",
    bio: "Cofounder. Building AI for infrastructure projects with the team.",
    avatarUrl: "https://github.com/Franklin-Rosas.png",
    company: { name: "Valtana", logoUrl: "/companies/valtana.png" },
  },
];

export const FOUNDER_GITHUB_USERNAMES = TEAM.map((member) =>
  member.githubUsername.toLowerCase(),
);
