"use client";

import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, type Variants } from "motion/react";

import { DottedBackdrop } from "@/components/layout/dotted-backdrop";
import Console from "@/components/mockups/console";
import LogStream from "@/components/mockups/log-stream";
import WatchAlert from "@/components/mockups/watch-alert";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const EASE = [0.16, 1, 0.3, 1] as const;

const FACTS = [
  { value: "24/7", label: "balance access · anytime" },
  { value: "01", label: "financial history · per member" },
  { value: "03", label: "core money flows · in Wallet" },
  { value: "20K+", label: "users · designed to scale" },
] as const;

const SURFACES = [
  {
    num: "01",
    title: "Balances",
    role: "MEMBER VIEW",
    caption:
      "Members see their balance, income, expenses, and transaction history without asking for an update.",
  },
  {
    num: "02",
    title: "Transactions",
    role: "ACTIVITY",
    caption:
      "Every income, expense, allocation, and adjustment stays tied to the member record it changed.",
  },
  {
    num: "03",
    title: "Withdrawals",
    role: "REQUEST FLOW",
    caption:
      "Members submit requests in Wallet. Leaders review them, update the status, and keep the result on record.",
  },
] as const;

type Specimen = {
  num: string;
  name: string;
  role: string;
  headlineLead: string;
  headlineTail: string;
  body: string;
  bullets: readonly string[];
  metric: { value: string; label: string };
};

const SPECIMENS: readonly Specimen[] = [
  {
    num: "01",
    name: "Balances",
    role: "MEMBER VIEW",
    headlineLead: "Their balance.",
    headlineTail: "Right there.",
    body: "Members can see their balance, income, expenses, and transaction history without asking a leader to confirm the figures.",
    bullets: [
      "Current balance stays visible at a glance",
      "Income and expenses stay tied to their record",
      "Transaction history shows what changed and when",
    ],
    metric: { value: "24/7", label: "BALANCE ACCESS · ANYTIME" },
  },
  {
    num: "02",
    name: "Transactions",
    role: "ACTIVITY",
    headlineLead: "Open an entry.",
    headlineTail: "See the record.",
    body: "Every income, expense, allocation, and adjustment stays attached to the member record it changed, so the history is easier to review.",
    bullets: [
      "Income, expenses, and allocations stay in one history",
      "Each entry stays tied to the member it affected",
      "Dates, amounts, and notes stay easy to check",
    ],
    metric: { value: "01", label: "FINANCIAL HISTORY · PER MEMBER" },
  },
  {
    num: "03",
    name: "Withdrawals",
    role: "REQUEST FLOW",
    headlineLead: "Request it.",
    headlineTail: "Track the status.",
    body: "Members can submit withdrawal requests in Wallet, while leaders review them and keep each request’s status clear.",
    bullets: [
      "Submit a withdrawal request from the member account",
      "Leaders review and update each request",
      "The request stays part of the member’s financial record",
    ],
    metric: { value: "03", label: "REQUEST → REVIEW → STATUS" },
  },
] as const;

const heroContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const ProductScene = () => {
  const sceneRef = useRef<HTMLDivElement>(null);

  const consoleRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const watchRef = useRef<HTMLDivElement>(null);

  const consoleHeroSlot = useRef<HTMLDivElement>(null);
  const logHeroSlot = useRef<HTMLDivElement>(null);
  const watchHeroSlot = useRef<HTMLDivElement>(null);

  const consoleFocalSlot = useRef<HTMLDivElement>(null);
  const logFocalSlot = useRef<HTMLDivElement>(null);
  const watchFocalSlot = useRef<HTMLDivElement>(null);

  const { isAtLeast, ready } = useMediaQuery();
  const isDesktop = isAtLeast("lg");

  useGSAP(
    () => {
      if (!ready) return;

      const fit = (target: HTMLElement, slot: HTMLElement) => {
        const slotR = slot.getBoundingClientRect();
        const targetR = target.getBoundingClientRect();
        return {
          x: slotR.left + slotR.width / 2 - (targetR.left + targetR.width / 2),
          y: slotR.top - targetR.top,
          scale: slotR.width / targetR.width,
        };
      };
      const dur = (a: number, b: number) => Math.max(0.001, b - a);

      gsap.utils.toArray<HTMLElement>(".js-specimen-copy").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const consoleEl = consoleRef.current;
      const logEl = logRef.current;
      const watchEl = watchRef.current;
      const heroSection =
        sceneRef.current?.querySelector<HTMLElement>(".js-hero-section");
      const briefPanels = gsap.utils.toArray<HTMLElement>(".js-brief-panel");
      const heroSlots = [
        consoleHeroSlot.current,
        logHeroSlot.current,
        watchHeroSlot.current,
      ];
      const focalSlots = [
        consoleFocalSlot.current,
        logFocalSlot.current,
        watchFocalSlot.current,
      ];

      if (
        !consoleEl ||
        !logEl ||
        !watchEl ||
        !heroSection ||
        briefPanels.length !== 3 ||
        heroSlots.some((s) => !s) ||
        focalSlots.some((s) => !s)
      ) {
        return;
      }

      const mockups = [consoleEl, logEl, watchEl];
      let timelines: gsap.core.Timeline[] = [];

      const build = () => {
        timelines.forEach((tl) => tl.kill());
        timelines = [];
        gsap.set(mockups, { clearProps: "transform" });

        const heroStates = mockups.map((m, i) => fit(m, heroSlots[i]!));

        mockups.forEach((m, i) => {
          const w = m.getBoundingClientRect().width;
          focalSlots[i]!.style.maxWidth = `${w}px`;
        });

        const focalStates = mockups.map((m, i) => fit(m, focalSlots[i]!));

        const heroBox = heroSection.getBoundingClientRect();
        const heroTopDoc = heroBox.top + window.scrollY;
        const heroH = heroBox.height;
        const briefDoc = briefPanels.map(
          (p) => p.getBoundingClientRect().top + window.scrollY,
        );
        const vh = window.innerHeight;

        const m_heroExit = heroH;
        const m_b01Entry = briefDoc[0]! - vh - heroTopDoc;
        const m_b01Settled = briefDoc[0]! - vh / 2 - heroTopDoc;
        const m_b02Entry = briefDoc[1]! - vh - heroTopDoc;
        const m_b02Settled = briefDoc[1]! - vh / 2 - heroTopDoc;
        const m_b03Entry = briefDoc[2]! - vh - heroTopDoc;
        const m_b03Settled = briefDoc[2]! - vh / 2 - heroTopDoc;

        mockups.forEach((m, i) => gsap.set(m, heroStates[i]!));

        timelines.push(
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                endTrigger: briefPanels[1]!,
                end: "top center",
                scrub: 1,
              },
            })
            .to(consoleEl, {
              x: 0,
              y: 0,
              scale: 1,
              duration: dur(0, m_heroExit),
            })
            .to(consoleEl, {
              x: 0,
              y: 0,
              scale: 1,
              duration: dur(m_heroExit, m_b01Entry),
            })
            .to(consoleEl, {
              ...focalStates[0]!,
              duration: dur(m_b01Entry, m_b01Settled),
            })
            .to(consoleEl, {
              ...focalStates[0]!,
              duration: dur(m_b01Settled, m_b02Settled),
            }),
        );

        timelines.push(
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                endTrigger: briefPanels[2]!,
                end: "top center",
                scrub: 1,
              },
            })
            .to(logEl, {
              x: 0,
              y: 0,
              scale: 1,
              duration: dur(0, m_heroExit),
            })
            .to(logEl, {
              x: 0,
              y: 0,
              scale: 1,
              duration: dur(m_heroExit, m_b01Entry),
            })
            .to(logEl, {
              autoAlpha: 0,
              duration: dur(m_b01Entry, m_b01Settled),
            })
            .to(logEl, {
              autoAlpha: 0,
              duration: dur(m_b01Settled, m_b02Entry),
            })
            .to(logEl, {
              ...focalStates[1]!,
              autoAlpha: 1,
              duration: dur(m_b02Entry, m_b02Settled),
            })
            .to(logEl, {
              ...focalStates[1]!,
              duration: dur(m_b02Settled, m_b03Settled),
            }),
        );

        timelines.push(
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                endTrigger: briefPanels[2]!,
                end: "top center",
                scrub: 1,
              },
            })
            .to(watchEl, {
              x: 0,
              y: 0,
              scale: 1,
              duration: dur(0, m_heroExit),
            })
            .to(watchEl, {
              x: 0,
              y: 0,
              scale: 1,
              duration: dur(m_heroExit, m_b01Entry),
            })
            .to(watchEl, {
              autoAlpha: 0,
              duration: dur(m_b01Entry, m_b01Settled),
            })
            .to(watchEl, {
              autoAlpha: 0,
              duration: dur(m_b01Settled, m_b03Entry),
            })
            .to(watchEl, {
              ...focalStates[2]!,
              autoAlpha: 1,
              duration: dur(m_b03Entry, m_b03Settled),
            }),
        );
      };

      build();
      ScrollTrigger.addEventListener("refreshInit", build);

      let cancelled = false;
      const refresh = () => {
        if (!cancelled) ScrollTrigger.refresh();
      };
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(refresh);
      }
      const settleTimer = window.setTimeout(refresh, 1000);

      return () => {
        cancelled = true;
        window.clearTimeout(settleTimer);
        ScrollTrigger.removeEventListener("refreshInit", build);
        timelines.forEach((tl) => tl.kill());
      };
    },
    { scope: sceneRef, dependencies: [ready, isDesktop] },
  );

  return (
    <div ref={sceneRef} className="relative overflow-x-hidden">
      <motion.section
        initial="initial"
        animate="animate"
        variants={heroContainer}
        className="js-hero-section hero-padding relative overflow-hidden"
      >
        <DottedBackdrop opacity={0.04} />

        <div className="container">
          <motion.div
            variants={fadeUp}
            className="text-meta text-muted-foreground flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-4"
          >
            <span className="text-foreground flex items-center gap-2">
              <span className="bg-foreground size-1.5 animate-pulse rounded-full" />
              ELIVATE WALLET · 03 IN VIEW
            </span>
            <span className="hidden md:inline">
              · BALANCES · INCOME · WITHDRAWALS
            </span>
            <span className="ml-auto">FEATURES</span>
          </motion.div>

          <div className="mt-10 grid gap-4 md:mt-14 md:gap-12 lg:mt-20 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-24">
            <motion.div variants={fadeUp} className="flex flex-col">
              <h1 className="text-5xl leading-[1.05] tracking-tight text-balance md:text-7xl md:leading-[0.95] lg:text-8xl">
                <span className="block">Balances.</span>
                <span className="block">Income.</span>
                <em className="text-muted-foreground block">Withdrawals.</em>
              </h1>
              <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed md:mt-8 md:text-lg">
                See member balances and transaction history.<br />
                Record income and manage withdrawal requests.<br />
                Keep the record clear across your network.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
                <Button size="lg">Get started</Button>
                <Button variant="ghost" size="lg">
                  See all features
                </Button>
              </div>
            </motion.div>

            <div className="relative mx-auto h-[400px] w-full max-w-[600px] lg:h-[560px]">
              <div
                aria-hidden
                className="from-foreground/10 pointer-events-none absolute inset-0 -z-10 bg-radial-[ellipse_at_50%_50%] to-transparent to-65% blur-3xl"
              />

              <div
                ref={consoleHeroSlot}
                className="invisible absolute top-0 left-0 w-full origin-top-left scale-[0.7] lg:scale-[0.8]"
              >
                <Console />
              </div>
              <div
                ref={logHeroSlot}
                className="invisible absolute top-10 right-0 w-full origin-top-right scale-[0.7] lg:top-13 lg:-right-13"
              >
                <LogStream />
              </div>
              <div
                ref={watchHeroSlot}
                className="invisible absolute top-3/5 left-1/2 origin-center -translate-x-1/2 -translate-y-1/2 scale-50 lg:scale-[0.6]"
              >
                <WatchAlert />
              </div>
            </div>
          </div>

          <motion.dl
            variants={fadeUp}
            className="mt-10 grid grid-cols-2 border-y md:mt-14 md:grid-cols-4 lg:mt-20"
          >
            {FACTS.map((f, i) => (
              <div
                key={f.label}
                className={cn(
                  "py-6 not-first:border-l md:py-10",
                  i < 2 && "border-b md:border-b-0",
                )}
              >
                <dt className="text-meta text-muted-foreground px-4 md:px-6">
                  {f.label}
                </dt>
                <dd className="font-display mt-3 px-4 text-5xl leading-none tracking-tighter md:px-6 md:text-6xl lg:text-7xl">
                  {f.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.section>

      <section className="section-padding relative">
        <DottedBackdrop opacity={0.03} />

        <div className="container">
          <div className="text-meta text-muted-foreground flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-4">
            <span className="text-foreground flex items-center gap-2">
              <span className="bg-foreground size-1.5 animate-pulse rounded-full" />
              § STAGE · 03 CORE VIEWS
            </span>
            <span className="hidden md:inline">
              · BALANCES · TRANSACTIONS · WITHDRAWALS
            </span>
            <span className="ml-auto">FIG. 02 · CORE VIEWS</span>
          </div>

          <div className="mt-10 grid grid-cols-1 items-end gap-6 md:mt-14 md:grid-cols-[1fr_auto] md:gap-16 lg:mt-20">
            <h2 className="text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
              Three money flows. {" "}
              <em className="text-muted-foreground">One clear record.</em>
            </h2>
            <span className="text-meta text-muted-foreground hidden text-right md:block">
              FIG. 02 ·<br />
              CORE VIEWS
            </span>
          </div>

          {ready && !isDesktop ? (
            <ul className="mt-10 flex flex-col gap-12">
              {SURFACES.map((s, i) => (
                <li
                  key={s.num}
                  className="flex flex-col gap-6 border-t pt-8 first:border-t-0 first:pt-0"
                >
                  <div
                    ref={i === 0 ? consoleRef : i === 1 ? logRef : watchRef}
                    className={cn(
                      "mx-auto w-full origin-top",
                      i === 0 && "max-w-[440px]",
                      i === 1 && "max-w-[360px]",
                      i === 2 && "max-w-[287px]",
                    )}
                  >
                    {i === 0 ? (
                      <Console />
                    ) : i === 1 ? (
                      <LogStream />
                    ) : (
                      <WatchAlert />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="text-meta text-muted-foreground flex items-center gap-2">
                      <span className="font-display text-foreground text-base tracking-tight">
                        № {s.num}
                      </span>
                      <span className="bg-foreground/15 h-px flex-1" />
                      <span>{s.role}</span>
                    </div>
                    <div className="font-display mt-3 text-2xl leading-tight tracking-tight">
                      {s.title}
                    </div>
                    <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                      {s.caption}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <div className="relative mt-14 grid grid-cols-3 items-center gap-8 lg:mt-20 lg:gap-16">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2"
                >
                  <div className="bg-foreground/5 absolute inset-x-0 top-1/2 h-px -translate-y-1/2" />
                  <svg
                    className="text-foreground/10 block h-2 w-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <pattern
                        id="stage-ticks"
                        x="0"
                        y="0"
                        width="32"
                        height="8"
                        patternUnits="userSpaceOnUse"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="8"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#stage-ticks)" />
                  </svg>
                </div>
                <div
                  ref={consoleRef}
                  className="mx-auto w-full max-w-[440px] origin-top"
                >
                  <Console />
                </div>
                <div
                  ref={logRef}
                  className="mx-auto w-full max-w-[348px] origin-top"
                >
                  <LogStream />
                </div>
                <div
                  ref={watchRef}
                  className="mx-auto w-full max-w-[327px] origin-top"
                >
                  <WatchAlert />
                </div>
              </div>

              <div className="mt-14 grid grid-cols-3 gap-12 border-t pt-6 lg:mt-20 lg:gap-16">
                {SURFACES.map((s) => (
                  <div key={s.num} className="flex flex-col">
                    <div className="text-meta text-muted-foreground flex items-center gap-2">
                      <span className="font-display text-foreground text-base tracking-tight">
                        № {s.num}
                      </span>
                      <span className="bg-foreground/15 h-px flex-1" />
                      <span>{s.role}</span>
                    </div>
                    <div className="font-display mt-3 text-2xl leading-tight tracking-tight md:text-3xl">
                      {s.title}
                    </div>
                    <p className="text-muted-foreground mt-3 max-w-xs text-base leading-relaxed md:text-lg">
                      {s.caption}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="relative">
        {SPECIMENS.map((s, i) => (
          <SpecimenPanel
            key={s.num}
            s={s}
            slotRef={
              i === 0
                ? consoleFocalSlot
                : i === 1
                  ? logFocalSlot
                  : watchFocalSlot
            }
            mockupKind={i === 0 ? "console" : i === 1 ? "log" : "watch"}
          />
        ))}
      </section>
    </div>
  );
};

const SpecimenPanel = ({
  s,
  slotRef,
  mockupKind,
}: {
  s: Specimen;
  slotRef: React.RefObject<HTMLDivElement | null>;
  mockupKind: "console" | "log" | "watch";
}) => (
  <div
    id={`brief-${mockupKind}`}
    className="js-brief-panel relative scroll-mt-24"
  >
    <DottedBackdrop opacity={0.025} />
    <div className="section-padding container flex h-full flex-col">
      <div className="mx-auto flex w-full flex-1 flex-col">
        <div className="js-specimen-copy">
          <div className="text-meta text-muted-foreground flex items-center gap-2">
            <span className="font-display text-foreground text-base tracking-tight">
              № {s.num}
            </span>
            <span className="bg-foreground/15 h-px flex-1" />
            <span>{s.role}</span>
          </div>
          <h2 className="mt-6 text-4xl leading-[0.9] tracking-tighter text-balance md:mt-8 md:text-6xl lg:text-[8rem]">
            {s.headlineLead}{" "}
            <em className="text-muted-foreground">{s.headlineTail}</em>
          </h2>
        </div>

        <div className="mt-12 grid flex-1 gap-12 md:mt-16 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-24">
          <div className="js-specimen-copy order-2 flex flex-col lg:order-1">
            <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
              {s.body}
            </p>

            <ul className="mt-8 space-y-3 border-t pt-6 md:mt-10">
              {s.bullets.map((b) => (
                <li
                  key={b}
                  className="text-meta text-muted-foreground flex items-start gap-3"
                >
                  <span className="bg-foreground mt-1.5 size-1 shrink-0 rounded-full" />
                  <span className="leading-relaxed tracking-normal normal-case">
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 inline-flex items-baseline gap-3 self-start border-t pt-4 md:mt-10">
              <span className="font-display text-4xl leading-none tracking-tight tabular-nums md:text-5xl">
                {s.metric.value}
              </span>
              <span className="text-meta text-muted-foreground">
                {s.metric.label}
              </span>
            </div>
          </div>

          <div className="relative order-1 flex items-center justify-center lg:order-2">
            <div
              aria-hidden
              className="from-foreground/10 pointer-events-none absolute inset-0 -z-10 bg-radial-[ellipse_at_50%_50%] to-transparent to-65% blur-3xl"
            />
            <div aria-hidden className="w-full">
              <div
                ref={slotRef}
                className={cn("invisible mx-auto", FOCAL_WIDTHS[mockupKind])}
              >
                <FocalMockup kind={mockupKind} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FOCAL_WIDTHS = {
  console: "w-full max-w-[420px] lg:max-w-[520px]",
  log: "w-full max-w-[360px] lg:max-w-[420px]",
  watch: "w-full max-w-[287px] lg:max-w-[380px]",
} as const;

const FocalMockup = ({ kind }: { kind: "console" | "log" | "watch" }) =>
  kind === "console" ? (
    <Console />
  ) : kind === "log" ? (
    <LogStream />
  ) : (
    <WatchAlert />
  );

export default ProductScene;