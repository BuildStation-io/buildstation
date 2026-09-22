import type { Metadata } from "next";
import { IdeasBoard } from "@/components/IdeasBoard";

export const metadata: Metadata = {
  title: "Ideas",
  description:
    "Public field ideas from people in the network. Leave a slow process you saw at work. If it becomes a project, the card says so.",
};

export default function IdeasPage() {
  return <IdeasBoard />;
}
