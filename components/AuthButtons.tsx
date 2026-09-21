"use client";

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerkAppearance";

export function AuthButtons() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <span className="inline-flex h-9 w-20 rounded-full border border-line" />
    );
  }

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          ...clerkAppearance,
          elements: {
            avatarBox: "h-8 w-8",
          },
        }}
      />
    );
  }

  return (
    <div className="flex items-center gap-3">
      <SignInButton mode="modal" appearance={clerkAppearance}>
        <button
          type="button"
          data-goo-target
          data-goo-color="#ffffff"
          className="inline-flex h-9 items-center whitespace-nowrap rounded-full border border-line px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          Sign in
        </button>
      </SignInButton>
      <SignUpButton mode="modal" appearance={clerkAppearance}>
        <button
          type="button"
          data-goo-target
          data-goo-color="#67e8f9"
          className="inline-flex h-9 items-center whitespace-nowrap rounded-full bg-foreground px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-background"
        >
          Join
        </button>
      </SignUpButton>
    </div>
  );
}
