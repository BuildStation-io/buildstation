import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-16">
      <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        BuildStation
      </p>
      <SignUp />
    </div>
  );
}
