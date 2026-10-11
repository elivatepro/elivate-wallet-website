import { cn } from "@/lib/utils";

type ScreenProps = {
  src: string;
  alt: string;
  className?: string;
};

type AppWindowProps = ScreenProps & {
  /** Intrinsic pixel size of the exported screen, used to reserve layout space. */
  width: number;
  height: number;
};

/** A desktop app screen exported from Paper, framed like a window. */
export const AppWindow = ({ src, alt, width, height, className }: AppWindowProps) => (
  <div
    className={cn(
      "border-foreground/15 overflow-hidden rounded-xl border bg-[#111314] shadow-2xl select-none",
      className,
    )}
  >
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="block h-auto w-full"
    />
  </div>
);

// The bezel PNG's transparent screen opening, measured from the 1350×2760
// source: 72px in from each side, 69px from top and bottom, ~210px corners.
const SCREEN_INSET = {
  top: "2.5%",
  bottom: "2.5%",
  left: "5.333%",
  right: "5.333%",
  borderRadius: "17% / 7.9%",
} as const;

/** A mobile app screen (390×844 @2x) seated inside the iPhone bezel. */
export const PhoneFrame = ({ src, alt, className }: ScreenProps) => (
  <div className={cn("relative aspect-[1350/2760] select-none", className)}>
    <div className="absolute overflow-hidden bg-[#111314]" style={SCREEN_INSET}>
      <img
        src={src}
        alt={alt}
        width={780}
        height={1688}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="size-full object-cover object-top"
      />
    </div>
    <img
      src="/images/home/iphone-16-pro-bezel.png"
      alt=""
      aria-hidden="true"
      width={1350}
      height={2760}
      draggable={false}
      className="pointer-events-none relative z-10 size-full"
    />
  </div>
);

export { SCREEN_INSET };
