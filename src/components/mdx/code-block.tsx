"use client";

import { useState } from "react";

import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  html: string;
  label: string;
  glyph: string;
  title?: string;
};

export const CodeBlock = ({
  code,
  html,
  label,
  glyph,
  title,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // older browsers without async clipboard
    }
  };

  return (
    <div className="not-prose group/code bg-card relative my-5 overflow-hidden border">
      <CornerTicks />

      <div className="bg-muted/40 flex items-center justify-between border-b px-3 py-1.5">
        <div className="text-meta-xs text-muted-foreground flex items-center gap-3">
          <span
            aria-hidden
            className="border-border/70 bg-background text-foreground/70 inline-flex h-5 min-w-5 items-center justify-center border px-1 font-mono text-[0.65rem]"
          >
            {glyph}
          </span>
          {title ? (
            <span className="text-foreground/80 font-mono text-[0.65rem] tracking-wide">
              {title}
            </span>
          ) : null}
          <span className="font-mono text-[0.6rem] tracking-widest uppercase">
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className={cn(
            "text-meta-xs relative inline-flex items-center gap-1.5 px-2 py-1",
            "text-muted-foreground hover:text-foreground transition-colors",
          )}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          <span aria-hidden className="relative inline-block size-3">
            <Copy
              className={cn(
                "absolute inset-0 size-3 transition-[transform,opacity] duration-300 ease-out",
                copied
                  ? "scale-75 -rotate-6 opacity-0"
                  : "scale-100 rotate-0 opacity-100",
              )}
            />
            <Check
              className={cn(
                "absolute inset-0 size-3 transition-[transform,opacity] duration-300 ease-out",
                copied
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-75 rotate-6 opacity-0",
              )}
            />
          </span>
          <span
            aria-hidden
            className="relative inline-grid overflow-hidden py-[0.15em] font-mono text-[0.6rem] leading-none tracking-widest uppercase"
          >
            <span
              className={cn(
                "col-start-1 row-start-1 transition-[transform,opacity] duration-300 ease-out",
                copied
                  ? "-translate-y-[120%] opacity-0"
                  : "translate-y-0 opacity-100",
              )}
            >
              Copy
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 transition-[transform,opacity] duration-300 ease-out",
                copied
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[120%] opacity-0",
              )}
            >
              Copied
            </span>
          </span>
        </button>
      </div>

      <div
        className="shiki-wrapper overflow-x-auto px-4 py-4 font-mono text-[0.78rem] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

const CornerTicks = () => (
  <>
    <span
      aria-hidden
      className="border-foreground/30 pointer-events-none absolute top-1.5 left-1.5 size-1.5 border-t border-l opacity-0 transition-opacity duration-300 group-hover/code:opacity-100"
    />
    <span
      aria-hidden
      className="border-foreground/30 pointer-events-none absolute top-1.5 right-1.5 size-1.5 border-t border-r opacity-0 transition-opacity duration-300 group-hover/code:opacity-100"
    />
    <span
      aria-hidden
      className="border-foreground/30 pointer-events-none absolute bottom-1.5 left-1.5 size-1.5 border-b border-l opacity-0 transition-opacity duration-300 group-hover/code:opacity-100"
    />
    <span
      aria-hidden
      className="border-foreground/30 pointer-events-none absolute right-1.5 bottom-1.5 size-1.5 border-r border-b opacity-0 transition-opacity duration-300 group-hover/code:opacity-100"
    />
  </>
);
