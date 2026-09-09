"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { AnimatePresence, motion, type Variants } from "motion/react";

import Console from "@/components/mockups/console";
import LogStream from "@/components/mockups/log-stream";
import PostMortem from "@/components/mockups/post-mortem";
import WatchAlert from "@/components/mockups/watch-alert";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = { base: 0.8 } as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

type StepId = "detect" | "page" | "draft" | "resolve";

const STEPS: {
  id: StepId;
  step: string;
  label: string;
  title: string;
  body: string;
}[] = [
  {
    id: "page",
    step: "01",
    label: "Page",
    title: "Alerts on every device.",
    body: "The on-call engineer gets a single notification. Two taps: acknowledge or roll back.",
  },
  {
    id: "detect",
    step: "02",
    label: "Detect",
    title: "Critical incidents detected.",
    body: "Elivate monitors your SLO, not raw CPU graphs. An incident room opens automatically before anyone opens a laptop.",
  },
  {
    id: "draft",
    step: "03",
    label: "Draft",
    title: "The post-mortem writes itself.",
    body: "Timeline, suspect services, last three commits, and correlated deploys — all attached when she opens the ticket.",
  },
  {
    id: "resolve",
    step: "04",
    label: "Resolve",
    title: "Resolved, with full documentation.",
    body: "Error budget is back to healthy. The incident room closes, the post-mortem is saved, and on-call goes back to sleep.",
  },
];

const MOCKUPS: Record<StepId, ReactNode> = {
  detect: <Console />,
  page: <WatchAlert />,
  draft: (
    <div className="mx-auto w-full max-w-xl">
      <PostMortem />
    </div>
  ),
  resolve: <LogStream />,
};

const useRafScroll = (callback: () => void) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  useEffect(() => {
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
  }, []);
};

const NightShift = () => {
  const [activeId, setActiveId] = useState<StepId>("page");
  const stepRefs = useRef<Partial<Record<StepId, HTMLDivElement>>>({});
  const activeIdx = STEPS.findIndex((s) => s.id === activeId);

  useRafScroll(() => {
    const scanLine = window.innerHeight * 0.42;
    let bestId: StepId | null = null;
    let bestTop = -Infinity;
    for (const step of STEPS) {
      const el = stepRefs.current[step.id];
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= scanLine && top > bestTop) {
        bestTop = top;
        bestId = step.id;
      }
    }
    if (bestId !== null) {
      setActiveId((prev) => (prev === bestId ? prev : bestId!));
    }
  });

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
    >
      <div className="section-padding container">
        <div className="max-w-3xl">
          <motion.span
            variants={fadeUp}
            className="text-meta text-muted-foreground"
          >
            § Night shift · 03:17 UTC
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]"
          >
            Six minutes, one page,{" "}
            <em className="text-muted-foreground">no laptop.</em>
          </motion.h2>
        </div>

        <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-[1fr_1.1fr] md:gap-16 lg:mt-20 lg:gap-24">
          <motion.div variants={container} className="flex flex-col">
            {STEPS.map((step, idx) => (
              <Step
                key={step.id}
                step={step}
                isActive={activeId === step.id}
                style={{ order: idx * 2 }}
                stepRef={(el) => {
                  if (el) stepRefs.current[step.id] = el;
                  else delete stepRefs.current[step.id];
                }}
              />
            ))}

            <motion.div
              layout
              transition={{
                layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
              }}
              style={{ order: activeIdx * 2 + 1 }}
              className="md:hidden"
            >
              <MockupFrame className="flex min-h-[420px] items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="w-full"
                  >
                    {MOCKUPS[activeId]}
                  </motion.div>
                </AnimatePresence>
              </MockupFrame>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="hidden min-w-0 overflow-clip md:block"
          >
            <div className="md:sticky md:top-24">
              <MockupFrame className="flex min-h-[480px] items-center justify-center md:min-h-[620px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="flex w-full items-center justify-center"
                  >
                    {MOCKUPS[activeId]}
                  </motion.div>
                </AnimatePresence>
              </MockupFrame>
              <div className="text-meta text-muted-foreground mt-4 flex items-baseline justify-between">
                <span>
                  Now showing ·{" "}
                  <span className="text-foreground">
                    {STEPS.find((s) => s.id === activeId)!.label}
                  </span>
                </span>
                <span>
                  Step {STEPS.findIndex((s) => s.id === activeId) + 1} /{" "}
                  {STEPS.length}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

type StepProps = {
  step: (typeof STEPS)[number];
  isActive: boolean;
  style?: CSSProperties;
  stepRef: (el: HTMLDivElement | null) => void;
};

const Step = ({ step, isActive, style, stepRef }: StepProps) => {
  return (
    <motion.div
      ref={stepRef}
      variants={fadeUp}
      style={style}
      className={cn(
        "relative border-t py-10 transition-colors first:border-t-0 md:py-16",
        !isActive && "text-muted-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "bg-foreground absolute top-10 left-0 h-10 w-px transition-opacity md:top-16 md:h-16",
          isActive ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="flex items-baseline gap-4 pl-5">
        <span className="text-meta-xs text-muted-foreground">
          {step.step} · {step.label}
        </span>
      </div>
      <p
        className={cn(
          "font-display mt-4 pl-5 text-3xl leading-tight tracking-tighter transition-colors md:text-4xl lg:text-5xl",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {step.title}
      </p>
      <p className="text-muted-foreground mt-4 max-w-md pl-5 text-base leading-relaxed md:text-lg">
        {step.body}
      </p>
    </motion.div>
  );
};

type MockupFrameProps = {
  children: ReactNode;
  className?: string;
};

const MockupFrame = ({ children, className }: MockupFrameProps) => (
  <div
    className={cn(
      "border-foreground/15 from-card/70 via-card/40 to-muted/40 relative overflow-hidden border bg-gradient-to-br p-6 backdrop-blur-xl md:p-10",
      className,
    )}
  >
    <div
      aria-hidden="true"
      className="from-foreground/[0.08] pointer-events-none absolute inset-0 bg-radial-[ellipse_at_30%_10%] to-transparent to-60%"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage:
          "repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 0.5deg, currentColor 0.5deg 1deg)",
        backgroundSize: "3px 3px",
      }}
    />
    <div className="relative flex h-full w-full items-center justify-center">
      {children}
    </div>
  </div>
);

export default NightShift;
