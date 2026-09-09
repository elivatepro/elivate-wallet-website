"use client";

import { useRef } from "react";

import { motion, useInView } from "motion/react";

const EASE = [0.32, 0.72, 0, 1] as const;

export const MotionSteps = ({ children }: { children: React.ReactNode }) => (
  <ol className="not-prose mt-8 space-y-8" data-elivate-steps>
    {children}
  </ol>
);

type StepProps = {
  title?: string;
  index: number;
  total: number;
  children: React.ReactNode;
};

// MotionStep is intentionally not driven by counter() — we pass the index
// from the parent extractor in mdx-components so the number can animate on
// scroll-in with a satisfying counter-reveal.
export const MotionStep = ({ title, index, total, children }: StepProps) => {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  const num = String(index).padStart(2, "0");
  const totalPad = String(total).padStart(2, "0");

  return (
    <li ref={ref} className="relative grid grid-cols-[3rem_1fr] gap-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative"
      >
        <div className="border-foreground bg-background flex size-9 items-center justify-center border font-mono text-sm tabular-nums">
          {num}
        </div>
        <div className="text-muted-foreground mt-1 text-center font-mono text-[0.55rem] tracking-widest">
          /{totalPad}
        </div>
        {/* Vertical hairline that connects steps — fades in on view. */}
        <motion.span
          aria-hidden
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="bg-border absolute top-12 -bottom-8 left-1/2 -ml-px w-px origin-top"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: EASE, delay: 0.08 }}
      >
        {title ? (
          <div className="font-display text-lg tracking-tight">{title}</div>
        ) : null}
        <div className="text-foreground/85 mt-2 text-sm [&_p]:mt-2 [&_pre]:mt-3">
          {children}
        </div>
      </motion.div>
    </li>
  );
};
