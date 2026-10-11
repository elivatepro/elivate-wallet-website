"use client";

import { useState } from "react";

import { Menu, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { AskAi, AskAiButton } from "@/components/docs/ask-ai";
import { DocsSearch } from "@/components/docs/docs-search";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { ThemeToggle } from "@/components/elements/theme-toggle";
import { BrandLogo } from "@/components/layout/brand-logo";
import type { DocNavGroup } from "@/lib/types";

const APP_URL = "https://app.elivatewallet.com";

// Docs pages use this slim header instead of the marketing navbar:
// brand · Docs, search, Ask AI, theme, and the app login. Below `md` the
// sidebar moves into a drawer opened from here.
export const DocsHeader = ({ nav }: { nav: DocNavGroup[] }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-background/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="flex h-14 items-center gap-2 px-4 sm:gap-3 md:px-6">
        <div className="flex shrink-0 items-center gap-3">
          <BrandLogo className="text-xl md:text-xl" />
          <span aria-hidden className="text-muted-foreground/50 hidden sm:inline">
            /
          </span>
          <a
            href="/docs"
            className="text-meta text-muted-foreground hover:text-foreground hidden transition-colors sm:inline"
          >
            Docs
          </a>
        </div>

        <div className="flex flex-1 justify-center">
          <DocsSearch className="hidden w-full max-w-sm md:flex" />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <AskAiButton />
          <ThemeToggle className="text-muted-foreground hover:text-foreground" />
          <a
            href={APP_URL}
            className="bg-foreground text-background hidden h-9 items-center px-3 text-sm font-medium transition-opacity hover:opacity-90 lg:inline-flex"
          >
            Log in
          </a>

          <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogPrimitive.Trigger
              aria-label="Open docs menu"
              className="hover:bg-muted inline-flex size-9 items-center justify-center md:hidden"
            >
              <Menu className="size-5" />
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="bg-background/70 fixed inset-0 z-50 backdrop-blur-sm" />
              <DialogPrimitive.Content
                aria-describedby={undefined}
                className="bg-background fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col gap-5 overflow-y-auto border-r px-5 pt-5 pb-8"
              >
                <div className="flex items-center justify-between">
                  <DialogPrimitive.Title className="text-meta text-muted-foreground">
                    Docs menu
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close
                    aria-label="Close docs menu"
                    className="hover:bg-muted inline-flex size-8 items-center justify-center"
                  >
                    <X className="size-4" />
                  </DialogPrimitive.Close>
                </div>
                {/* The header search owns ⌘K; this copy must not also bind it. */}
                <DocsSearch hotkey={false} className="w-full" />
                <DocsSidebar nav={nav} />
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        </div>
      </div>
      <AskAi />
    </header>
  );
};
