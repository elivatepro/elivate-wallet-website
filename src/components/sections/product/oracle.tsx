"use client";

import { useEffect, useRef, useState } from "react";

import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = { base: 0.8 } as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789!@#$%&*+-=_";

const EXCHANGES = [
  {
    prompt: "errors on checkout, past 6h, grouped by version",
    plan: "PLAN · index(version) · 3 shards · est 42ms · hot",
    answer: "429 events · v2.4.1 dominates (412) · regression at 14:02",
    chart: [
      { k: "v2.4.1", v: 412, bad: true },
      { k: "v2.4.0", v: 14, bad: false },
      { k: "v2.3.9", v: 3, bad: false },
    ],
  },
  {
    prompt: "p99 query latency, last 24h, by region",
    plan: "PLAN · index(region, ts) · 27 shards · est 118ms · hot",
    answer: "27 regions · p99 87ms overall · ap-south drifting (142ms)",
    chart: [
      { k: "us-east", v: 72, bad: false },
      { k: "eu-central", v: 81, bad: false },
      { k: "ap-south", v: 142, bad: true },
    ],
  },
  {
    prompt: "users affected by the 14:02 spike",
    plan: "PLAN · join(events, users) · est 91ms · partial cache hit",
    answer: "1,804 users · 82% on v2.4.1 · paged oncall",
    chart: [
      { k: "v2.4.1", v: 1478, bad: true },
      { k: "v2.4.0", v: 241, bad: false },
      { k: "v2.3.9", v: 85, bad: false },
    ],
  },
];

const Oracle = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <motion.section
      ref={sectionRef}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="section-padding container"
    >
      <motion.div
        variants={fadeUp}
        className="text-meta text-muted-foreground mb-10 flex items-center border-b pb-4 md:mb-14 lg:mb-20"
      >
        <span className="flex flex-1 items-center gap-2">
          <span className="bg-foreground inline-block size-1.5 animate-pulse rounded-full" />
          Oracle &middot; the AI in your console
        </span>
        <span className="hidden md:inline">
          Natural language &rarr; plan &rarr; answer
        </span>
        <span className="flex-1 text-end">Fig. 05</span>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mb-10 max-w-5xl md:mb-14 lg:mb-20"
      >
        <h2 className="text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
          A sentence, <em className="text-muted-foreground">answered.</em>
          <sup className="text-muted-foreground ml-1 align-super text-base md:text-xl lg:text-2xl">
            *
          </sup>
        </h2>

        <p className="text-meta text-muted-foreground mt-4 max-w-md md:mt-6">
          <span className="font-display text-base font-bold text-red-500">
            *
          </span>{" "}
          In{" "}
          <span className="bg-red-500 px-1.5 py-px font-bold tracking-wider text-black">
            BETA
          </span>{" "}
          &mdash; behavior and pricing may shift before GA. Your feedback shapes
          what ships.
        </p>
      </motion.div>

      <div className="space-y-4">
        {EXCHANGES.map((ex, i) => (
          <Exchange
            key={ex.prompt}
            exchange={ex}
            index={i}
            start={inView}
            delayMs={i * 2200}
          />
        ))}
      </div>
    </motion.section>
  );
};

type Phase = "idle" | "typing" | "scrambling" | "answering" | "done";

type ExchangeProps = {
  exchange: (typeof EXCHANGES)[number];
  index: number;
  start: boolean;
  delayMs: number;
};

