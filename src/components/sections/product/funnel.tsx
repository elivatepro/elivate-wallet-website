"use client";

import { useMemo, useState } from "react";

import { motion, type Variants } from "motion/react";

import { FunnelChart } from "@/components/charts/funnel-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
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

type Stage = {
  num: string;
  count: string;
  label: string;
  ratio: string;
  hint: string;
  visual: number;
};

const HEADER_LEFT = "§ SCOPE · NETWORK → ENTRY";
const HEADER_MIDDLE = "FIVE LEVELS · ONE RECORD";
const HEADER_RIGHT = "ELIVATE · WALLET-001";

const HEADLINE_LEAD = "See the whole network.";
const HEADLINE_TAIL = "Trace one exact entry.";
const SUB =
  "Start with the wider picture, then narrow by team, member, balance, and transaction until you reach the record you need.";

const STAGES: readonly Stage[] = [
  {
    num: "01",
    count: "ALL",
    label: "Network",
    ratio: "ALL",
    hint: "See financial activity across your organization.",
    visual: 1.0,
  },
  {
    num: "02",
    count: "1 TEAM",
    label: "Team",
    ratio: "1 TEAM",
    hint: "Narrow the view to a specific team or office.",
    visual: 0.72,
  },
  {
    num: "03",
    count: "1 MEMBER",
    label: "Member",
    ratio: "1 MEMBER",
    hint: "Open one member’s balance and financial history.",
    visual: 0.5,
  },
  {
    num: "04",
    count: "1 BALANCE",
    label: "Balance",
    ratio: "1 BALANCE",
    hint: "See the entries behind their current recorded balance.",
    visual: 0.3,
  },
  {
    num: "05",
    count: "1 ENTRY",
    label: "Transaction",
    ratio: "1 ENTRY",
    hint: "Inspect the exact income, expense, adjustment, or withdrawal entry.",
    visual: 0.12,
  },
] as const;

const RATIO_BY_PCT = new Map<number, string>([
  [100, "ALL"],
  [72, "1 TEAM"],
  [50, "1 MEMBER"],
  [30, "1 BALANCE"],
  [12, "1 ENTRY"],
]);

const formatPercentage = (pct: number) =>
  RATIO_BY_PCT.get(Math.round(pct)) ?? "";

const ProductFunnel = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const { isAtLeast } = useMediaQuery();
  const isHorizontal = isAtLeast("md");

  const focused = hovered ?? selected;
  const focusedStage = focused !== null ? STAGES[focused]! : null;

  const chartData = useMemo(
    () =>
      STAGES.map((s) => ({
        label: s.label,
        value: Math.round(s.visual * 100),
        displayValue: s.count,
      })),
    [],
  );

  const toggleSelected = (i: number) => {
    setSelected((prev) => (prev === i ? null : i));
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="section-padding container"
    >
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 lg:mb-20">
        <h2 className="text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
          {HEADLINE_LEAD}{" "}
          <em className="text-muted-foreground">{HEADLINE_TAIL}</em>
        </h2>
        <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed md:mt-8 md:text-lg">
          {SUB}
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="bg-card/40 overflow-hidden border shadow-2xl"
      >
        <div className="text-meta border-foreground/10 text-muted-foreground flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b px-4 py-3">
          <span className="flex items-center gap-1.5">
            <span className="bg-muted-foreground/30 size-2 rounded-full" />
            <span className="bg-muted-foreground/30 size-2 rounded-full" />
            <span className="bg-muted-foreground/30 size-2 rounded-full" />
          </span>
          <span className="text-foreground">{HEADER_LEFT}</span>
          <span className="hidden md:inline">· {HEADER_MIDDLE}</span>
          <span className="ml-auto">{HEADER_RIGHT}</span>
        </div>

        <div className="border-foreground/10 bg-background/30 border-b p-6 md:p-10">
          <FunnelChart
            data={chartData}
            color="var(--foreground)"
            layers={4}
            gap={6}
            staggerDelay={0.1}
            showLabels={isHorizontal}
            formatPercentage={formatPercentage}
            hoveredIndex={hovered}
            onHoverChange={setHovered}
          />
        </div>

        <dl className="border-foreground/10 grid gap-6 border-b p-4 md:grid-cols-3 md:p-6">
          {focusedStage ? (
            <>
              <div>
                <dt className="text-meta text-muted-foreground">Level</dt>
                <dd className="font-display mt-2 text-2xl leading-none tracking-tight md:text-3xl">
                  № {focusedStage.num} · {focusedStage.label}
                </dd>
              </div>
              <div>
                <dt className="text-meta text-muted-foreground">Scope</dt>
                <dd className="font-display mt-2 text-2xl leading-none tracking-tight tabular-nums md:text-3xl">
                  {focusedStage.count}
                </dd>
              </div>
              <div>
                <dt className="text-meta text-muted-foreground">Note</dt>
                <dd className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {focusedStage.hint}
                </dd>
              </div>
            </>
          ) : (
            <>
              <div>
                <dt className="text-meta text-muted-foreground">Levels</dt>
                <dd className="font-display mt-2 text-2xl leading-none tracking-tight tabular-nums md:text-3xl">
                  5
                </dd>
              </div>
              <div>
                <dt className="text-meta text-muted-foreground">Range</dt>
                <dd className="font-display mt-2 text-2xl leading-none tracking-tight md:text-3xl">
                  Network → Entry
                </dd>
              </div>
              <div>
                <dt className="text-meta text-muted-foreground">Inspect</dt>
                <dd className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Hover or click any level above.
                </dd>
              </div>
            </>
          )}
        </dl>

        <div className="flex flex-wrap items-center justify-center gap-2 p-4">
          {STAGES.map((s, i) => {
            const isSelected = i === selected;
            return (
              <button
                key={s.label}
                type="button"
                onClick={() => toggleSelected(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "text-meta flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/20 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isSelected ? "bg-background" : "bg-muted-foreground/40",
                  )}
                />
                {s.label}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ProductFunnel;
