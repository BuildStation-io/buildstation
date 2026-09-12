import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-16">
      <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        BuildStation
      </p>
      <SignIn />
    </div>
  );
}
