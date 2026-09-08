"use client";

import { useEffect, useState } from "react";

const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const useViewport = (debounceMs = 200) => {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    const handler = debounce(update, debounceMs);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [debounceMs]);

  return size;
};
