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
  // Visual height factor (0–1). Drives the chart's segment scale via synthetic value.
  visual: number;
};

const HEADER_LEFT = "§ Mesh · declared → pinned";
const HEADER_MIDDLE = "Right now · across 41 teams";
const HEADER_RIGHT = "2026.04 · MRD-mesh-001";

const HEADLINE_LEAD = "12.4k services in the mesh.";
const HEADLINE_TAIL = "620 with eyes on them.";
const SUB =
  "Every service walks the same five rings. Only the last one has a human paying attention right now.";
const COUNT_LABEL = "now";

const STAGES: readonly Stage[] = [
  {
    num: "01",
    count: "12.4k",
    label: "Declared",
    ratio: "ALL",
    hint: "Registered with a name, an owner, and a heartbeat.",
    visual: 1.0,
  },
  {
    num: "02",
    count: "6.8k",
    label: "Reporting",
    ratio: "55%",
    hint: "Emitting in the last minute — logs, metrics, or traces.",
    visual: 0.55,
  },
  {
    num: "03",
    count: "3.2k",
    label: "SLO-tracked",
    ratio: "26%",
    hint: "An SLO defined, a budget being measured.",
    visual: 0.26,
  },
  {
    num: "04",
    count: "1.5k",
    label: "At risk",
    ratio: "12%",
    hint: "Burning budget faster than the window refills.",
    visual: 0.12,
  },
  {
    num: "05",
    count: "620",
    label: "Pinned",
    ratio: "5%",
    hint: "On someone's console right now. Eyes on it.",
    visual: 0.05,
  },
] as const;

const RATIO_BY_PCT = new Map<number, string>([
  [100, "ALL"],
  [55, "55%"],
  [26, "26%"],
  [12, "12%"],
  [5, "5%"],
]);

const formatPercentage = (pct: number) =>
  RATIO_BY_PCT.get(Math.round(pct)) ?? `${Math.round(pct)}%`;

const ProductFunnel = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const { isAtLeast } = useMediaQuery();
  const isHorizontal = isAtLeast("md");

  const focused = hovered ?? selected;
  const focusedStage = focused !== null ? STAGES[focused]! : null;

  const firstStage = STAGES[0]!;
  const lastStage = STAGES[STAGES.length - 1]!;

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
                <dt className="text-meta text-muted-foreground">Ring</dt>
                <dd className="font-display mt-2 text-2xl leading-none tracking-tight md:text-3xl">
                  № {focusedStage.num} · {focusedStage.label}
                </dd>
              </div>
              <div>
                <dt className="text-meta text-muted-foreground">
                  Services · {COUNT_LABEL}
                </dt>
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
                <dt className="text-meta text-muted-foreground">Rings</dt>
                <dd className="font-display mt-2 text-2xl leading-none tracking-tight tabular-nums md:text-3xl">
                  {STAGES.length}
                </dd>
              </div>
              <div>
                <dt className="text-meta text-muted-foreground">Range</dt>
                <dd className="font-display mt-2 text-2xl leading-none tracking-tight tabular-nums md:text-3xl">
                  {firstStage.count} → {lastStage.count}
                </dd>
              </div>
              <div>
                <dt className="text-meta text-muted-foreground">Inspect</dt>
                <dd className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Hover or click any ring above.
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
