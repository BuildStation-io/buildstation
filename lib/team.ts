export type TeamMember = {
  name: string;
  role: string;
  location: string;
  githubUsername: string;
  bio: string;
  avatarUrl: string;
};

export const TEAM: TeamMember[] = [
  {
    name: "Andy Acaro",
    role: "Founder",
    location: "Lima, Peru",
    githubUsername: "Andy18acaro",
    bio: "Constructor applying AI to AEC-Energy — architecture, engineering, construction, and energy.",
    avatarUrl: "https://github.com/Andy18acaro.png",
  },
];

export const FOUNDER_GITHUB_USERNAMES = TEAM.map((member) =>
  member.githubUsername.toLowerCase(),
);
