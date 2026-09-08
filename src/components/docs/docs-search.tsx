"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Search } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type SearchResult = {
  slug: string;
  title: string;
  description: string;
  group: string;
  url: string;
};

const fetchIndex = async (): Promise<SearchResult[]> => {
  try {
    const res = await fetch("/api/search.json");
    if (!res.ok) return [];
    return (await res.json()) as SearchResult[];
  } catch {
    return [];
  }
};

// Lightweight ⌘K search dialog. Lists every doc by title/description and
// filters client-side — keeps the wire form simple while preserving the
// keyboard-first feel of the fumadocs original.
export const DocsSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open && items.length === 0) {
      fetchIndex().then(setItems);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open, items.length]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      return (
        it.title.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        it.group.toLowerCase().includes(q)
      );
    });
  }, [query, items]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="group/search bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground flex items-center justify-between border px-3 py-2 text-left text-sm transition-colors"
        >
          <span className="flex items-center gap-2">
            <Search className="size-3.5" />
            <span>Search the manual</span>
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
              placeholder="Search the manual"
              className="text-foreground placeholder:text-muted-foreground h-12 flex-1 bg-transparent text-sm outline-none"
            />
            <DialogPrimitive.Close className="text-muted-foreground hover:text-foreground rounded-none border bg-transparent px-2 py-1 font-mono text-[0.6rem]">
              ESC
            </DialogPrimitive.Close>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-muted-foreground px-4 py-8 text-center text-sm">
                No matches.
              </div>
            ) : (
              <ul className="flex flex-col">
                {filtered.map((item) => (
                  <li key={item.slug}>
                    <a
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex flex-col gap-1 border-b px-4 py-3 text-sm transition-colors last:border-b-0",
                        "hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <span className="text-foreground font-medium">
                        {item.title}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {item.description}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
