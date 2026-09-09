"use client";

import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";

import Schematic, {
  type AnnotationKey,
  ZONE_PARTS,
} from "@/components/mockups/spec-schematic";
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

type SpecRow = {
  key: AnnotationKey;
  label: string;
  value: string;
  detail: string;
};

const KEYS: AnnotationKey[] = ["A", "B", "C", "D", "E", "F"];

const SPEC_ROWS: SpecRow[] = [
  {
    key: "A",
    label: "Surface",
    value: "One console for logs, metrics, and traces",
    detail: "Keyboard-first. ⌘K to search anything.",
  },
  {
    key: "B",
    label: "Topology",
    value: "Every service mapped to its SLO",
    detail: "See your full service hierarchy at a glance.",
  },
  {
    key: "C",
    label: "Signal model",
    value: "Alerts based on SLO error-budget burn",
    detail: "You only get paged when your monthly budget is at risk.",
  },
  {
    key: "D",
    label: "Auto-draft",
    value: "Post-mortems written automatically",
    detail:
      "Timeline, suspect services, and the last 3 commits — attached to every incident.",
  },
  {
    key: "E",
    label: "Query speed",
    value: "p95 queries under 120 ms worldwide",
    detail: "Fast reads from every region Elivate runs in.",
  },
  {
    key: "F",
    label: "Noise floor",
    value: "97% fewer alerts since Q1 2026",
    detail: "Measured across 41 customer teams.",
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

const Spec = () => {
  const [active, setActive] = useState<AnnotationKey | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<Partial<Record<AnnotationKey, HTMLDivElement>>>({});

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

  // Flip isStuck when the sticky figure pins at top-16 (4rem = 64px)
  useRafScroll(() => {
    const figure = figureRef.current;
    if (!figure) return;
    const top = figure.getBoundingClientRect().top;
    setIsStuck((prev) => {
      const next = top <= 65;
      return prev === next ? prev : next;
    });
  });

  // Active row = topmost row whose top is at or below the sticky figure's bottom.
  useRafScroll(() => {
    const figure = figureRef.current;
    const figureBottom = figure
      ? Math.max(0, figure.getBoundingClientRect().bottom)
      : 0;
    let activeKey: AnnotationKey | null = null;
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
            className={cn(
              "group/fig sticky top-16 z-20 flex flex-col gap-4 md:static md:z-auto md:justify-between md:gap-8 lg:gap-10",
              isStuck && "max-md:flex-col-reverse",
            )}
          >
            <motion.div layout variants={fadeUp}>
              <SchematicFrame
                active={active}
                onHover={setActive}
                clearOnLeave={!isMobile}
              />
            </motion.div>
            <motion.figcaption
              layout
              variants={fadeUp}
              className="text-meta text-muted-foreground group-hover/fig:text-foreground flex items-baseline justify-between border-b pb-3 transition-colors duration-300"
            >
              <span>Console &middot; 6 zones, A through F</span>
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "bg-foreground size-1 rounded-full transition-opacity duration-300",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                {active
                  ? `${active} — ${ZONE_PARTS[active]}`
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

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-baseline gap-2 border-t pt-4 md:mt-14 md:flex-row md:items-baseline md:justify-between md:gap-8 lg:mt-20"
        >
          <span className="text-meta text-muted-foreground">
            § Pricing · Flat
          </span>
          <span className="text-3xl tracking-tight text-balance md:text-4xl">
            <span className="text-foreground">$0 per seat.</span>{" "}
            <em className="text-muted-foreground">
              Your whole team, one flat price.
            </em>
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
};

type SchematicFrameProps = {
  active: AnnotationKey | null;
  onHover: (key: AnnotationKey | null) => void;
  clearOnLeave: boolean;
};

const SchematicFrame = ({
  active,
  onHover,
  clearOnLeave,
}: SchematicFrameProps) => {
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);
  const [lit, setLit] = useState(false);
  const reduceMotion = useReducedMotion();

  const background = useMotionTemplate`radial-gradient(480px circle at ${mouseX}px ${mouseY}px, rgb(255 255 255 / 0.06), transparent 55%)`;

  const onPointerMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      className={cn(
        "border-foreground/15 bg-card/70 relative border p-6 backdrop-blur-xs backdrop-saturate-150 transition-colors duration-300 md:p-8",
        (lit || active) && "border-foreground/30",
      )}
      onPointerMove={onPointerMove}
      onPointerEnter={() => setLit(true)}
      onPointerLeave={() => {
        setLit(false);
        if (clearOnLeave) onHover(null);
      }}
    >
      <Schematic active={active} onHover={onHover} />
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background }}
          animate={{ opacity: lit ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}
    </div>
  );
};

type SpecTableRowProps = {
  row: SpecRow;
  active: AnnotationKey | null;
  onHover: (key: AnnotationKey | null) => void;
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
      className="relative flex h-full min-h-36 items-center md:min-h-24"
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

export default Spec;
