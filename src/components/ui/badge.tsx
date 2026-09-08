import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // `self-center` overrides any parent `items-baseline`/`items-end` so badges
  // with icons and badges without never drift vertically against each other
  // in the same flex row.
  "text-meta-xs group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 self-center rounded-full leading-none whitespace-nowrap transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        // Filled — the editorial high-contrast pill (e.g. "Included" tier).
        default: "bg-foreground text-background [a]:hover:bg-foreground/85",
        // Border-only, foreground text. Add `text-muted-foreground` via
        // className when a category/legacy label is needed.
        outline: "border text-foreground [a]:hover:bg-muted",
        // Bordered card surface — TierBadge "Recommended · Atlas".
        card: "border bg-card text-foreground [a]:hover:bg-muted",
        // Soft tint — Popular markers and addon hints.
        soft: "bg-foreground/10 text-foreground [a]:hover:bg-foreground/15",
        // Image overlay — voices № pill, cta capture markers.
        overlay:
          "bg-background/80 text-foreground backdrop-blur [a]:hover:bg-background/90",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
      },
      size: {
        sm: "h-3 px-1.5",
        default: "h-3.5 px-2",
        lg: "h-7 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
