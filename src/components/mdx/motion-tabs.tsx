"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1] as const;

type Item = {
  title: string;
  body: React.ReactNode;
};

type MotionTabsProps = {
  items: Item[];
};

export const MotionTabs = ({ items }: MotionTabsProps) => {
  const [active, setActive] = useState(0);

  return (
    <div className="not-prose bg-card mt-6 flex flex-col gap-0 border">
      <div
        role="tablist"
        className="relative flex w-full items-center justify-start gap-0 border-b px-2"
      >
        {items.map((item, i) => {
          const isActive = active === i;
          return (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={cn(
                "relative inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="font-display tracking-tight">{item.title}</span>
              {isActive ? (
                <motion.span
                  layoutId="motion-tab-bar"
                  className="bg-foreground absolute inset-x-2 -bottom-px h-px"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 32,
                  }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="text-foreground/85 relative px-5 py-5 text-sm">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="[&_p:first-child]:mt-0 [&_pre]:mt-3"
          >
            {items[active]?.body}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
