import type { Metadata } from "next";
import { ProjectsCatalog } from "@/components/ProjectsCatalog";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return <ProjectsCatalog />;
}
