"use client";

import { Fragment } from "react";

import { motion, type Variants } from "motion/react";

import { Marquee } from "@/components/magicui/marquee";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const glow: Variants = {
  hidden: {
    opacity: 0,
    maskImage:
      "linear-gradient(to top, black -40%, transparent -10%, transparent 100%)",
  },
  visible: {
    opacity: 1,
    maskImage:
      "linear-gradient(to top, black 100%, transparent 130%, transparent 160%)",
    transition: {
      duration: 1.6,
      ease: EASE,
      delay: 0.2,
      opacity: { duration: 0.85, delay: 0.2, ease: EASE },
    },
  },
};

const TICKER = [
  "Two pages · last week.",
  "Six minutes · MTTR.",
  "Forty-one teams · in production.",
  "Zero noise · by design.",
  "One console · for everything.",
] as const;

const ProductCTA = () => (
  <motion.section
    variants={container}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="section-padding relative"
  >
    <motion.div
      variants={glow}
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ willChange: "mask-image, opacity" }}
    >
      <div className="from-foreground/12 via-foreground/[0.04] absolute inset-0 bg-radial-[ellipse_55%_40%_at_50%_45%] to-transparent to-100%" />
      <div className="from-foreground/[0.08] absolute inset-0 bg-radial-[ellipse_40%_30%_at_15%_35%] to-transparent to-100%" />
      <div className="from-foreground/[0.08] absolute inset-0 bg-radial-[ellipse_40%_30%_at_85%_35%] to-transparent to-100%" />
    </motion.div>

    <div className="relative container">
      <motion.div
        variants={fadeUp}
        className="text-meta text-muted-foreground flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-4"
      >
        <span className="text-foreground flex items-center gap-2">
          <span className="bg-foreground size-1.5 animate-pulse rounded-full" />
          § End of spec
        </span>
        <span className="hidden md:inline">
          · Ship a trace. Page yourself. See it work.
        </span>
        <span className="ml-auto">03:14 UTC · live</span>
      </motion.div>

      <div className="mt-10 grid items-center gap-16 md:mt-14 lg:mt-20 lg:grid-cols-[2fr_1fr] lg:gap-10">
        <div className="flex flex-col">
          <motion.h2
            variants={fadeUp}
            className="font-display max-w-[16ch] leading-[0.85] tracking-tighter text-balance lg:max-w-none"
            style={{ fontSize: "clamp(2.5rem, 9vw, 9rem)" }}
          >
            <em className="text-muted-foreground">Quiet</em> is the new{" "}
            <em>fast.</em>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed md:mt-8 md:text-lg"
          >
            Spin up a workspace, point your OTLP exporter at us, watch the
            alerts go quiet. If anything still slips through, tell us &mdash; we
            go fix it.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-3 md:mt-10"
          >
            <Button size="lg">Start free trial</Button>
            <Button asChild variant="ghost" size="lg">
              <a href="#">Book a tour</a>
            </Button>
          </motion.div>
        </div>

        <SilencePlate />
      </div>
    </div>

    <motion.div
      variants={fadeUp}
      aria-hidden
      className="relative mt-10 border-y md:mt-14 lg:mt-20"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <Marquee
        pauseOnHover
        className="p-0 py-4 [--duration:35s] [--gap:4rem] md:py-6 md:[--gap:6rem]"
      >
        {TICKER.map((t) => (
          <Fragment key={t}>
            <span className="font-display text-4xl leading-none tracking-tighter whitespace-nowrap md:text-7xl">
              {t}
            </span>
            <span className="font-display text-foreground/20 text-4xl leading-none tracking-tighter md:text-7xl">
              §
            </span>
          </Fragment>
        ))}
      </Marquee>
    </motion.div>
  </motion.section>
);

const SilencePlate = () => (
  <figure className="group/plate relative mx-auto w-full max-w-[22.5rem] lg:max-w-[24rem]">
    <div className="border-foreground/30 group-hover/plate:border-foreground/55 relative overflow-hidden border transition-colors duration-500">
      <div className="bg-foreground/5 relative aspect-[16/10] overflow-hidden">
        <img
          src="/images/product/silence.png"
          alt="A night-shift desk overlooking the coast: lamp, ledger, mug, and a Meridian console reading 99.97% silence over 24 hours"
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 22rem, 92vw"
          className="absolute inset-0 size-full object-cover transition-transform duration-[1400ms] ease-out group-hover/plate:scale-[1.03]"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 55%, transparent 50%, oklch(0 0 0 / 0.6) 100%)",
          }}
        />

        <Badge
          variant="overlay"
          size="sm"
          className="pointer-events-none absolute top-2 left-2 gap-1"
        >
          <span className="bg-foreground size-1 animate-pulse rounded-full" />№
          04
        </Badge>

        <span className="text-meta-xs text-background pointer-events-none absolute right-2 bottom-2 opacity-70">
          B&amp;W
        </span>
      </div>

      <figcaption className="text-meta-xs border-foreground/15 text-muted-foreground group-hover/plate:text-foreground flex items-baseline justify-between gap-3 border-t px-4 py-3 transition-colors duration-300">
        <span>Console · at rest</span>
        <span>Plate IV</span>
      </figcaption>
    </div>
  </figure>
);

export default ProductCTA;
