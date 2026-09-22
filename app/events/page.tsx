import type { Metadata } from "next";
import { EventsBoard } from "@/components/EventsBoard";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Dates for the BuildStation network. Confirmed and possible gatherings, with no signup list.",
};

export default function EventsPage() {
  return <EventsBoard />;
}
