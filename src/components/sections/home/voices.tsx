"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { motion, type Variants } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = { base: 0.8 } as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

const QUOTES = [
  {
    text: "We closed our first week of Elivate with one page and no laptop opened. The post-mortem was waiting in Linear when I got up.",
    name: "L. Chen",
    role: "SRE Lead",
    org: "Basin",
    portrait: "/images/portraits/1.webp",
    filed: "Filed · Brooklyn · 2026.03",
  },
  {
    text: "I stopped dreading on-call. Elivate decides what's worth waking me for, and it's almost always right.",
    name: "M. Okafor",
    role: "Platform Lead",
    org: "Compass",
    portrait: "/images/portraits/2.webp",
    filed: "Filed · Berlin · 2026.02",
  },
  {
    text: "Alert volume dropped ninety-something percent in the first month. Not a single person on my team has asked to go back.",
    name: "A. Reyes",
    role: "Infrastructure",
    org: "Tideline",
    portrait: "/images/portraits/3.webp",
    filed: "Filed · Lisbon · 2026.04",
  },
] as const;

const Voices = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const updateActive = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.scrollWidth / QUOTES.length;
    setActive(Math.round(scrollLeft / cardWidth));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActive, { passive: true });
    return () => el.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / QUOTES.length;
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
  }, []);

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden"
    >
      <span
        aria-hidden="true"
        className="font-display text-foreground/4 pointer-events-none absolute -top-32 -left-10 text-[24rem] leading-none select-none md:-top-48 md:-left-24 md:text-[36rem]"
      >
        &ldquo;
      </span>

      <div className="section-padding relative container">
        <motion.div
          variants={fadeUp}
          className="text-meta text-muted-foreground mb-10 flex flex-wrap items-baseline gap-4 border-b pb-4 md:mb-14 lg:mb-20"
        >
          <span className="flex flex-1 items-center gap-2">
            <span className="bg-foreground size-1.5 animate-pulse rounded-full" />
            3 interviews &middot; Q1 2026
          </span>
          <span className="hidden md:inline">
            Photographs by the customer · used with permission
          </span>
          <span className="flex-1 text-end">Issue 01 &middot; Spring 2026</span>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]"
        >
          Quieter,{" "}
          <em className="text-muted-foreground">
            according to the teams who&apos;ve used it for a full quarter.
          </em>
        </motion.h2>
      </div>

      <motion.div variants={fadeUp} className="mt-6 md:mt-8 lg:mt-10">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-4 md:gap-8"
        >
          {QUOTES.map((q, i) => (
            <Card key={q.name} quote={q} index={i + 1} />
          ))}
        </div>

        <div className="section-padding container">
          <div className="mt-5 flex items-center justify-between md:mt-6">
            <div className="flex gap-2">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={cn(
                    "h-0.5 rounded-full transition-all duration-500",
                    active === i
                      ? "bg-foreground w-8"
                      : "bg-foreground/20 hover:bg-foreground/40 w-4",
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => scrollTo(Math.max(0, active - 1))}
                disabled={active === 0}
                className="border-border text-foreground hover:bg-foreground hover:text-background disabled:hover:text-foreground flex size-10 items-center justify-center rounded-full border transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                aria-label="Previous testimonial"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 3L5 8L10 13" />
                </svg>
              </button>
              <button
                onClick={() =>
                  scrollTo(Math.min(QUOTES.length - 1, active + 1))
                }
                disabled={active === QUOTES.length - 1}
                className="border-border text-foreground hover:bg-foreground hover:text-background disabled:hover:text-foreground flex size-10 items-center justify-center rounded-full border transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                aria-label="Next testimonial"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 3L11 8L6 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

type CardProps = {
  quote: (typeof QUOTES)[number];
  index: number;
};

const Card = ({ quote, index }: CardProps) => (
  <div className="w-[min(85vw,28rem)] flex-none snap-center md:w-lg lg:w-xl">
    <div className="group border-border bg-card relative overflow-hidden rounded-sm border">
      <div className="bg-muted relative aspect-4/5 w-full overflow-hidden">
        <img
          src={quote.portrait}
          alt={`Portrait of ${quote.name}, ${quote.role} at ${quote.org}`}
          sizes="(min-width: 1024px) 36rem, (min-width: 768px) 32rem, 85vw"
          className="absolute inset-0 size-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, transparent 60%, oklch(0 0 0 / 0.5) 100%)",
          }}
        />

        <Badge
          variant="overlay"
          className="pointer-events-none absolute top-3 left-3"
        >
          <span className="bg-foreground size-1 rounded-full" />№{" "}
          {String(index).padStart(2, "0")}
        </Badge>

        <span className="text-meta-xs text-background pointer-events-none absolute right-3 bottom-3 opacity-70">
          B&amp;W · 35mm
        </span>
      </div>

      <div className="flex flex-col gap-6 p-5 md:p-6">
        <span
          aria-hidden
          className="font-display text-foreground/15 text-5xl leading-none tracking-tight"
        >
          &ldquo;
        </span>

        <p className="font-display text-xl leading-[1.15] tracking-tight md:text-2xl lg:text-[1.7rem]">
          {quote.text}
        </p>

        <div className="text-meta border-border text-muted-foreground flex items-baseline gap-3 border-t pt-4">
          <span className="text-foreground">{quote.name}</span>
          <span>·</span>
          <span>{quote.role}</span>
          <span>·</span>
          <span>{quote.org}</span>
        </div>

        <div className="text-meta-xs border-border text-muted-foreground/60 flex items-center justify-between border-t pt-3">
          <span>{quote.filed}</span>
          <span>
            frame {String(index).padStart(2, "0")}/
            {String(QUOTES.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default Voices;
