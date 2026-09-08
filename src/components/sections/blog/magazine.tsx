"use client";

import { useState } from "react";

import { motion, type Variants } from "motion/react";

import { DottedBackdrop } from "@/components/layout/dotted-backdrop";
import BlogCover from "@/components/mockups/blog-cover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { BlogEntry } from "@/lib/types";

const ENTRIES: readonly BlogEntry[] = [
  {
    slug: "status-pages-should-be-boring",
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
    num: "016",
    date: "2026.04.27",
    time: "10:14",
    monthKey: "2026.04",
    title: "Status pages should be boring",
    dek: "On why a green status page is the most expensive feature you can ship.",
    featuredLede:
      "The best status page is the one nobody bookmarks. We learned that the hard way, after eighteen months of designing one that customers checked twice a week. Sixteen dots, sixteen labels, one timestamp — and forty people in three timezones agreeing to be the first to know if anything flips.",
    author: "@ren",
    authorImage: "/images/portraits/1.webp",
    authorRole: "Designer · platform",
    category: "Design notes",
    severity: "note",
    readMin: 9,
  },
  {
    slug: "the-handoff",
    coverImage:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80",
    num: "015",
    date: "2026.04.22",
    time: "06:48",
    monthKey: "2026.04",
    title: "The handoff",
    dek: "A 90-second pager exchange that said almost nothing — and didn't need to.",
    author: "@kit",
    authorImage: "/images/portraits/3.webp",
    authorRole: "Editor · field notes",
    category: "Field",
    severity: "note",
    readMin: 6,
  },
  {
    slug: "the-0314-page",
    coverImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
    num: "014",
    date: "2026.04.18",
    time: "03:14",
    monthKey: "2026.04",
    title: "The 03:14 page",
    dek: "What forty-one teams learned from a single L3 burn — and the post-mortem that wrote itself before the room finished gathering.",
    featuredLede:
      "It started with a budget burn at 03:14 UTC. It ended forty-three minutes later with a closed ticket, a saved diff, and an oncall who never opened a laptop. In between is the story of a system that paged once, drafted twice, and resolved itself before the room finished gathering.",
    author: "@yass",
    authorImage: "/images/portraits/2.webp",
    authorRole: "Founding engineer · oncall, 2026.Q2",
    category: "Postmortem",
    severity: "warn",
    readMin: 10,
  },
  {
    slug: "why-we-deleted-the-dashboard",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
    num: "013",
    date: "2026.04.11",
    time: "09:00",
    monthKey: "2026.04",
    title: "Why we deleted the dashboard",
    dek: "On removing 217 graphs nobody read.",
    author: "@ren",
    authorImage: "/images/portraits/1.webp",
    authorRole: "Designer · platform",
    category: "Practice",
    severity: "info",
    readMin: 6,
  },
  {
    slug: "three-words-on-every-page",
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80",
    num: "012",
    date: "2026.03.27",
    time: "12:00",
    monthKey: "2026.03",
    title: "Three words on every page",
    dek: "On the discipline of a one-line alert — and the dashboards we burned to defend it.",
    author: "@ren",
    authorImage: "/images/portraits/1.webp",
    authorRole: "Designer · platform",
    category: "Practice",
    severity: "note",
    readMin: 5,
  },
  {
    slug: "when-the-alert-was-right",
    coverImage:
      "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1600&q=80",
    num: "011",
    date: "2026.03.13",
    time: "04:02",
    monthKey: "2026.03",
    title: "When the alert was right",
    dek: "An incident the human ignored, the system insisted on, and the eighty-three minutes between the two.",
    author: "@yass",
    authorImage: "/images/portraits/2.webp",
    authorRole: "Founding engineer · oncall, 2026.Q1",
    category: "Postmortem",
    severity: "warn",
    readMin: 8,
  },
  {
    slug: "a-quiet-quarter",
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    num: "010",
    date: "2026.02.27",
    time: "15:12",
    monthKey: "2026.02",
    title: "A quiet quarter",
    dek: "What it feels like — the boredom, the suspicion, the unease — when nothing happens for ninety days.",
    author: "@kit",
    authorImage: "/images/portraits/3.webp",
    authorRole: "Editor · field notes",
    category: "Field",
    severity: "info",
    readMin: 5,
  },
  {
    slug: "charts-we-didnt-ship",
    coverImage:
      "https://images.unsplash.com/photo-1606159068539-43f36b99d1b2?w=1600&q=80",
    num: "009",
    date: "2026.02.20",
    time: "13:30",
    monthKey: "2026.02",
    title: "Charts we didn't ship",
    dek: "A small museum of designs that died on purpose — and what each one was trying to be.",
    author: "@ren",
    authorImage: "/images/portraits/1.webp",
    authorRole: "Designer · platform",
    category: "Design notes",
    severity: "info",
    readMin: 7,
  },
  {
    slug: "the-pager-that-learned-to-whisper",
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80",
    num: "008",
    date: "2026.02.13",
    time: "23:48",
    monthKey: "2026.02",
    title: "The pager that learned to whisper",
    dek: "On reducing nine pages to one — and the eight that nobody had needed in the first place.",
    author: "@yass",
    authorImage: "/images/portraits/2.webp",
    authorRole: "Founding engineer · oncall, 2026.Q1",
    category: "Postmortem",
    severity: "warn",
    readMin: 9,
  },
  {
    slug: "burning-the-runbook",
    coverImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=80",
    num: "007",
    date: "2026.02.06",
    time: "08:20",
    monthKey: "2026.02",
    title: "Burning the runbook",
    dek: "We replaced two hundred pages with one paragraph — and the paragraph wrote itself.",
    author: "@ren",
    authorImage: "/images/portraits/1.webp",
    authorRole: "Designer · platform",
    category: "Design notes",
    severity: "note",
    readMin: 6,
  },
  {
    slug: "what-an-slo-is-for",
    coverImage:
      "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1600&q=80",
    num: "006",
    date: "2026.01.30",
    time: "16:45",
    monthKey: "2026.01",
    title: "What an SLO is for",
    dek: "On uptime, trust, and the difference between a number and a promise.",
    author: "@yass",
    authorImage: "/images/portraits/2.webp",
    authorRole: "Founding engineer · oncall, 2026.Q1",
    category: "Practice",
    severity: "note",
    readMin: 8,
  },
  {
    slug: "fourteen-minutes",
    coverImage:
      "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=1600&q=80",
    num: "005",
    date: "2026.01.23",
    time: "10:00",
    monthKey: "2026.01",
    title: "Fourteen minutes",
    dek: "The shortest retrospective we ever ran — and what was already on the page when we walked in.",
    author: "@kit",
    authorImage: "/images/portraits/3.webp",
    authorRole: "Editor · field notes",
    category: "Field",
    severity: "info",
    readMin: 4,
  },
  {
    slug: "eight-channels-one-signal",
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80",
    num: "004",
    date: "2026.01.16",
    time: "11:02",
    monthKey: "2026.01",
    title: "Eight channels, one signal",
    dek: "On collapsing a wall of Slack rooms into a feed nobody had to triage.",
    author: "@ren",
    authorImage: "/images/portraits/1.webp",
    authorRole: "Designer · platform",
    category: "Practice",
    severity: "note",
    readMin: 7,
  },
  {
    slug: "the-call-we-never-made",
    coverImage:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1600&q=80",
    num: "003",
    date: "2026.01.09",
    time: "02:41",
    monthKey: "2026.01",
    title: "The call we never made",
    dek: "A page that didn't fire, an oncall who didn't wake, and the forty-second window between the two.",
    author: "@yass",
    authorImage: "/images/portraits/2.webp",
    authorRole: "Founding engineer · oncall, 2026.Q1",
    category: "Postmortem",
    severity: "info",
    readMin: 5,
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const fadeUpAfterPortraits: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE, delay: 0.55 },
  },
};

