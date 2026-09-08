"use client";

import { ChevronDown } from "lucide-react";

type MotionAccordionItemProps = {
  title: string;
  children: React.ReactNode;
};

export const MotionAccordionItem = ({
  title,
  children,
}: MotionAccordionItemProps) => (
  <details className="group/acc border-b last:border-b-0">
    <summary className="text-foreground hover:text-foreground/70 flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-left text-sm font-medium transition-colors">
      <span>{title}</span>
      <ChevronDown className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 group-open/acc:rotate-180" />
    </summary>
    <div className="text-foreground/85 overflow-hidden pt-2 pb-4 text-sm">
      {children}
    </div>
  </details>
);

export const MotionAccordion = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="not-prose mt-6 border">{children}</div>;
