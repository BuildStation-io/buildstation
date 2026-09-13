export const FOUNDER_GITHUB_USERNAMES = ["andy18acaro"] as const;

export function isFounderGithub(username: string | undefined): boolean {
  if (!username) {
    return false;
  }
  const handle = username.replace(/^@/, "").toLowerCase();
  return FOUNDER_GITHUB_USERNAMES.some((founder) => founder === handle);
}
