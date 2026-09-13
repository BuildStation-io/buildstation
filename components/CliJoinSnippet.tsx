"use client";

import { useState } from "react";
import { CLI_COMMAND } from "@/lib/community";

export function CliJoinSnippet() {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(CLI_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex w-full max-w-2xl items-center gap-3 border border-line bg-surface px-4 py-3">
      <span className="font-mono text-[11px] text-muted">$</span>
      <code className="min-w-0 flex-1 truncate font-mono text-[12px] text-foreground/90 sm:text-[13px]">
        {CLI_COMMAND}
      </code>
      <button
        type="button"
        onClick={() => void copyCommand()}
        className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
