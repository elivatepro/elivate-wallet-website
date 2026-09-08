"use client";

import { motion, type Variants } from "motion/react";

import { Button } from "@/components/ui/button";
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

const PUNCH_MASK =
  "radial-gradient(circle at 0 50%, transparent 11.5px, black 12px), radial-gradient(circle at 100% 50%, transparent 11.5px, black 12px)";

type LineItem = { label: string; value: string };

type Tier = {
  id: string;
  name: string;
  auth: string;
  tagline: string;
  cta: { label: string; variant: "default" | "ghost" };
  includes: readonly string[];
  totals: readonly LineItem[];
  totalDue: { value: string; suffix?: string };
  featured: boolean;
  lean?: string;
};

const TIERS: readonly Tier[] = [
  {
    id: "lookout",
    name: "Lookout",
    auth: "MRD-LK-2026",
    tagline: "For the team that just stood up on-call.",
    cta: { label: "Start free trial", variant: "ghost" },
    includes: [
      "5 seats · single team",
      "Logs, metrics, traces · unified",
      "SLO-native paging",
      "Slack · PagerDuty",
      "99.95% global SLA",
    ],
    totals: [
      { label: "Subtotal", value: "$1,200.00" },
      { label: "Per-seat tax", value: "$0.00" },
    ],
    totalDue: { value: "$1,200", suffix: "/ yr" },
    featured: false,
    lean: "md:-rotate-[0.6deg]",
  },
  {
    id: "bridge",
    name: "Bridge",
    auth: "MRD-BR-2026",
    tagline: "What forty-one teams already run.",
    cta: { label: "Start free trial", variant: "default" },
    includes: [
      "25 seats included",
      "Everything in Lookout",
      "Auto-drafted post-mortems",
      "Watch · ack & roll back",
      "Linear · GitHub",
      "99.997% global SLA",
      "Audit log · signed",
    ],
    totals: [
      { label: "Subtotal", value: "$4,800.00" },
      { label: "Per-seat tax", value: "$0.00" },
      { label: "Overage fees", value: "$0.00" },
      { label: "Hidden charges", value: "$0.00" },
    ],
    totalDue: { value: "$4,800", suffix: "/ yr" },
    featured: true,
  },
  {
    id: "atlas",
    name: "Atlas",
    auth: "MRD-AT-2026",
    tagline: "When the rotation spans three time zones.",
    cta: { label: "Talk to us", variant: "ghost" },
    includes: [
      "Unlimited seats",
      "Everything in Bridge",
      "Dedicated rotation engineer",
      "SOC 2 · custom DPA",
      "Custom retention",
      "Priority on-call",
    ],
    totals: [
      { label: "Subtotal", value: "scaled to you" },
      { label: "Setup fee", value: "$0.00" },
    ],
    totalDue: { value: "Custom" },
    featured: false,
    lean: "md:rotate-[0.6deg]",
  },
] as const;

type LedgerProps = {
  /** Padding utility — defaults to `section-padding`. Pass `hero-padding` when mounted as the page hero. */
  className?: string;
  /** When true, render the heading as h1 with hero-scale sizing (matches `product/scene.tsx` hero). Default is h2 with canonical section sizing. */
  asHero?: boolean;
};

const Ledger = ({
  className = "section-padding",
  asHero = false,
}: LedgerProps) => {
  const Heading = asHero ? motion.h1 : motion.h2;
  const headingClass = asHero
    ? "mt-3 text-5xl leading-[1.05] tracking-tight text-balance md:text-7xl md:leading-[0.95] lg:text-8xl"
    : "mt-3 text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]";

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
    >
      <div className={cn("container", className)}>
        <div className="mx-auto max-w-5xl text-center">
          <motion.span
            variants={fadeUp}
            className="text-meta text-muted-foreground"
          >
            § Ledger · three tickets · 2026.04
          </motion.span>
          <Heading variants={fadeUp} className={headingClass}>
            Pick a plan. <br className="hidden md:block" />
            <em className="text-muted-foreground">
              Simple pricing, no per-seat fees.
            </em>
          </Heading>
        </div>

        <motion.div
          variants={container}
          className="mx-auto mt-10 grid max-w-6xl gap-10 md:mt-14 md:grid-cols-3 md:items-start md:gap-6 lg:mt-20 lg:gap-10"
        >
          {TIERS.map((tier) => (
            <TicketCard key={tier.id} tier={tier} />
          ))}
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-meta-xs text-muted-foreground mt-12 text-center"
        >
          Billed annually &middot; 30-day trial &middot; no card to start
        </motion.p>
      </div>
    </motion.section>
  );
};

