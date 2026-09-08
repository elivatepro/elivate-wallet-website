"use client";

import { useRef } from "react";

import { type Surface, useMeridianCanvas } from "@/lib/meridian-canvas";
import { cn } from "@/lib/utils";

const SVG_BODY = `
<path d="M 6 16 L 10 12 L 60 12 L 56 16 Z" fill-opacity="0.18"/>
<path d="M 56 16 L 60 12 L 60 46 L 56 50 Z" fill-opacity="0.25"/>
<line x1="6" y1="16" x2="10" y2="12" stroke-width="0.5" opacity="0.7"/>
<line x1="56" y1="16" x2="60" y2="12" stroke-width="0.5" opacity="0.7"/>
<line x1="56" y1="50" x2="60" y2="46" stroke-width="0.5" opacity="0.7"/>
<line x1="60" y1="12" x2="60" y2="46" stroke-width="0.5" opacity="0.7"/>
<path d="M 6 16 L 56 16 L 56 50 L 6 50 Z" fill-opacity="0.4"/>
<path d="M 6 16 L 56 16 L 56 50 L 6 50 Z" stroke-width="1" fill="none"/>
<line x1="6" y1="22" x2="56" y2="22" stroke-width="0.7"/>
<circle cx="11" cy="19" r="1.2" stroke="none"/>
<circle cx="15" cy="19" r="1.2" stroke="none"/>
<circle cx="19" cy="19" r="1.2" stroke="none"/>
<path d="M 11 28 L 14 30 L 11 32" stroke-width="0.85" fill="none"/>
<line x1="17" y1="30" x2="38" y2="30" stroke-width="0.6"/>
<line x1="11" y1="35" x2="42" y2="35" stroke-width="0.5" opacity="0.7"/>
<line x1="11" y1="40" x2="36" y2="40" stroke-width="0.5" opacity="0.6"/>
<path d="M 11 44 L 14 46 L 11 48" stroke-width="0.85" fill="none"/>
<rect x="17" y="44" width="3.5" height="4" fill-opacity="0.85"/>
`.trim();

const MASK_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="white" stroke="white">${SVG_BODY}</svg>`,
)}")`;

const MASK_STYLE = {
  maskImage: MASK_URL,
  WebkitMaskImage: MASK_URL,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
} as const;

export const MeridianMark = ({
  surface = "light",
  className,
}: {
  surface?: Surface;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const failed = useMeridianCanvas(canvasRef, {
    surface,
    theme: "platinum",
    meridian: { specBrightness: 0.45, specWidth: 0.32, chromeContrast: 1.4 },
  });

  return (
    <div className={cn("relative", className)} style={MASK_STYLE}>
      <canvas ref={canvasRef} aria-hidden className="block size-full" />
      {failed ? (
        <div aria-hidden className="bg-foreground absolute inset-0" />
      ) : null}
    </div>
  );
};
