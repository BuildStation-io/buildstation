"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

export function MemberEnsure() {
  const { isAuthenticated } = useConvexAuth();
  const ensure = useMutation(api.users.ensure);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    void ensure({});
  }, [ensure, isAuthenticated]);

  return null;
}
