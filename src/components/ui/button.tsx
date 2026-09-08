"use client"

import * as React from "react"
import { useRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import {
  MERIDIAN_DEFAULTS,
  MERIDIAN_THEMES,
  type MeridianConfig,
  type MeridianTheme,
  type Surface,
  useMeridianCanvas,
} from "@/lib/meridian-canvas"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // `relative` stacks the button above the absolute WebGL canvas behind it —
  // without it the shader covers the whole pill, not just the padding ring.
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-semibold tracking-tight whitespace-nowrap transition-all duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] outline-none select-none hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // `default` and `secondary` surface classes are applied by the Button
        // component based on the `surface` prop, so they can swap interiors
        // (dark orb / light classic / silver) without proliferating cva entries.
        default: "",
        secondary: "",
        // Transparent border reserves the hover ring's 1.5px at rest so the
        // `chrome-ring-outline` hover state doesn't cause an inward shift.
        ghost:
          "hover:chrome-ring-outline border-[1.5px] border-transparent text-foreground",
        destructive: "meridian-destructive-surface",
        link: "rounded-none bg-transparent text-foreground underline-offset-4 shadow-none hover:scale-100 hover:underline active:scale-100",
      },
      size: {
        xs: "h-8 gap-1.5 px-4 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-1.5 px-6 text-sm [&_svg:not([class*='size-'])]:size-4",
        default:
          "h-11 gap-2 px-8 text-base [&_svg:not([class*='size-'])]:size-4",
        lg: "h-13 gap-2 px-10 text-lg [&_svg:not([class*='size-'])]:size-5",
        "icon-xs": "size-8 px-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9 px-0 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-11 px-0 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-13 px-0 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Interior + shader treatment. `dark` = glassy orb, `light` = classic pill. */
    surface?: Surface
    /** Shader configuration — overrides the surface defaults. */
    meridian?: MeridianConfig
    /** Force the CSS conic-gradient ring (skip WebGL). Useful for previewing
     *  the degraded state or when you know you're rendering many buttons. */
    fallback?: boolean
  }

const MERIDIAN_VARIANT_THEMES: Partial<
  Record<
    NonNullable<VariantProps<typeof buttonVariants>["variant"]>,
    MeridianTheme
  >
> = {
  default: "chrome",
  secondary: "silver",
  destructive: "red",
}

const DEFAULT_SURFACE_CLASS: Record<Surface, string> = {
  dark: "meridian-default-surface",
  light: "meridian-default-surface-light",
}

function Button({
  className,
  variant = "default",
  size = "default",
  surface = "dark",
  asChild = false,
  meridian,
  fallback = false,
  ...props
}: ButtonProps) {
  // Dark + secondary is a shortcut for the "light classic" treatment —
  // remap downstream so theme/defaults/surface class all line up.
  const isLightClassic = surface === "dark" && variant === "secondary"
  const effSurface: Surface = isLightClassic ? "light" : surface
  const effVariant = isLightClassic ? "default" : variant

  const meridianTheme = effVariant
    ? MERIDIAN_VARIANT_THEMES[effVariant]
    : undefined
  const Comp = asChild ? Slot.Root : "button"

  // Surface class is the only piece that differs between default/secondary
  // on the same `effSurface` — everything else (shader tuning, ring palette)
  // is already keyed on surface + theme.
  const surfaceClass =
    effVariant === "default"
      ? DEFAULT_SURFACE_CLASS[effSurface]
      : effVariant === "secondary"
        ? "meridian-silver-surface"
        : ""

  return (
    <>
      <ButtonStyles />
      {meridianTheme ? (
        <MeridianButton
          theme={meridianTheme}
          surface={effSurface}
          variant={effVariant}
          size={size}
          surfaceClass={surfaceClass}
          className={className}
          meridian={meridian}
          fallback={fallback}
          {...props}
        />
      ) : (
        <Comp
          data-slot="button"
          data-variant={effVariant}
          data-size={size}
          className={cn(
            buttonVariants({ variant: effVariant, size }),
            surfaceClass,
            className
          )}
          {...props}
        />
      )}
    </>
  )
}

