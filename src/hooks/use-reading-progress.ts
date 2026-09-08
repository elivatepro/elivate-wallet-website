"use client";

import { useEffect, useState } from "react";

export const useReadingProgress = (articleId: string, readMin: number) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(articleId);
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const scrolled = -rect.top;
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [articleId]);

  const pct = Math.round(progress * 100);
  const minutesLeft = Math.max(0, Math.ceil(readMin * (1 - progress)));
  const remainingLabel =
    progress >= 0.99
      ? "— caught up"
      : minutesLeft <= 1
        ? "< 1 min left"
        : `~${minutesLeft} min left`;

  return { progress, pct, minutesLeft, remainingLabel };
};

export const scrollToTop = () =>
  window.scrollTo({ top: 0, behavior: "smooth" });
