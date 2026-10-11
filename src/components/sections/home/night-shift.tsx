"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { AnimatePresence, motion, type Variants } from "motion/react";

import { AppWindow, PhoneFrame } from "@/components/mockups/app-screen";
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
    label: "Record",
    title: "Add the income where it belongs.",
    body: "Record income to the right member and keep the supporting details with the entry.",
  },
  {
    id: "detect",
    step: "02",
    label: "Track",
    title: "Your member sees the change for themselves.",
    body: "Their balance and transaction history reflect what was recorded, so they do not have to come back to you for the figure.",
  },
  {
    id: "draft",
    step: "03",
    label: "Request",
    title: "When they want to withdraw, the request starts in Wallet.",
    body: "It is recorded against their account instead of beginning as a message someone has to remember.",
  },
  {
    id: "resolve",
    step: "04",
    label: "Review & complete",
    title: "See what is waiting. Keep track of what is done.",
    body: "Review the request, update its status, and keep the record clear through completion.",
  },
];

const MOCKUPS: Record<StepId, ReactNode> = {
  page: (
    <AppWindow
      src="/images/app/record-income.png"
      alt="Recording income for a member in Elivate Wallet"
      width={2240}
      height={1320}
      className="mx-auto w-full max-w-xl"
    />
  ),
  detect: (
    <PhoneFrame
      src="/images/phone/balance.png"
      alt="A member's balance on the Elivate Wallet mobile home"
      className="mx-auto w-[220px] md:w-[250px]"
    />
  ),
  draft: (
    <PhoneFrame
      src="/images/phone/withdrawal.png"
      alt="A member's withdrawal requests in Elivate Wallet"
      className="mx-auto w-[220px] md:w-[250px]"
    />
  ),
  resolve: (
    <AppWindow
      src="/images/app/review-payout.png"
      alt="Reviewing a withdrawal and recording the payout"
      width={2240}
      height={1740}
      className="mx-auto w-full max-w-xl"
    />
  ),
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
            § Workflow · Record to withdrawal
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]"
          >
            From income recorded to withdrawal handled,{" "}
            <em className="text-muted-foreground">the trail stays clear.</em>
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