const MONTH_LABELS: Record<string, string> = {
  "2026.04": "April · 2026",
  "2026.03": "March · 2026",
  "2026.02": "February · 2026",
  "2026.01": "January · 2026",
};

const groupByMonth = (entries: readonly BlogEntry[]) => {
  const map = new Map<string, BlogEntry[]>();
  for (const e of entries) {
    if (!map.has(e.monthKey)) map.set(e.monthKey, []);
    map.get(e.monthKey)!.push(e);
  }
  return Array.from(map.entries());
};

const INITIAL_VISIBLE = 12;

const BlogMagazine = () => {
  const featured = ENTRIES[0]!;
  const archive = ENTRIES.slice(1);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const visible = archive.slice(0, visibleCount);
  const grouped = groupByMonth(visible);
  const hasMore = visibleCount < archive.length;
  const remaining = archive.length - visibleCount;

  return (
    <>
      <Hero count={ENTRIES.length} featured={featured} />
      <Featured entry={featured} />
      <Archive
        grouped={grouped}
        hasMore={hasMore}
        remaining={remaining}
        total={ENTRIES.length}
        onLoadMore={() => setVisibleCount(archive.length)}
      />
    </>
  );
};

const Hero = ({ count, featured }: { count: number; featured: BlogEntry }) => (
  <motion.section
    variants={container}
    initial="hidden"
    animate="visible"
    className="hero-padding relative overflow-hidden pb-5 md:pb-7 lg:pb-8"
  >
    <AmbientMesh />

    <DottedBackdrop />

    <Grain />

    <div className="relative container">
      <motion.div
        variants={fadeUp}
        className="text-meta text-muted-foreground flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-3"
      >
        <span className="text-foreground flex items-center gap-2">
          <span className="bg-foreground size-1.5 animate-pulse rounded-full" />
          § Blog
        </span>
        <span>Vol. 01 · № {count.toString().padStart(3, "0")}</span>
        <span className="hidden md:inline">
          · Dispatches from the night shift
        </span>
        <span className="ml-auto">2026.04 · {count} on file</span>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="font-display mt-10 flex flex-wrap items-baseline gap-x-4 tracking-tighter md:mt-14 md:flex-nowrap md:gap-x-10 lg:mt-20"
        style={{ fontSize: "clamp(5rem, 14vw, 14rem)", lineHeight: 0.85 }}
      >
        <span>Blog</span>
        <span
          aria-hidden
          className="relative -mb-2 inline-flex shrink-0 items-center"
        >
          <PortraitStack />
        </span>
        <motion.em
          variants={fadeUpAfterPortraits}
          className="text-muted-foreground"
        >
          notes.
        </motion.em>
      </motion.h1>

      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1.1fr_0.9fr] md:gap-16 lg:mt-20 lg:gap-24">
        <motion.p
          variants={fadeUp}
          className="text-foreground max-w-xl text-base leading-relaxed md:text-lg lg:text-xl"
        >
          Reports filed from oncall. The decisions, the SLOs we got wrong, the
          nights we got back. One dispatch a fortnight, signed and dated, no
          product pitch.
        </motion.p>

        <motion.dl
          variants={fadeUp}
          className="text-meta text-muted-foreground grid grid-cols-3 gap-4 self-end border-t pt-4"
        >
          <div>
            <dt>Filed</dt>
            <dd className="font-display text-foreground mt-2 text-2xl leading-none tracking-tight md:text-3xl">
              {count}
            </dd>
          </div>
          <div>
            <dt>Voices</dt>
            <dd className="font-display text-foreground mt-2 text-2xl leading-none tracking-tight md:text-3xl">
              03
            </dd>
          </div>
          <div>
            <dt>Since</dt>
            <dd className="font-display text-foreground mt-2 text-2xl leading-none tracking-tight md:text-3xl">
              2026
            </dd>
          </div>
        </motion.dl>
      </div>

      <motion.div
        variants={fadeUp}
        className="text-meta text-muted-foreground mt-16 flex items-baseline border-t pt-3 md:mt-24"
      >
        <span className="text-foreground flex flex-1 items-center gap-2">
          <span className="bg-foreground size-1.5 rounded-full" />§ On the cover
          · № {featured.num}
        </span>
        <span className="hidden md:inline">{featured.category} · Oncall</span>
        <span className="flex-1 text-end">{featured.date}</span>
      </motion.div>
    </div>
  </motion.section>
);

