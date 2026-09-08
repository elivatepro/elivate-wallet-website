"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";

import { MeridianFrame } from "@/components/layout/meridian-frame";
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
  id: "deploy" | "build" | "trip" | "page";
  slot: "left" | "right";
  label: string;
  value: string;
  accent?: "accent" | "default";
  compact: ReactNode;
  expanded: ReactNode;
};

const ACTIVITIES: Activity[] = [
  {
    id: "deploy",
    slot: "left",
    label: "Deploy",
    value: "us-east · canary",
    compact: <DeployIcon />,
    expanded: <DeployExpanded />,
  },
  {
    id: "build",
    slot: "right",
    label: "Build",
    value: "meridian#41b2",
    compact: <BuildIcon />,
    expanded: <BuildExpanded />,
  },
  {
    id: "trip",
    slot: "left",
    label: "ETA",
    value: "8 min · home",
    compact: <TripIcon />,
    expanded: <TripExpanded />,
  },
  {
    id: "page",
    slot: "right",
    label: "Page",
    value: "checkout-api",
    accent: "accent",
    compact: <PageIcon />,
    expanded: <PageExpanded />,
  },
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
      <MeridianFrame borderWidth={12} radius={0}>
        <div className="mx-auto max-w-5xl px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-24">
          <motion.div
            variants={fadeUp}
            className="mx-auto mb-10 max-w-3xl text-center md:mb-14 lg:mb-20"
          >
            <span className="text-meta text-muted-foreground inline-flex items-center gap-2">
              <span className="bg-foreground inline-block size-1.5 animate-pulse rounded-full" />
              § Dynamic Island &middot; iOS, iPadOS, watchOS
            </span>
            <h2 className="mt-3 text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
              The Island{" "}
              <em className="text-muted-foreground">knows what you need.</em>
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-16"
          >
            <aside className="flex flex-col gap-5 lg:order-2">
              <span className="text-meta text-muted-foreground">
                Now cycling
              </span>
              <h3 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
                <em className="text-muted-foreground">Four</em> live activities,{" "}
                <em className="text-muted-foreground">one</em> Island.
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
                      style={{ order: idx * 2 }}
                      className="group/trigger text-foreground/70 group-data-[state=active]/trigger:!border-border group-data-[state=active]/trigger:!bg-muted data-[state=active]:!border-border data-[state=active]:!bg-muted data-[state=active]:text-foreground relative !h-auto w-full !flex-none !items-baseline !justify-start gap-3 !border border-transparent !bg-transparent px-3 py-3 text-left text-base !font-normal whitespace-normal transition-colors after:hidden"
                    >
                      {hovered === a.id && (
                        <motion.span
                          layoutId="notch-tab-hover"
                          aria-hidden
                          className="ring-foreground/15 pointer-events-none absolute inset-0 ring-1"
                          transition={{
                            layout: {
                              duration: 0.3,
                              ease: [0.32, 0.72, 0, 1],
                            },
                          }}
                        />
                      )}
                      <span
                        className={cn(
                          "relative mt-1 size-1.5 shrink-0 rounded-full transition-colors",
                          idx === i
                            ? "bg-foreground"
                            : "bg-muted-foreground/50",
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
                          layoutId="notch-indicator"
                          className="text-meta-xs text-foreground relative"
                          transition={{
                            type: "spring",
                            damping: 24,
                            stiffness: 260,
                          }}
                        >
                          Live
                        </motion.span>
                      )}
                      {idx === i && !reduced && (
                        <RowTimer cycleMs={CYCLE_MS} cycleKey={i} />
                      )}
                    </TabsTrigger>
                  ))}

                  <motion.div
                    layout
                    transition={{
                      layout: {
                        duration: 0.5,
                        ease: [0.32, 0.72, 0, 1],
                      },
                    }}
                    style={{ order: i * 2 + 1 }}
                    className="w-full px-3 pt-6 pb-3 lg:hidden"
                  >
                    <Phone active={active} />
                  </motion.div>
                </TabsList>
              </Tabs>

              <p className="text-muted-foreground mt-4 border-t pt-4 text-sm leading-relaxed md:text-base">
                Deploys, builds, incidents, and commute ETA — Meridian surfaces
                them in the Dynamic Island without unlocking your phone or
                opening an app. Tap to switch, or let it cycle automatically.
              </p>
            </aside>

            <div className="hidden lg:order-1 lg:block">
              <Phone active={active} />
            </div>
          </motion.div>
        </div>
      </MeridianFrame>
    </motion.section>
  );
};

