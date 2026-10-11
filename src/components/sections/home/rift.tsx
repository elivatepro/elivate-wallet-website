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

const ACTIVITY = [
  {
    at: "09:42",
    type: "Income",
    member: "Ada O.",
    team: "Delta",
    amount: "+₦185K",
    status: "Recorded",
  },
  {
    at: "09:36",
    type: "Withdrawal",
    member: "Daniel K.",
    team: "Alpha",
    amount: "₦75K",
    status: "Pending",
  },
  {
    at: "09:15",
    type: "Expense",
    member: "Sarah E.",
    team: "Beta",
    amount: "−₦28.5K",
    status: "Recorded",
  },
  {
    at: "08:58",
    type: "Withdrawal",
    member: "Michael A.",
    team: "Gamma",
    amount: "₦120K",
    status: "Completed",
  },
  {
    at: "08:44",
    type: "Income",
    member: "Tolu B.",
    team: "Alpha",
    amount: "+₦95K",
    status: "Recorded",
  },
  {
    at: "08:21",
    type: "Withdrawal",
    member: "Grace N.",
    team: "Delta",
    amount: "₦60K",
    status: "Approved",
  },
  {
    at: "08:09",
    type: "Income",
    member: "Chidi E.",
    team: "Beta",
    amount: "+₦210K",
    status: "Recorded",
  },
  {
    at: "07:52",
    type: "Expense",
    member: "Mariam A.",
    team: "Gamma",
    amount: "−₦18K",
    status: "Recorded",
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
            Financial activity
          </span>
          <span className="hidden md:inline">
            View &middot; <DriftReadout value={driftPct} />
          </span>
          <span className="flex-1 text-end">Illustrative product data</span>
        </div>

        <div className="relative mt-10 md:mt-14 lg:mt-20">
          <div className="flex flex-col gap-4 md:gap-8 lg:gap-12">
            <motion.div
              style={{ y: leftShift }}
              className="will-change-transform"
            >
              <p className="text-meta opacity-60">Financial activity</p>
              <h2 className="mt-4 text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
                what <em className="opacity-60">changed</em>
              </h2>
            </motion.div>

            <div className="relative h-12 md:h-40">
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
                  {[...ACTIVITY, ...ACTIVITY].map((entry, i) => (
                    <li
                      key={`${entry.at}-${i}`}
                      className="border-foreground/30 bg-card/80 w-36 shrink-0 rounded border px-3 py-2 backdrop-blur"
                    >
                      <div className="text-meta-xs flex items-center justify-between opacity-60">
                        <span>{entry.at}</span>
                        <span>{entry.type}</span>
                      </div>
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="font-display text-lg leading-none tracking-tighter whitespace-nowrap">
                          {entry.amount}
                        </span>
                        <span className="text-meta-xs opacity-70">
                          {entry.member}
                        </span>
                      </div>
                    </li>
                  ))}
                </motion.ul>
              </div>
            </div>

            <motion.div
              style={{ y: rightShift }}
              className="text-right will-change-transform"
            >
              <p className="text-meta opacity-60">Elivate Wallet</p>
              <h2 className="mt-4 text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
                <em className="opacity-60">what</em> remains
              </h2>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-8 md:mt-24 md:grid-cols-[1fr_1.2fr]">
          <p className="text-meta opacity-60">How it works &middot; 05</p>
          <p className="text-muted-foreground max-w-xl text-base leading-relaxed md:text-lg">
            Every balance change leaves a record. See who it belongs to, what
            changed, when it happened, and what still needs your attention.
          </p>
        </div>

        <div className="mt-16 md:mt-20 [&_[data-slot=table-container]]:overflow-x-clip">
          <Table className="border-t">
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Team</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="w-full">Member</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ACTIVITY.map((entry, i) => (
                <motion.tr
                  key={`${entry.at}-${entry.member}`}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.4,
                    delay: 0.04 * i,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border-b font-mono text-xs"
                >
                  <TableCell className="whitespace-nowrap opacity-70">
                    {entry.at}
                  </TableCell>
                  <TableCell className="whitespace-nowrap opacity-70">
                    {entry.type}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {entry.team}
                  </TableCell>
                  <TableCell className="font-display text-lg leading-none tracking-tighter whitespace-nowrap normal-case">
                    {entry.amount}
                  </TableCell>
                  <TableCell className="normal-case">{entry.member}</TableCell>
                  <TableCell className="text-right tracking-widest whitespace-nowrap uppercase opacity-70">
                    {entry.status}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-meta-xs mt-10 flex flex-wrap items-center gap-3 border-t pt-4 opacity-70 md:mt-14 lg:mt-20">
          <span className="flex-1">Organization · Team · Member</span>
          <span className="hidden md:inline">Date range · Activity type</span>
          <span className="flex-1 text-end">End of activity</span>
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

export default Rift;