// `<style jsx global>` injects into <head> once per unique CSS string —
// multiple buttons on the page share a single injected copy. Placed at
// the top of the render so the rules are present before first paint.
function ButtonStyles() {
  return (
    <style>{`
      @property --chrome-angle {
        syntax: "<angle>";
        initial-value: 45deg;
        inherits: false;
      }
      @keyframes chrome-rotate {
        to {
          --chrome-angle: 405deg;
        }
      }

      /* Chrome fallback — mirrors the shader's dominant palette
         (oklch-ish chromeDark [0.12,0.14,0.18] → chromeBright [0.96,0.98,1]
         in sRGB: #1f2429 → #f5fafa). The perimeter cycles through multiple
         dark↔bright bands to echo the FBM noise pattern, with two narrow
         rainbow bleed regions (sky at ~52%, rose at ~88%) that match how
         the shader only lets rainbow bursts leak in rare angular slots. */
      .meridian-fallback-silver {
        background: conic-gradient(
          from var(--chrome-angle),
          #1f2429 0%,
          #6b7280 7%,
          #e2e8f0 14%,
          #94a3b8 22%,
          #0f1419 30%,
          #cbd5e1 38%,
          #475569 46%,
          #f5fafa 52%,
          #7dd3fc 54%,
          #cbd5e1 58%,
          #1f2429 66%,
          #64748b 74%,
          #e2e8f0 82%,
          #334155 87%,
          #fb7185 89%,
          #94a3b8 94%,
          #0f1419 100%
        );
        animation: chrome-rotate 18s linear infinite;
      }
      /* Red fallback — same cycling pattern using the shader's red palette
         (#7f1d1d → #fecaca). No rainbow bleed since the red theme sets
         rainbowScale = 0 in the shader. */
      .meridian-fallback-red {
        background: conic-gradient(
          from var(--chrome-angle),
          #450a0a 0%,
          #7f1d1d 10%,
          #fecaca 20%,
          #dc2626 30%,
          #450a0a 42%,
          #f87171 54%,
          #7f1d1d 66%,
          #fecaca 78%,
          #ef4444 90%,
          #450a0a 100%
        );
        animation: chrome-rotate 20s linear infinite;
      }
      .chrome-ring-outline {
        border: 1.5px solid transparent;
        background:
          rgb(255 255 255 / 0.6) padding-box,
          conic-gradient(
              from var(--chrome-angle),
              #94a3b8,
              #dbeafe,
              #e2e8f0,
              #f8fafc,
              #cbd5e1,
              #fce7f3,
              #94a3b8,
              #f1f5f9,
              #e2e8f0,
              #cbd5e1,
              #94a3b8
            )
            border-box;
        backdrop-filter: blur(10px) saturate(1.4);
        -webkit-backdrop-filter: blur(10px) saturate(1.4);
        animation: chrome-rotate 26s linear infinite;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.9),
          inset 0 -1px 2px rgb(0 0 0 / 0.04),
          0 1px 2px rgb(0 0 0 / 0.04),
          0 4px 12px -4px rgb(0 0 0 / 0.08);
      }
      .dark .chrome-ring-outline {
        background:
          rgb(0 0 0 / 0.35) padding-box,
          conic-gradient(
              from var(--chrome-angle),
              #94a3b8,
              #dbeafe,
              #e2e8f0,
              #f8fafc,
              #cbd5e1,
              #fce7f3,
              #94a3b8,
              #f1f5f9,
              #e2e8f0,
              #cbd5e1,
              #94a3b8
            )
            border-box;
      }

      .meridian-default-surface {
        background:
          radial-gradient(
            ellipse 80% 55% at 50% 0%,
            rgb(255 255 255 / 0.22) 0%,
            rgb(255 255 255 / 0.06) 45%,
            rgb(255 255 255 / 0) 70%
          ),
          linear-gradient(to bottom, oklch(0.2 0 0), oklch(0.08 0 0));
        color: oklch(0.985 0 0);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.22),
          inset 0 8px 16px -8px rgb(255 255 255 / 0.3),
          inset 0 -8px 16px -8px rgb(0 0 0 / 0.7),
          0 1px 2px rgb(0 0 0 / 0.1),
          0 10px 24px -6px rgb(0 0 0 / 0.3);
      }
      .dark .meridian-default-surface {
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.16),
          inset 0 8px 16px -8px rgb(255 255 255 / 0.2),
          inset 0 -8px 16px -8px rgb(0 0 0 / 0.7),
          0 1px 2px rgb(0 0 0 / 0.3),
          0 10px 24px -6px rgb(0 0 0 / 0.6);
      }

      .meridian-default-surface-light {
        background: linear-gradient(
          to bottom,
          rgb(255 255 255),
          rgb(245 245 245)
        );
        color: oklch(0.145 0 0);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255),
          inset 0 2px 8px rgb(255 255 255 / 0.5),
          inset 0 -2px 6px rgb(0 0 0 / 0.06),
          0 1px 2px rgb(0 0 0 / 0.04),
          0 8px 20px -4px rgb(0 0 0 / 0.12);
      }

      .meridian-silver-surface {
        background: linear-gradient(
          to bottom,
          #fafafa 0%,
          #f3f3f3 50%,
          #e0e0e0 100%
        );
        color: oklch(0.145 0 0);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255),
          inset 0 2px 8px rgb(255 255 255 / 0.45),
          inset 0 -2px 6px rgb(0 0 0 / 0.07),
          0 1px 2px rgb(0 0 0 / 0.04),
          0 6px 14px -3px rgb(0 0 0 / 0.1);
      }
      .dark .meridian-silver-surface {
        background: linear-gradient(
          to bottom,
          oklch(0.27 0 0) 0%,
          oklch(0.22 0 0) 50%,
          oklch(0.16 0 0) 100%
        );
        color: oklch(0.985 0 0);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.08),
          inset 0 2px 8px rgb(255 255 255 / 0.04),
          inset 0 -2px 6px rgb(0 0 0 / 0.5),
          0 1px 2px rgb(0 0 0 / 0.3),
          0 6px 14px -3px rgb(0 0 0 / 0.45);
      }

      .meridian-destructive-surface {
        background: linear-gradient(
          to bottom,
          #fef2f2 0%,
          #fde4e4 50%,
          #fecaca 100%
        );
        color: #7f1d1d;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.85),
          inset 0 2px 8px rgb(255 255 255 / 0.4),
          inset 0 -2px 6px rgb(239 68 68 / 0.12),
          0 1px 2px rgb(239 68 68 / 0.1),
          0 6px 18px -3px rgb(239 68 68 / 0.3);
      }
      .dark .meridian-destructive-surface {
        background: linear-gradient(
          to bottom,
          #450a0a 0%,
          #5c1010 50%,
          #7f1d1d 100%
        );
        color: #fecaca;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.08),
          inset 0 2px 8px rgb(255 255 255 / 0.04),
          inset 0 -2px 6px rgb(0 0 0 / 0.5),
          0 1px 2px rgb(127 29 29 / 0.4),
          0 6px 18px -3px rgb(220 38 38 / 0.35);
      }

      @media (prefers-reduced-motion: reduce) {
        .chrome-ring-outline,
        .meridian-fallback-silver,
        .meridian-fallback-red {
          animation: none;
        }
      }
    `}</style>
  )
}

