"use client";

import { useEffect, useRef, useState } from "react";

import { Menu, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

import { ThemeToggle } from "@/components/elements/theme-toggle";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useBannerVisibility } from "@/hooks/use-banner-visibility";
import { useOverDarkSection } from "@/hooks/use-over-dark-section";
import { NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1] as const;
const BRACKET_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 36,
  mass: 0.6,
};

const isItemActive = (href: string, pathname: string | null) => {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

// Off-site items (the app login) open in a new tab.
const externalLinkProps = (href: string) =>
  href.startsWith("http")
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

const DesktopBrackets = () => (
  <>
    <motion.span
      aria-hidden
      layoutId="nav-active-desktop-l"
      transition={BRACKET_SPRING}
      className="text-background pointer-events-none absolute top-1/2 left-0.5 -translate-y-1/2 text-sm leading-none"
    >
      [
    </motion.span>
    <motion.span
      aria-hidden
      layoutId="nav-active-desktop-r"
      transition={BRACKET_SPRING}
      className="text-background pointer-events-none absolute top-1/2 right-0.5 -translate-y-1/2 text-sm leading-none"
    >
      ]
    </motion.span>
  </>
);

const MobileBracket = ({ side }: { side: "l" | "r" }) => (
  <motion.span
    aria-hidden
    layoutId={`nav-active-mobile-${side}`}
    transition={BRACKET_SPRING}
    className="text-background inline-block leading-none"
  >
    {side === "l" ? "[" : "]"}
  </motion.span>
);

const Navbar = ({
  initialBannerVisible = true,
}: {
  initialBannerVisible?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolledPastBanner, setScrolledPastBanner] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const [pathname, setPathname] = useState<string>("");
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);
  const { isBannerVisible } = useBannerVisibility(initialBannerVisible);
  // Docs pages render the brand inside the sticky sidebar, so suppress
  // the global absolute-positioned brand mark to avoid double-up at scroll-top.
  const inDocs = pathname?.startsWith("/docs") ?? false;
  const overDarkSection = useOverDarkSection();
  const bannerOffset = isBannerVisible && !scrolledPastBanner;

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    lastY.current = y;
    if (y < 20) {
      setHidden(false);
      setScrolledPastBanner(false);
    } else if (delta > 3) {
      setHidden(true);
      setScrolledPastBanner(true);
    } else if (delta < -3) {
      setHidden(false);
    }
  });

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const mobileHidden = hidden && !open;

  return (
    <>
      {inDocs ? null : (
        <header
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-50 hidden transition-[margin] duration-300 md:block",
            bannerOffset && "mt-14",
          )}
        >
          <div className="container flex items-center py-3 md:py-4">
            <div
              data-loader-target="navbar"
              className="inline-flex h-12 items-center"
            >
              <BrandLogo
                surface="auto"
                className="pointer-events-none invisible"
              />
            </div>
          </div>
        </header>
      )}

      <motion.div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 transition-[margin] duration-300 md:hidden",
          bannerOffset && "mt-14",
          overDarkSection && "dark",
        )}
        animate={{ y: mobileHidden ? -120 : 0, opacity: mobileHidden ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div className="container py-3">
          <div className="bg-foreground text-background pointer-events-auto flex w-full flex-col overflow-hidden rounded-[3px] shadow-[0_10px_30px_-10px_oklch(0_0_0_/_0.35)] transition-colors duration-500">
            <div className="flex items-center justify-between gap-1 p-1.5">
              <BrandLogo className="pl-2" />
              <div className="flex items-center gap-1">
                <ThemeToggle />
                {/* Phones: Contact us lives in the menu so the logo keeps one line. */}
                <a
                  href="/contact"
                  className="text-meta bg-background text-foreground hidden items-center rounded-[2px] px-4 py-2 whitespace-nowrap transition-opacity hover:opacity-90 sm:inline-flex"
                >
                  Contact us
                </a>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-label={open ? "Close menu" : "Open menu"}
                  onClick={() => setOpen((v) => !v)}
                  className="text-background/80 hover:text-background flex size-9 items-center justify-center transition-colors"
                >
                  {open ? (
                    <X className="size-5" />
                  ) : (
                    <Menu className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {open && (
                <motion.nav
                  key="menu"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: EASE }}
                  className="overflow-hidden"
                >
                  <ul className="divide-background/15 divide-y px-3.5 pt-2 pb-4">
                    {NAV.map((item) => {
                      const active = isItemActive(item.href, pathname);
                      return (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            {...externalLinkProps(item.href)}
                            onClick={() => setOpen(false)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "block py-4 text-2xl leading-none font-medium tracking-tight transition-opacity",
                              active
                                ? "text-background"
                                : "text-background/70 hover:text-background",
                            )}
                          >
                            <span className="inline-flex items-baseline gap-2">
                              {active && <MobileBracket side="l" />}
                              <span>{item.label}</span>
                              {active && <MobileBracket side="r" />}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                  <a
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="text-meta bg-background text-foreground mx-3.5 mb-3.5 flex items-center justify-center rounded-[2px] py-3 transition-opacity hover:opacity-90 sm:hidden"
                  >
                    Contact us
                  </a>
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 hidden transition-[margin] duration-300 md:block",
          bannerOffset && "mt-14",
          overDarkSection && "dark",
        )}
        animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div className="container flex justify-end py-3 md:py-4">
          <nav className="bg-foreground text-background pointer-events-auto flex items-center gap-1 rounded-[3px] p-1.5 shadow-[0_10px_30px_-10px_oklch(0_0_0_/_0.35)] transition-colors duration-500">
            {NAV.map((item) => {
              const active = isItemActive(item.href, pathname);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  {...externalLinkProps(item.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-meta relative px-4 py-2 transition-colors",
                    active
                      ? "text-background"
                      : "text-background/80 hover:text-background",
                  )}
                >
                  {active && <DesktopBrackets />}
                  <span className="relative">{item.label}</span>
                </a>
              );
            })}
            <ThemeToggle />
            <a
              href="/contact"
              className="text-meta bg-background text-foreground inline-flex items-center rounded-[2px] px-4 py-2 transition-opacity hover:opacity-90"
            >
              Contact us
            </a>
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
