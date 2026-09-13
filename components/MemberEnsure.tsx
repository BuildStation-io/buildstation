"use client";

import { useAction, useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

export function MemberEnsure() {
  const { isAuthenticated } = useConvexAuth();
  const ensure = useMutation(api.users.ensure);
  const claim = useAction(api.builders.claimFromGitHub);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void (async () => {
      await ensure({});
      try {
        await claim({});
      } catch {
        // Google-only sessions stay in the network count without a Builder card.
      }
    })();
  }, [claim, ensure, isAuthenticated]);

  return null;
}
