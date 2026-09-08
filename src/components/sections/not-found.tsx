"use client";

import { motion } from "motion/react";

import { DottedBackdrop } from "@/components/layout/dotted-backdrop";
import { Button } from "@/components/ui/button";

// Pre-rounded so server and client emit byte-identical SVG markup.
const COMPASS_TICKS = Array.from({ length: 32 }, (_, i) => {
  const a = (i / 32) * Math.PI * 2;
  const isMajor = i % 8 === 0;
  const r1 = isMajor ? 44 : 46;
  const r2 = 48;
  const f = (n: number) => Number(n.toFixed(3));
  return {
    x1: f(50 + Math.cos(a) * r1),
    y1: f(50 + Math.sin(a) * r1),
    x2: f(50 + Math.cos(a) * r2),
    y2: f(50 + Math.sin(a) * r2),
    width: isMajor ? 0.6 : 0.3,
  };
});

// Compass + 404 both scale on the same vmin axis so the content always
// holds the same proportion to the circle at any viewport size.
const COMPASS_SIZE = "min(92vmin, 820px)";
const SIZE_404 = "clamp(4.5rem, 22vmin, 12rem)";

export const NotFound = () => (
  <main className="bg-background relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
    <DottedBackdrop opacity={0.06} cell={32} />

    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <span className="bg-foreground/15 absolute inset-x-0 top-1/2 h-px" />
      <span className="bg-foreground/15 absolute inset-y-0 left-1/2 w-px" />
    </div>

    <motion.svg
      viewBox="0 0 100 100"
      className="text-foreground/12 pointer-events-none absolute"
      style={{ width: COMPASS_SIZE, height: COMPASS_SIZE }}
      animate={{ rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      aria-hidden
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.3"
      />
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.2"
        strokeDasharray="0.4 1.6"
      />
      {COMPASS_TICKS.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          // i=24 is the tick at the top of the dial (sin(3π/2) = -1 in SVG
          // y-down coords) — that's the one beside the "N" text. Painted red
          // so the broken compass's only readable mark doubles as the
          // page's error indicator. Darker red in dark mode so it doesn't
          // glow against the dark canvas.
          className={
            i === 24
              ? "stroke-destructive dark:stroke-red-900"
              : "stroke-current"
          }
          strokeWidth={t.width}
        />
      ))}
      <text
        x="50"
        y="14"
        textAnchor="middle"
        className="fill-destructive font-mono dark:fill-red-900"
        style={{ fontSize: "3px" }}
      >
        N
      </text>
    </motion.svg>

    <div
      className="relative z-10 flex flex-col items-center text-center"
      style={{ maxWidth: "min(28rem, 68vmin)" }}
    >
      {/* Status badge — only shows on xl+ where there's vertical room.
          On smaller screens the red N tick on the compass carries the error
          signal alone. */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-meta text-muted-foreground hidden items-center gap-2 xl:inline-flex"
      >
        <span
          aria-hidden
          className="bg-destructive size-1.5 animate-pulse rounded-full dark:bg-red-900"
        />
        Error 404 &middot; coordinates not found
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        // leading-[0.78] trims DM Serif Display's chunky ascender whitespace
        // so the digits sit close to the surrounding meta lines.
        className="font-display mt-3 leading-[0.78] tracking-tighter"
        style={{ fontSize: SIZE_404 }}
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-meta-xs text-muted-foreground mt-3"
      >
        LAT 0°00′00″ &nbsp;&middot;&nbsp; LON 0°00′00″
      </motion.p>

      {/* Body sits with the title cluster (proximity = same idea); the
          button gets the larger gap because it's a separate action group. */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="text-muted-foreground mt-5 max-w-[16rem] text-sm leading-relaxed md:text-base xl:max-w-[22rem]"
      >
        <span className="font-display text-foreground">Off the map.</span> These
        coordinates resolve to nothing on any chart we keep.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="mt-6"
      >
        <Button asChild size="lg">
          <a href="/">Return to charts</a>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.85 }}
        className="text-meta-xs text-muted-foreground mt-6 hidden flex-wrap items-center justify-center gap-x-3 gap-y-1 md:gap-x-6 xl:flex"
      >
        <span>Bearing —°</span>
        <span aria-hidden>&middot;</span>
        <span>Heading: lost</span>
      </motion.div>
    </div>
  </main>
);
