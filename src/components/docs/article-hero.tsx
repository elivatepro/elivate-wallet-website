"use client";

import { motion } from "motion/react";

const EASE = [0.32, 0.72, 0, 1] as const;

type ArticleHeroProps = {
  group: string;
  title: string;
  description: string;
};

// Editorial entrance: the meta strip drops first, the title arrives on a
// gentle riser, the dek follows half a beat later. Each step is short
// (~280ms) so the reader gets to the content fast — premium ≠ slow.
export const ArticleHero = ({
  group,
  title,
  description,
}: ArticleHeroProps) => (
  <header className="not-prose">
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="text-meta-xs text-muted-foreground"
    >
      {group}
    </motion.div>
    <motion.h1
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
      className="mt-2 text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl"
    >
      {title}.
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay: 0.16 }}
      className="font-display text-muted-foreground mt-3 max-w-2xl text-lg leading-snug tracking-tight md:text-xl"
    >
      {description}
    </motion.p>
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.28 }}
      aria-hidden
      className="bg-foreground/30 mt-8 h-px max-w-2xl origin-left"
    />
  </header>
);
