"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";

import { Sparkles, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const OPEN_EVENT = "docs:ask-ai";

/** Open the Ask AI panel from anywhere (search dialog, buttons), optionally pre-asking. */
export function openAskAi(question = "") {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { question } }));
}

type Source = { title: string; url: string };
type Turn = {
  question: string;
  answer?: string;
  sources?: Source[];
  error?: string;
};

const SUGGESTIONS = [
  "Why is part of my balance reserved?",
  "How do I record income for a member?",
  "What happens after I approve a withdrawal?",
];

// Only links back into the site are clickable; the model can't send readers
// anywhere else.
const isSafeHref = (href: string) => /^\/(docs|contact)(\/|\?|#|$)/.test(href);

/** Inline Markdown subset: **bold** and [label](/docs/...) links. */
function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) {
      parts.push(<strong key={match.index}>{match[1]}</strong>);
    } else if (isSafeHref(match[3])) {
      parts.push(
        <a
          key={match.index}
          href={match[3]}
          className="decoration-foreground/30 hover:decoration-foreground underline underline-offset-4"
        >
          {match[2]}
        </a>,
      );
    } else {
      parts.push(match[2]);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Paragraphs and bullet/numbered lists; everything else is plain text. */
function renderAnswer(answer: string): ReactNode {
  const blocks = answer.trim().split(/\n{2,}/);
  return blocks.map((block, i) => {
    const lines = block.split("\n");
    const bullet = /^\s*[-*]\s+/;
    const numbered = /^\s*\d+[.)]\s+/;
    if (lines.every((l) => bullet.test(l))) {
      return (
        <ul key={i} className="list-disc space-y-1 pl-5">
          {lines.map((l, j) => (
            <li key={j}>{renderInline(l.replace(bullet, ""))}</li>
          ))}
        </ul>
      );
    }
    if (lines.every((l) => numbered.test(l))) {
      return (
        <ol key={i} className="list-decimal space-y-1 pl-5">
          {lines.map((l, j) => (
            <li key={j}>{renderInline(l.replace(numbered, ""))}</li>
          ))}
        </ol>
      );
    }
    return <p key={i}>{renderInline(lines.join(" ").replace(/^#+\s*/, ""))}</p>;
  });
}

type AskAiButtonProps = { className?: string };

/** Header button that opens the panel. */
export const AskAiButton = ({ className }: AskAiButtonProps) => (
  <button
    type="button"
    onClick={() => openAskAi()}
    className={cn(
      "hover:border-foreground/40 inline-flex h-9 items-center gap-2 border px-2.5 text-sm transition-colors sm:px-3",
      className,
    )}
  >
    <Sparkles className="text-brand size-4" />
    <span className="sr-only sm:not-sr-only">Ask AI</span>
  </button>
);

// The panel itself: answers come only from the published docs (see the
// /api/ask Worker route) and always link the chapters they used.
export const AskAi = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    const history = turns
      .filter((t) => t.answer)
      .slice(-3)
      .map((t) => ({ question: t.question, answer: t.answer! }));
    setTurns((t) => [...t, { question: q }]);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data = (await res.json().catch(() => null)) as {
        answer?: string;
        sources?: Source[];
        error?: string;
      } | null;
      if (!res.ok || !data?.answer) {
        throw new Error(data?.error ?? "Ask AI isn't available right now.");
      }
      setTurns((t) =>
        t.map((turn, i) =>
          i === t.length - 1
            ? { ...turn, answer: data.answer, sources: data.sources ?? [] }
            : turn,
        ),
      );
    } catch (err) {
      setTurns((t) =>
        t.map((turn, i) =>
          i === t.length - 1
            ? {
                ...turn,
                error:
                  err instanceof Error && err.message !== "Failed to fetch"
                    ? err.message
                    : "Couldn't reach Ask AI. Check your connection and try again.",
              }
            : turn,
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  // Opened from the header button or the search dialog's "Ask AI" row.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const question = (e as CustomEvent<{ question?: string }>).detail
        ?.question;
      setOpen(true);
      if (question) void ask(question);
      else setTimeout(() => inputRef.current?.focus(), 30);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [turns, busy]);

  // On wide screens the panel docks: the page makes room beside it (see
  // html.ask-ai-open in global.css) instead of being covered.
  useEffect(() => {
    document.documentElement.classList.toggle("ask-ai-open", open);
    return () => document.documentElement.classList.remove("ask-ai-open");
  }, [open]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen} modal={false}>
      <DialogPrimitive.Portal>
        {/* Docked panel on the right; the page stays usable beside it. */}
        <DialogPrimitive.Content
          aria-describedby="ask-ai-note"
          onInteractOutside={(e) => e.preventDefault()}
          className="bg-card text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l shadow-2xl duration-300 sm:w-[440px] lg:w-[480px] lg:shadow-none"
        >
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <DialogPrimitive.Title className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="text-brand size-4" />
              Ask AI about Elivate Wallet
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close"
              className="text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {turns.length === 0 ? (
              <div className="flex flex-col gap-3">
                <p className="text-muted-foreground text-sm">
                  Ask a question about using Elivate Wallet. Answers come from
                  these docs and link the guide they used.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void ask(s)}
                      className="hover:border-foreground/40 border px-3 py-1.5 text-left text-sm transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {turns.map((turn, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="bg-muted self-end px-3 py-2 text-sm">
                      {turn.question}
                    </div>
                    {turn.answer ? (
                      <div className="flex flex-col gap-3 text-sm leading-relaxed">
                        {renderAnswer(turn.answer)}
                        {turn.sources?.length ? (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-meta-xs text-muted-foreground">
                              Sources
                            </span>
                            {turn.sources.map((s) => (
                              <a
                                key={s.url}
                                href={s.url}
                                className="hover:border-foreground/40 border px-2 py-0.5 text-xs transition-colors"
                              >
                                {s.title}
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : turn.error ? (
                      <p className="text-destructive text-sm" role="alert">
                        {turn.error}
                      </p>
                    ) : (
                      <p className="text-muted-foreground animate-pulse text-sm">
                        Reading the docs…
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-2 border-t p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void ask(input);
                  }
                }}
                rows={1}
                maxLength={500}
                placeholder="Ask a question…"
                aria-label="Your question"
                className="bg-background placeholder:text-muted-foreground focus-visible:border-foreground max-h-32 min-h-10 flex-1 resize-none border px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="bg-foreground text-background h-10 px-4 text-sm font-medium transition-opacity disabled:opacity-50"
              >
                Ask
              </button>
            </div>
            <p id="ask-ai-note" className="text-muted-foreground text-xs">
              AI answers can be wrong. Check the linked guide, or{" "}
              <a
                href="/contact?topic=support#contact-form"
                className="underline underline-offset-2"
              >
                contact support
              </a>
              .
            </p>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
