"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Check, Lock, Sparkles } from "lucide-react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
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

type Cycle = "monthly" | "yearly";

type TierConfig = {
  id: "lookout" | "bridge" | "atlas";
  rank: 1 | 2 | 3;
  name: string;
  monthly: number | null;
  yearly: number | null;
  upTo: number | null;
};

const TIERS: readonly TierConfig[] = [
  { id: "lookout", rank: 1, name: "Lookout", monthly: 19, yearly: 15, upTo: 5 },
  { id: "bridge", rank: 2, name: "Bridge", monthly: 49, yearly: 39, upTo: 25 },
  {
    id: "atlas",
    rank: 3,
    name: "Atlas",
    monthly: null,
    yearly: null,
    upTo: null,
  },
] as const;

type Availability = "all" | "bridge" | "atlas";

type Addon = {
  id: string;
  name: string;
  detail: string;
  category: "Retention" | "Reach" | "Hands" | "Trust";
  monthlyPrice: number;
  available: Availability;
  // Inherited (free) when on Atlas — toggle becomes "Included".
  inclusiveOnAtlas?: boolean;
  recommended?: boolean;
};

const ADDONS: readonly Addon[] = [
  {
    id: "retention-180",
    name: "Extended retention",
    detail: "180 days of hot logs · queryable from the same console",
    category: "Retention",
    monthlyPrice: 200,
    available: "all",
    recommended: true,
  },
  {
    id: "cold-archive",
    name: "Cold archive",
    detail: "365-day Parquet archive exported to your S3",
    category: "Retention",
    monthlyPrice: 80,
    available: "all",
  },
  {
    id: "region-extra",
    name: "Additional region",
    detail: "Multi-region replicated ingest · read-from-nearest",
    category: "Reach",
    monthlyPrice: 400,
    available: "bridge",
  },
  {
    id: "single-tenant",
    name: "Single-tenant region",
    detail: "Your VPC, your KMS keys, your audit trail",
    category: "Reach",
    monthlyPrice: 0,
    available: "atlas",
    inclusiveOnAtlas: true,
  },
  {
    id: "premium-support",
    name: "Premium on-call",
    detail: "Engineer-on-engineer · 15-min ack · weekend coverage",
    category: "Hands",
    monthlyPrice: 1200,
    available: "bridge",
    recommended: true,
  },
  {
    id: "rotation-engineer",
    name: "Dedicated rotation engineer",
    detail: "A named SRE who reviews runbooks every quarter",
    category: "Hands",
    monthlyPrice: 0,
    available: "atlas",
    inclusiveOnAtlas: true,
  },
  {
    id: "audit-expansion",
    name: "Audit log expansion",
    detail: "180-day signed log + S3 export · webhook-on-write",
    category: "Trust",
    monthlyPrice: 200,
    available: "bridge",
  },
  {
    id: "custom-dpa",
    name: "Custom DPA",
    detail: "Legal review and countersign · GDPR + HIPAA + SOX",
    category: "Trust",
    monthlyPrice: 0,
    available: "atlas",
    inclusiveOnAtlas: true,
  },
] as const;

const SEAT_MIN = 1;
const SEAT_MAX = 200;

const formatUsd = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const tierFor = (seats: number): TierConfig =>
  TIERS.find((t) => t.upTo !== null && seats <= t.upTo) ??
  TIERS[TIERS.length - 1];

const isAddonEnabled = (addon: Addon, tier: TierConfig) => {
  if (addon.available === "all") return true;
  if (addon.available === "bridge") return tier.rank >= 2;
  return tier.rank >= 3;
};

const isAddonInclusive = (addon: Addon, tier: TierConfig) =>
  !!addon.inclusiveOnAtlas && tier.id === "atlas";

