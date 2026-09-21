import { SITE_URL } from "@/lib/community";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const origin = new URL(request.url).origin || SITE_URL;
  const joinUrl = `${origin}/sign-up`;
  const membersUrl = `${origin}/members`;

  const script = `#!/bin/sh
set -e

join="${joinUrl}"
members="${membersUrl}"

echo ""
echo "BuildStation: AI for AEC-Energy"
echo "Join as a Builder with GitHub so we can sync your photo, handle, and bio."
echo ""

if command -v open >/dev/null 2>&1; then
  open "$join"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$join"
elif command -v cmd.exe >/dev/null 2>&1; then
  cmd.exe /c start "" "$join"
else
  echo "Open this URL in your browser:"
  echo "  $join"
fi

echo "After you sign in with GitHub, your card lands on:"
echo "  $members"
echo ""
`;

  return new Response(script, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
