import { readdirSync, readFileSync } from "fs";
import path from "path";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: raw.trim() };
  }

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(":");
    if (sep === -1) {
      continue;
    }
    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = value;
  }

  return { data, body: match[2].trim() };
}

function toPost(filename: string, raw: string): BlogPost {
  const { data, body } = parseFrontmatter(raw);
  return {
    slug: filename.replace(/\.mdx$/, ""),
    title: data.title ?? filename,
    date: data.date ?? "",
    author: data.author ?? "BuildStation",
    excerpt: data.excerpt ?? "",
    content: body,
  };
}

export function listPosts(): BlogPost[] {
  return readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx") && file !== "README.md")
    .map((file) => toPost(file, readFileSync(path.join(BLOG_DIR, file), "utf8")))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | null {
  const posts = listPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
