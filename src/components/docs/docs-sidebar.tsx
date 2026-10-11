"use client";

import { useState } from "react";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

import { DocsSearch } from "@/components/docs/docs-search";
import { BrandLogo } from "@/components/layout/brand-logo";
import { usePathname } from "@/hooks/use-pathname";
import type { DocNavGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

type DocsSidebarProps = {
  nav: DocNavGroup[];
  className?: string;
};

// A plasma/fumadocs-style left rail: workspace pill at the top, search
// affordance, then collapsible group sections with compact items. Active
// item gets a left accent bar + bg wash. Restrained micro-motion only —
// chevron rotates, hover nudges right, the active bar travels via
// layoutId when the route changes.
export const DocsSidebar = ({ nav, className }: DocsSidebarProps) => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Docs navigation"
      className={cn("flex flex-col gap-5", className)}
    >
      <SidebarBrand />
      <WorkspaceCard />
      <DocsSearch />

      <ul className="flex list-none flex-col gap-1">
        <SidebarLink
          href="/docs"
          active={pathname === "/docs"}
          label="Overview"
        />
      </ul>

      {nav.map((group) => (
        <SidebarGroup key={group.group} label={group.group}>
          {group.entries.map((entry) => {
            const href = `/docs/${entry.slug}`;
            return (
              <SidebarLink
                key={entry.slug}
                href={href}
                active={pathname === href}
                label={entry.title}
              />
            );
          })}
        </SidebarGroup>
      ))}

      <Footer />
    </nav>
  );
};

// Identical to the navbar brand on every other page — same mark size,
// same wordmark, same tracking — so the docs sidebar reads as a
// continuation of the global identity, not a docs-only variant.
const SidebarBrand = () => <BrandLogo />;

const WorkspaceCard = () => (
  <div className="bg-card flex items-center gap-2.5 border p-2.5">
    <div className="border-foreground bg-foreground font-display text-background flex size-7 shrink-0 items-center justify-center border text-xs leading-none tracking-tight">
      E.
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-meta-xs text-muted-foreground">Docs</div>
      <div className="font-display truncate text-sm leading-tight tracking-tight">
        Help center
      </div>
    </div>
    <div className="text-meta-xs text-muted-foreground tabular-nums">v2.0</div>
  </div>
);

type SidebarGroupProps = {
  label: string;
  children: React.ReactNode;
};

const SidebarGroup = ({ label, children }: SidebarGroupProps) => {
  // Always start expanded — matches the fumadocs/plasma default. Users
  // can collapse manually; we don't sync the state to the route.
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-meta-xs text-muted-foreground hover:text-foreground flex w-full items-center justify-between gap-2 py-1.5 pr-2 pl-1 transition-colors"
      >
        <span>{label}</span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
          className="inline-flex"
        >
          <ChevronRight className="size-3" />
        </motion.span>
      </button>
      {open ? <ul className="mt-1 flex flex-col gap-px">{children}</ul> : null}
    </div>
  );
};

type SidebarLinkProps = {
  href: string;
  active: boolean;
  label: string;
};

const SidebarLink = ({ href, active, label }: SidebarLinkProps) => (
  <li className="relative">
    {/* Active accent — a 2px bar pinned to the left edge of the rail. The
        layoutId lets it travel between items when the route changes. */}
    {active ? (
      <motion.span
        layoutId="sidebar-active-bar"
        aria-hidden
        className="bg-foreground absolute top-1 bottom-1 -left-[10px] w-[2px]"
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
      />
    ) : null}
    <a
      href={href}
      className={cn(
        "group/link flex items-center justify-between gap-2 py-1.5 pr-2 pl-3 text-sm transition-colors",
        active
          ? "bg-muted/60 text-foreground"
          : "text-foreground/65 hover:bg-muted/30 hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "truncate transition-transform duration-200",
          !active && "group-hover/link:translate-x-0.5",
        )}
      >
        {label}
      </span>
    </a>
  </li>
);

const Footer = () => (
  <div className="mt-2 border-t pt-3">
    <div className="text-meta-xs text-muted-foreground flex items-center justify-between">
      <span>Elivate Wallet</span>
      <a href="/contact" className="hover:text-foreground transition-colors">
        Support
      </a>
    </div>
  </div>
);
