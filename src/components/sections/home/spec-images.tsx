"use client";

import { useEffect, useRef, useState } from "react";

import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";

import { ElivateFrame } from "@/components/layout/elivate-frame";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = { base: 0.8 } as const;
const STAGGER = { section: 0.08, row: 0.06 } as const;

const sectionOrchestration: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.section, delayChildren: 0.05 },
  },
};

const listOrchestration: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.row } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

const VIEWPORT = { once: true, margin: "-100px" } as const;

type SpecKey = "A" | "B" | "C" | "D" | "E" | "F";

type SpecRow = {
  key: SpecKey;
  label: string;
  value: string;
  detail: string;
  image: string;
};

const KEYS: SpecKey[] = ["A", "B", "C", "D", "E", "F"];

const SPEC_ROWS: SpecRow[] = [
  {
    key: "A",
    label: "Surface",
    value: "One console for logs, metrics, and traces",
    detail: "Keyboard-first. ⌘K to search anything.",
    image: "/images/spec/6.png",
  },
  {
    key: "B",
    label: "Topology",
    value: "Every service mapped to its SLO",
    detail: "See your full service hierarchy at a glance.",
    image: "/images/spec/1.png",
  },
  {
    key: "C",
    label: "Signal model",
    value: "Alerts based on SLO error-budget burn",
    detail: "You only get paged when your monthly budget is at risk.",
    image: "/images/spec/3.png",
  },
  {
    key: "D",
    label: "Auto-draft",
    value: "Post-mortems written automatically",
    detail:
      "Timeline, suspect services, and the last 3 commits — attached to every incident.",
    image: "/images/spec/4.png",
  },
  {
    key: "E",
    label: "Query speed",
    value: "p95 queries under 120 ms worldwide",
    detail: "Fast reads from every region Elivate runs in.",
    image: "/images/spec/5.png",
  },
  {
    key: "F",
    label: "Noise floor",
    value: "97% fewer alerts since Q1 2026",
    detail: "Measured across 41 customer teams.",
    image: "/images/spec/8.png",
  },
];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
};

const useRafScroll = (callback: () => void, enabled = true) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  useEffect(() => {
    if (!enabled) return;
    let rafId = requestAnimationFrame(() => callbackRef.current());
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => callbackRef.current());
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);
};

