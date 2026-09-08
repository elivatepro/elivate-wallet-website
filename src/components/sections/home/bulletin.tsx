"use client";

import { motion, type Variants } from "motion/react";

import { DottedBackdrop } from "@/components/layout/dotted-backdrop";
import { Button } from "@/components/ui/button";

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

const STATS = [
  { value: "217", label: "Alerts per week · before", inverted: false },
  { value: "2", label: "Alerts per week · on Meridian", inverted: true },
  { value: "215", label: "Alerts you never see", inverted: false },
] as const;

const Bulletin = () => (
  <motion.section
    variants={container}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="border-foreground/20 relative border-y"
  >
    <motion.div
      variants={fadeUp}
      className="border-foreground/20 relative isolate overflow-hidden border-b"
    >
      <DottedBackdrop opacity={0.06} className="z-auto" />
      <div className="text-meta container flex flex-wrap items-center gap-4 py-4 md:py-5">
        <span className="text-foreground flex flex-1 items-center gap-2">
          <span className="bg-foreground size-1.5 animate-pulse rounded-full" />
          Bulletin № 01
        </span>
        <span className="text-muted-foreground">MRD-2026-Q1 · Sheet 1/1</span>
        <span className="text-muted-foreground flex-1 text-end">
          Filed from us-east-1 · 03:14 UTC
        </span>
      </div>
    </motion.div>

    <div className="container grid grid-cols-1 md:grid-cols-12">
      <motion.div
        variants={fadeUp}
        className="border-foreground/20 border-b py-6 md:col-span-7 md:border-r md:border-b-0 md:py-12 md:pr-12 lg:py-16 lg:pr-16"
      >
        <span className="text-meta text-muted-foreground">
          Headline · Filed 2026.04.25
        </span>
        <h2 className="mt-3 text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
          Silence your alerts,{" "}
          <em className="text-muted-foreground">with confidence.</em>
        </h2>
        <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed md:mt-8 md:text-lg">
          Forty-one teams ran Meridian for ninety days. They went from two
          hundred alerts a week down to two. Not one team has asked to switch
          back.
        </p>
      </motion.div>

      <motion.ul
        variants={container}
        className="divide-foreground/20 flex flex-col divide-y md:col-span-5"
      >
        {STATS.map((s) => (
          <motion.li
            key={s.label}
            variants={fadeUp}
            className={
              s.inverted
                ? "bg-foreground text-background py-6 md:py-10 md:pl-12 lg:pl-16"
                : "py-6 md:py-10 md:pl-12 lg:pl-16"
            }
          >
            <div className="font-display text-6xl leading-none tracking-tight md:text-7xl lg:text-8xl">
              {s.value}
            </div>
            <div
              className={
                s.inverted
                  ? "text-meta mt-3 opacity-70"
                  : "text-meta text-muted-foreground mt-3"
              }
            >
              {s.label}
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>

    <motion.div
      variants={fadeUp}
      className="border-foreground/20 relative isolate overflow-hidden border-t"
    >
      <DottedBackdrop opacity={0.06} className="z-auto" />
      <div className="container flex flex-col items-baseline gap-6 py-6 md:flex-row md:items-center md:justify-between md:py-8">
        <span className="font-display text-xl leading-tight tracking-tight md:text-2xl">
          This is not an outage.{" "}
          <em className="text-muted-foreground">It&apos;s the product.</em>
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg">Start free trial</Button>
          <Button size="lg" variant="ghost">
            See pricing
          </Button>
        </div>
      </div>
    </motion.div>
  </motion.section>
);

export default Bulletin;
