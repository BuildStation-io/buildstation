"use client";

import { useQuery } from "convex/react";
import { OssHero } from "./OssHero";
import { WhatsAppLink } from "./WhatsAppLink";
import { api } from "@/convex/_generated/api";
import { WHATSAPP_INVITE } from "@/lib/community";

type MemberCard = {
  _id: string;
  name: string;
  avatarUrl?: string;
  githubUsername?: string;
};

function MemberGrid({ members }: { members: MemberCard[] }) {
  if (members.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="border border-line px-6 py-16 text-center">
          <p className="text-2xl font-medium tracking-tight">
            Be the first to join.
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">
            Sign in so your name and avatar land in the network, or say hello
            in WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/sign-in"
              className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background"
            >
              Sign in
            </a>
            <WhatsAppLink className="inline-flex h-11 items-center gap-2 text-sm text-foreground/80 hover:text-foreground" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {members.map((member) => (
          <article
            key={member._id}
            className="flex flex-col items-start gap-4 border-b border-r border-line p-6"
          >
            {member.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.avatarUrl}
                alt=""
                className="h-14 w-14 rounded-full border border-line object-cover"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line font-mono text-sm">
                {member.name.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div>
              <p className="text-sm font-medium">{member.name}</p>
              {member.githubUsername ? (
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  @{member.githubUsername}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LiveDirectory() {
  const members = useQuery(api.members.list, {});
  if (members === undefined) {
    return (
      <section className="mx-auto w-full max-w-6xl px-5 pb-24 text-sm text-muted">
        Loading members…
      </section>
    );
  }
  return <MemberGrid members={members} />;
}

export function MembersDirectory() {
  return (
    <>
      <OssHero
        eyebrow="Members"
        title="People in the network."
        description="Anyone who signs in becomes a member. The count on the home page is this list — not stars from other people’s repos."
        primaryHref="/sign-in"
        primaryLabel="Join the network"
        secondaryHref={WHATSAPP_INVITE}
        secondaryLabel="WhatsApp"
      />
      {process.env.NEXT_PUBLIC_CONVEX_URL ? (
        <LiveDirectory />
      ) : (
        <MemberGrid members={[]} />
      )}
    </>
  );
}
