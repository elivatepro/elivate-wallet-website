"use client";

import { useEffect, useRef, useState } from "react";

import {
  AnchorProvider,
  ScrollProvider,
  type TableOfContents,
  TOCItem as TOCItemPrimitive,
  type TOCItemType,
  useActiveAnchors,
} from "fumadocs-core/toc";
import { AlignLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type DocsTocProps = {
  toc: TableOfContents;
  className?: string;
};

// Hosts the fumadocs <AnchorProvider> + a clerk-style renderer. The
// `<TOCItem>` primitive emits `data-active="true|false"` based on
// useAnchorObserver, and auto-scrolls itself into view when active —
// behaviour we get for free by using the real fumadocs primitive.
export const DocsToc = ({ toc, className }: DocsTocProps) => {
  if (!toc.length) return null;
  return (
    <AnchorProvider toc={toc} single={false}>
      <div className={cn("flex flex-col gap-3", className)}>
        <h3 className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
          <AlignLeft className="size-4" />
          On this page
        </h3>
        <Scroll>
          <ClerkItems items={toc} />
        </Scroll>
      </div>
    </AnchorProvider>
  );
};

// Mirrors fumadocs-ui TOCScrollArea: hidden scrollbar + soft top/bottom
// fade. Provides the `<ScrollProvider>` so `<TOCItem>` knows which
// container to scrollIntoView when an anchor activates.
const Scroll = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="relative ms-px min-h-0 overflow-auto [mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)] py-3 text-sm [scrollbar-width:none]"
    >
      <ScrollProvider containerRef={ref}>{children}</ScrollProvider>
    </div>
  );
};

// 1:1 port of fumadocs-ui ClerkTOCItems. Token swap only:
//   text-fd-primary → text-foreground
//   bg-fd-primary → bg-foreground
//   text-fd-muted-foreground → text-muted-foreground
//   stroke-fd-foreground/10 → stroke-border
const ClerkItems = ({ items }: { items: TableOfContents }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<{
    path: string;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const onResize = () => {
      if (container.clientHeight === 0) return;
      let w = 0;
      let h = 0;
      const d: string[] = [];
      for (let i = 0; i < items.length; i++) {
        const element = container.querySelector<HTMLElement>(
          `a[href="${items[i].url}"]`,
        );
        if (!element) continue;
        const styles = getComputedStyle(element);
        const offset = getLineOffset(items[i].depth) + 1;
        const top = element.offsetTop + parseFloat(styles.paddingTop);
        const bottom =
          element.offsetTop +
          element.clientHeight -
          parseFloat(styles.paddingBottom);
        w = Math.max(offset, w);
        h = Math.max(h, bottom);
        d.push(`${i === 0 ? "M" : "L"}${offset} ${top}`);
        d.push(`L${offset} ${bottom}`);
      }
      setSvg({ path: d.join(" "), width: w + 1, height: h });
    };
    const observer = new ResizeObserver(onResize);
    onResize();
    observer.observe(container);
    return () => observer.disconnect();
  }, [items]);

  return (
    <>
      {svg ? (
        <div
          className="absolute start-0 top-0"
          style={{
            width: svg.width,
            height: svg.height,
            maskImage: makeMaskUrl(svg),
            WebkitMaskImage: makeMaskUrl(svg),
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          <ClerkThumb containerRef={containerRef} />
        </div>
      ) : null}
      <div ref={containerRef} className="flex flex-col">
        {items.map((item, i) => (
          <ClerkItem
            key={item.url}
            item={item}
            upper={items[i - 1]?.depth}
            lower={items[i + 1]?.depth}
          />
        ))}
      </div>
    </>
  );
};

const ClerkThumb = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const active = useActiveAnchors();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const el = ref.current;
    if (!container || !el) return;
    if (active.length === 0) return;
    let upper = Number.MAX_VALUE;
    let lower = 0;
    for (const id of active) {
      const a = container.querySelector<HTMLElement>(`a[href="#${id}"]`);
      if (!a) continue;
      const styles = getComputedStyle(a);
      upper = Math.min(upper, a.offsetTop + parseFloat(styles.paddingTop));
      lower = Math.max(
        lower,
        a.offsetTop + a.clientHeight - parseFloat(styles.paddingBottom),
      );
    }
    if (upper === Number.MAX_VALUE) return;
    el.style.setProperty("--fd-top", `${upper}px`);
    el.style.setProperty("--fd-height", `${lower - upper}px`);
  }, [active, containerRef]);

  return (
    <div
      ref={ref}
      role="none"
      className="bg-foreground transition-all"
      style={{
        marginTop: "var(--fd-top)",
        height: "var(--fd-height)",
      }}
    />
  );
};

const ClerkItem = ({
  item,
  upper = item.depth,
  lower = item.depth,
}: {
  item: TOCItemType;
  upper?: number;
  lower?: number;
}) => {
  const offset = getLineOffset(item.depth);
  const upperOffset = getLineOffset(upper);
  const lowerOffset = getLineOffset(lower);
  return (
    <TOCItemPrimitive
      href={item.url}
      style={{ paddingInlineStart: getItemOffset(item.depth) }}
      className={cn(
        "text-muted-foreground relative py-1.5 pr-2 text-sm leading-snug [overflow-wrap:anywhere] transition-colors first:pt-0 last:pb-0",
        "hover:text-foreground data-[active=true]:text-foreground",
      )}
    >
      {offset !== upperOffset ? (
        <svg
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className="absolute start-0 -top-1.5 size-4"
        >
          <line
            x1={upperOffset}
            y1="0"
            x2={offset}
            y2="12"
            className="stroke-border"
            strokeWidth="1"
          />
        </svg>
      ) : null}
      <span
        aria-hidden
        className={cn(
          "bg-border absolute inset-y-0 w-px",
          offset !== upperOffset && "top-1.5",
          offset !== lowerOffset && "bottom-1.5",
        )}
        style={{ insetInlineStart: offset }}
      />
      {item.title}
    </TOCItemPrimitive>
  );
};

const getItemOffset = (depth: number) => {
  if (depth <= 2) return 14;
  if (depth === 3) return 26;
  return 36;
};

const getLineOffset = (depth: number) => (depth >= 3 ? 10 : 0);

const makeMaskUrl = (svg: { path: string; width: number; height: number }) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`,
  )}")`;
