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
  stamp?: string;
};

const TIERS: readonly Tier[] = [
  {
    id: "400",
    name: "400",
    auth: "EW-400",
    tagline: "For networks with up to 400 members.",
    cta: { label: "Get started", variant: "ghost" },
    includes: [
      "Up to 400 users",
      "Member balances & history",
      "Income & expense records",
      "Withdrawal requests",
      "Team and leader visibility",
      "Core Wallet features included",
    ],
    totals: [
      { label: "Covered users", value: "UP TO 400" },
      { label: "Extras", value: "OPTIONAL" },
    ],
    totalDue: { value: "₦700,000" },
    featured: false,
    lean: "md:-rotate-[0.6deg]",
  },
  {
    id: "1000",
    name: "1,000",
    auth: "EW-1000",
    tagline: "For growing networks with up to 1,000 members.",
    cta: { label: "Get started", variant: "default" },
    includes: [
      "Up to 1,000 users",
      "Member balances & history",
      "Income & expense records",
      "Withdrawal requests",
      "Team and leader visibility",
      "Financial records per member",
      "Core Wallet features included",
    ],
    totals: [
      { label: "Covered users", value: "UP TO 1,000" },
      { label: "Extras", value: "OPTIONAL" },
    ],
    totalDue: { value: "₦1,000,000" },
    featured: true,
    stamp: "UP TO 1,000 USERS",
  },
  {
    id: "1500",
    name: "1,500+",
    auth: "EW-1500",
    tagline: "For larger networks with 1,500+ members.",
    cta: { label: "Talk to us", variant: "ghost" },
    includes: [
      "1,500+ users",
      "Member balances & history",
      "Income & expense records",
      "Withdrawal requests",
      "Team and leader visibility",
      "Core Wallet features included",
    ],
    totals: [
      { label: "Covered users", value: "1,500+" },
      { label: "Extras", value: "OPTIONAL" },
    ],
    totalDue: { value: "₦1,500,000" },
    featured: false,
    lean: "md:rotate-[0.6deg]",
  },
] as const;

type LedgerProps = {
  className?: string;
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
            § PRICING · THREE NETWORK SIZES
          </motion.span>
          <Heading variants={fadeUp} className={headingClass}>
            Choose your network size. <br className="hidden md:block" />
            <em className="text-muted-foreground">
              Simple pricing, based on your network.
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
          ONE SUBSCRIPTION COVERS YOUR ORGANIZATION AND ITS TEAMS · EXTRAS PRICED SEPARATELY
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
          <span>ELIVATE WALLET · {tier.name}</span>
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
            <span className="text-meta">Plan price</span>
            <span className="font-display text-3xl tracking-tight tabular-nums md:text-4xl">
              {tier.totalDue.value}
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
          <span>Network · {tier.name}</span>
          <span>Extras · optional</span>
        </div>

        <Barcode className="mt-5" inverted={tier.featured} />

        <div className="mt-8 flex justify-center">
          <Button size="lg" variant={tier.cta.variant}>
            {tier.cta.label}
          </Button>
        </div>

        {tier.featured && tier.stamp && (
          <span
            aria-hidden="true"
            className="border-background/55 text-background/85 pointer-events-none absolute top-[5.5rem] right-7 -rotate-[11deg] border-2 px-3 py-1 text-[0.625rem] font-bold tracking-[0.22em] uppercase"
          >
            {tier.stamp}
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
