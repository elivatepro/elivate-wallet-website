"use client";

import { useCallback, useRef } from "react";

import Dashboard from "@/components/mockups/dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroAltProps {
  className?: string;
  /** When true (default), render the heading as h1 with hero-scale sizing (matches `product/scene.tsx` hero). Set false to render as h2 with canonical section sizing for reuse outside the page hero slot. */
  asHero?: boolean;
}

const TILT_DEG = 4;
const TRANSLATE_PX = 12;

const HeroAlt = ({ className, asHero = true }: HeroAltProps) => {
  const Heading = asHero ? "h1" : "h2";
  const headingClass = asHero
    ? "text-5xl leading-[1.05] tracking-tight text-balance md:text-7xl md:leading-[0.95] lg:text-8xl"
    : "text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]";
  const illustrationRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = illustrationRef.current;
      if (!el) return;
      el.style.transform = [
        `translate(${nx * TRANSLATE_PX}px, ${ny * TRANSLATE_PX}px)`,
        `rotateY(${nx * TILT_DEG}deg)`,
        `rotateX(${-ny * TILT_DEG}deg)`,
      ].join(" ");
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const el = illustrationRef.current;
    if (el)
      el.style.transform = "translate(0px, 0px) rotateY(0deg) rotateX(0deg)";
  }, []);

  return (
    <section
      data-section-dark
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "dark bg-background text-foreground relative h-screen max-h-[1200px] overflow-hidden pt-32 font-sans after:pointer-events-none after:absolute after:inset-0 after:z-30 after:block after:w-full after:bg-[linear-gradient(to_bottom,var(--color-transparent)_50%,var(--color-background)_100%)] after:content-[''] md:pt-40",
        className,
      )}
    >
      <div className="container">
        <div className="relative z-20 flex flex-col gap-5">
          <Heading className={headingClass}>
            <span className="hidden md:block">
              One console for your logs, metrics, and traces
            </span>
            <span className="mx-auto block max-w-[31.25rem] text-center md:hidden">
              One console for logs, metrics, and traces
            </span>
          </Heading>
          <div className="max-w-2xl">
            <p className="text-muted-foreground text-center text-xl font-medium md:text-left">
              Elivate replaces noisy dashboards with a single observability
              console that only pages you when it matters.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 py-4 md:flex-row">
            <Button size="lg">Start free trial</Button>
            <Button size="lg" variant="ghost">
              See how it works
            </Button>
          </div>
          <div
            className="pointer-events-none relative -mt-[8.75rem] w-full"
            style={{ perspective: "1200px" }}
          >
            <div
              ref={illustrationRef}
              className="h-[60rem] w-full transition-transform duration-500 ease-out will-change-transform md:h-[85rem]"
            >
              <div className="relative size-full [perspective-origin:100%_0] [perspective:4000px] [transform-style:preserve-3d]">
                <div className="pointer-events-auto absolute inset-0 mx-auto mt-[11.25rem] h-[160rem] w-[120rem] [transform-origin:top_left] [transform:scale(.7)_rotateX(47deg)_rotateY(21deg)_rotate(330deg)] rounded-xl after:pointer-events-none after:absolute after:-top-px after:-right-px after:bottom-0 after:block after:w-full after:bg-[linear-gradient(to_right,var(--color-transparent)_80%,var(--color-background)_90%)] after:content-[''] md:mt-[17.5rem] md:[transform:translateX(2%)_scale(1.2)_rotateX(47deg)_rotateY(31deg)_rotate(324deg)]">
                  <Dashboard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Glow behind top-left of the illustration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-0 z-10 h-[60%] w-[50%] bg-radial-[ellipse_at_30%_50%] from-white/10 to-transparent to-65%"
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-[81.25rem] w-[35rem] -translate-y-[21.875rem] rotate-[-45deg] rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="absolute top-0 left-0 h-[81.25rem] w-[15rem] origin-top-left translate-x-[5%] translate-y-[-5%] rotate-[-45deg] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        <div className="absolute top-0 left-0 h-[81.25rem] w-[15rem] origin-top-left translate-x-[180%] translate-y-[70%] rotate-[-45deg] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>
    </section>
  );
};

export default HeroAlt;
