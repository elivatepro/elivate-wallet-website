"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const ROMAN = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
] as const;
const toRoman = (n: number) => ROMAN[n] ?? `${n}`;

type Heading = { text: string; slug: string };

const SCROLL_OFFSET = 160;

export const LegalSchedule = ({ headings }: { headings: Heading[] }) => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (headings.length === 0) return;

    const update = () => {
      const scrollY = window.scrollY + SCROLL_OFFSET;

      const positions = headings.map((h) => {
        const el = document.getElementById(h.slug);
        return el
          ? el.getBoundingClientRect().top + window.scrollY
          : Number.POSITIVE_INFINITY;
      });

      let idx = 0;
      for (let i = 0; i < positions.length; i++) {
        if (positions[i] <= scrollY) idx = i;
        else break;
      }

      const start = positions[idx];
      const end =
        positions[idx + 1] ??
        document.documentElement.scrollHeight -
          window.innerHeight +
          SCROLL_OFFSET;
      const p = end > start ? (scrollY - start) / (end - start) : 0;

      setActive(idx);
      setProgress(Math.max(0, Math.min(1, p)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="border-y py-6">
      <div className="text-meta text-muted-foreground mb-5 flex items-baseline justify-between">
        <span>Schedule</span>
        <span className="tabular-nums">
          {String(headings.length).padStart(2, "0")} clauses
        </span>
      </div>

      <ol className="relative">
        <span
          aria-hidden
          className="bg-foreground/15 pointer-events-none absolute top-0 bottom-0 left-0 w-px"
        />

        {headings.map((h, i) => {
          const isActive = i === active;
          const isPassed = i < active;
          const fill = isPassed ? 1 : isActive ? progress : 0;

          return (
            <li key={h.slug} className="relative">
              <span
                aria-hidden
                className="bg-foreground pointer-events-none absolute top-0 left-0 w-px transition-[height] duration-150 ease-out"
                style={{ height: `${fill * 100}%` }}
              />
              <a
                href={`#${h.slug}`}
                className={cn(
                  "group/row flex items-baseline gap-3 py-1.5 pl-5 transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="text-meta-xs w-7 shrink-0 tabular-nums">
                  {toRoman(i + 1)}
                </span>
                <span className="font-display text-sm leading-snug tracking-tight">
                  {h.text}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
