"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { Component, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const SECTORS = [
  { value: "construction", label: "Construction" },
  { value: "mining", label: "Mining" },
  { value: "energy", label: "Energy" },
  { value: "real estate", label: "Real estate" },
] as const;

type Sector = (typeof SECTORS)[number]["value"];

const STATUS_LABEL = {
  open: "Open",
  picked: "Picked",
  shipped: "Shipped",
} as const;

const field =
  "w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-muted focus:outline-none disabled:opacity-60";

type Idea = {
  _id: Id<"ideas">;
  authorName: string;
  githubUsername?: string;
  place: string;
  process: string;
  why: string;
  sector: Sector;
  status: keyof typeof STATUS_LABEL;
  projectSlug?: string;
  createdAt: number;
};

type IdeaComment = {
  _id: Id<"ideaComments">;
  ideaId: Id<"ideas">;
  authorName: string;
  githubUsername?: string;
  body: string;
  createdAt: number;
};

function readableError(reason: unknown) {
  const raw = reason instanceof Error ? reason.message : "Could not save that.";
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("[CONVEX") && !line.startsWith("[Request ID"));
  const server = lines.find((line) => line !== "Server Error");
  return (server ?? raw).replace(/^Uncaught Error:\s*/, "");
}

function formatWhen(createdAt: number) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(createdAt);
}

function sectorLabel(sector: Sector) {
  return SECTORS.find((item) => item.value === sector)?.label ?? sector;
}

