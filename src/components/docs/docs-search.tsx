"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Search, Sparkles } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { openAskAi } from "@/components/docs/ask-ai";
import { cn } from "@/lib/utils";

type SearchItem = {
  slug: string;
  title: string;
  description: string;
  group: string;
  url: string;
  headings: string[];
  text: string;
};

type Result = SearchItem & { score: number; snippet: string | null };

let indexPromise: Promise<SearchItem[]> | null = null;

const fetchIndex = (): Promise<SearchItem[]> => {
  indexPromise ??= fetch("/api/search.json")
    .then((res) => (res.ok ? (res.json() as Promise<SearchItem[]>) : []))
    .catch(() => {
      indexPromise = null;
      return [];
    });
  return indexPromise;
};

/** ~140 characters of body text around the first match. */
const snippetFor = (text: string, terms: string[]): string | null => {
  const lower = text.toLowerCase();
  const at = Math.min(
    ...terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0),
  );
  if (!Number.isFinite(at)) return null;
  const start = Math.max(0, at - 50);
  const end = Math.min(text.length, at + 90);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).replace(/\s+/g, " ").trim()}${end < text.length ? "…" : ""}`;
};

// Every term must appear somewhere; titles and headings outrank body text.
const rank = (items: SearchItem[], query: string): Result[] => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) {
    return items.map((item) => ({ ...item, score: 0, snippet: null }));
  }
  return items
    .map((item) => {
      const title = item.title.toLowerCase();
      const headings = item.headings.join(" ").toLowerCase();
      const description = item.description.toLowerCase();
      const body = item.text.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 8;
        else if (headings.includes(term)) score += 4;
        else if (description.includes(term)) score += 3;
        else if (body.includes(term)) score += 1;
        else return null;
      }
      return { ...item, score, snippet: snippetFor(item.text, terms) };
    })
    .filter((r): r is Result => r !== null)
    .sort((a, b) => b.score - a.score);
};

type DocsSearchProps = {
  /** Only one trigger per page should own ⌘K, or two toggles cancel out. */
  hotkey?: boolean;
  className?: string;
};

// ⌘K search over every published chapter (titles, headings and body text),
// with a hand-off to Ask AI for questions the text search can't answer.
export const DocsSearch = ({ hotkey = true, className }: DocsSearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey]);

  useEffect(() => {
    if (!open) return;
    fetchIndex().then(setItems);
    setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  const results = useMemo(() => rank(items, query), [items, query]);
  const trimmed = query.trim();
  // Last row is "Ask AI" whenever there is a query.
  const rowCount = results.length + (trimmed ? 1 : 0);

  useEffect(() => setActive(0), [query]);

  const askAi = () => {
    setOpen(false);
    openAskAi(trimmed);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, rowCount - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && rowCount > 0) {
      e.preventDefault();
      if (active < results.length) window.location.href = results[active].url;
      else askAi();
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "group/search bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground flex h-9 items-center justify-between gap-3 border px-3 text-left text-sm transition-colors",
            className,
          )}
        >
          <span className="flex items-center gap-2">
            <Search className="size-3.5" />
            <span>Search the docs</span>
          </span>
          <kbd className="text-muted-foreground/80 group-hover/search:text-foreground font-mono text-[0.6rem] transition-colors">
            ⌘ K
          </kbd>
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-background/70 fixed inset-0 z-50 backdrop-blur-sm" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="bg-card text-foreground fixed top-[12vh] left-[50%] z-50 grid w-[92vw] max-w-xl translate-x-[-50%] gap-0 border shadow-2xl"
        >
          <DialogPrimitive.Title className="sr-only">
            Search docs
          </DialogPrimitive.Title>
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="text-muted-foreground size-4" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search the docs"
              aria-label="Search the docs"
              className="text-foreground placeholder:text-muted-foreground h-12 flex-1 bg-transparent text-sm outline-none"
            />
            <DialogPrimitive.Close className="text-muted-foreground hover:text-foreground rounded-none border bg-transparent px-2 py-1 font-mono text-[0.6rem]">
              ESC
            </DialogPrimitive.Close>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {results.length === 0 && trimmed ? (
              <div className="text-muted-foreground px-4 pt-6 pb-2 text-center text-sm">
                No chapter mentions “{trimmed}”.
              </div>
            ) : null}
            <ul className="flex flex-col">
              {results.map((item, i) => (
                <li key={item.slug}>
                  <a
                    href={item.url}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex flex-col gap-1 border-b px-4 py-3 text-sm transition-colors",
                      active === i && "bg-muted",
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-foreground font-medium">
                        {item.title}
                      </span>
                      <span className="text-meta-xs text-muted-foreground shrink-0">
                        {item.group}
                      </span>
                    </span>
                    <span className="text-muted-foreground text-xs leading-relaxed">
                      {item.snippet ?? item.description}
                    </span>
                  </a>
                </li>
              ))}
              {trimmed ? (
                <li>
                  <button
                    type="button"
                    onClick={askAi}
                    onMouseEnter={() => setActive(results.length)}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition-colors",
                      active === results.length && "bg-muted",
                    )}
                  >
                    <Sparkles className="text-brand size-4 shrink-0" />
                    <span>
                      Ask AI: <span className="font-medium">“{trimmed}”</span>
                    </span>
                  </button>
                </li>
              ) : null}
            </ul>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
