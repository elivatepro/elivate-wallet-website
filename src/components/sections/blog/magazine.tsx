"use client";

import { motion, type Variants } from "motion/react";

import { DottedBackdrop } from "@/components/layout/dotted-backdrop";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const BlogMagazine = () => (
  <>
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      className="hero-padding relative overflow-hidden pb-5 md:pb-7 lg:pb-8"
    >
      <DottedBackdrop />

      <div className="relative container">
        <motion.div
          variants={fadeUp}
          className="text-meta text-muted-foreground flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-3"
        >
          <span className="text-foreground flex items-center gap-2">
            <span className="bg-foreground size-1.5 animate-pulse rounded-full" />
            § BLOG
          </span>
          <span>VOL. 01 · № 000</span>
          <span className="hidden md:inline">NOTES FROM ELIVATE</span>
          <span className="ml-auto">0 PUBLISHED</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-display mt-10 flex flex-wrap items-baseline gap-x-4 tracking-tighter md:mt-14 md:gap-x-10 lg:mt-20"
          style={{ fontSize: "clamp(5rem, 14vw, 14rem)", lineHeight: 0.85 }}
        >
          <span>Wallet</span>
          <em className="text-muted-foreground">notes.</em>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-muted-foreground mt-8 max-w-2xl text-base leading-relaxed md:mt-10 md:text-lg"
        >
          Practical writing on clearer financial records, growing member
          networks, and what we’re learning as Elivate Wallet evolves.
        </motion.p>

        <motion.dl
          variants={fadeUp}
          className="mt-10 grid grid-cols-3 border-y md:mt-14 lg:mt-20"
        >
          <div className="py-5 pr-4 md:py-7 md:pr-6">
            <dt className="text-meta text-muted-foreground">Published</dt>
            <dd className="font-display mt-2 text-4xl leading-none tracking-tighter md:text-5xl">
              0
            </dd>
          </div>
          <div className="border-l px-4 py-5 md:px-6 md:py-7">
            <dt className="text-meta text-muted-foreground">Topics</dt>
            <dd className="font-display mt-2 text-4xl leading-none tracking-tighter md:text-5xl">
              0
            </dd>
          </div>
          <div className="border-l py-5 pl-4 md:py-7 md:pl-6">
            <dt className="text-meta text-muted-foreground">Since</dt>
            <dd className="font-display mt-2 text-4xl leading-none tracking-tighter md:text-5xl">
              2026
            </dd>
          </div>
        </motion.dl>
      </div>
    </motion.section>

    <motion.section
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="section-padding container"
    >
      <motion.div
        variants={fadeUp}
        className="text-meta text-muted-foreground flex items-baseline justify-between border-b pb-4"
      >
        <span>§ ARCHIVE</span>
        <span>ALL 0 ARTICLES</span>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid min-h-[22rem] place-items-center border-b py-16 text-center md:min-h-[28rem]"
      >
        <div className="max-w-xl">
          <p className="font-display text-4xl leading-tight tracking-tighter md:text-5xl">
            No articles published yet.
          </p>
          <p className="text-muted-foreground mt-5 text-base leading-relaxed md:text-lg">
            Published notes from Elivate Wallet will appear here.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="text-meta text-muted-foreground mt-5 flex items-baseline justify-between"
      >
        <span>§ END OF ARCHIVE</span>
        <span>ALL 0 ARTICLES</span>
      </motion.div>
    </motion.section>
  </>
);

export default BlogMagazine;
