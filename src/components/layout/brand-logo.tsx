import type { ComponentProps } from "react";

import { MeridianLogo } from "@/components/icons/meridian-logo";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** "auto" follows the theme, "dark" forces white. Default inherits text color. */
  surface?: "auto" | "dark";
  className?: string;
} & Omit<ComponentProps<"a">, "href" | "aria-label" | "className">;

export const BrandLogo = ({ surface, className, ...rest }: BrandLogoProps) => (
  <a
    {...rest}
    href="/"
    aria-label="Meridian — home"
    className={cn(
      "font-display inline-flex items-center gap-2 text-2xl leading-none tracking-tight md:gap-2.5 md:text-3xl",
      surface === "dark" && "text-white",
      surface === "auto" && "dark:text-white",
      className,
    )}
  >
    <MeridianLogo aria-hidden className="hidden size-9 shrink-0 md:block" />
    <span>
      Meridian<sup className="align-super text-xs md:text-sm">®</sup>
    </span>
  </a>
);
