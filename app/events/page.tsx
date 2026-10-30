import type { Metadata } from "next";
import { EventsBoard } from "@/components/EventsBoard";
import LumaCalendar from "@/components/LumaCalendar";
import { getExternalEvents } from "@/lib/data";
import { getLumaConfig } from "@/lib/luma";

export const metadata: Metadata = {
  title: "Encuentros",
  description:
    "Workshops, meetups y hackathons para aprender haciendo. Encuentra tu próximo encuentro con la comunidad BuildStation.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const feed = await getExternalEvents();
  const { calendarUrl } = getLumaConfig();
  return <><EventsBoard external={feed.events} unavailable={feed.unavailable} calendarUrl={calendarUrl} now={feed.now} /><div className="site-container"><LumaCalendar /></div></>;
}
