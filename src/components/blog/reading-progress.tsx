"use client";

import { motion } from "motion/react";

import { scrollToTop, useReadingProgress } from "@/hooks/use-reading-progress";
import { cn } from "@/lib/utils";

const TICKS = 12;

const ReadingProgress = ({
  articleId,
  readMin,
}: {
  articleId: string;
  readMin: number;
}) => {
  const { progress, pct, remainingLabel } = useReadingProgress(
    articleId,
    readMin,
  );
  const filled = Math.round(progress * TICKS);

  return (
    <div className="flex w-full flex-col items-end gap-3 text-right">
      <div className="flex w-full items-baseline justify-between border-b pb-2">
        <span className="text-meta-xs text-muted-foreground tracking-widest uppercase">
          Folio
        </span>
        <span className="font-display text-base leading-none tracking-tight tabular-nums">
          {pct}%
        </span>
      </div>

      <div className="flex w-full items-center gap-1">
        {Array.from({ length: TICKS }, (_, i) => (
          <motion.span
            key={i}
            aria-hidden
            className={cn(
              "h-3 flex-1 origin-center rounded-[1px]",
              i < filled ? "bg-foreground" : "bg-foreground/15",
            )}
            animate={{ scaleY: i === filled - 1 ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </div>

      <div className="text-meta-xs text-muted-foreground">{remainingLabel}</div>

      <button
        type="button"
        onClick={scrollToTop}
        className={cn(
          "text-meta-xs text-muted-foreground hover:text-foreground tracking-widest uppercase transition-opacity",
          progress < 0.15 && "pointer-events-none opacity-0",
        )}
      >
        ↑ Top
      </button>
    </div>
  );
};

export default ReadingProgress;