type RowTimerProps = {
  cycleMs: number;
  cycleKey: number;
};

const RowTimer = ({ cycleMs, cycleKey }: RowTimerProps) => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-0 overflow-hidden"
  >
    <motion.span
      key={cycleKey}
      className="via-foreground/10 absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{ duration: cycleMs / 1000, ease: "linear" }}
    />
  </span>
);

const Phone = ({ active }: { active: Activity }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInitial = useRef(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    if (reduced || !ref.current) return;
    ref.current.animate([{ opacity: 0.45 }, { opacity: 1 }], {
      duration: 360,
      easing: "cubic-bezier(0.32, 0.72, 0, 1)",
    });
  }, [active.id, reduced]);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[280px] select-none"
      style={{
        filter:
          "drop-shadow(0 50px 80px oklch(from var(--foreground) l c h / 0.35)) drop-shadow(0 20px 30px oklch(from var(--foreground) l c h / 0.25))",
      }}
    >
      <div className="absolute inset-[10px] z-0 overflow-hidden rounded-[36px]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 18%, #fff5e8 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 75% 85%, #f3dde2 0%, transparent 70%), linear-gradient(180deg, #faf4ea 0%, #f0e8dc 55%, #e6dccc 100%)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#1c1c1e 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        <div className="absolute inset-x-0 top-[14%] flex flex-col items-center text-[#1c1c1e]">
          <span className="text-[10px] font-medium opacity-60">
            Thursday, April 25
          </span>
          <span className="font-display mt-1 text-6xl leading-none tracking-tighter">
            9:41
          </span>
        </div>

        <div className="absolute inset-x-[6%] bottom-[6%]">
          <div className="rounded-md border border-white/60 bg-white/55 p-3 text-[#1c1c1e] shadow-[0_8px_24px_-12px_oklch(0_0_0/0.15)] backdrop-blur-xl">
            <div className="flex items-center justify-between text-[10px] text-[#1c1c1e]/55">
              <span className="flex items-center gap-1.5 font-semibold tracking-tight">
                <span className="bg-accent inline-block size-1.5 rounded-full" />
                Meridian
              </span>
              <span>now</span>
            </div>
            <p className="mt-1.5 text-[0.7rem] leading-snug">
              Watching 14 services. You&apos;ll only see what matters.
            </p>
          </div>
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[0.8%] left-1/2 h-[0.4%] w-[30%] -translate-x-1/2 rounded-full bg-[#1c1c1e]/40"
        />
      </div>

      <div className="absolute inset-x-0 top-[3.6%] z-[1] flex h-[26px] items-center justify-between px-7 text-[#1c1c1e]">
        <span className="text-[11px] leading-none font-semibold tabular-nums">
          9:41
        </span>
        <span className="flex items-center gap-[5px]">
          <WifiIcon />
          <BatteryIcon />
        </span>
      </div>

      <img
        src="/images/home/iphone-16-pro-bezel.png"
        alt=""
        width={1350}
        height={2760}
        className="pointer-events-none relative z-10 w-full select-none"
      />

      <div className="absolute top-[3.6%] left-1/2 z-20 -translate-x-1/2">
        <LayoutGroup>
          <motion.div
            layout
            transition={{
              type: "spring",
              damping: 22,
              stiffness: 280,
              mass: 0.7,
            }}
            className={cn(
              "relative flex items-center gap-1.5 rounded-full bg-black px-2 py-1.5 text-white shadow-[0_8px_24px_-8px_oklch(from_black_l_c_h_/0.8)]",
              active.accent === "accent" && "ring-accent/50 ring-2",
            )}
          >
            <motion.span
              layout
              className="flex size-3.5 shrink-0 items-center justify-center"
            >
              {active.compact}
            </motion.span>

            <motion.div layout className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{
                    duration: 0.22,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex w-[5rem] items-center justify-between gap-1 text-[0.55rem]"
                >
                  {active.expanded}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </LayoutGroup>
      </div>
    </div>
  );
};

function DeployIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" strokeDasharray="4 3" />
      <path d="M12 3v9l6 3" />
    </svg>
  );
}
function DeployExpanded() {
  return (
    <>
      <span className="truncate">us-east</span>
      <span className="flex shrink-0 items-center gap-1 text-white/85 tabular-nums">
        <span className="relative h-0.5 w-6 overflow-hidden rounded-full bg-white/20">
          <motion.span
            className="absolute inset-y-0 left-0 bg-white"
            initial={{ width: "18%" }}
            animate={{ width: "78%" }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>
        78%
      </span>
    </>
  );
}

function BuildIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 7h16v3H4zM4 14h16v3H4z" />
      <circle cx="7" cy="8.5" r="0.5" fill="currentColor" />
      <circle cx="7" cy="15.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
function BuildExpanded() {
  return (
    <>
      <span className="truncate">typecheck</span>
      <span className="flex shrink-0 items-center gap-0.5">
        {[0, 1, 2, 3].map((n) => (
          <motion.span
            key={n}
            className="block h-1.5 w-0.5 rounded-full bg-white/85"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{
              duration: 0.9,
              delay: n * 0.08,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
    </>
  );
}

function TripIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3l7 17-7-4-7 4z" />
    </svg>
  );
}
function TripExpanded() {
  return (
    <>
      <span className="truncate">Home · 400m</span>
      <span className="flex shrink-0 items-baseline gap-0.5 tabular-nums">
        <span className="text-[0.7rem] leading-none">8</span>
        <span className="text-[0.45rem] opacity-70">m</span>
      </span>
    </>
  );
}

function PageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-2.5" fill="currentColor">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
function PageExpanded() {
  return (
    <>
      <span className="truncate">checkout-api</span>
      <span className="flex shrink-0 items-center gap-1">
        <motion.span
          className="bg-accent block size-1 rounded-full"
          animate={{ scale: [1, 1.6, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[0.5rem]">p99</span>
      </span>
    </>
  );
}

function WifiIcon() {
  return (
    <svg
      viewBox="0 0 16 12"
      className="h-[8px] w-auto"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 2.2 C 4.6 2.2 1.7 3.6 0 5.5 L 1.5 7 C 3 5.5 5.4 4.6 8 4.6 C 10.6 4.6 13 5.5 14.5 7 L 16 5.5 C 14.3 3.6 11.4 2.2 8 2.2 Z" />
      <path d="M8 5.6 C 5.8 5.6 3.9 6.5 2.7 7.8 L 4.2 9.3 C 5.2 8.4 6.5 7.9 8 7.9 C 9.5 7.9 10.8 8.4 11.8 9.3 L 13.3 7.8 C 12.1 6.5 10.2 5.6 8 5.6 Z" />
      <circle cx="8" cy="10.5" r="1.3" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg
      viewBox="0 0 26 12"
      className="h-[9px] w-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <rect x="0.5" y="0.5" width="22" height="11" rx="2.8" opacity="0.4" />
      <rect
        x="24"
        y="4"
        width="1.5"
        height="4"
        rx="0.75"
        fill="currentColor"
        opacity="0.4"
        stroke="none"
      />
      <rect
        x="2"
        y="2"
        width="18"
        height="8"
        rx="1.5"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export default Notch;
