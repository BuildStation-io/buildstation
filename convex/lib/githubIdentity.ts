type IdentityLike = {
  nickname?: string | null;
  preferredUsername?: string | null;
  username?: string | null;
};

function asHandle(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim().replace(/^@/, "");
  if (!trimmed || trimmed.includes("@") || trimmed.includes(" ")) {
    return undefined;
  }
  return trimmed;
}

export function githubLoginFromIdentity(
  identity: IdentityLike,
): string | undefined {
  return (
    asHandle(identity.nickname) ??
    asHandle(identity.preferredUsername) ??
    asHandle(identity.username)
  );
}
