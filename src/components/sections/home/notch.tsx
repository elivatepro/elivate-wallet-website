"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { ElivateFrame } from "@/components/layout/elivate-frame";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

type Activity = {
  id: "balance" | "income" | "withdrawal" | "activity";
  label: string;
  value: string;
};

const ACTIVITIES: Activity[] = [
  { id: "balance", label: "Balance", value: "AT A GLANCE" },
  { id: "income", label: "Income", value: "RECENTLY RECORDED" },
  { id: "withdrawal", label: "Withdrawal", value: "REQUEST STATUS" },
  { id: "activity", label: "Activity", value: "RECENT TRANSACTIONS" },
];

const CYCLE_MS = 4400;

const Notch = () => {
  const [i, setI] = useState(0);
  const [hovered, setHovered] = useState<Activity["id"] | null>(null);
  const reduced = useReducedMotion();
  const active = ACTIVITIES[i];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (reduced) return;
    timerRef.current = setInterval(
      () => setI((v) => (v + 1) % ACTIVITIES.length),
      CYCLE_MS,
    );
  }, [reduced]);

  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restartTimer]);

  const handleValueChange = (v: string) => {
    const next = ACTIVITIES.findIndex((a) => a.id === v);
    if (next === -1) return;
    setI(next);
    restartTimer();
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="section-padding container"
    >
      <ElivateFrame borderWidth={12} radius={0}>
        <div className="mx-auto max-w-5xl px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-24">
          <motion.div
            variants={fadeUp}
            className="mx-auto mb-10 max-w-3xl text-center md:mb-14 lg:mb-20"
          >
            <span className="text-meta text-muted-foreground inline-flex items-center gap-2">
              <span className="bg-foreground inline-block size-1.5 animate-pulse rounded-full" />
              § MOBILE ACCESS · PWA · MEMBER VIEW
            </span>
            <h2 className="mt-3 text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
              Your members know{" "}
              <em className="text-muted-foreground">where they stand.</em>
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-16"
          >
            <aside className="flex flex-col gap-5 lg:order-2">
              <span className="text-meta text-muted-foreground">NOW SHOWING</span>
              <h3 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
                Four essentials, <em className="text-muted-foreground">one mobile view.</em>
              </h3>

              <Tabs
                value={active.id}
                onValueChange={handleValueChange}
                orientation="vertical"
                className="mt-2 gap-0"
              >
                <TabsList
                  variant="line"
                  onMouseLeave={() => setHovered(null)}
                  className="h-auto w-full flex-col gap-1 bg-transparent p-0"
                >
                  {ACTIVITIES.map((a, idx) => (
                    <TabsTrigger
                      key={a.id}
                      value={a.id}
                      onMouseEnter={() => setHovered(a.id)}
                      onFocus={() => setHovered(a.id)}
                      onBlur={() => setHovered(null)}
                      className="group/trigger text-foreground/70 group-data-[state=active]/trigger:!border-border group-data-[state=active]/trigger:!bg-muted data-[state=active]:!border-border data-[state=active]:!bg-muted data-[state=active]:text-foreground relative !h-auto w-full !flex-none !items-baseline !justify-start gap-3 !border border-transparent !bg-transparent px-3 py-3 text-left text-base !font-normal whitespace-normal transition-colors after:hidden"
                    >
                      {hovered === a.id && (
                        <motion.span
                          layoutId="mobile-tab-hover"
                          aria-hidden
                          className="ring-foreground/15 pointer-events-none absolute inset-0 ring-1"
                          transition={{ layout: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } }}
                        />
                      )}
                      <span
                        className={cn(
                          "relative mt-1 size-1.5 shrink-0 rounded-full transition-colors",
                          idx === i ? "bg-foreground" : "bg-muted-foreground/50",
                        )}
                      />
                      <span className="text-meta-xs text-muted-foreground relative">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="relative flex-1">
                        <span className="font-display text-foreground block text-xl leading-none tracking-tighter">
                          {a.label}
                        </span>
                        <span className="text-meta text-muted-foreground mt-1 block">
                          {a.value}
                        </span>
                      </span>
                      {idx === i && (
                        <motion.span
                          layoutId="mobile-indicator"
                          className="text-meta-xs text-foreground relative"
                        >
                          CURRENT
                        </motion.span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <p className="text-muted-foreground mt-4 border-t pt-4 text-sm leading-relaxed md:text-base">
                Balances, income, withdrawal status, and recent activity stay easy
                to check on mobile. Your members can see what changed without
                messaging you first.
              </p>
            </aside>

            <div className="lg:order-1">
              <Phone active={active} />
            </div>
          </motion.div>
        </div>
      </ElivateFrame>
    </motion.section>
  );
};

const Phone = ({ active }: { active: Activity }) => (
  <div
    className="relative mx-auto w-full max-w-[280px] select-none"
    style={{
      filter:
        "drop-shadow(0 50px 80px oklch(from var(--foreground) l c h / 0.35)) drop-shadow(0 20px 30px oklch(from var(--foreground) l c h / 0.25))",
    }}
  >
    <div className="absolute inset-[10px] z-0 overflow-hidden rounded-[36px] bg-[#f6f1e8] text-[#1c1c1e]">
      <div className="absolute inset-x-[8%] top-[9%]">
        <div className="text-[10px] font-semibold tracking-[0.12em] uppercase opacity-55">
          Elivate Wallet
        </div>
        <div className="mt-8 text-[11px] opacity-55">Your balance</div>
        <div className="font-display mt-1 text-4xl leading-none tracking-tighter">₦84,250</div>

        <div className="mt-8 border-t border-black/10 pt-5">
          <div className="flex items-center justify-between text-[10px] opacity-55">
            <span>Recent activity</span>
            <span>{active.label}</span>
          </div>
          <div className="mt-3 rounded-md border border-black/10 bg-white/55 p-3">
            <div className="text-[11px] font-semibold">+₦12,600</div>
            <div className="mt-1 text-[9px] opacity-60">Income recorded</div>
          </div>
          <div className="mt-2 rounded-md border border-black/10 bg-white/35 p-3">
            <div className="text-[10px] font-medium">Withdrawal request</div>
            <div className="mt-1 text-[9px] opacity-60">Pending review</div>
          </div>
        </div>
      </div>
    </div>

    <img
      src="/images/home/iphone-16-pro-bezel.png"
      alt="Elivate Wallet mobile view"
      width={1350}
      height={2760}
      className="pointer-events-none relative z-10 w-full select-none"
    />
  </div>
);

export default Notch;
