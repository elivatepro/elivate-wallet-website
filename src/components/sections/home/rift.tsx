"use client";

import { useEffect, useRef } from "react";

import {
  motion,
  type MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { DottedBackdrop } from "@/components/layout/dotted-backdrop";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const QUAKES = [
  {
    at: "14:02:11",
    depth: "L1",
    mag: "4.2",
    where: "checkout-api",
    note: "regression · v2.4.1",
  },
  {
    at: "14:02:42",
    depth: "L2",
    mag: "3.1",
    where: "auth-mesh",
    note: "token rotation",
  },
  {
    at: "14:03:09",
    depth: "L1",
    mag: "2.4",
    where: "cdn-edge",
    note: "cache warm",
  },
  {
    at: "14:03:55",
    depth: "L3",
    mag: "5.6",
    where: "billing-core",
    note: "paged · oncall",
  },
  {
    at: "14:04:18",
    depth: "L2",
    mag: "2.8",
    where: "search-index",
    note: "re-shard",
  },
  {
    at: "14:04:47",
    depth: "L1",
    mag: "1.9",
    where: "webhooks",
    note: "retry burst",
  },
  {
    at: "14:05:20",
    depth: "L2",
    mag: "3.4",
    where: "billing-core",
    note: "recovered",
  },
  {
    at: "14:05:51",
    depth: "L1",
    mag: "2.1",
    where: "search-index",
    note: "hot",
  },
];

const Rift = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 90,
    mass: 0.7,
  });

  const open = useTransform(smooth, [0.1, 0.45, 0.65, 0.95], [0, 1, 1, 0]);
  const leftShift = useTransform(open, [0, 1], ["0vh", "-3vh"]);
  const rightShift = useTransform(open, [0, 1], ["0vh", "3vh"]);
  const reel = useTransform(smooth, [0.1, 0.95], ["0%", "-50%"]);
  const driftPct = useTransform(open, (v) => `${(v * 100).toFixed(0)}%`);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden">
      {/* No -z-10 — section uses `isolate`, the next siblings paint above
          via natural document order. */}
      <DottedBackdrop opacity={0.06} className="z-auto" />
      <span
        aria-hidden
        className="bg-foreground/20 absolute inset-x-0 top-0 h-px"
      />
      <span
        aria-hidden
        className="bg-foreground/20 absolute inset-x-0 bottom-0 h-px"
      />

      <div className="section-padding relative container">
        <div className="text-meta flex items-center border-b pb-4">
          <span className="flex flex-1 items-center gap-2">
            <span className="bg-background inline-block size-1.5 animate-pulse rounded-full" />
            8 quakes &middot; 14:02&ndash;14:05 UTC
          </span>
          <span className="hidden md:inline">
            Drift &middot; <DriftReadout value={driftPct} />
          </span>
          <span className="flex-1 text-end">Peak L3 &middot; 5.6 mag</span>
        </div>

        <div className="relative mt-10 md:mt-14 lg:mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 md:gap-8 lg:gap-12">
            <motion.div
              style={{ y: leftShift }}
              className="will-change-transform sm:shrink-0"
            >
              <p className="text-meta opacity-60">Your stack</p>
              <h2 className="mt-4 text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
                What <em className="opacity-60">failed</em>
              </h2>
            </motion.div>

            <div className="relative h-12 sm:flex-1 sm:self-center md:h-40">
              <svg
                aria-hidden
                viewBox="0 0 600 40"
                preserveAspectRatio="none"
                className="text-foreground/60 absolute inset-x-0 top-1/2 h-[40px] w-full -translate-y-1/2"
              >
                <motion.path
                  d="M0,20 L30,22 L55,17 L80,24 L110,16 L140,22 L170,15 L200,23 L230,17 L260,24 L290,16 L320,22 L350,15 L380,23 L410,17 L440,24 L470,16 L500,22 L530,15 L560,23 L600,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>

              <div className="pointer-events-none absolute inset-x-4 top-1/2 hidden h-40 -translate-y-1/2 overflow-hidden md:block">
                <motion.ul style={{ x: reel }} className="flex gap-3">
                  {[...QUAKES, ...QUAKES].map((q, i) => (
                    <li
                      key={`${q.at}-${i}`}
                      className="border-foreground/30 bg-card/80 w-36 shrink-0 rounded border px-3 py-2 backdrop-blur"
                    >
                      <div className="text-meta-xs flex items-center justify-between opacity-60">
                        <span>{q.at}</span>
                        <span>{q.depth}</span>
                      </div>
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="font-display text-lg leading-none tracking-tighter">
                          {q.mag}
                        </span>
                        <span className="text-meta-xs opacity-70">
                          {q.where}
                        </span>
                      </div>
                    </li>
                  ))}
                </motion.ul>
              </div>
            </div>

            <motion.div
              style={{ y: rightShift }}
              className="text-right will-change-transform sm:shrink-0"
            >
              <p className="text-meta opacity-60">Elivate</p>
              <h2 className="mt-4 text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
                <em className="opacity-60">what</em> held
              </h2>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-8 md:mt-24 md:grid-cols-[1fr_1.2fr]">
          <p className="text-meta opacity-60">How it works &middot; 00</p>
          <p className="text-muted-foreground max-w-xl text-base leading-relaxed md:text-lg">
            Every incident starts as a gap between what the system promised and
            what actually happened. Elivate keeps that gap visible and
            annotated &mdash; a live feed of every disruption &mdash; until
            on-call resolves it for good.
          </p>
        </div>

        <div className="mt-16 md:mt-20 [&_[data-slot=table-container]]:overflow-x-clip">
          <Table className="border-t">
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Depth</TableHead>
                <TableHead className="hidden md:table-cell">Shape</TableHead>
                <TableHead>Mag</TableHead>
                <TableHead className="w-full">Where</TableHead>
                <TableHead className="text-right">Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {QUAKES.map((q, i) => (
                <motion.tr
                  key={q.at}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.4,
                    delay: 0.04 * i,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    "border-b font-mono text-xs",
                    Number(q.mag) >= 5 && "bg-foreground/[0.03]",
                  )}
                >
                  <TableCell className="whitespace-nowrap opacity-70">
                    {q.at}
                  </TableCell>
                  <TableCell className="whitespace-nowrap opacity-70">
                    {q.depth}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <QuakeBlip
                      mag={Number(q.mag)}
                      depth={q.depth as "L1" | "L2" | "L3"}
                    />
                  </TableCell>
                  <TableCell className="font-display text-lg leading-none tracking-tighter whitespace-nowrap normal-case">
                    {q.mag}
                  </TableCell>
                  <TableCell className="normal-case">{q.where}</TableCell>
                  <TableCell className="text-right tracking-widest whitespace-nowrap uppercase opacity-70">
                    {q.note}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-meta-xs mt-10 flex flex-wrap items-center gap-3 border-t pt-4 opacity-70 md:mt-14 lg:mt-20">
          <span className="flex-1">Scroll drives drift</span>
          <span className="hidden md:inline">Rift seals on exit</span>
          <span className="flex-1 text-end">End of tape</span>
        </div>
      </div>
    </section>
  );
};

