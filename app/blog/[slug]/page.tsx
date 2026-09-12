import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/MarkdownBody";
import { getPost, listPosts } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return { title: "Post" };
  }
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-24 pt-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        {post.date} · {post.author}
      </p>
      <h1 className="mt-6 text-5xl font-medium leading-[0.95] tracking-tight">
        {post.title}
      </h1>
      <p className="mt-6 text-lg leading-8 text-muted">{post.excerpt}</p>
      <div className="mt-12">
        <MarkdownBody content={post.content} />
      </div>
      <Link
        href="/blog"
        className="mt-16 inline-flex text-sm text-muted hover:text-foreground"
      >
        ← All posts
      </Link>
    </article>
  );
}
