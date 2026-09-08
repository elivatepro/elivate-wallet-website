"use client";

import { type MouseEvent, useSyncExternalStore } from "react";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1] as const;

type ThemeToggleProps = {
  className?: string;
};

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const prefersReduced = usePrefersReducedMotion();

  const isDark = mounted && resolvedTheme === "dark";

  const toggle = async (e: MouseEvent<HTMLButtonElement>) => {
    const newTheme = isDark ? "light" : "dark";
    const root = document.documentElement;

    if (typeof document.startViewTransition !== "function" || prefersReduced) {
      setTheme(newTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    root.style.setProperty("--theme-x", `${x}px`);
    root.style.setProperty("--theme-y", `${y}px`);
    root.style.setProperty("--theme-r", `${endRadius}px`);
    root.classList.add("theme-transition");

    const transition = document.startViewTransition(() => setTheme(newTheme));

    try {
      await transition.finished;
    } finally {
      root.classList.remove("theme-transition");
      root.style.removeProperty("--theme-x");
      root.style.removeProperty("--theme-y");
      root.style.removeProperty("--theme-r");
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "text-background/80 hover:text-background flex size-9 items-center justify-center transition-colors",
        className,
      )}
    >
      <span className="relative flex size-4 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="absolute"
            >
              <Moon className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: 45, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -45, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="absolute"
            >
              <Sun className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export { ThemeToggle };
