"use client";

import { motion, type Variants } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const PROOF = [
  { name: "Balances", meta: "MEMBER VIEW" },
  { name: "Income", meta: "RECORDED" },
  { name: "Withdrawals", meta: "TRACKED" },
  { name: "Transactions", meta: "HISTORY" },
  { name: "Receipts", meta: "ATTACHED" },
  { name: "Teams", meta: "ORGANIZED" },
  { name: "Reports", meta: "OVERVIEW" },
  { name: "Backups", meta: "TEAM-OWNED" },
] as const;

const Brands = () => (
  <motion.section
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
        REAL USE · LIVE TEAMS · TODAY
      </span>
      <span className="hidden md:inline">ELIVATE WALLET · CURRENT PRODUCT</span>
      <span className="flex-1 text-end">8 CORE PROOF POINTS</span>
    </motion.div>

    <motion.div variants={fadeUp} className="mb-10 md:mb-14 lg:mb-20">
      <h2 className="text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-[5.5rem]">
        Already in use. <em className="text-muted-foreground">Built to go further.</em>
      </h2>
    </motion.div>

    <motion.ul
      variants={container}
      className="bg-border grid grid-cols-2 gap-px overflow-hidden border sm:grid-cols-3 md:grid-cols-4"
    >
      {PROOF.map((item) => (
        <motion.li
          key={item.name}
          variants={fadeUp}
          className="bg-card relative flex aspect-[5/3] flex-col items-center justify-center px-5 text-center"
        >
          <span className="font-display text-2xl leading-none tracking-tight md:text-3xl">
            {item.name}
          </span>
          <span className="text-meta-xs text-muted-foreground mt-3">{item.meta}</span>
        </motion.li>
      ))}
    </motion.ul>

    <motion.div
      variants={fadeUp}
      className="relative mt-10 border-t pt-5 md:mt-14 lg:mt-20"
    >
      <p className="font-display max-w-3xl text-xl leading-snug tracking-tight md:text-2xl">
        Real teams already use Elivate Wallet to manage the financial work behind their networks.
      </p>
    </motion.div>
  </motion.section>
);

export default Brands;
