import type { ComponentProps } from "react";

import { ElivateMark } from "@/components/layout/elivate-mark";
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
    aria-label="Elivate Wallet — home"
    className={cn(
      "font-display inline-flex items-center gap-[0.3em] text-2xl leading-none tracking-tight md:text-3xl",
      surface === "dark" && "text-white",
      surface === "auto" && "dark:text-white",
      className,
    )}
  >
    <ElivateMark className="text-brand h-[1.05em] w-auto shrink-0" />
    <span>Elivate Wallet</span>
  </a>
);