const SpecImages = () => {
  const [active, setActive] = useState<SpecKey | null>(null);
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<Partial<Record<SpecKey, HTMLDivElement>>>({});

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });
  const headlineParallax = useTransform(progress, [0, 1], [60, -60]);

  useRafScroll(() => {
    const figure = figureRef.current;
    const figureBottom = figure
      ? Math.max(0, figure.getBoundingClientRect().bottom)
      : 0;
    let activeKey: SpecKey | null = null;
    let smallestValidTop = Infinity;
    for (const key of KEYS) {
      const el = rowRefs.current[key];
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top >= figureBottom && top < smallestValidTop) {
        smallestValidTop = top;
        activeKey = key;
      }
    }
    if (activeKey) {
      setActive((prev) => (prev === activeKey ? prev : activeKey));
    }
  }, isMobile);

  const activeRow = SPEC_ROWS.find((r) => r.key === active) ?? SPEC_ROWS[0];

  return (
    <motion.section
      ref={sectionRef}
      className="relative"
      variants={sectionOrchestration}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <div className="section-padding container">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_auto] md:gap-16">
          <motion.h2
            variants={fadeIn}
            style={{ y: headlineParallax, willChange: "transform" }}
            className="text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]"
          >
            Elivate, <em className="text-muted-foreground">at a glance.</em>
          </motion.h2>
          <Stamp />
        </div>

        <div className="mt-10 flex flex-col gap-12 md:mt-14 md:grid md:grid-cols-[0.95fr_1.05fr] md:gap-16 lg:mt-20 lg:gap-24">
          <figure
            ref={figureRef}
            className="group/fig sticky top-16 z-20 flex flex-col gap-4 md:static md:z-auto md:justify-between md:gap-8 lg:gap-10"
          >
            <motion.div variants={fadeUp}>
              <ElivateFrame borderWidth={8} radius={0}>
                <div className="relative aspect-square overflow-hidden bg-black">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeRow.image}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="absolute inset-0"
                    >
                      <img
                        src={activeRow.image}
                        alt={`${activeRow.label} illustration`}
                        className="absolute inset-0 size-full object-cover"
                        sizes="(max-width: 768px) 100vw, 45vw"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={activeRow.key}
                        initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="font-mono text-base font-bold tracking-widest text-white/80 uppercase drop-shadow-lg md:text-lg"
                      >
                        {activeRow.label}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </ElivateFrame>
            </motion.div>
            <motion.figcaption
              variants={fadeUp}
              className="text-meta text-muted-foreground group-hover/fig:text-foreground flex items-baseline justify-between border-b pb-3 transition-colors duration-300"
            >
              <span>Spec &middot; 6 zones, A through F</span>
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "bg-foreground size-1 rounded-full transition-opacity duration-300",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                {active
                  ? `${active} — ${activeRow.label}`
                  : "Hover or scroll to inspect"}
              </span>
            </motion.figcaption>
          </figure>

          <motion.dl
            variants={listOrchestration}
            className="relative divide-y border-y md:grid md:grid-rows-6"
            onPointerLeave={!isMobile ? () => setActive(null) : undefined}
          >
            {SPEC_ROWS.map((row) => (
              <motion.div key={row.key} variants={fadeUp}>
                <SpecTableRow
                  row={row}
                  active={active}
                  onHover={setActive}
                  isMobile={isMobile}
                  rowRef={(el) => {
                    if (el) rowRefs.current[row.key] = el;
                    else delete rowRefs.current[row.key];
                  }}
                />
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </motion.section>
  );
};

type SpecTableRowProps = {
  row: SpecRow;
  active: SpecKey | null;
  onHover: (key: SpecKey | null) => void;
  isMobile: boolean;
  rowRef: (el: HTMLDivElement | null) => void;
};

const SpecTableRow = ({
  row,
  active,
  onHover,
  isMobile,
  rowRef,
}: SpecTableRowProps) => {
  const isActive = active === row.key;
  const isDimmed = active !== null && !isActive;

  const handlePointerEnter = isMobile ? undefined : () => onHover(row.key);

  return (
    <motion.div
      ref={rowRef}
      onPointerEnter={handlePointerEnter}
      animate={{ opacity: isDimmed ? 0.4 : 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative flex h-full min-h-36 cursor-pointer items-center md:min-h-24"
    >
      <motion.span
        aria-hidden="true"
        className="from-foreground/[0.035] via-foreground/[0.01] pointer-events-none absolute inset-0 origin-left bg-gradient-to-r to-transparent"
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      />

      <div className="relative grid w-full grid-cols-[2.5rem_1fr] items-baseline gap-6 py-5 md:grid-cols-[3rem_8rem_1fr]">
        <motion.dt
          className={cn(
            "font-display ml-2 text-2xl leading-none transition-colors duration-200",
            isActive ? "text-foreground" : "text-muted-foreground",
          )}
          animate={{ scale: isActive ? 1.85 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          style={{ transformOrigin: "left bottom" }}
        >
          {row.key}.
        </motion.dt>

        <span
          className={cn(
            "text-meta hidden transition-colors duration-200 md:block",
            isActive ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {row.label}
        </span>
        <dd className="space-y-1">
          <span className="text-meta text-muted-foreground mb-1 block md:hidden">
            {row.label}
          </span>
          <span className="block text-lg leading-snug tracking-tight text-balance md:text-xl">
            {row.value}
          </span>
          <span className="text-muted-foreground block text-xs leading-relaxed md:text-sm">
            {row.detail}
          </span>
        </dd>
      </div>
    </motion.div>
  );
};

const Stamp = () => (
  <motion.div
    variants={fadeUp}
    whileHover={{
      y: -2,
      transition: { type: "spring", stiffness: 300, damping: 22 },
    }}
    className="group/stamp border-foreground/20 hover:border-foreground/50 hidden border p-4 transition-colors duration-200 select-none md:block md:min-w-56"
  >
    <div className="text-meta text-muted-foreground group-hover/stamp:text-foreground flex items-center justify-between border-b pb-2 transition-colors duration-200">
      <span>§ MRD / 01</span>
      <span>Rev A</span>
    </div>
    <dl className="text-meta text-muted-foreground mt-2 space-y-1">
      <div className="flex items-baseline justify-between">
        <dt>Issued</dt>
        <dd className="text-foreground">2026.01</dd>
      </div>
      <div className="flex items-baseline justify-between">
        <dt>Scale</dt>
        <dd className="text-foreground">1 : 1</dd>
      </div>
      <div className="flex items-baseline justify-between">
        <dt>Sheet</dt>
        <dd className="text-foreground">1 / 3</dd>
      </div>
    </dl>
  </motion.div>
);

export default SpecImages;
