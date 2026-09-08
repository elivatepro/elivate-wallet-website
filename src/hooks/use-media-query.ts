import { useMemo, useSyncExternalStore } from "react";

const SCREEN_SIZES = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type ScreenSize = keyof typeof SCREEN_SIZES;

const getScreenSize = (): ScreenSize => {
  if (typeof window === "undefined") return "xs";
  const w = document.documentElement.clientWidth || window.innerWidth;
  if (w >= SCREEN_SIZES["2xl"]) return "2xl";
  if (w >= SCREEN_SIZES.xl) return "xl";
  if (w >= SCREEN_SIZES.lg) return "lg";
  if (w >= SCREEN_SIZES.md) return "md";
  if (w >= SCREEN_SIZES.sm) return "sm";
  return "xs";
};

const ORDER: readonly ScreenSize[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
] as const;

const createSubscribe = (debounceMs: number) => (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const handler = () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(callback, debounceMs);
  };
  window.addEventListener("resize", handler);
  return () => {
    if (timeout) clearTimeout(timeout);
    window.removeEventListener("resize", handler);
  };
};

const getServerSnapshot = (): ScreenSize | null => null;

export const useMediaQuery = (debounceMs = 100) => {
  const subscribe = useMemo(() => createSubscribe(debounceMs), [debounceMs]);
  const screenSize = useSyncExternalStore(
    subscribe,
    getScreenSize,
    getServerSnapshot,
  );

  const resolved: ScreenSize = screenSize ?? "lg";

  return {
    screenSize: resolved,
    ready: screenSize !== null,
    isAtLeast: (size: ScreenSize) =>
      ORDER.indexOf(resolved) >= ORDER.indexOf(size),
    isAtMost: (size: ScreenSize) =>
      ORDER.indexOf(resolved) <= ORDER.indexOf(size),
  };
};
