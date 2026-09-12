import type { Metadata } from "next";
import { OssCatalog } from "@/components/OssCatalog";

export const metadata: Metadata = {
  title: "Open source",
};

export default function OssPage() {
  return <OssCatalog />;
}
