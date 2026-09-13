import type { Metadata } from "next";
import { MembersDirectory } from "@/components/MembersDirectory";

export const metadata: Metadata = {
  title: "Builders",
};

export default function MembersPage() {
  return <MembersDirectory />;
}