type MeridianButtonProps = React.ComponentProps<"button"> & {
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  theme?: MeridianTheme
  surface?: Surface
  /** Pre-resolved surface class (dark-orb or light-classic) for variant="default". */
  surfaceClass?: string
  meridian?: MeridianConfig
  fallback?: boolean
}

function MeridianButton({
  variant = "default",
  size = "default",
  theme = "chrome",
  surface = "dark",
  surfaceClass = "",
  className,
  meridian = {},
  fallback = false,
  children,
  style,
  ...props
}: MeridianButtonProps) {
  const themeConfig = MERIDIAN_THEMES[surface][theme]
  const borderWidth =
    meridian.borderWidth ?? MERIDIAN_DEFAULTS[surface].borderWidth
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Hook flips this only on real WebGL failure (context cap, getContext null,
  // shader link failure), so the CSS conic fallback doesn't flash for a frame
  // before the shader's first paint.
  const webglFailed = useMeridianCanvas(canvasRef, {
    surface,
    theme,
    meridian,
    fallback,
  })

  return (
    <div
      className={cn(
        // `w-fit` gives the wrapper a definite intrinsic width so flex-col
        // parents with the default `align-items: stretch` don't drag the
        // shader canvas across the full cross-axis. We intentionally do not
        // pin to `self-start` — the wrapper should inherit the parent's
        // align-items so callers using `items-center` actually get centered.
        "relative inline-flex w-fit rounded-full transition-opacity duration-200",
        // Dim the wrapper (not the button) when disabled so the canvas dims
        // with it — dimming the button alone makes its bg translucent and
        // the shader bleeds through the whole pill.
        "has-[button:disabled]:opacity-50",
        // Animated CSS conic-gradient ring applied only when WebGL actually
        // fails (context cap, getContext null, shader link failure). Keeping
        // it off by default avoids the fallback flashing for ~1 frame
        // before the shader's first paint.
        webglFailed && themeConfig.fallbackClass
      )}
      style={{ padding: `${borderWidth}px` }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full rounded-full"
      />
      <button
        type="button"
        {...props}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        // Override base's `disabled:opacity-50` — the wrapper handles the
        // dim so the button stays opaque and keeps masking the canvas.
        className={cn(
          buttonVariants({ variant, size }),
          surfaceClass,
          "disabled:opacity-100",
          className
        )}
        style={style}
      >
        <span className="relative z-10">{children}</span>
      </button>
    </div>
  )
}

export { Button, buttonVariants }
