import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { MDXComponents } from "mdx/types";

import { CodeBlock } from "@/components/mdx/code-block";
import {
  MotionAccordion,
  MotionAccordionItem,
} from "@/components/mdx/motion-accordion";
import { MotionCard } from "@/components/mdx/motion-card";
import { MotionStep, MotionSteps } from "@/components/mdx/motion-steps";
import { MotionTabs } from "@/components/mdx/motion-tabs";
import { getLangMeta } from "@/lib/highlighter";
import { cn } from "@/lib/utils";

// Heading IDs come from the `remarkHeading` plugin upstream — no
// slugify helper needed here. `toText` is kept because <Pre> needs to
// extract the raw code text from <code>'s children.
function toText(node: ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    return toText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function H1(props: ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      {...props}
      className={cn(
        "text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl",
        props.className,
      )}
    />
  );
}

function H2(props: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      {...props}
      className={cn(
        "mt-14 scroll-mt-32 border-t pt-10 text-2xl tracking-tight md:text-3xl",
        props.className,
      )}
    />
  );
}

function H3(props: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      {...props}
      className={cn(
        "mt-10 scroll-mt-32 text-lg tracking-tight md:text-xl",
        props.className,
      )}
    />
  );
}

function P(props: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      {...props}
      className={cn("text-foreground/85 mt-4 leading-relaxed", props.className)}
    />
  );
}

function A(props: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      {...props}
      className={cn(
        "decoration-foreground/30 hover:decoration-foreground underline underline-offset-4 transition-colors",
        props.className,
      )}
    />
  );
}

function Ul(props: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      {...props}
      className={cn(
        "[&>li]:before:bg-muted-foreground mt-4 space-y-2 [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:top-[0.6em] [&>li]:before:left-0 [&>li]:before:h-px [&>li]:before:w-3",
        props.className,
      )}
    />
  );
}

function Ol(props: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      {...props}
      className={cn(
        "marker:text-muted-foreground mt-4 list-decimal space-y-2 pl-6 marker:font-mono marker:text-xs",
        props.className,
      )}
    />
  );
}

function Li(props: ComponentPropsWithoutRef<"li">) {
  return <li {...props} className={cn("leading-relaxed", props.className)} />;
}

function Blockquote(props: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      {...props}
      className={cn(
        "border-foreground/40 text-foreground/80 mt-6 border-l-2 pl-5 italic",
        props.className,
      )}
    />
  );
}

function InlineCode(props: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      {...props}
      className={cn(
        "bg-muted text-foreground rounded-[2px] px-1.5 py-0.5 font-mono text-[0.85em]",
        props.className,
      )}
    />
  );
}

// Astro hands React MDX components their children as pre-rendered HTML
// (a StaticHtml element with a `value` prop) rather than React nodes.
function slotHtml(node: ReactNode): string | null {
  if (node && typeof node === "object" && "props" in (node as object)) {
    const value = (node as { props: { value?: unknown } }).props.value;
    if (value != null) return String(value);
  }
  return null;
}

function unescapeHtml(value: string) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&amp;", "&");
}