const PricingQuote = () => {
  const [seats, setSeats] = useState(5);
  const [cycle, setCycle] = useState<Cycle>("yearly");
  // Split state so each checkbox is durable across tier changes — picked = paid extras, optedOut = Atlas freebies dropped.
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [optedOut, setOptedOut] = useState<Set<string>>(new Set());

  const tier = useMemo(() => tierFor(seats), [seats]);
  const isCustom = tier.id === "atlas";

  const isAddonChecked = useCallback(
    (addon: Addon) => {
      if (!isAddonEnabled(addon, tier)) return false;
      if (isAddonInclusive(addon, tier)) return !optedOut.has(addon.id);
      return picked.has(addon.id);
    },
    [picked, optedOut, tier],
  );

  const toggleAddon = useCallback(
    (addon: Addon) => {
      const target = isAddonInclusive(addon, tier) ? setOptedOut : setPicked;
      target((prev) => {
        const next = new Set(prev);
        if (next.has(addon.id)) next.delete(addon.id);
        else next.add(addon.id);
        return next;
      });
    },
    [tier],
  );

  // Picks survive tier changes — toggling back to a compatible tier restores them.
  const effective = useMemo(
    () => ADDONS.filter((a) => isAddonChecked(a)),
    [isAddonChecked],
  );

  const baseMonthly = isCustom
    ? 0
    : seats * (cycle === "yearly" ? tier.yearly! : tier.monthly!);
  const addonsMonthly = isCustom
    ? 0
    : effective.reduce((sum, a) => sum + a.monthlyPrice, 0);
  const months = cycle === "yearly" ? 12 : 1;
  const dueNow = (baseMonthly + addonsMonthly) * months;
  const monthlyEquivalent = baseMonthly + addonsMonthly;
  const yearlyEquivalent = monthlyEquivalent * 12;

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="section-padding container"
    >
      <motion.div
        variants={fadeUp}
        className="text-meta text-muted-foreground flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-3"
      >
        <span className="text-foreground flex items-center gap-2">
          <span className="bg-foreground size-1.5 animate-pulse rounded-full" />
          § Quote · build your ticket
        </span>
        <span className="hidden md:inline">
          · Move the dial, tick the extras, watch the total
        </span>
        <span className="ml-auto">live · 2026.04</span>
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="mt-10 max-w-[18ch] text-4xl leading-[0.95] tracking-tighter text-balance md:mt-14 md:text-6xl lg:mt-20 lg:text-[5.5rem]"
      >
        Build your ticket.{" "}
        <em className="text-muted-foreground">We&apos;ll do the math.</em>
      </motion.h2>

      <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-[1.15fr_1fr] md:items-start md:gap-12 lg:mt-20 lg:gap-20">
        <motion.div variants={fadeUp} className="flex flex-col gap-14">
          <SeatBlock seats={seats} setSeats={setSeats} tier={tier} />
          <CycleBlock cycle={cycle} setCycle={setCycle} />
          <AddonsBlock
            tier={tier}
            isCustom={isCustom}
            isAddonChecked={isAddonChecked}
            onToggle={toggleAddon}
          />
        </motion.div>

        <motion.div variants={fadeUp} className="md:sticky md:top-24">
          <Receipt
            tier={tier}
            seats={seats}
            cycle={cycle}
            effective={effective}
            isCustom={isCustom}
            baseMonthly={baseMonthly}
            addonsMonthly={addonsMonthly}
            dueNow={dueNow}
            monthlyEquivalent={monthlyEquivalent}
            yearlyEquivalent={yearlyEquivalent}
            months={months}
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

type SeatBlockProps = {
  seats: number;
  setSeats: (n: number) => void;
  tier: TierConfig;
};

const SeatBlock = ({ seats, setSeats, tier }: SeatBlockProps) => {
  const display = useAnimatedNumber(seats);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-meta text-muted-foreground flex items-baseline justify-between">
        <span>01 · Seats</span>
        <span className="text-foreground">
          {seats === 1 ? "engineer" : "engineers"}
        </span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-end gap-3">
          <motion.span className="font-display text-7xl leading-none tracking-tighter tabular-nums md:text-8xl">
            {display}
          </motion.span>
          <span className="text-meta text-muted-foreground pb-3">seats</span>
        </div>
        <TierBadge tier={tier} />
      </div>

      <SeatSlider value={seats} onChange={setSeats} tier={tier} />
    </div>
  );
};