const Featured = ({ entry }: { entry: BlogEntry }) => (
  <motion.section
    variants={container}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="relative pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-28"
  >
    <div className="container">
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16 lg:gap-24">
        <motion.div variants={container} className="flex flex-col">
          <motion.h2
            variants={fadeUp}
            className="font-display text-5xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-7xl"
          >
            {entry.title}.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="font-display text-muted-foreground mt-6 max-w-xl text-2xl leading-tight tracking-tight md:text-3xl"
          >
            {entry.dek}
          </motion.p>

          {entry.featuredLede && (
            <motion.div
              variants={fadeUp}
              className="relative mt-10 max-w-xl pl-5"
            >
              <span
                aria-hidden
                className="bg-foreground/40 absolute top-1 left-0 h-full w-px"
              />
              <p className="text-foreground text-base leading-relaxed md:text-lg">
                {entry.featuredLede}
              </p>
            </motion.div>
          )}

          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center gap-4 border-t pt-6 md:mt-12"
          >
            <Avatar className="ring-foreground/15 size-11 shrink-0 ring-1">
              <AvatarImage
                src={entry.authorImage}
                alt={`Portrait of ${entry.author}`}
              />
              <AvatarFallback>
                {entry.author.replace("@", "")[0]?.toUpperCase() ?? "M"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-display text-lg leading-none tracking-tight">
                {entry.author}
              </div>
              <div className="text-meta-xs text-muted-foreground mt-1.5">
                {entry.authorRole}
              </div>
            </div>
            <span className="text-meta-xs text-muted-foreground hidden sm:inline">
              {entry.readMin} min read
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8">
            <Button asChild size="lg">
              <a href={`/blog/${entry.slug}`}>Read the dispatch</a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} className="md:h-full">
          <BlogCover entry={entry} />
        </motion.div>
      </div>
    </div>
  </motion.section>
);