function Pre({ children }: ComponentPropsWithoutRef<"pre">) {
  // The MDX pipeline gives us <pre><code class="language-bash title="x.ts">…</code></pre>.
  // Unwrap the <code>, parse the language + optional title= token, then hand
  // the code to the client CodeBlock. This must stay synchronous: Astro's
  // React renderer silently renders async components as nothing, which is
  // why code blocks used to vanish (Shiki highlighting is async).
  const raw = slotHtml(children);
  const codeProps =
    raw == null &&
    children &&
    typeof children === "object" &&
    "props" in (children as object)
      ? (children as { props: { className?: string; children?: ReactNode } })
          .props
      : { className: "", children: "" };
  const className =
    raw != null
      ? (/<code[^>]*class="([^"]*)"/.exec(raw)?.[1] ?? "")
      : (codeProps.className ?? "");
  const langRaw = /language-([\w-]+(?:[^\s]*)?)/.exec(className)?.[1] ?? "";
  const titleMatch = /title=(?:"([^"]+)"|'([^']+)')/.exec(langRaw);
  const lang = langRaw.replace(/title=.+$/, "").trim();
  const title = titleMatch?.[1] ?? titleMatch?.[2];
  const code = (
    raw != null
      ? unescapeHtml(raw.replace(/<[^>]+>/g, ""))
      : toText(codeProps.children)
  ).replace(/\n$/, "");
  const meta = getLangMeta(lang);
  const html = `<pre><code>${escapeHtml(code)}</code></pre>`;
  return (
    <CodeBlock
      code={code}
      html={html}
      label={meta.label}
      glyph={meta.glyph}
      title={title}
    />
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function Hr(props: ComponentPropsWithoutRef<"hr">) {
  return <hr {...props} className={cn("mt-12 border-t", props.className)} />;
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="mt-6 overflow-x-auto border">
      <table
        {...props}
        className={cn(
          "[&_th]:text-meta [&_th]:bg-muted w-full border-collapse text-sm [&_tbody_tr:last-child]:border-b-0 [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_tr]:border-b",
          props.className,
        )}
      />
    </div>
  );
}

// ---- MDX-only components (used by author, not produced by markdown) ----

type CardProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

function Card({ title, subtitle, children }: CardProps) {
  return (
    <MotionCard title={title} subtitle={subtitle}>
      {children}
    </MotionCard>
  );
}

