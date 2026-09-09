"use client";

import { motion, type Variants } from "motion/react";

import { Badge } from "@/components/ui/badge";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const ROWS = [
  {
    topic: "Pricing",
    us: "Fixed cost, all-in.",
    them: "Per-host, per-metric, per-seat.",
  },
  {
    topic: "Schema",
    us: "Logs, metrics, traces — one.",
    them: "Three products, three invoices.",
  },
  {
    topic: "Ingest",
    us: "OTLP native, 3ms edge.",
    them: "Proprietary agents, 200ms+.",
  },
  {
    topic: "Incident",
    us: "A room with a runbook.",
    them: "A channel, if you remember to open one.",
  },
  {
    topic: "Retention",
    us: "90 days, always.",
    them: "7 days, then archived to cold.",
  },
  {
    topic: "Exports",
    us: "Parquet, NDJSON, signed S3.",
    them: "Support ticket and a prayer.",
  },
  {
    topic: "Onboarding",
    us: "90 seconds, first trace in ten.",
    them: "Two-week professional services plan.",
  },
];

const Comparison = () => (
  <motion.section
    variants={container}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="section-padding container space-y-10 md:space-y-14 lg:space-y-20"
  >
    <motion.div
      variants={fadeUp}
      className="text-meta text-muted-foreground flex items-center border-b pb-4"
    >
      <span className="flex-1">7 categories &middot; head-to-head</span>
      <span className="hidden md:inline">
        Pricing, schema, ingest, retention &middot; and more
      </span>
      <span className="flex-1 text-end">Updated &middot; 2026.04</span>
    </motion.div>

    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-end md:gap-6"
    >
      <div>
        <div className="text-meta text-muted-foreground">Us</div>
        <div className="font-display text-6xl leading-none tracking-tighter md:text-8xl">
          Elivate.
        </div>
      </div>
      <div className="md:text-right">
        <div className="text-meta text-muted-foreground">Them</div>
        <div className="font-display text-muted-foreground/60 decoration-foreground/40 text-6xl leading-none tracking-tighter line-through md:text-8xl">
          Legacy.
        </div>
      </div>
    </motion.div>

    <motion.dl variants={fadeUp} className="hidden border-y md:block">
      {ROWS.map((row, i) => (
        <div
          key={row.topic}
          className="grid grid-cols-1 items-baseline border-b last:border-b-0 md:grid-cols-[180px_calc(50%_-_180px)_1fr]"
        >
          <dt className="flex items-baseline gap-3 border-b py-5 md:border-r md:border-b-0 md:pr-6">
            <span className="text-meta text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-xl tracking-tight">
              {row.topic}
            </span>
          </dt>
          <dd className="border-b py-5 pl-3 md:border-r md:border-b-0 md:px-6">
            <div className="font-display text-2xl leading-snug tracking-tight md:text-3xl">
              {row.us}
            </div>
          </dd>
          <dd className="py-5 pl-3 md:px-6">
            <div className="font-display text-muted-foreground text-2xl leading-snug tracking-tight md:text-3xl">
              {row.them}
            </div>
          </dd>
        </div>
      ))}
    </motion.dl>

    <motion.dl variants={fadeUp} className="border-y md:hidden">
      {ROWS.map((row, i) => (
        <div key={row.topic} className="border-b py-5 last:border-b-0">
          <div className="text-meta text-muted-foreground flex items-baseline gap-3">
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span className="font-display text-foreground text-lg tracking-tight">
              {row.topic}
            </span>
          </div>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-baseline gap-3">
              <Badge className="shrink-0">Elivate</Badge>
              <p className="font-display text-lg leading-snug tracking-tight">
                {row.us}
              </p>
            </div>
            <div className="flex items-baseline gap-3">
              <Badge
                variant="outline"
                className="text-muted-foreground shrink-0"
              >
                Legacy
              </Badge>
              <p className="font-display text-muted-foreground decoration-foreground/30 text-lg leading-snug tracking-tight line-through">
                {row.them}
              </p>
            </div>
          </div>
        </div>
      ))}
    </motion.dl>
  </motion.section>
);

export default Comparison;
