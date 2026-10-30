"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Icon from "./Icon";

export default function JoinButton({ className = "button button-primary" }: { className?: string }) {
  const { isSignedIn } = useUser();
  if (isSignedIn) return <Link href="/members" className={className}>Mi comunidad <Icon name="arrow" /></Link>;
  return <Link href="/sign-in" className={className}>Unirme con GitHub <Icon name="github" /></Link>;
}
