"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { motion } from "motion/react";

import { usePathname } from "@/hooks/use-pathname";
import { cn } from "@/lib/utils";

export type LoaderPhase = "cycle" | "brand" | "transition" | "done";

const SOFT_EASE = [0.16, 1, 0.3, 1] as const;
const LETTER_STAGGER = 0.04;
const LETTER_DELAY = 0.22;
const MAX_SCALE = 5;
const VIEWPORT_RATIO = 0.82;
const BRAND_TEXT = "Elivate Wallet";

const computeScale = () => {
  const w = window.innerWidth;
  const naturalWidth = 240;
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
  const letters = BRAND_TEXT.split("");

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
        aria-label="Elivate Wallet — home"
        className="font-display pointer-events-auto inline-flex shrink-0 origin-center items-center text-3xl leading-none tracking-tight whitespace-nowrap text-white will-change-transform"
      >
        {showContent ? (
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
                {char === " " ? "\u00a0" : char}
              </motion.span>
            ))}
          </span>
        ) : null}
      </a>
    </div>
  );
}