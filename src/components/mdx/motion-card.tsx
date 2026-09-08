"use client";

import { useRef, useState } from "react";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

type MotionCardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

// Cursor-aware tilt + a thin "scan line" that follows the pointer. Both
// effects fade on hover-out so the card sits flat at rest. The tilt is
// intentionally tiny (max ~3deg) — this is editorial, not a casino.
export const MotionCard = ({
  title,
  subtitle,
  children,
  className,
}: MotionCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [2, -2]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-2, 2]), {
    stiffness: 220,
    damping: 22,
  });
  const lightX = useTransform(px, (v) => `${v * 100}%`);
  const lightY = useTransform(py, (v) => `${v * 100}%`);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onLeave = () => {
    setHovered(false);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={cn(
        "not-prose group/card bg-card relative mt-6 border p-5 transition-shadow duration-300 will-change-transform hover:shadow-[0_18px_40px_-24px_oklch(0_0_0_/_0.35)] dark:hover:shadow-[0_18px_40px_-24px_oklch(0_0_0_/_0.65)]",
        className,
      )}
    >
      {/* Pointer-tracked highlight — subtle, just enough to suggest the
          card is sensitive to attention. */}
      <motion.span
        aria-hidden
        style={{
          background: hovered
            ? `radial-gradient(220px circle at ${lightX.get()} ${lightY.get()}, oklch(from var(--foreground) l c h / 0.04), transparent 60%)`
            : "transparent",
        }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
      />

      {/* Top + bottom mini-rule decoration that animates in on hover. */}
      <span
        aria-hidden
        className="bg-foreground/40 pointer-events-none absolute top-0 right-3 left-3 h-px origin-left scale-x-0 transition-transform duration-500 group-hover/card:scale-x-100"
      />

      <div className="text-meta-xs text-muted-foreground">
        {subtitle ?? "Note"}
      </div>
      <div className="font-display mt-2 text-lg tracking-tight">{title}</div>
      {children ? (
        <div className="text-foreground/85 mt-3 text-sm [&_pre]:mt-3">
          {children}
        </div>
      ) : null}
    </motion.div>
  );
};
