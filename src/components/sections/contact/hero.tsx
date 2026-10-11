"use client";

import { useRef } from "react";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";

import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/contact";
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

const tileIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.1, ease: EASE },
  },
};

type TileSpec = {
  src: string;
  cell: string;
  focal: string;
};

// Real product screens, shown as decorative texture behind the headline.
const TILES: ReadonlyArray<TileSpec> = [
  {
    src: "/images/phone/balance.png",
    cell: "col-start-1 row-start-1 row-span-6 sm:row-span-4",
    focal: "object-[50%_12%]",
  },
  {
    src: "/images/app/overview.png",
    cell: "col-start-1 row-start-5 row-span-2 hidden sm:block",
    focal: "object-[0%_0%]",
  },
  {
    src: "/images/app/review-payout.png",
    cell: "col-start-2 row-start-1 row-span-3 hidden sm:block",
    focal: "object-[100%_0%]",
  },
  {
    src: "/images/app/queue.png",
    cell: "col-start-2 row-start-4 row-span-3 hidden sm:block",
    focal: "object-[0%_0%]",
  },
  {
    src: "/images/app/record-income.png",
    cell: "col-start-3 row-start-1 row-span-2 hidden xl:block",
    focal: "object-[0%_0%]",
  },
  {
    src: "/images/phone/activity.png",
    cell: "col-start-3 row-start-3 row-span-4 hidden xl:block",
    focal: "object-[50%_10%]",
  },
];

const FOCUS_AFTER_SCROLL_MS = 600;

const ContactHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 0.6,
  });
  const tilesY = useTransform(progress, [0, 1], [0, -40]);

  const goToForm = () => {
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      document.getElementById("ct-name")?.focus({ preventScroll: true });
    }, FOCUS_AFTER_SCROLL_MS);
  };

  return (
    <motion.section
      ref={sectionRef}
      data-section-dark
      variants={container}
      initial="hidden"
      animate="visible"
      className="dark bg-background text-foreground relative isolate overflow-hidden"
    >
      <motion.div
        style={{ y: reduceMotion ? 0 : tilesY, willChange: "transform" }}
        aria-hidden
        className="pointer-events-none absolute inset-0 grid grid-cols-1 grid-rows-6 gap-2 p-2 sm:grid-cols-2 sm:gap-3 sm:p-3 xl:grid-cols-3"
      >
        {TILES.map((tile, i) => (
          <Tile key={i} idx={i} tile={tile} />
        ))}
      </motion.div>

      <div
        aria-hidden
        className="bg-background/40 pointer-events-none absolute inset-0 sm:hidden"
      />
      <div
        aria-hidden
        className="from-background/95 via-background/60 pointer-events-none absolute inset-0 bg-radial-[ellipse_at_top_left] to-transparent to-80%"
      />
      <div
        aria-hidden
        className="from-background/80 via-background/40 pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent"
      />
      <div
        aria-hidden
        className="via-background/10 to-background/40 pointer-events-none absolute inset-0 bg-radial-[ellipse_at_50%_50%] from-transparent to-100%"
      />

      <div className="hero-padding relative z-10 container flex h-[100svh] flex-col pb-10!">
        <div className="flex-[3] sm:hidden" />
        <motion.h1
          variants={fadeUp}
          className="text-5xl leading-[1.05] tracking-tight text-balance md:text-7xl md:leading-[0.95] lg:text-8xl"
        >
          Talk to <em className="text-muted-foreground">us.</em>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed md:mt-8 md:text-lg"
        >
          Planning a rollout for your network, stuck on something in the app,
          or just curious — tell us what you need and a real person on the
          Elivate Wallet team will get back to you.
        </motion.p>
        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center gap-3 md:mt-10"
        >
          <Button size="lg" onClick={goToForm}>
            Send a message
          </Button>
        </motion.div>

        <div className="flex-1" />

        <motion.div
          variants={fadeUp}
          className="grid grid-cols-1 items-end gap-y-10 md:grid-cols-[auto_1fr] md:gap-x-12 lg:gap-x-16"
        >
          <ul className="space-y-3 text-base md:text-lg">
            <li className="flex items-baseline gap-3">
              <span className="font-display tracking-tighter">Email.</span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="font-display tracking-tighter">Help.</span>
              <a
                href="/docs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Read the Docs
              </a>
            </li>
          </ul>
          <p
            className="font-display block min-w-0 leading-none tracking-tighter break-words md:text-end"
            style={{ fontSize: "clamp(1.25rem, 3.5vw, 3rem)" }}
          >
            Real people, real replies.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

const Tile = ({ idx, tile }: { idx: number; tile: TileSpec }) => (
  <motion.div
    variants={tileIn}
    custom={idx}
    className={cn("group/tile bg-muted relative overflow-hidden", tile.cell)}
  >
    <img
      src={tile.src}
      alt=""
      decoding="async"
      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 33vw, 50vw"
      className={cn(
        "absolute inset-0 size-full object-cover opacity-45 blur-[1.5px] saturate-75 transition-transform duration-700 ease-out group-hover/tile:scale-105",
        tile.focal,
      )}
    />
  </motion.div>
);

export default ContactHero;