const DriftReadout = ({ value }: { value: MotionValue<string> }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const unsub = value.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return () => unsub();
  }, [value]);
  return <span ref={ref}>0%</span>;
};

const QuakeBlip = ({
  mag,
  depth,
}: {
  mag: number;
  depth: "L1" | "L2" | "L3";
}) => {
  const BASE = 14;
  const h = mag * 2.0;
  const isL3 = depth === "L3";
  const noise = (x: number) =>
    Math.sin(x * 0.45) * 0.5 + Math.sin(x * 0.83) * 0.35;

  const segs: string[] = [];
  for (let x = 0; x <= 28; x += 3) {
    segs.push(
      `${segs.length === 0 ? "M" : "L"}${x} ${(BASE + noise(x)).toFixed(2)}`,
    );
  }
  segs.push(`L32 ${(BASE - h * 0.2).toFixed(2)}`);
  segs.push(`L36 ${(BASE - h * 0.65).toFixed(2)}`);
  segs.push(`L40 ${(BASE - h).toFixed(2)}`);
  segs.push(`L43 ${(BASE - h * 0.4).toFixed(2)}`);
  segs.push(`L46 ${(BASE + h * 0.15).toFixed(2)}`);
  segs.push(`L49 ${(BASE - h * 0.05).toFixed(2)}`);
  for (let x = 53; x <= 80; x += 3) {
    segs.push(`L${x} ${(BASE + noise(x)).toFixed(2)}`);
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 80 28"
      preserveAspectRatio="none"
      className={cn(
        "h-6 w-20",
        isL3
          ? "text-foreground"
          : depth === "L2"
            ? "text-foreground/75"
            : "text-foreground/55",
      )}
    >
      <line
        x1="0"
        y1={BASE}
        x2="80"
        y2={BASE}
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="1 2"
        vectorEffect="non-scaling-stroke"
        opacity={0.3}
      />
      <path
        d={segs.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth={isL3 ? "1.4" : "1"}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default Rift;
