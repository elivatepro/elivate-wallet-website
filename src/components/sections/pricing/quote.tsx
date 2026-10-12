"use client";

import { useMemo, useState } from "react";

import { motion, type Variants } from "motion/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { APPLY_URL } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

type Tier = {
  label: string;
  short: string;
  price: number;
};

const TIERS: readonly Tier[] = [
  { label: "Up to 400 users", short: "400", price: 700000 },
  { label: "Up to 1,000 users", short: "1,000", price: 1000000 },
  { label: "1,500+ users", short: "1,500+", price: 1500000 },
] as const;

const EXTRAS = [
  "Data migration",
  "Custom branding",
  "Special integrations",
  "Enhanced support",
] as const;

const formatNaira = (value: number) => `₦${value.toLocaleString("en-NG")}`;

const PricingQuote = () => {
  const [tierIndex, setTierIndex] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());

  const tier = TIERS[tierIndex];
  const hasExtras = selectedExtras.size > 0;

  const selected = useMemo(
    () => EXTRAS.filter((extra) => selectedExtras.has(extra)),
    [selectedExtras],
  );

  const toggleExtra = (extra: string, checked: boolean) => {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      if (checked) next.add(extra);
      else next.delete(extra);
      return next;
    });
  };

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
          § NETWORK SIZE · EXTRAS · BASE PRICE
        </span>
        <span className="hidden md:inline">ONE ORGANIZATION · CORE WALLET INCLUDED</span>
        <span className="ml-auto">LIVE QUOTE</span>
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="mt-10 max-w-[18ch] text-4xl leading-[0.95] tracking-tighter text-balance md:mt-14 md:text-6xl lg:mt-20 lg:text-[5.5rem]"
      >
        Choose your network size. {" "}
        <em className="text-muted-foreground">Add Extras if you need them.</em>
      </motion.h2>

      <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-[1.15fr_1fr] md:items-start md:gap-12 lg:mt-20 lg:gap-20">
        <motion.div variants={fadeUp} className="flex flex-col gap-14">
          <div className="flex flex-col gap-6">
            <div className="text-meta text-muted-foreground flex items-baseline justify-between">
              <span>01 · Network size</span>
              <span className="text-foreground">{tier.label}</span>
            </div>

            <div className="flex items-end gap-3">
              <span className="font-display text-7xl leading-none tracking-tighter tabular-nums md:text-8xl">
                {tier.short}
              </span>
              <span className="text-meta text-muted-foreground pb-3">users</span>
            </div>

            <div className="relative pb-12">
              <Slider
                min={0}
                max={2}
                step={1}
                value={[tierIndex]}
                onValueChange={([value]) => {
                  if (value !== undefined) setTierIndex(value);
                }}
                aria-label={`Network size — ${tier.label}`}
              />
              <div className="text-meta-xs text-muted-foreground mt-4 grid grid-cols-3">
                <span>Up to 400</span>
                <span className="text-center">Up to 1,000</span>
                <span className="text-right">1,500+</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="text-meta text-muted-foreground flex items-baseline justify-between">
              <span>02 · Extras</span>
              <span className="text-foreground">Optional · quoted separately</span>
            </div>

            <div className="divide-y border-y">
              {EXTRAS.map((extra) => {
                const checked = selectedExtras.has(extra);
                return (
                  <label
                    key={extra}
                    className="flex cursor-pointer items-center gap-4 py-5"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => toggleExtra(extra, value === true)}
                      aria-label={extra}
                    />
                    <span className="font-display flex-1 text-xl tracking-tight">
                      {extra}
                    </span>
                    <span className="text-meta text-muted-foreground">
                      {checked ? "QUOTE" : "OPTIONAL"}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="md:sticky md:top-24">
          <div className="bg-card border p-7 font-mono text-sm shadow-2xl md:p-9">
            <div className="text-meta flex items-baseline justify-between border-b border-dashed pb-4">
              <span>ELIVATE WALLET</span>
              <span className="text-muted-foreground">QUOTE</span>
            </div>

            <div className="mt-7">
              <div className="text-meta text-muted-foreground">Network size</div>
              <div className="font-display mt-2 text-3xl tracking-tight">{tier.label}</div>
            </div>

            <div className="mt-8 border-t border-dashed pt-6">
              <div className="text-meta text-muted-foreground">Extras</div>
              {selected.length === 0 ? (
                <p className="mt-3 text-muted-foreground">None selected</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {selected.map((extra) => (
                    <li key={extra} className="flex items-baseline justify-between gap-4">
                      <span>{extra}</span>
                      <span className="text-muted-foreground">QUOTE</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8 border-t pt-5">
              <div className="text-meta text-muted-foreground">Base plan</div>
              <div className="font-display mt-2 text-4xl tracking-tight tabular-nums">
                {formatNaira(tier.price)}
              </div>
              {hasExtras && (
                <p className="text-meta-xs text-muted-foreground mt-3">
                  Selected Extras are quoted separately and are not included in this base price.
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Button asChild size="lg">
                {hasExtras ? (
                  <a href="/contact">Request a quote</a>
                ) : (
                  <a href={APPLY_URL} target="_blank" rel="noopener noreferrer">
                    Get started
                  </a>
                )}
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href="/contact">Talk to us</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PricingQuote;