const TierBadge = ({ tier }: { tier: TierConfig }) => (
  <AnimatePresence mode="wait" initial={false}>
    <Badge variant="card" size="lg" className="gap-2" asChild>
      <motion.span
        key={tier.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        <span className="bg-foreground size-1.5 rounded-full" />
        Recommended · {tier.name}
      </motion.span>
    </Badge>
  </AnimatePresence>
);

const SeatSlider = ({
  value,
  onChange,
  tier,
}: {
  value: number;
  onChange: (v: number) => void;
  tier: TierConfig;
}) => {
  const ticks = [
    { seats: 5, label: "Lookout" },
    { seats: 25, label: "Bridge" },
    { seats: 100, label: "Atlas" },
  ];

  return (
    <div className="relative pb-9">
      <Slider
        min={SEAT_MIN}
        max={SEAT_MAX}
        value={[value]}
        onValueChange={([v]) => v !== undefined && onChange(v)}
        aria-label={`Seats — ${value} on ${tier.name}`}
      />

      {/* Tick marks overlay — positioned at the slider track's Y (top-2 ≈
          center of the size-4 thumb that determines the Slider's height). */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-2">
        {ticks.map((t) => {
          const tickPct = ((t.seats - SEAT_MIN) / (SEAT_MAX - SEAT_MIN)) * 100;
          const reached = value >= t.seats;
          return (
            <span
              key={t.seats}
              className="absolute -translate-x-1/2"
              style={{ left: `${tickPct}%` }}
            >
              <span
                className={cn(
                  "block h-2 w-px -translate-y-[3px] transition-colors",
                  reached ? "bg-foreground" : "bg-foreground/30",
                )}
              />
              <span
                className={cn(
                  "text-meta-xs absolute top-3 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 transition-colors",
                  reached ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="tabular-nums">{t.seats}</span>
                <span className="opacity-60">{t.label}</span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

const CycleBlock = ({
  cycle,
  setCycle,
}: {
  cycle: Cycle;
  setCycle: (c: Cycle) => void;
}) => (
  <div className="flex flex-col gap-4">
    <div className="text-meta text-muted-foreground flex items-baseline justify-between">
      <span>02 · Billing cycle</span>
      <span className="text-foreground">
        {cycle === "yearly" ? "−20% vs monthly" : "Pay as you go"}
      </span>
    </div>
    <div className="bg-card inline-flex w-fit items-center border p-1">
      {(
        [
          { v: "monthly", label: "Monthly", hint: undefined },
          { v: "yearly", label: "Yearly", hint: "−20%" },
        ] as const
      ).map((opt) => {
        const active = cycle === opt.v;
        return (
          <button
            key={opt.v}
            type="button"
            onClick={() => setCycle(opt.v)}
            aria-pressed={active}
            className={cn(
              "relative inline-flex items-center gap-2 px-5 py-2.5 text-sm transition-colors",
              active
                ? "text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="quote-cycle-pill"
                aria-hidden
                className="bg-foreground absolute inset-0"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative font-medium">{opt.label}</span>
            {opt.hint && (
              <Badge
                variant="soft"
                size="sm"
                className={cn(
                  "relative",
                  active && "bg-background/15 text-background",
                )}
              >
                {opt.hint}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

type AddonsBlockProps = {
  tier: TierConfig;
  isCustom: boolean;
  isAddonChecked: (addon: Addon) => boolean;
  onToggle: (addon: Addon) => void;
};

const AddonsBlock = ({
  tier,
  isCustom,
  isAddonChecked,
  onToggle,
}: AddonsBlockProps) => {
  const counts = useMemo(() => {
    let added = 0;
    let included = 0;
    for (const a of ADDONS) {
      if (!isAddonChecked(a)) continue;
      if (isAddonInclusive(a, tier)) included += 1;
      else added += 1;
    }
    return { added, included };
  }, [isAddonChecked, tier]);

  return (
    <div className="flex flex-col gap-5">
      <div className="text-meta text-muted-foreground flex items-baseline justify-between">
        <span>03 · Optional extras</span>
        <span className="text-foreground tabular-nums">
          {counts.added} added
          {counts.included ? ` · ${counts.included} inherited` : ""}
        </span>
      </div>

      <ul className="grid gap-3">
        {ADDONS.map((addon) => (
          <li key={addon.id}>
            <AddonItem
              addon={addon}
              tier={tier}
              isChecked={isAddonChecked(addon)}
              isCustom={isCustom}
              onToggle={() => onToggle(addon)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

type AddonItemProps = {
  addon: Addon;
  tier: TierConfig;
  isChecked: boolean;
  isCustom: boolean;
  onToggle: () => void;
};

const AddonItem = ({
  addon,
  tier,
  isChecked,
  isCustom,
  onToggle,
}: AddonItemProps) => {
  const enabled = isAddonEnabled(addon, tier);
  const inclusive = isAddonInclusive(addon, tier);
  // Picks surface on Atlas as "Quoted" so sales sees interest, even without a numeric bill.
  const muteForCustom = isCustom && !inclusive;
  const interactable = enabled;

  return (
    <label
      className={cn(
        "group/addon bg-card/40 flex w-full items-start gap-4 border p-4 text-left transition-all md:p-5",
        interactable &&
          "hover:border-foreground/30 hover:bg-card cursor-pointer",
        isChecked && "border-foreground bg-card",
        !enabled && "cursor-not-allowed opacity-55",
      )}
    >
      <Checkbox
        checked={isChecked}
        onCheckedChange={interactable ? onToggle : undefined}
        disabled={!interactable}
        aria-label={addon.name}
        className="mt-0.5"
      />

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-display text-lg leading-tight tracking-tight md:text-xl">
            {addon.name}
          </span>
          <Badge variant="outline" className="text-muted-foreground">
            {addon.category}
          </Badge>
          {addon.recommended && (
            <Badge variant="soft" className="gap-1">
              <Sparkles className="size-2.5" />
              Popular
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground max-w-prose text-sm leading-snug">
          {addon.detail}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1 text-right">
        {inclusive ? (
          <Badge
            variant={isChecked ? "default" : "card"}
            className={cn("gap-1", !isChecked && "text-muted-foreground")}
          >
            {isChecked && <Check className="size-2.5" strokeWidth={3} />}
            {isChecked ? "Included" : "Opt out"}
          </Badge>
        ) : !enabled ? (
          <span className="text-meta-xs text-muted-foreground inline-flex items-center gap-1">
            <Lock className="size-2.5" />
            {addon.available === "bridge" ? "Bridge & up" : "Atlas only"}
          </span>
        ) : muteForCustom ? (
          <span className="text-meta-xs text-muted-foreground">
            Quoted with Atlas
          </span>
        ) : (
          <>
            <span className="font-display text-xl leading-none tracking-tight tabular-nums md:text-2xl">
              + {formatUsd(addon.monthlyPrice)}
            </span>
            <span className="text-meta-xs text-muted-foreground">/ mo</span>
          </>
        )}
      </div>
    </label>
  );
};

type ReceiptProps = {
  tier: TierConfig;
  seats: number;
  cycle: Cycle;
  effective: Addon[];
  isCustom: boolean;
  baseMonthly: number;
  addonsMonthly: number;
  dueNow: number;
  monthlyEquivalent: number;
  yearlyEquivalent: number;
  months: number;
};

const Receipt = ({
  tier,
  seats,
  cycle,
  effective,
  isCustom,
  baseMonthly,
  addonsMonthly,
  dueNow,
  monthlyEquivalent,
  yearlyEquivalent,
  months,
}: ReceiptProps) => {
  const dueDisplay = useAnimatedNumber(dueNow, formatUsd);
  const monthlyDisplay = useAnimatedNumber(monthlyEquivalent, formatUsd);
  const yearlyDisplay = useAnimatedNumber(yearlyEquivalent, formatUsd);
  const baseDisplay = useAnimatedNumber(baseMonthly * months, formatUsd);
  const addonsDisplay = useAnimatedNumber(
    addonsMonthly * months,
    (v) => `+ ${formatUsd(v)}`,
  );
  const lineSeats = seats === SEAT_MAX ? `${SEAT_MAX}+` : `${seats}`;

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.4, ease: EASE } }}
      className="bg-card shadow-foreground/5 rounded-[2px] border p-7 shadow-2xl md:p-9"
    >
      <div className="text-meta flex items-baseline justify-between border-b border-dashed pb-4">
        <span className="text-foreground flex items-center gap-2">
          <span className="bg-foreground size-1.5 animate-pulse rounded-full" />
          Receipt · {tier.name}
        </span>
        <span className="text-muted-foreground">№ MRD-Q-{tier.rank}</span>
      </div>

      <p className="font-display mt-7 text-2xl leading-[1.15] tracking-tight md:text-3xl">
        {lineSeats} {seats === 1 ? "engineer" : "engineers"} on{" "}
        <em className="text-muted-foreground">{cycle}</em> billing
      </p>

      <ul className="mt-9 space-y-3 font-mono text-sm">
        <ReceiptLine
          label={`${tier.name} · ${lineSeats} seats × ${months} mo`}
          value={isCustom ? "—" : <motion.span>{baseDisplay}</motion.span>}
        />

        <AnimatePresence initial={false} mode="popLayout">
          {effective.map((addon) => {
            const isInclusiveLine = isAddonInclusive(addon, tier);
            return (
              <motion.li
                key={addon.id}
                layout
                initial={{ opacity: 0, height: 0, y: -4 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -4 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="text-muted-foreground flex items-baseline justify-between gap-3 overflow-hidden"
              >
                <span>
                  {addon.name}
                  {!isCustom && !isInclusiveLine && ` · ${months} mo`}
                </span>
                <span
                  aria-hidden
                  className="border-foreground/25 grow border-b border-dotted"
                />
                <span className="text-foreground tabular-nums">
                  {isInclusiveLine
                    ? "Included"
                    : isCustom
                      ? "Quoted"
                      : `+ ${formatUsd(addon.monthlyPrice * months)}`}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>

        {effective.length > 0 && !isCustom && (
          <ReceiptLine
            label="Extras subtotal"
            value={<motion.span>{addonsDisplay}</motion.span>}
            tone="muted"
          />
        )}

        <ReceiptLine label="Per-seat tax" value="$0" tone="muted" />
      </ul>

      <div className="mt-8 border-t pt-6">
        <motion.div
          layout
          className="flex items-baseline justify-between gap-4"
        >
          <span className="text-meta text-muted-foreground">
            Total due {cycle === "yearly" ? "now" : "this month"}
          </span>
          <span className="font-display text-5xl leading-none tracking-tighter tabular-nums md:text-6xl">
            {isCustom ? "Custom" : <motion.span>{dueDisplay}</motion.span>}
          </span>
        </motion.div>
        {!isCustom && (
          <motion.div
            layout
            className="text-meta text-muted-foreground mt-3 flex items-baseline justify-end gap-3"
          >
            <span>
              ≈ <motion.span>{monthlyDisplay}</motion.span> / mo
            </span>
            <span aria-hidden>·</span>
            <span>
              <motion.span>{yearlyDisplay}</motion.span> / yr
            </span>
          </motion.div>
        )}
      </div>

      <motion.div layout className="mt-9 flex flex-wrap items-center gap-3">
        <Button size="lg">
          {isCustom ? "Talk to us" : `Start on ${tier.name}`}
        </Button>
        <Button size="lg" variant="ghost">
          Email this quote
        </Button>
      </motion.div>

      <motion.div
        layout
        className="text-meta-xs text-muted-foreground mt-7 flex items-baseline justify-between border-t border-dashed pt-5"
      >
        <span>Auth · 0xMRD-Q-{tier.rank}</span>
        <span>Holder · your team</span>
      </motion.div>
    </motion.div>
  );
};

type ReceiptLineProps = {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "muted";
};

const ReceiptLine = ({ label, value, tone = "default" }: ReceiptLineProps) => (
  <li className="text-muted-foreground flex items-baseline justify-between gap-3">
    <span>{label}</span>
    <span
      aria-hidden
      className="border-foreground/25 grow border-b border-dotted"
    />
    <span
      className={cn(
        "tabular-nums",
        tone === "muted" ? "text-muted-foreground" : "text-foreground",
      )}
    >
      {value}
    </span>
  </li>
);

const useAnimatedNumber = (
  value: number,
  format: (v: number) => string = (v) => Math.round(v).toLocaleString("en-US"),
) => {
  const motionValue = useMotionValue(value);
  const display = useTransform(motionValue, format);
  const initial = useRef(true);
  useEffect(() => {
    if (initial.current) {
      motionValue.set(value);
      initial.current = false;
      return;
    }
    const controls = animate(motionValue, value, {
      type: "spring",
      stiffness: 280,
      damping: 32,
      mass: 0.6,
    });
    return controls.stop;
  }, [value, motionValue]);
  return display;
};

export default PricingQuote;