const Exchange = ({ exchange, index, start, delayMs }: ExchangeProps) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [promptText, setPromptText] = useState("");
  const [planText, setPlanText] = useState("");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      const timer = setTimeout(() => {
        setPromptText(exchange.prompt);
        setPlanText(exchange.plan);
        setPhase("done");
      }, delayMs);
      return () => clearTimeout(timer);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    timers.push(
      setTimeout(() => {
        setPhase("typing");
        let i = 0;
        const typeInt = setInterval(() => {
          i++;
          setPromptText(exchange.prompt.slice(0, i));
          if (i >= exchange.prompt.length) {
            clearInterval(typeInt);

            timers.push(
              setTimeout(() => {
                setPhase("scrambling");
                const target = exchange.plan;
                let iter = 0;
                const maxIter = 18;
                const scrambleInt = setInterval(() => {
                  iter++;
                  const resolved = Math.floor((iter / maxIter) * target.length);
                  const scrambled = target
                    .split("")
                    .map((ch, idx) => {
                      if (idx < resolved) return ch;
                      if (ch === "") return "";
                      if (ch === "·") return "·";
                      return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("");
                  setPlanText(scrambled);
                  if (iter >= maxIter) {
                    clearInterval(scrambleInt);
                    setPlanText(target);
                    timers.push(setTimeout(() => setPhase("answering"), 180));
                    timers.push(setTimeout(() => setPhase("done"), 900));
                  }
                }, 50);
                intervals.push(scrambleInt);
              }, 180),
            );
          }
        }, 22);
        intervals.push(typeInt);
      }, delayMs),
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
      intervals.forEach((i) => clearInterval(i));
    };
  }, [start, delayMs, exchange.prompt, exchange.plan, reduced]);

  const showAnswer = phase === "answering" || phase === "done";

  return (
    <motion.article
      className="bg-card relative border"
      initial={{ opacity: 0, y: 20 }}
      animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.7,
        delay: delayMs / 1000 - 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="text-meta text-muted-foreground flex items-center justify-between border-b px-4 py-2.5 md:px-6">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "inline-block size-1.5 rounded-full",
              phase === "done"
                ? "bg-foreground"
                : "bg-foreground animate-pulse",
            )}
          />
          Exchange 0{index + 1}
        </span>
        <span className="hidden md:inline">
          elivate.console &middot; /q/
          {index === 0 ? "3fb7c2" : index === 1 ? "8a12de" : "b47f91"}
        </span>
        <span>
          {phase === "typing" && "Typing…"}
          {phase === "scrambling" && "Planning…"}
          {phase === "answering" && "Answering…"}
          {phase === "done" && "Done · 87ms"}
          {phase === "idle" && "Queued"}
        </span>
      </div>

      <div className="flex items-start gap-3 px-4 py-4 md:px-6">
        <span className="text-muted-foreground shrink-0 pt-0.5 font-mono text-xs">
          ?
        </span>
        <p className="text-foreground font-mono text-sm leading-relaxed md:text-base">
          {promptText}
          {phase === "typing" && (
            <span
              aria-hidden
              className="bg-foreground ml-0.5 inline-block h-[1em] w-[0.6ch] translate-y-[2px] animate-pulse"
            />
          )}
        </p>
      </div>

      {(phase === "scrambling" ||
        phase === "answering" ||
        phase === "done") && (
        <div className="flex items-start gap-3 border-t px-4 py-3 md:px-6">
          <span className="text-meta text-muted-foreground shrink-0 pt-0.5">
            PLAN
          </span>
          <p
            className={cn(
              "font-mono text-xs leading-relaxed md:text-sm",
              phase === "scrambling"
                ? "text-muted-foreground"
                : "text-foreground",
            )}
          >
            {planText}
          </p>
        </div>
      )}

      {/* grid-rows 0fr↔1fr is the transform-only equivalent of height: 0↔auto — */}
      {/* GPU-friendly and avoids layout thrash from re-measuring auto height. */}
      <div
        className={cn(
          "grid overflow-hidden border-t transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          showAnswer
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 space-y-5 px-4 py-5 md:px-6 md:py-6">
          <div className="flex items-start gap-3">
            <span className="text-meta text-muted-foreground shrink-0 pt-0.5">
              Ans
            </span>
            <p className="font-display text-xl leading-snug tracking-tight md:text-2xl">
              {exchange.answer}
            </p>
          </div>

          <ul className="space-y-2 pl-0 md:pl-8">
            {exchange.chart.map((row, i) => {
              const max = Math.max(...exchange.chart.map((r) => r.v));
              const pct = (row.v / max) * 100;
              return (
                <li key={row.k} className="flex items-center gap-3">
                  <span className="text-foreground w-20 shrink-0 font-mono text-xs">
                    {row.k}
                  </span>
                  <span className="bg-muted relative h-3 flex-1 overflow-hidden">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={showAnswer ? { width: `${pct}%` } : { width: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2 + i * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={cn(
                        "absolute inset-y-0 left-0",
                        row.bad ? "bg-foreground" : "bg-foreground/45",
                      )}
                    />
                  </span>
                  <span className="text-foreground w-16 shrink-0 text-right font-mono text-xs">
                    {row.v.toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.article>
  );
};

export default Oracle;
