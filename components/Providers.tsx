"use client";

import type { ReactNode } from "react";
import { ConvexClientProvider } from "./ConvexClientProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