function Cards({
  children,
  columns = 2,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 4
      ? "md:grid-cols-2 lg:grid-cols-4"
      : columns === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-2";
  return (
    <div className={cn("not-prose mt-6 grid grid-cols-1 gap-4", cols)}>
      {children}
    </div>
  );
}

type StepItem = { title?: string; body: ReactNode };

function Steps({ children }: { children: ReactNode }) {
  // Walk the immediate children to extract title + body, then re-emit as
  // MotionSteps with index/total so each step can animate its own counter
  // when scrolled into view.
  const items: StepItem[] = [];
  for (const child of Array.isArray(children) ? children : [children]) {
    if (!child) continue;
    if (child && typeof child === "object" && "props" in (child as object)) {
      const props = (
        child as { props: { title?: string; children?: ReactNode } }
      ).props;
      items.push({ title: props.title, body: props.children ?? null });
    }
  }

  return (
    <MotionSteps>
      {items.map((it, i) => (
        <MotionStep key={i} index={i + 1} total={items.length} title={it.title}>
          {it.body}
        </MotionStep>
      ))}
    </MotionSteps>
  );
}

// Step is a marker — its props are read by Steps above; rendering it
// directly returns nothing.
function Step({}: { title?: string; children: ReactNode }) {
  return null;
}

function DocTabs({ children }: { children: ReactNode }) {
  // Children are <Tab title="...">…</Tab> elements. Pull their titles +
  // bodies and hand them to the client-side MotionTabs.
  const items = (Array.isArray(children) ? children : [children])
    .filter(Boolean)
    .map((child, i) => {
      if (child && typeof child === "object" && "props" in (child as object)) {
        const props = (
          child as {
            props: { title?: string; children?: ReactNode };
          }
        ).props;
        return {
          title: props.title ?? `Tab ${i + 1}`,
          body: props.children ?? null,
        };
      }
      return { title: `Tab ${i + 1}`, body: null };
    });

  return <MotionTabs items={items} />;
}

// Tab is a marker — its props are read by DocTabs above; rendering it
// directly returns nothing.
function Tab({}: { title?: string; children: ReactNode }) {
  return null;
}

function Files({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose bg-card mt-6 border font-mono text-sm">
      <div className="text-meta-xs bg-muted/60 text-muted-foreground border-b px-4 py-2">
        File tree
      </div>
      <div className="p-4">
        <ul className="space-y-1">{children}</ul>
      </div>
    </div>
  );
}

function Folder({
  name,
  defaultOpen,
  children,
}: {
  name: string;
  defaultOpen?: boolean;
  children?: ReactNode;
}) {
  return (
    <li>
      <details open={defaultOpen ?? false} className="group">
        <summary className="text-foreground hover:text-foreground/70 flex cursor-pointer items-center gap-2 select-none">
          <span className="text-muted-foreground inline-block w-3 transition-transform group-open:rotate-90">
            ▸
          </span>
          <span className="text-muted-foreground">▸</span>
          <span>{name}/</span>
        </summary>
        {children ? (
          <ul className="border-border mt-1 ml-5 space-y-1 border-l pl-4">
            {children}
          </ul>
        ) : null}
      </details>
    </li>
  );
}

function FileLeaf({ name }: { name: string }) {
  return (
    <li className="flex items-center gap-2 pl-5">
      <span className="text-muted-foreground">·</span>
      <span className="text-foreground/85">{name}</span>
    </li>
  );
}

// Accordion + AccordionItem are thin re-exports of the motion versions;
// kept under the MDX-author-facing names so existing content reads the same.
const Accordion = MotionAccordion;
const AccordionItem = MotionAccordionItem;

type TypeRowProps = {
  field: string;
  [k: string]: ReactNode | string | undefined;
};

function TypeTable({
  columns = ["type", "description"],
  children,
}: {
  columns?: string[];
  children: ReactNode;
}) {
  // Children are <TypeRow> elements; extract their props to render rows.
  const rows = (Array.isArray(children) ? children : [children])
    .filter(Boolean)
    .map((child) => {
      if (child && typeof child === "object" && "props" in (child as object)) {
        return (child as { props: TypeRowProps }).props;
      }
      return null;
    })
    .filter((r): r is TypeRowProps => !!r);

  if (!rows.length) return null;

  return (
    <div className="not-prose mt-6 overflow-x-auto border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/60 border-b">
            <th className="text-meta-xs text-muted-foreground px-3 py-2 text-left">
              Field
            </th>
            {columns.map((c) => (
              <th
                key={c}
                className="text-meta-xs text-muted-foreground px-3 py-2 text-left"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-b-0">
              <td className="text-foreground px-3 py-3 align-top font-mono text-[0.8rem]">
                {row.field}
              </td>
              {columns.map((c) => (
                <td key={c} className="text-foreground/80 px-3 py-3 align-top">
                  {row[c] as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// TypeRow is a marker — its props are read by TypeTable above.
function TypeRow({}: TypeRowProps) {
  return null;
}

function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "muted" | "info";
}) {
  const tone =
    variant === "muted"
      ? "bg-muted text-muted-foreground"
      : variant === "info"
        ? "bg-foreground text-background"
        : "border border-foreground bg-background text-foreground";
  return (
    <span
      className={cn(
        "not-prose text-meta-xs mt-8 inline-flex items-center px-3 py-1",
        tone,
      )}
    >
      {children}
    </span>
  );
}

function Callout({
  variant = "note",
  children,
}: {
  variant?: "note" | "warn" | "tip";
  children: ReactNode;
}) {
  const tone =
    variant === "warn"
      ? "border-l-foreground bg-muted/40"
      : variant === "tip"
        ? "border-l-foreground/60 bg-card"
        : "border-l-foreground/40 bg-card";
  const label =
    variant === "warn" ? "Caution" : variant === "tip" ? "Tip" : "Note";
  return (
    <div
      className={cn(
        "not-prose text-foreground/85 mt-6 border border-l-4 p-5 text-sm",
        tone,
      )}
    >
      <div className="text-meta-xs text-muted-foreground">{label}</div>
      <div className="mt-2 [&_p]:m-0">{children}</div>
    </div>
  );
}

export function getDocsMdxComponents(): MDXComponents {
  return {
    h1: H1,
    h2: H2,
    h3: H3,
    p: P,
    a: A,
    ul: Ul,
    ol: Ol,
    li: Li,
    blockquote: Blockquote,
    code: InlineCode,
    pre: Pre,
    hr: Hr,
    table: Table,
    Card,
    Cards,
    Steps,
    Step,
    Tabs: DocTabs,
    Tab,
    Files,
    Folder,
    File: FileLeaf,
    Accordion,
    AccordionItem,
    TypeTable,
    TypeRow,
    Badge,
    Callout,
  };
}
