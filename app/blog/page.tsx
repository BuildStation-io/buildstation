import type { Metadata } from "next";
import Link from "next/link";
import { OssHero } from "@/components/OssHero";
import { listPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const posts = listPosts();

  return (
    <>
      <OssHero
        eyebrow="Blog"
        title="Notes from the network."
        description="Every post is an MDX file in the repo. Fork a branch, write, open a PR. There is no editor behind a login."
        primaryHref="/blog/how-we-publish-on-buildstation"
        primaryLabel="How we publish"
        secondaryHref="/projects"
        secondaryLabel="See projects"
      />
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-line px-5 py-12"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                {post.date} · {post.author}
              </p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight">
                <Link href={`/blog/${post.slug}`} className="hover:opacity-80">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm"
              >
                Read
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line">
                  ↗
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