const TicketCard = ({ tier }: { tier: Tier }) => {
  const dashed = tier.featured
    ? "border-background/30"
    : "border-foreground/30";
  const dotted = tier.featured
    ? "border-background/30"
    : "border-foreground/30";
  const muted = tier.featured ? "opacity-70" : "text-muted-foreground";
  const totalRule = tier.featured
    ? "border-background/40"
    : "border-foreground/40";

  return (
    <motion.div
      variants={fadeUp}
      className={cn("relative", tier.lean, tier.featured && "md:-mt-4 md:mb-2")}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-4 -z-10 rounded-3xl blur-3xl",
          tier.featured ? "bg-foreground/15" : "bg-foreground/5",
        )}
      />

      <div
        className={cn(
          "relative flex h-full flex-col rounded-[2px] border px-7 py-10 font-mono text-sm shadow-2xl md:px-9 md:py-14",
          tier.featured
            ? "border-foreground bg-foreground text-background shadow-foreground/20"
            : "border-foreground/15 bg-card text-foreground",
        )}
        style={{
          maskImage: PUNCH_MASK,
          WebkitMaskImage: PUNCH_MASK,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <div
          className={cn(
            "text-meta flex items-baseline justify-between border-b border-dashed pb-4",
            dashed,
          )}
        >
          <span>Meridian · {tier.name}</span>
          <span className={muted}>№ {tier.auth}</span>
        </div>

        <p className="font-display mt-7 text-2xl leading-[1.1] tracking-tight md:text-[1.625rem]">
          {tier.tagline}
        </p>

        <div className={cn("text-meta mt-9", muted)}>Includes</div>
        <ul className="mt-3 space-y-2.5">
          {tier.includes.map((item) => (
            <li key={item} className="flex items-baseline gap-2">
              <span className="shrink-0">·</span>
              <span className="grow">{item}</span>
              <span
                aria-hidden="true"
                className={cn("grow border-b border-dotted", dotted)}
              />
              <span className={cn("shrink-0", muted)}>incl.</span>
            </li>
          ))}
        </ul>

        <div className={cn("mt-10 border-t border-dashed pt-6", dashed)}>
          <ul className="space-y-2">
            {tier.totals.map((line) => (
              <li
                key={line.label}
                className={cn("flex items-baseline justify-between", muted)}
              >
                <span>{line.label}</span>
                <span>{line.value}</span>
              </li>
            ))}
          </ul>
          <div
            className={cn(
              "mt-5 flex items-baseline justify-between border-t pt-4",
              totalRule,
            )}
          >
            <span className="text-meta">Total due</span>
            <span className="font-display text-3xl tracking-tight tabular-nums md:text-4xl">
              {tier.totalDue.value}
              {tier.totalDue.suffix && (
                <span className={cn("text-meta ml-2", muted)}>
                  {tier.totalDue.suffix}
                </span>
              )}
            </span>
          </div>
        </div>

        <div
          className={cn(
            "text-meta mt-8 flex items-center justify-between border-t border-dashed pt-6",
            dashed,
            muted,
          )}
        >
          <span>Auth · 0x{tier.auth.replace(/-/g, "").toLowerCase()}</span>
          <span>Holder · your team</span>
        </div>

        <Barcode className="mt-5" inverted={tier.featured} />

        <div className="mt-8 flex justify-center">
          <Button size="lg" variant={tier.cta.variant}>
            {tier.cta.label}
          </Button>
        </div>

        {tier.featured && (
          <span
            aria-hidden="true"
            className="border-background/55 text-background/85 pointer-events-none absolute top-[5.5rem] right-7 -rotate-[11deg] border-2 px-3 py-1 text-[0.625rem] font-bold tracking-[0.22em] uppercase"
          >
            ★ Teams&apos; pick ★
          </span>
        )}
      </div>
    </motion.div>
  );
};

const BARS = [
  3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 2, 1, 4, 2, 1, 3, 1, 2, 1, 3, 4, 1, 2, 1, 3, 1,
  2, 4, 1, 2,
];

const Barcode = ({
  className,
  inverted,
}: {
  className?: string;
  inverted: boolean;
}) => (
  <div
    aria-hidden="true"
    className={cn("flex h-7 items-end justify-center gap-[2px]", className)}
  >
    {BARS.map((w, i) => (
      <span
        key={i}
        className={cn(
          "block h-full",
          inverted ? "bg-background" : "bg-foreground",
        )}
        style={{ width: `${w}px` }}
      />
    ))}
  </div>
);

export default Ledger;