function CommentList({ comments }: { comments: IdeaComment[] }) {
  if (comments.length === 0) {
    return <p className="text-sm text-muted">No replies yet.</p>;
  }

  return (
    <ul className="grid gap-4">
      {comments.map((comment) => {
        const handle = comment.githubUsername?.replace(/^@/, "");
        return (
          <li key={comment._id} className="border-t border-line pt-4">
            <p className="text-sm">
              <span className="font-medium">{comment.authorName}</span>
              {handle ? (
                <a
                  href={`https://github.com/${handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 font-mono text-[12px] text-muted hover:text-foreground"
                >
                  @{handle}
                </a>
              ) : null}
              <time className="ml-2 font-mono text-[11px] text-muted" dateTime={new Date(comment.createdAt).toISOString()}>
                {formatWhen(comment.createdAt)}
              </time>
            </p>
            <p className="mt-2 text-sm leading-6">{comment.body}</p>
          </li>
        );
      })}
    </ul>
  );
}

function ReplyBox({ ideaId }: { ideaId: Id<"ideas"> }) {
  const { isLoaded, isSignedIn } = useAuth();
  const addComment = useMutation(api.ideaComments.add);
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <Link href="/sign-in" className="text-sm text-foreground hover:underline">
        Sign in
      </Link>
    );
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setPending(true);
        setError(null);
        void addComment({ ideaId, body })
          .then(() => setBody(""))
          .catch((reason: unknown) => setError(readableError(reason)))
          .finally(() => setPending(false));
      }}
    >
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Reply</span>
        <textarea
          required
          rows={3}
          maxLength={2000}
          className={field}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Add to the thread"
        />
      </label>
      {error ? <p className="text-sm text-muted">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-fit items-center rounded-full bg-foreground px-5 text-sm font-medium text-background disabled:opacity-60"
      >
        {pending ? "Posting…" : "Reply"}
      </button>
    </form>
  );
}

function IdeaCard({ idea, comments }: { idea: Idea; comments: IdeaComment[] }) {
  const handle = idea.githubUsername?.replace(/^@/, "");

  return (
    <article className="flex flex-col gap-4 border-b border-r border-line p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {sectorLabel(idea.sector)}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {STATUS_LABEL[idea.status]}
        </p>
      </div>
      <h2 className="text-2xl font-medium tracking-tight">{idea.place}</h2>
      <p className="text-sm leading-6">{idea.process}</p>
      <p className="text-sm leading-6 text-muted">{idea.why}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-sm">
          <span className="font-medium">{idea.authorName}</span>
          {handle ? (
            <a
              href={`https://github.com/${handle}`}
              target="_blank"
              rel="noreferrer"
              className="ml-2 font-mono text-[12px] text-muted hover:text-foreground"
            >
              @{handle}
            </a>
          ) : null}
        </p>
        {idea.status === "shipped" && idea.projectSlug ? (
          <Link
            href={`/projects#${idea.projectSlug}`}
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground hover:underline"
          >
            See the project
          </Link>
        ) : idea.status === "shipped" ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            This became a project
          </p>
        ) : null}
      </div>
      <div className="mt-2 grid gap-4 border-t border-line pt-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Thread</p>
        <CommentList comments={comments} />
        <ReplyBox ideaId={idea._id} />
      </div>
    </article>
  );
}

function IdeaForm({
  canPost,
  showAuthActions,
  pending,
  error,
  onSubmit,
}: {
  canPost: boolean;
  showAuthActions: boolean;
  pending: boolean;
  error: string | null;
  onSubmit: (form: { place: string; process: string; why: string; sector: Sector }) => void;
}) {
  const [place, setPlace] = useState("");
  const [process, setProcess] = useState("");
  const [why, setWhy] = useState("");
  const [sector, setSector] = useState<Sector>("construction");

  const update =
    (setter: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setter(event.target.value);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canPost) {
      return;
    }
    onSubmit({ place, process, why, sector });
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Sector</span>
        <select
          className={field}
          value={sector}
          disabled={!canPost}
          onChange={(event) => setSector(event.target.value as Sector)}
        >
          {SECTORS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Where you saw it</span>
        <input
          required
          disabled={!canPost}
          className={field}
          value={place}
          onChange={update(setPlace)}
          placeholder="Site, office, plant, or mine"
          maxLength={160}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">What people do today</span>
        <textarea
          required
          disabled={!canPost}
          rows={4}
          className={field}
          value={process}
          onChange={update(setProcess)}
          placeholder="The slow process, as you watched it"
          maxLength={4000}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Why it can move faster</span>
        <textarea
          required
          disabled={!canPost}
          rows={3}
          className={field}
          value={why}
          onChange={update(setWhy)}
          placeholder="What is manual, repeated, or easy to miss"
          maxLength={2000}
        />
      </label>
      {error ? <p className="text-sm text-muted">{error}</p> : null}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {canPost ? (
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background disabled:opacity-60"
          >
            {pending ? "Posting…" : "Post the idea"}
          </button>
        ) : showAuthActions ? (
          <>
            <Link
              href="/sign-in"
              className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background"
            >
              Join
            </Link>
          </>
        ) : null}
      </div>
    </form>
  );
}

function Board({
  ideas,
  comments,
}: {
  ideas: Idea[] | undefined;
  comments: IdeaComment[] | undefined;
}) {
  if (ideas === undefined || comments === undefined) {
    return <p className="px-5 py-16 text-sm text-muted">Loading ideas…</p>;
  }
  if (ideas.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-2xl font-medium tracking-tight">No field ideas yet.</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">
          Be the first to leave a process you saw at work.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1">
      {ideas.map((idea) => (
        <IdeaCard
          key={idea._id}
          idea={idea}
          comments={comments.filter((comment) => comment.ideaId === idea._id)}
        />
      ))}
    </div>
  );
}

function IdeaList() {
  const ideas = useQuery(api.ideas.list, {});
  const comments = useQuery(api.ideaComments.list, {});
  return <Board ideas={ideas} comments={comments} />;
}

class IdeaListBoundary extends Component<{ children: ReactNode }, { failed: boolean; message: string | null }> {
  state = { failed: false, message: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { failed: true, message: readableError(error) };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="px-6 py-16">
          <p className="text-2xl font-medium tracking-tight">The board could not load.</p>
          {this.state.message ? (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{this.state.message}</p>
          ) : null}
        </div>
      );
    }
    return this.props.children;
  }
}

function LiveBoard() {
  const { isLoaded, isSignedIn } = useAuth();
  const submitIdea = useMutation(api.ideas.submit);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posted, setPosted] = useState(false);
  const canPost = isLoaded && isSignedIn === true;

  return (
    <IdeasLayout
      ideas={
        <IdeaListBoundary>
          <IdeaList />
        </IdeaListBoundary>
      }
      form={
        posted ? (
          <p className="text-lg font-medium tracking-tight">The idea is on the board.</p>
        ) : (
          <IdeaForm
            canPost={canPost}
            showAuthActions={!canPost}
            pending={pending}
            error={error}
            onSubmit={(form) => {
              if (!canPost) {
                return;
              }
              setPending(true);
              setError(null);
              void submitIdea(form)
                .then(() => setPosted(true))
                .catch((reason: unknown) => {
                  setError(readableError(reason));
                })
                .finally(() => setPending(false));
            }}
          />
        )
      }
      signedOutNote={
        isLoaded && !isSignedIn ? "Sign in to post. Anonymous visitors cannot publish." : null
      }
    />
  );
}

function IdeasLayout({
  ideas,
  form,
  signedOutNote,
}: {
  ideas: ReactNode;
  form: ReactNode;
  signedOutNote: string | null;
}) {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-24 sm:pt-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Ideas</p>
        <h1 className="mt-6 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-7xl">
          A process you saw in the field.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
          Leave a slow process from a site, an office, or a mine. Your name stays on the card.
          If it becomes a project, the card says so.
        </p>
        <div className="mt-12 max-w-2xl border border-line p-6 sm:p-8">
          {signedOutNote ? <p className="mb-4 text-sm leading-6 text-muted">{signedOutNote}</p> : null}
          {form}
        </div>
      </section>
      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">The board</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight">Public field ideas.</h2>
        </div>
        <div className="mx-auto w-full max-w-6xl border-t border-line">{ideas}</div>
      </section>
    </>
  );
}

export function IdeasBoard() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return (
      <IdeasLayout
        signedOutNote="Sign in to post. Anonymous visitors cannot publish."
        ideas={
          <div className="px-6 py-16 text-center">
            <p className="text-2xl font-medium tracking-tight">No field ideas yet.</p>
          </div>
        }
        form={
          <IdeaForm
            canPost={false}
            showAuthActions
            pending={false}
            error={null}
            onSubmit={() => undefined}
          />
        }
      />
    );
  }
  return <LiveBoard />;
}
