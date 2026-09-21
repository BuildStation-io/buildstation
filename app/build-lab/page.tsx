import type { Metadata } from "next";
import { Alliance } from "@/components/build-lab/alliance";
import { Handbook } from "@/components/build-lab/handbook";
import { Hero } from "@/components/build-lab/hero";
import { PartnerCta } from "@/components/build-lab/partner-cta";
import { Process } from "@/components/build-lab/process";
import { Sectors } from "@/components/build-lab/sectors";
import { TrustWall } from "@/components/build-lab/trust-wall";

export const metadata: Metadata = {
  title: "Build Lab",
  description:
    "A partnership program where construction, mining, energy and real-estate companies bring a real problem and a BuildStation squad ships a solution in two-week sprints.",
};

export default function BuildLabPage() {
  return (
    <>
      <Hero />
      <Process />
      <Sectors />
      <Alliance />
      <Handbook />
      <PartnerCta />
      <TrustWall />
    </>
  );
}
