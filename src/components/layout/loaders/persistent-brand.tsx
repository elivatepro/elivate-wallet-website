"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { motion } from "motion/react";

import { MeridianLogo } from "@/components/icons/meridian-logo";
import { usePathname } from "@/hooks/use-pathname";
import { cn } from "@/lib/utils";

export type LoaderPhase = "cycle" | "brand" | "transition" | "done";

const SOFT_EASE = [0.16, 1, 0.3, 1] as const;
const LETTER_STAGGER = 0.04;
const LETTER_DELAY = 0.22;
const MAX_SCALE = 5;
const VIEWPORT_RATIO = 0.82;

const computeScale = () => {
  const w = window.innerWidth;
  const hasMark = w >= 768;
  const naturalWidth = hasMark ? 208 : 165;
  return Math.min(MAX_SCALE, (w * VIEWPORT_RATIO) / naturalWidth);
};

const findVisibleTarget = () => {
  const targets = document.querySelectorAll<HTMLElement>(
    '[data-loader-target="navbar"]',
  );
  return Array.from(targets).find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
};

export function PersistentBrand({
  phase,
  reduced,
  onTransitionDone,
}: {
  phase: LoaderPhase;
  reduced: boolean;
  onTransitionDone: () => void;
}) {
  const brandRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const inDocs = pathname?.startsWith("/docs") ?? false;
  // Skipped-intro path mounts directly at phase="done", so the wrapper
  // would paint at viewport center before the gsap.set snap. Hide it
  // until the first positioning pass commits.
  const initialDoneRef = useRef(phase === "done");
  const [doneReady, setDoneReady] = useState(false);
  const hideForInitialDone =
    initialDoneRef.current && phase === "done" && !doneReady;

  useEffect(() => {
    if (phase === "transition" || phase === "done") return;
    const apply = () => {
      const brand = brandRef.current;
      if (!brand) return;
      brand.style.transform = `scale(${computeScale()})`;
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [phase]);

  useEffect(() => {
    if (phase !== "transition") return;

    const brand = brandRef.current;
    if (!brand) {
      onTransitionDone();
      return;
    }

    const target = findVisibleTarget();
    if (!target || reduced) {
      const tween = gsap.to(brand, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: onTransitionDone,
      });
      return () => {
        tween.kill();
      };
    }

    const targetRect = target.getBoundingClientRect();
    // The wrapper's `left/top: 50%` resolves against the containing block
    // (clientWidth/clientHeight — excludes the scrollbar), but innerWidth
    // includes it. Using innerWidth here offsets the landing by half the
    // scrollbar width, which puts the logo a few px left of the container.
    const cbWidth = document.documentElement.clientWidth;
    const cbHeight = document.documentElement.clientHeight;
    const deltaX = targetRect.left + targetRect.width / 2 - cbWidth / 2;
    const deltaY = targetRect.top + targetRect.height / 2 - cbHeight / 2;

    const tween = gsap.to(brand, {
      scale: 1,
      x: deltaX,
      y: deltaY,
      duration: 0.95,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(brand, {
          x: deltaX + window.scrollX,
          y: deltaY + window.scrollY,
        });
        onTransitionDone();
      },
    });

    return () => {
      tween.kill();
    };
  }, [phase, reduced, onTransitionDone]);

  useEffect(() => {
    if (phase !== "done" || inDocs) return;

    const update = () => {
      const brand = brandRef.current;
      if (!brand) return;
      const target = findVisibleTarget();
      if (!target) {
        // No visible slot (e.g. mobile). Hide instead of stranding it at center.
        gsap.set(brand, { opacity: 0 });
        return;
      }
      const targetRect = target.getBoundingClientRect();
      const cbWidth = document.documentElement.clientWidth;
      const cbHeight = document.documentElement.clientHeight;
      const deltaX =
        targetRect.left + window.scrollX + targetRect.width / 2 - cbWidth / 2;
      const deltaY =
        targetRect.top + window.scrollY + targetRect.height / 2 - cbHeight / 2;
      gsap.set(brand, { x: deltaX, y: deltaY, scale: 1, opacity: 1 });
    };

    update();
    setDoneReady(true);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [phase, inDocs]);

  const showContent = phase !== "cycle";
  const letters = "Meridian".split("");

  return (
    <div
      className={cn(
        "pointer-events-none z-[110] flex items-center justify-center mix-blend-difference",
        phase === "done" ? "absolute" : "fixed",
        phase === "done" && inDocs && "hidden",
        hideForInitialDone && "invisible",
      )}
      style={{ top: "50%", left: "50%", width: 0, height: 0 }}
    >
      <a
        ref={brandRef}
        href="/"
        aria-label="Meridian — home"
        className="font-display pointer-events-auto inline-flex shrink-0 origin-center items-center gap-2.5 text-3xl leading-none tracking-tight whitespace-nowrap text-white will-change-transform"
      >
        {showContent ? (
          <>
            <motion.span
              initial={{ opacity: 0, y: -18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={
                reduced
                  ? { duration: 0.3, ease: SOFT_EASE }
                  : { type: "spring", stiffness: 110, damping: 18 }
              }
              className="hidden size-9 shrink-0 md:block"
            >
              <MeridianLogo aria-hidden className="size-full" />
            </motion.span>
            <span>
              {letters.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: "blur(8px)", scale: 0.92 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  transition={{
                    duration: reduced ? 0.3 : 0.5,
                    ease: SOFT_EASE,
                    delay: reduced ? 0 : LETTER_DELAY + i * LETTER_STAGGER,
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
              <motion.sup
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  reduced
                    ? { duration: 0.3, ease: SOFT_EASE, delay: 0.5 }
                    : {
                        type: "spring",
                        stiffness: 180,
                        damping: 18,
                        delay:
                          LETTER_DELAY + letters.length * LETTER_STAGGER + 0.1,
                      }
                }
                className="align-super text-sm"
              >
                ®
              </motion.sup>
            </span>
          </>
        ) : null}
      </a>
    </div>
  );
}
