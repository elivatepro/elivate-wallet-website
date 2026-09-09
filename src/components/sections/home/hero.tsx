"use client";

import { useRef } from "react";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";

import Console from "@/components/mockups/console";
import { Button } from "@/components/ui/button";
import { useLoaderReady } from "@/hooks/use-loader-ready";

const EASE = [0.16, 1, 0.3, 1] as const;

const DURATION = {
  base: 0.8,
  long: 1.2,
  ambient: 1.6,
} as const;

const STAGGER = {
  section: 0.1,
  word: 0.05,
} as const;

const container: Variants = {
  animate: { transition: { staggerChildren: STAGGER.section } },
};

const consoleReveal: Variants = {
  initial: { opacity: 0, y: 32, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.long, ease: EASE },
  },
};

const heading: Variants = {
  animate: {
    transition: { staggerChildren: STAGGER.word, delayChildren: 0.1 },
  },
};

const word: Variants = {
  initial: { opacity: 0, y: "0.55em", filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: DURATION.base, ease: EASE },
  },
};

const body: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

const footer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

const renderWords = (text: string, prefix: string) =>
  text.split(/(\s+)/).map((token, i) => {
    if (/^\s+$/.test(token)) return <span key={`${prefix}-${i}`}>{token}</span>;
    return (
      <motion.span
        key={`${prefix}-${i}`}
        variants={word}
        className="inline-block"
      >
        {token}
      </motion.span>
    );
  });

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ready = useLoaderReady();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });
  const tiltDesktop = useTransform(progress, [0, 1], [10, 0]);
  const tiltMobile = useTransform(progress, [0, 1], [16, 0]);
  const glowParallax = useTransform(progress, [0, 1], [0, 80]);
  const consoleParallax = useTransform(progress, [0, 1], [0, 140]);
  const textParallax = useTransform(progress, [0, 1], [0, -80]);

  const glowInitial = {
    opacity: 0,
    maskImage:
      "linear-gradient(to top, black -40%, transparent -10%, transparent 100%)",
  };
  const glowAnimate = {
    opacity: 1,
    maskImage:
      "linear-gradient(to top, black 100%, transparent 130%, transparent 160%)",
  };

  return (
    <motion.section
      ref={sectionRef}
      initial="initial"
      animate={ready ? "animate" : "initial"}
      variants={container}
      className="relative flex min-h-[100svh] flex-col overflow-hidden md:h-[clamp(1100px,100vh,1300px)] md:min-h-0"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={glowInitial}
        animate={ready ? glowAnimate : glowInitial}
        transition={{
          duration: DURATION.ambient,
          ease: EASE,
          delay: 0.6,
          opacity: { duration: DURATION.base, delay: 0.6, ease: EASE },
        }}
        style={{
          y: glowParallax,
          willChange: "transform, mask-image",
        }}
      >
        <div className="from-foreground/15 via-foreground/5 absolute inset-0 bg-radial-[ellipse_at_50%_30%] to-transparent to-60%" />
        <div className="from-foreground/10 absolute inset-0 bg-radial-[ellipse_at_20%_20%] to-transparent to-45%" />
        <div className="from-foreground/10 absolute inset-0 bg-radial-[ellipse_at_80%_20%] to-transparent to-45%" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        variants={consoleReveal}
        className="pointer-events-none absolute inset-x-0 top-0 hidden justify-center pt-24 md:flex"
        style={{
          perspective: "2200px",
          transformStyle: "preserve-3d",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
        }}
      >
        <motion.div
          className="w-[96%] max-w-[1600px] origin-top"
          style={{
            rotateX: tiltDesktop,
            y: consoleParallax,
            willChange: "transform",
          }}
        >
          <Console />
        </motion.div>
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 0.5deg, currentColor 0.5deg 1deg)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="from-background/60 pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b to-transparent" />
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t to-transparent" />

      <div className="relative z-10 container flex flex-col py-16 md:flex-1 md:justify-end md:py-10">
        <motion.div
          aria-hidden="true"
          variants={consoleReveal}
          className="mt-12 sm:mt-16 md:hidden"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 45%, transparent 92%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 45%, transparent 92%)",
          }}
        >
          <motion.div
            className="origin-top"
            style={{
              rotateX: tiltMobile,
              y: consoleParallax,
              willChange: "transform",
            }}
          >
            <Console />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col sm:mt-16 md:mt-0"
          style={{ y: textParallax, willChange: "transform" }}
        >
          <motion.h1
            variants={heading}
            className="max-w-4xl text-5xl leading-[1.05] tracking-tight text-balance md:text-7xl md:leading-[0.95] lg:text-8xl"
          >
            {renderWords("A Wallet that scales ", "a")}
            <em className="text-muted-foreground">
              {renderWords("with your network.", "b")}
            </em>
          </motion.h1>

          <div className="mt-5 flex flex-col gap-10 md:mt-10 md:flex-row md:items-end md:justify-between md:gap-6">
            <motion.p
              variants={body}
              className="text-muted-foreground max-w-md text-base leading-snug text-balance md:text-lg"
            >
              Give every member a clear view of their balance and transactions,
              while your leaders manage income, withdrawals, teams, and financial
              activity from one place.
            </motion.p>

            <motion.div
              variants={body}
              className="flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center md:justify-end"
            >
              <Button size="lg">Get started</Button>
              <Button variant="ghost" size="lg">
                Book a demo
              </Button>
            </motion.div>
          </div>

          <motion.div
            variants={footer}
            className="text-meta text-muted-foreground mt-12 flex items-center justify-between border-t pt-4 sm:mt-16 md:mt-10"
          >
            <span className="flex-1">Fig. 01 &middot; Elivate Wallet</span>
            <span className="hidden md:inline">
              Member balances and transactions in one place
            </span>
            <span className="flex-1 text-end">Scroll &darr;</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
