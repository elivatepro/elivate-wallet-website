"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";

import { type LoaderPhase, PersistentBrand } from "./persistent-brand";

import { markLoaderDone } from "@/hooks/use-loader-ready";
import { INTRO_ANIMATION } from "@/lib/constants";

const WORDS = ["Observe.", "Measure.", "Respond."];
const SWAP_INTERVAL = 700;
const BRAND_HOLD = 1100;
const STAGGER = 0.025;
const LETTER_EASE = [0.32, 0.72, 0, 1] as const;

const cycleWordVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: STAGGER } },
  exit: { transition: { staggerChildren: STAGGER } },
};

const letterVariants: Variants = {
  initial: { y: "110%" },
  animate: { y: "0%", transition: { duration: 0.5, ease: LETTER_EASE } },
  exit: { y: "-110%", transition: { duration: 0.4, ease: LETTER_EASE } },
};

// Skip the intro only when arriving via an in-site link (same-origin referrer
// and not a reload). Refreshes, direct visits, and external referrers still
// play the intro.
const isInternalNavigation = () => {
  if (typeof window === "undefined") return false;
  try {
    const [navEntry] = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    if (navEntry?.type === "reload") return false;
    const referrer = document.referrer;
    if (!referrer) return false;
    return new URL(referrer).origin === window.location.origin;
  } catch {
    return false;
  }
};

export function IntroLoader() {
  const skipIntro = !INTRO_ANIMATION.enabled || isInternalNavigation();

  const [phase, setPhase] = useState<LoaderPhase>(() =>
    skipIntro ? "done" : "cycle",
  );
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skipIntro) {
      markLoaderDone();
    }
  }, [skipIntro]);

  useEffect(() => {
    if (phase === "cycle") {
      if (reduced) {
        const t = setTimeout(() => setPhase("brand"), 0);
        return () => clearTimeout(t);
      }
      if (index < WORDS.length - 1) {
        const t = setTimeout(() => setIndex((i) => i + 1), SWAP_INTERVAL);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("brand"), SWAP_INTERVAL);
      return () => clearTimeout(t);
    }
    if (phase === "brand") {
      const hold = reduced ? 600 : BRAND_HOLD;
      const t = setTimeout(() => setPhase("transition"), hold);
      return () => clearTimeout(t);
    }
  }, [phase, index, reduced]);

  useEffect(() => {
    if (phase !== "transition") return;
    const panel = panelRef.current;
    if (!panel) return;
    const tween = gsap.to(panel, {
      opacity: 0,
      duration: 0.55,
      ease: "power2.out",
      delay: 0.45,
    });
    return () => {
      tween.kill();
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "done") return;

    const lockedX = window.scrollX;
    const lockedY = window.scrollY;

    const preventDefault = (e: Event) => e.preventDefault();
    const preventScrollKeys = (e: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }
    };
    const enforceLocked = () => {
      if (window.scrollY !== lockedY || window.scrollX !== lockedX) {
        window.scrollTo(lockedX, lockedY);
      }
    };

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", preventScrollKeys);
    window.addEventListener("scroll", enforceLocked, { passive: true });

    return () => {
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      window.removeEventListener("keydown", preventScrollKeys);
      window.removeEventListener("scroll", enforceLocked);
    };
  }, [phase]);

  const letters = WORDS[index]?.split("") ?? [];
  const panelOpen =
    phase === "cycle" || phase === "brand" || phase === "transition";

  return (
    <>
      <AnimatePresence mode="wait">
        {panelOpen ? (
          <motion.div
            ref={panelRef}
            key="intro-loader-panel"
            aria-hidden
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            className="bg-background text-foreground fixed inset-0 z-[100] overflow-hidden"
          >
            <AnimatePresence>
              {phase === "cycle" ? (
                <motion.div
                  key={`cycle-${index}`}
                  variants={cycleWordVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="font-display text-6xl leading-[1.1] tracking-tight whitespace-nowrap md:text-8xl">
                    {letters.map((char, i) => (
                      <span
                        key={i}
                        className="inline-block overflow-hidden align-bottom"
                      >
                        <motion.span
                          variants={letterVariants}
                          className="inline-block"
                        >
                          {char}
                        </motion.span>
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <PersistentBrand
        phase={phase}
        reduced={!!reduced}
        onTransitionDone={() => {
          setPhase("done");
          markLoaderDone();
        }}
      />
    </>
  );
}
