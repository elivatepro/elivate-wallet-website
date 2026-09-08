"use client";

import { useState } from "react";

import { motion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

type Brand = {
  name: string;
  src: string;
  since: string;
  quote: string;
  by: string;
  square?: boolean;
};

const BRANDS: Brand[] = [
  {
    name: "IBM",
    src: "/images/brands/ibm.svg",
    since: "2023",
    quote:
      "We replaced six dashboards with one room and our paging volume dropped 41% in a quarter.",
    by: "— director of platform, internal tools",
  },
  {
    name: "Netflix",
    src: "/images/brands/netflix.svg",
    since: "2024",
    quote:
      "Our sev-2 review meetings got shorter. That is the whole pitch, really.",
    by: "— staff SRE, streaming platform",
  },
  {
    name: "Spotify",
    src: "/images/brands/spotify.svg",
    since: "2024",
    quote:
      "The query-by-prose thing is the only feature every oncall engineer asks for by name.",
    by: "— engineering manager, infrastructure",
  },
  {
    name: "T-Mobile",
    src: "/images/brands/t-mobile.svg",
    since: "2023",
    quote:
      "We trust it with our 5am traffic spike. The dashboard is dark at 5am. That's the point.",
    by: "— principal engineer, network ops",
  },
  {
    name: "Booking.com",
    src: "/images/brands/booking.svg",
    since: "2024",
    quote:
      "The archive made our post-incident reviews honest. We have artifacts now, not memories.",
    by: "— head of reliability, traveler-facing",
  },
  {
    name: "Stripe",
    src: "/images/brands/stripe.svg",
    since: "2025",
    quote:
      "It reads like the best technical writing we've ever bought. We notice the paragraphs.",
    by: "— vp engineering, payments",
  },
  {
    name: "Slack",
    src: "/images/brands/slack.svg",
    since: "2024",
    quote:
      "The alert precedent panel alone saved us a team. We stopped hiring oncall rotations.",
    by: "— director, infrastructure",
    square: true,
  },
  {
    name: "Shopify",
    src: "/images/brands/shopify.svg",
    since: "2025",
    quote:
      "We ship three times on Fridays. Nothing breaks that way, and it never used to be that way.",
    by: "— engineering lead, commerce platform",
    square: true,
  },
];

const Brands = () => {
  const [active, setActive] = useState<number | null>(null);
  const quote = active !== null ? BRANDS[active] : null;

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="section-padding container"
    >
      <motion.div
        variants={fadeUp}
        className="text-meta text-muted-foreground mb-10 flex items-center border-b pb-4 md:mb-14 lg:mb-20"
      >
        <span className="flex flex-1 items-center gap-2">
          <span className="bg-foreground inline-block size-1.5 animate-pulse rounded-full" />
          8 customers &middot; since 2023
        </span>
        <span className="hidden md:inline">
          Hover a cell &middot; the wall pays attention back
        </span>
        <span className="flex-1 text-end">
          {quote ? `Speaking · ${quote.name}` : "Wall · quiet"}
        </span>
      </motion.div>

      <motion.div variants={fadeUp} className="mb-10 md:mb-14 lg:mb-20">
        <h2 className="text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
          Trusted by teams{" "}
          <em className="text-muted-foreground">larger than ours.</em>
        </h2>
      </motion.div>

      <motion.ul
        variants={fadeUp}
        onMouseLeave={() => setActive(null)}
        className="group/wall bg-border grid grid-cols-2 gap-px overflow-hidden border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
      >
        {BRANDS.map((b, i) => (
          <li
            key={b.name}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive((a) => (a === i ? null : a))}
            tabIndex={0}
            className={cn(
              "group/cell bg-card relative flex aspect-[5/3] cursor-pointer items-center justify-center px-5 transition-[filter] duration-500",
              "focus-visible:ring-foreground outline-none focus-visible:z-10 focus-visible:ring-2",
            )}
          >
            {active === i && (
              <motion.span
                layoutId="brands-hover"
                className="bg-muted/60 pointer-events-none absolute inset-0 will-change-transform"
                transition={{
                  layout: {
                    duration: 0.3,
                    ease: [0.32, 0.72, 0, 1],
                  },
                }}
              />
            )}
            <img
              src={b.src}
              alt={`${b.name} logo`}
              width={160}
              height={50}
              className={cn(
                "relative z-10 w-auto object-contain transition-[filter,opacity] duration-500",
                b.square ? "h-9 max-w-[30%] md:h-11" : "h-6 max-w-[65%] md:h-8",
                active === null &&
                  "opacity-70 brightness-0 contrast-200 grayscale dark:invert",
                active !== null &&
                  active !== i &&
                  "opacity-40 brightness-0 contrast-200 grayscale dark:invert",
                active === i && "opacity-100 grayscale-0",
              )}
            />

            <span
              aria-hidden
              className={cn(
                "text-meta-2xs pointer-events-none absolute top-2 left-2 z-10 opacity-0 transition-opacity duration-300",
                active === i && "opacity-50",
                "text-foreground",
              )}
            >
              {b.name}
            </span>
            <span
              aria-hidden
              className={cn(
                "text-meta-2xs pointer-events-none absolute right-2 bottom-2 z-10 opacity-0 transition-opacity duration-300",
                active === i && "opacity-50",
                "text-foreground",
              )}
            >
              est {b.since}
            </span>
          </li>
        ))}
      </motion.ul>

      <motion.div
        variants={fadeUp}
        className="relative mt-10 min-h-[160px] border-t pt-4 md:mt-14 md:min-h-[180px] lg:mt-20"
      >
        <motion.blockquote
          key={quote?.name ?? "default"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          {quote ? (
            <>
              <p className="text-meta-xs text-muted-foreground md:text-[0.625rem]">
                Unsigned &middot; {quote.name} &middot; customer since{" "}
                {quote.since}
              </p>
              <p className="font-display mt-4 text-2xl leading-snug tracking-tight md:text-3xl lg:text-4xl">
                &ldquo;{quote.quote}&rdquo;
              </p>
              <p className="text-meta text-muted-foreground mt-4">{quote.by}</p>
            </>
          ) : (
            <p className="font-display text-muted-foreground text-xl leading-snug tracking-tight md:text-2xl">
              Hover any logo to hear from the team behind it.
            </p>
          )}
        </motion.blockquote>

        <span
          aria-hidden
          className="text-meta-xs text-muted-foreground pointer-events-none absolute top-0 right-0 z-10 flex items-center gap-3"
        >
          <span className="bg-border h-px w-16" />
          {quote ? "speaking" : "quiet"}
        </span>
      </motion.div>
    </motion.section>
  );
};

export default Brands;
