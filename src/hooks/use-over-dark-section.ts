"use client";

import { useEffect, useState } from "react";

import { usePathname } from "@/hooks/use-pathname";

const PROBE_Y = 80;

export function useOverDarkSection() {
  const pathname = usePathname();
  const [over, setOver] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const targets = document.querySelectorAll<HTMLElement>(
        "[data-section-dark]",
      );
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        if (r.top <= PROBE_Y && r.bottom >= PROBE_Y) {
          setOver(true);
          return;
        }
      }
      setOver(false);
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return over;
}
