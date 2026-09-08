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
  alt: string;
  cell: string;
  focal: string;
  priority?: boolean;
};

const TILES: ReadonlyArray<TileSpec> = [
  {
    src: "/images/portraits/1.webp",
    alt: "Portrait — Brooklyn desk",
    cell: "col-start-1 row-start-1 row-span-6 sm:row-span-4",
    focal: "object-[50%_28%]",
    priority: true,
  },
  {
    src: "/images/portraits/2.webp",
    alt: "Portrait — Lisbon desk",
    cell: "col-start-1 row-start-5 row-span-2 hidden sm:block",
    focal: "object-[50%_22%]",
    priority: true,
  },
  {
    src: "/images/portraits/6.webp",
    alt: "Portrait — Kyoto desk",
    cell: "col-start-2 row-start-1 row-span-3 hidden sm:block",
    focal: "object-[50%_30%]",
  },
  {
    src: "/images/portraits/4.webp",
    alt: "Portrait — mailroom",
    cell: "col-start-2 row-start-4 row-span-3 hidden sm:block",
    focal: "object-[50%_28%]",
  },
  {
    src: "/images/portraits/5.webp",
    alt: "Portrait — switchboard",
    cell: "col-start-3 row-start-1 row-span-2 hidden xl:block",
    focal: "object-[50%_25%]",
  },
  {
    src: "/images/portraits/3.webp",
    alt: "Portrait — pressroom",
    cell: "col-start-3 row-start-3 row-span-4 hidden xl:block",
    focal: "object-[50%_30%]",
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

  // Smooth-scroll to the form section and focus the first input once the
  // browser has had time to settle — preventScroll on focus avoids the
  // input pulling the viewport up past the section eyebrow.
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
          Contact <em className="text-muted-foreground">us.</em>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed md:mt-8 md:text-lg"
        >
          We reply within four hours, most days. Phone, email, or message
          &mdash; pick the one that suits you.
          <span className="hidden md:inline">
            {" "}
            A small team across three time zones takes turns at the inbox, so
            someone is usually around.
          </span>{" "}
          If it&apos;s urgent, the phone is fastest.
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
              <span className="font-display tracking-tighter">Tel.</span>
              <span className="text-muted-foreground">+1 415 555 0148</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="font-display tracking-tighter">Email.</span>
              <span className="text-muted-foreground">
                talk@meridian.systems
              </span>
            </li>
          </ul>
          <a
            href="mailto:talk@meridian.systems"
            className="group/email font-display block min-w-0 leading-none tracking-tighter break-words md:text-end"
            style={{ fontSize: "clamp(1.25rem, 3.5vw, 3rem)" }}
          >
            <span className="transition-opacity group-hover/email:opacity-80">
              talk@meridian.systems
            </span>
            <span
              aria-hidden
              className="ml-3 inline-block text-[0.6em] transition-[transform,opacity] duration-300 ease-out group-hover/email:translate-x-1 group-hover/email:-translate-y-1 group-hover/email:opacity-80"
            >
              ↗
            </span>
          </a>
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
      alt={tile.alt}
      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 33vw, 50vw"
      className={cn(
        "absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover/tile:scale-105",
        tile.focal,
      )}
    />
  </motion.div>
);

export default ContactHero;
