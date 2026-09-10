"use client";

import { motion } from "motion/react";

import type { BlogSummary } from "@/lib/blog";

const EASE = [0.16, 1, 0.3, 1] as const;

const EditorialCover = ({
  entry,
  tickerItems,
}: {
  entry: BlogSummary;
  tickerItems: string[];
}) => {
  const tape = tickerItems.length
    ? tickerItems
    : [`№ ${entry.articleNumber}`, entry.category, entry.title];

  return (
    <div className="border-foreground relative aspect-[3/4] w-full overflow-hidden border bg-zinc-950 text-white shadow-2xl md:aspect-auto md:h-full md:min-h-[480px]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(255,255,255,.18), transparent 28%), radial-gradient(circle at 78% 70%, rgba(255,255,255,.09), transparent 32%), linear-gradient(145deg, #161616 0%, #050505 65%, #171717 100%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "5px 5px",
        }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-3 border border-white/15" />

      <div className="text-meta-xs absolute top-5 right-5 left-5 z-10 flex items-baseline justify-between tracking-widest text-white/70 uppercase">
        <span>ARTICLE · № {entry.articleNumber}</span>
        <span>{entry.displayDate}</span>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-meta-xs tracking-[0.32em] text-white/55 uppercase"
        >
          Elivate Wallet
        </motion.span>
        <motion.span
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.08 }}
          className="font-display mt-5 text-[clamp(5rem,18vw,10rem)] leading-[0.8] tracking-tighter tabular-nums"
        >
          {entry.articleNumber}
        </motion.span>
        <span className="text-meta mt-5 tracking-[0.35em] text-white/70 uppercase">
          Notes
        </span>
        <span className="mt-8 max-w-xs text-sm leading-relaxed text-white/60">
          {entry.category} · {entry.author.name}
        </span>
      </div>

      <div className="absolute right-0 bottom-16 left-0 z-20 overflow-hidden border-y border-white/15 bg-white/[0.03] py-2">
        <motion.div
          className="text-meta-xs flex w-max gap-7 tracking-widest whitespace-nowrap text-white/75 uppercase"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        >
          {[...tape, ...tape, ...tape, ...tape].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-7">
              <span>{item}</span>
              <span aria-hidden className="text-white/30">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="text-meta-xs absolute right-5 bottom-5 left-5 z-20 flex items-baseline justify-between tracking-widest text-white/60 uppercase">
        <span>{entry.featured ? "Featured" : "Elivate Wallet"}</span>
        <span>{entry.readMin} min read</span>
      </div>
    </div>
  );
};

export default EditorialCover;
