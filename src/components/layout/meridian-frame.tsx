"use client";

import { type ReactNode, useRef } from "react";

import {
  type MeridianConfig,
  type MeridianTheme,
  type Surface,
  useMeridianCanvas,
} from "@/lib/meridian-canvas";
import { cn } from "@/lib/utils";

type MeridianFrameProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  surface?: Surface;
  theme?: MeridianTheme;
  borderWidth?: number;
  /** Outer corner radius in rem. Inner radius auto-derives from borderWidth. */
  radius?: number;
  meridian?: MeridianConfig;
};

const MeridianFrame = ({
  children,
  className,
  innerClassName,
  surface = "light",
  theme = "chrome",
  borderWidth = 2,
  radius = 1,
  meridian,
}: MeridianFrameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webglFailed = useMeridianCanvas(canvasRef, {
    surface,
    theme,
    meridian,
  });

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        webglFailed && "border",
        className,
      )}
      style={{
        padding: webglFailed ? 0 : borderWidth,
        borderRadius: `${radius}rem`,
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <div
        className={cn(
          "bg-background relative z-10 h-full w-full overflow-hidden",
          innerClassName,
        )}
        style={{ borderRadius: `calc(${radius}rem - ${borderWidth}px)` }}
      >
        {children}
      </div>
    </div>
  );
};

export { MeridianFrame };
