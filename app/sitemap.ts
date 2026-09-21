import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/community";

const STATIC_PATHS = [
  "/",
  "/team",
  "/members",
  "/projects",
  "/blog",
  "/build-lab",
  "/sign-in",
  "/sign-up",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  }));

  for (const post of listPosts()) {
    pages.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : undefined,
    });
  }

  return pages;
}
