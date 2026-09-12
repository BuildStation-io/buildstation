import type { ComponentProps } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export const clerkAppearance: NonNullable<
  ComponentProps<typeof ClerkProvider>["appearance"]
> = {
  variables: {
    colorBackground: "#0a0a0a",
    colorPrimary: "#f5f5f5",
    borderRadius: "0.75rem",
  },
  options: {
    logoImageUrl: "/buildstation-mark.png",
    logoLinkUrl: "/",
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
    showOptionalFields: false,
  },
};