const AmbientMesh = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 -z-20 hidden overflow-hidden md:block"
  >
    <motion.div
      className="absolute h-[55vw] w-[55vw] rounded-full will-change-transform"
      style={{
        top: "5%",
        left: "-15%",
        background:
          "radial-gradient(circle, oklch(0 0 0 / 0.07), transparent 78%)",
      }}
      animate={{ x: ["0%", "8%", "0%"], y: ["0%", "-5%", "0%"] }}
      transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute h-[45vw] w-[45vw] rounded-full will-change-transform"
      style={{
        top: "20%",
        right: "-10%",
        background:
          "radial-gradient(circle, oklch(0 0 0 / 0.05), transparent 78%)",
      }}
      animate={{ x: ["0%", "-6%", "0%"], y: ["0%", "5%", "0%"] }}
      transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const Grain = () => (
  <svg
    aria-hidden
    className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full opacity-[0.12] md:block"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="blog-grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves="2"
        seed="3"
      />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#blog-grain)" />
  </svg>
);

const Archive = ({
  grouped,
  hasMore,
  remaining,
  total,
  onLoadMore,
}: {
  grouped: [string, BlogEntry[]][];
  hasMore: boolean;
  remaining: number;
  total: number;
  onLoadMore: () => void;
}) => (
  <section className="relative pt-4 pb-32 md:pb-40">
    <div className="container">
      <div>
        {grouped.map(([month, entries]) => (
          <MonthGroup key={month} month={month} entries={entries} />
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center gap-3 md:mt-20">
        {hasMore ? (
          <>
            <Button variant="secondary" size="lg" onClick={onLoadMore}>
              Read more dispatches
            </Button>
            <span className="text-meta-xs text-muted-foreground tracking-widest uppercase">
              {remaining} more on file
            </span>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex w-full max-w-md flex-col items-center gap-3"
          >
            <div className="flex w-full items-baseline gap-4">
              <span
                aria-hidden
                className="border-foreground/30 grow border-b border-dotted"
              />
              <span className="font-display text-base leading-none tracking-tight md:text-lg">
                § End of file
              </span>
              <span
                aria-hidden
                className="border-foreground/30 grow border-b border-dotted"
              />
            </div>
            <span className="text-meta-xs text-muted-foreground tracking-widest uppercase">
              All {total} dispatches on file
            </span>
          </motion.div>
        )}
      </div>
    </div>
  </section>
);

const HOVER_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 22,
  mass: 0.9,
};

const RowMeta = ({
  entry,
  variant = "stack",
  isHovered = false,
}: {
  entry: BlogEntry;
  variant?: "stack" | "inline";
  isHovered?: boolean;
}) =>
  variant === "stack" ? (
    <motion.div
      animate={{ x: isHovered ? -10 : 0 }}
      transition={HOVER_SPRING}
      className="text-meta text-muted-foreground hidden flex-col items-end gap-1 md:flex"
    >
      <span className="tabular-nums">{entry.date}</span>
      <span>
        {entry.author} · {entry.readMin} min
      </span>
      <span className="text-meta-xs tracking-widest uppercase opacity-70">
        {entry.category}
      </span>
    </motion.div>
  ) : (
    <div className="text-meta-xs text-muted-foreground flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span>{entry.date}</span>
      <span>·</span>
      <span>{entry.author}</span>
      <span>·</span>
      <span>{entry.readMin} min</span>
      <span>·</span>
      <span className="tracking-widest uppercase">{entry.category}</span>
    </div>
  );

const RowText = ({ entry }: { entry: BlogEntry }) => (
  <div className="min-w-0">
    <h3 className="font-display text-2xl leading-tight tracking-tight text-balance md:text-3xl lg:text-4xl">
      {entry.title}
    </h3>
    <p className="text-meta text-muted-foreground mt-2">{entry.dek}</p>
    <div className="mt-3 md:hidden">
      <RowMeta entry={entry} variant="inline" />
    </div>
  </div>
);

const MonthGroup = ({
  month,
  entries,
}: {
  month: string;
  entries: BlogEntry[];
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  return (
    <section className="mt-12 first:mt-0">
      <div className="text-meta text-muted-foreground mb-2 flex items-baseline gap-4">
        <span className="font-display text-foreground text-base leading-none tracking-tight md:text-lg">
          {MONTH_LABELS[month] ?? month}
        </span>
        <span
          aria-hidden
          className="border-foreground/30 grow border-b border-dotted"
        />
        <span>
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <ul onMouseLeave={() => setActiveIdx(0)}>
        {entries.map((e, idx) => (
          <motion.li
            key={e.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, ease: EASE, delay: idx * 0.04 }}
            className="border-b last:border-b-0"
          >
            <PolaroidRow
              entry={e}
              index={idx}
              isLead={idx === 0}
              isActive={activeIdx === idx}
              onActivate={() => setActiveIdx(idx)}
              layoutId={`archive-hover-${month}`}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

const PolaroidRow = ({
  entry,
  index,
  isLead,
  isActive,
  onActivate,
  layoutId,
}: {
  entry: BlogEntry;
  index: number;
  isLead: boolean;
  isActive: boolean;
  onActivate: () => void;
  layoutId: string;
}) => {
  return (
    <a
      href={`/blog/${entry.slug}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className="relative my-1 grid grid-cols-[96px_1fr] items-center gap-5 py-6 md:grid-cols-[140px_5rem_1fr_auto] md:items-baseline md:gap-10 md:py-7"
    >
      {isActive && (
        <motion.span
          layoutId={layoutId}
          className="bg-foreground/[0.05] pointer-events-none absolute inset-0"
          transition={{
            layout: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
          }}
        />
      )}
      <figure className="border-foreground/15 relative w-full self-center overflow-hidden border">
        <div className="bg-muted relative aspect-[4/5] w-full overflow-hidden">
          <img
            src={entry.coverImage}
            alt={entry.title}
            sizes="140px"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <figcaption className="text-meta-xs border-foreground/10 bg-card text-muted-foreground border-t px-2 py-1.5 text-center tracking-widest uppercase">
          № {entry.num}
        </figcaption>
      </figure>
      <div className="text-meta text-muted-foreground hidden md:block">
        <span className="tabular-nums">{entry.date}</span>
        {isLead && (
          <span className="text-meta-xs text-foreground mt-2 flex items-center gap-1.5 tracking-widest uppercase">
            <span className="bg-foreground size-1.5 animate-pulse rounded-full" />
            Latest
          </span>
        )}
      </div>
      <RowText entry={entry} />
      <RowMeta entry={entry} isHovered={isActive} />
    </a>
  );
};

const PORTRAIT_STACK = [
  { src: "/images/portraits/1.webp", label: "@ren" },
  { src: "/images/portraits/2.webp", label: "@yass" },
  { src: "/images/portraits/3.webp", label: "@kit" },
] as const;

const PORTRAIT_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

const stackVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
};

const portraitVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 12, x: 0, rotate: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0,
    rotate: 0,
    transition: PORTRAIT_SPRING,
  },
  spread: (i: number) => ({
    x: `${(i - 1) * 30}%`,
    rotate: (i - 1) * 5,
    scale: 1.1,
    transition: PORTRAIT_SPRING,
  }),
};

const PortraitStack = () => (
  <TooltipProvider delayDuration={150} skipDelayDuration={400}>
    <motion.span
      className="relative inline-flex items-center"
      variants={stackVariants}
      initial="hidden"
      animate="visible"
      whileHover="spread"
    >
      <span className="flex items-center -space-x-3 md:-space-x-5 lg:-space-x-7">
        {PORTRAIT_STACK.map((p, i) => (
          <Tooltip key={p.label}>
            <TooltipTrigger asChild>
              <motion.span
                custom={i}
                variants={portraitVariants}
                whileTap={{
                  scale: 1.02,
                  transition: { duration: 0.12, ease: "linear" },
                }}
                className="relative inline-flex"
                style={{ zIndex: PORTRAIT_STACK.length - i }}
              >
                <Avatar className="ring-background size-[0.7em] ring-4 md:ring-[6px]">
                  <AvatarImage src={p.src} alt="" />
                  <AvatarFallback className="text-[0.25em]">
                    {p.label.replace("@", "")[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.span>
            </TooltipTrigger>
            <TooltipContent side="top">{p.label}</TooltipContent>
          </Tooltip>
        ))}
      </span>
    </motion.span>
  </TooltipProvider>
);

export default BlogMagazine;
