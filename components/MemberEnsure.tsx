"use client";

import { useUser } from "@clerk/nextjs";
import { useAction, useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

export function MemberEnsure() {
  const { isAuthenticated } = useConvexAuth();
  const { isLoaded, user } = useUser();
  const ensure = useMutation(api.users.ensure);
  const claim = useAction(api.builders.claimFromGitHub);
  const avatarUrl = user?.imageUrl?.startsWith("https://") ? user.imageUrl : undefined;

  useEffect(() => {
    if (!isAuthenticated || !isLoaded) {
      return;
    }

    void (async () => {
      await ensure(avatarUrl ? { avatarUrl } : {});
      try {
        await claim({});
      } catch {
        // Google-only sessions stay in the network count without a Builder card.
      }
    })();
  }, [avatarUrl, claim, ensure, isAuthenticated, isLoaded]);

  return null;
}
