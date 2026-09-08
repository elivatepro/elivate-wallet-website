import { cn } from "@/lib/utils";

type DottedBackdropProps = {
  /** 0–1, drives the layer's `opacity`. Default 0.05 — the editorial-grain
   *  level used on docs/blog/section backdrops. */
  opacity?: number;
  /** Cell size in px for the dot grid. Default 5. The 404 plate uses 32
   *  for a sparser star-field; sections all use 5. */
  cell?: number;
  /** Append/override positioning classes. Default is the standard
   *  pointer-events-none absolute inset-0 -z-10 backdrop layer. */
  className?: string;
};

// Editorial dotted-grain backdrop. Lifted here from ~9 inline copies
// across docs/blog/sections/404 — same gradient string, same backgroundSize,
// only opacity and (occasionally) cell varied between callers.
export const DottedBackdrop = ({
  opacity = 0.05,
  cell = 5,
  className,
}: DottedBackdropProps) => (
  <span
    aria-hidden
    className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    style={{
      opacity,
      backgroundImage:
        "radial-gradient(var(--foreground) 1px, transparent 1px)",
      backgroundSize: `${cell}px ${cell}px`,
    }}
  />
);
