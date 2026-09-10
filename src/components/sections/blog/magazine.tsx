"use client";

import { useMemo, useState } from "react";
import { motion, type Variants } from "motion/react";

import EditorialCover from "@/components/blog/editorial-cover";
import { DottedBackdrop } from "@/components/layout/dotted-backdrop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { BlogSummary } from "@/lib/blog";

const EASE = [0.16, 1, 0.3, 1] as const;
const INITIAL_VISIBLE = 12;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const BlogMagazine = ({ posts }: { posts: BlogSummary[] }) => {
  if (posts.length === 0) return <EmptyBlog />;

  const featured = posts.find((post) => post.featured) ?? posts[0]!;
  const archive = posts.filter((post) => post.id !== featured.id);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const visible = archive.slice(0, visibleCount);
  const grouped = groupByMonth(visible);
  const categories = new Set(posts.map((post) => post.category)).size;
  const tickerItems = posts.flatMap((post) => [post.title, post.category]).slice(0, 12);
  const latestId = posts[0]?.id;
  const hasMore = visibleCount < archive.length;
  const remaining = archive.length - visibleCount;

  return (
    <>
      <Hero posts={posts} featured={featured} categoryCount={categories} />
      <Featured entry={featured} tickerItems={tickerItems} />
      <Archive
        grouped={grouped}
        total={posts.length}
        latestId={latestId}
        hasMore={hasMore}
        remaining={remaining}
        onLoadMore={() => setVisibleCount(archive.length)}
      />
    </>
  );
};

function groupByMonth(posts: BlogSummary[]) {
  const groups = new Map<string, BlogSummary[]>();
  for (const post of posts) {
    const list = groups.get(post.monthKey) ?? [];
    list.push(post);
    groups.set(post.monthKey, list);
  }
  return Array.from(groups.entries());
}

const Hero = ({
  posts,
  featured,
  categoryCount,
}: {
  posts: BlogSummary[];
  featured: BlogSummary;
  categoryCount: number;
}) => {
  const authors = useMemo(() => {
    const seen = new Set<string>();
    return posts
      .filter((post) => {
        if (seen.has(post.author.id)) return false;
        seen.add(post.author.id);
        return true;
      })
      .slice(0, 3)
      .map((post) => post.author);
  }, [posts]);

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      className="hero-padding relative overflow-hidden pb-5 md:pb-7 lg:pb-8"
    >
      <DottedBackdrop />
      <div className="relative container">
        <motion.div variants={fadeUp} className="text-meta text-muted-foreground flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-3">
          <span className="text-foreground flex items-center gap-2">
            <span className="bg-foreground size-1.5 animate-pulse rounded-full" />§ BLOG
          </span>
          <span>VOL. 01 · № {String(posts.length).padStart(3, "0")}</span>
          <span className="hidden md:inline">NOTES FROM ELIVATE</span>
          <span className="ml-auto">{posts[0]?.monthLabel.toUpperCase()} · {posts.length} PUBLISHED</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-display mt-10 flex flex-wrap items-baseline gap-x-4 tracking-tighter md:mt-14 md:flex-nowrap md:gap-x-8 lg:mt-20"
          style={{ fontSize: "clamp(5rem, 14vw, 14rem)", lineHeight: 0.85 }}
        >
          <span>Wallet</span>
          {authors.length > 0 && (
            <span aria-label="Blog authors" className="relative inline-flex shrink-0 items-center -space-x-3 md:-space-x-5 lg:-space-x-7">
              {authors.map((author) => (
                <Avatar key={author.id} className="ring-background size-[0.7em] ring-4 md:ring-[6px]">
                  {author.photo && <AvatarImage src={author.photo} alt={`Portrait of ${author.name}`} />}
                  <AvatarFallback className="text-[0.2em]">{initials(author.name)}</AvatarFallback>
                </Avatar>
              ))}
            </span>
          )}
          <em className="text-muted-foreground">notes.</em>
        </motion.h1>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1.1fr_0.9fr] md:gap-16 lg:mt-20 lg:gap-24">
          <motion.p variants={fadeUp} className="text-foreground max-w-xl text-base leading-relaxed md:text-lg lg:text-xl">
            Practical writing on clearer financial records, growing member networks, and what we’re learning as Elivate Wallet evolves.
          </motion.p>
          <motion.dl variants={fadeUp} className="text-meta text-muted-foreground grid grid-cols-3 gap-4 self-end border-t pt-4">
            <Metric label="Published" value={String(posts.length)} />
            <Metric label="Topics" value={String(categoryCount)} />
            <Metric label="Since" value="2026" />
          </motion.dl>
        </div>

        <motion.div variants={fadeUp} className="text-meta text-muted-foreground mt-16 flex items-baseline border-t pt-3 md:mt-24">
          <span className="text-foreground flex flex-1 items-center gap-2">
            <span className="bg-foreground size-1.5 rounded-full" />§ ON THE COVER · № {featured.articleNumber}
          </span>
          <span className="hidden md:inline">{featured.category.toUpperCase()} · ELIVATE WALLET</span>
          <span className="flex-1 text-end">{featured.displayDate.toUpperCase()}</span>
        </motion.div>
      </div>
    </motion.section>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt>{label}</dt>
    <dd className="font-display text-foreground mt-2 text-2xl leading-none tracking-tight md:text-3xl">{value}</dd>
  </div>
);

const Featured = ({ entry, tickerItems }: { entry: BlogSummary; tickerItems: string[] }) => (
  <motion.section variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="relative pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-28">
    <div className="container">
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16 lg:gap-24">
        <motion.div variants={container} className="flex flex-col">
          <motion.h2 variants={fadeUp} className="font-display text-5xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-7xl">{entry.title}</motion.h2>
          <motion.p variants={fadeUp} className="font-display text-muted-foreground mt-6 max-w-xl text-2xl leading-tight tracking-tight md:text-3xl">{entry.excerpt}</motion.p>
          {entry.featuredLede && (
            <motion.div variants={fadeUp} className="relative mt-10 max-w-xl border-l pl-5">
              <p className="text-foreground text-base leading-relaxed md:text-lg">{entry.featuredLede}</p>
            </motion.div>
          )}
          <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4 border-t pt-6 md:mt-12">
            <Avatar className="ring-foreground/15 size-11 shrink-0 ring-1">
              {entry.author.photo && <AvatarImage src={entry.author.photo} alt={`Portrait of ${entry.author.name}`} />}
              <AvatarFallback>{initials(entry.author.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-display text-lg leading-none tracking-tight">{entry.author.name}</div>
              <div className="text-meta-xs text-muted-foreground mt-1.5">{entry.author.role}</div>
            </div>
            <span className="text-meta-xs text-muted-foreground hidden sm:inline">{entry.readMin} min read</span>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8">
            <Button asChild size="lg"><a href={`/blog/${entry.slug}`}>Read article</a></Button>
          </motion.div>
        </motion.div>
        <motion.div variants={fadeUp} className="md:h-full"><EditorialCover entry={entry} tickerItems={tickerItems} /></motion.div>
      </div>
    </div>
  </motion.section>
);

const Archive = ({
  grouped,
  total,
  latestId,
  hasMore,
  remaining,
  onLoadMore,
}: {
  grouped: [string, BlogSummary[]][];
  total: number;
  latestId?: string;
  hasMore: boolean;
  remaining: number;
  onLoadMore: () => void;
}) => (
  <section className="relative pt-4 pb-32 md:pb-40">
    <div className="container">
      {grouped.map(([month, posts]) => (
        <MonthGroup key={month} posts={posts} latestId={latestId} />
      ))}
      <div className="mt-14 flex flex-col items-center gap-3 md:mt-20">
        {hasMore ? (
          <>
            <Button variant="secondary" size="lg" onClick={onLoadMore}>Load more articles</Button>
            <span className="text-meta-xs text-muted-foreground tracking-widest uppercase">{remaining} more published</span>
          </>
        ) : (
          <div className="flex w-full max-w-md flex-col items-center gap-3">
            <div className="flex w-full items-baseline gap-4">
              <span aria-hidden className="border-foreground/30 grow border-b border-dotted" />
              <span className="font-display text-base leading-none tracking-tight md:text-lg">§ End of archive</span>
              <span aria-hidden className="border-foreground/30 grow border-b border-dotted" />
            </div>
            <span className="text-meta-xs text-muted-foreground tracking-widest uppercase">All {total} articles</span>
          </div>
        )}
      </div>
    </div>
  </section>
);

const MonthGroup = ({ posts, latestId }: { posts: BlogSummary[]; latestId?: string }) => (
  <section className="mt-12 first:mt-0">
    <div className="text-meta text-muted-foreground mb-2 flex items-baseline gap-4">
      <span className="font-display text-foreground text-base leading-none tracking-tight md:text-lg">{posts[0]?.monthLabel}</span>
      <span aria-hidden className="border-foreground/30 grow border-b border-dotted" />
      <span>{posts.length} {posts.length === 1 ? "ARTICLE" : "ARTICLES"}</span>
    </div>
    <ul>
      {posts.map((post, index) => <ArchiveRow key={post.id} post={post} latest={post.id === latestId} index={index} />)}
    </ul>
  </section>
);

const ArchiveRow = ({ post, latest, index }: { post: BlogSummary; latest: boolean; index: number }) => (
  <motion.li initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.55, ease: EASE, delay: index * 0.04 }} className="border-b last:border-b-0">
    <a href={`/blog/${post.slug}`} className="hover:bg-foreground/[0.04] relative my-1 grid grid-cols-[96px_1fr] items-center gap-5 py-6 transition-colors md:grid-cols-[140px_5rem_1fr_auto] md:items-baseline md:gap-10 md:py-7">
      <figure className="border-foreground/15 relative w-full self-center overflow-hidden border">
        <div className="bg-muted relative aspect-[4/5] w-full overflow-hidden">
          {post.coverImage ? <img src={post.coverImage} alt="" className="absolute inset-0 size-full object-cover" /> : <div className="font-display grid size-full place-items-center text-3xl tracking-tighter">{post.articleNumber}</div>}
        </div>
        <figcaption className="text-meta-xs border-foreground/10 bg-card text-muted-foreground border-t px-2 py-1.5 text-center tracking-widest uppercase">№ {post.articleNumber}</figcaption>
      </figure>
      <div className="text-meta text-muted-foreground hidden md:block">
        <span className="tabular-nums">{post.displayDate}</span>
        {latest && <span className="text-meta-xs text-foreground mt-2 flex items-center gap-1.5 tracking-widest uppercase"><span className="bg-foreground size-1.5 animate-pulse rounded-full" />Latest</span>}
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-2xl leading-tight tracking-tight text-balance md:text-3xl lg:text-4xl">{post.title}</h3>
        <p className="text-meta text-muted-foreground mt-2">{post.excerpt}</p>
        <div className="text-meta-xs text-muted-foreground mt-3 flex flex-wrap gap-x-3 md:hidden"><span>{post.displayDate}</span><span>·</span><span>{post.author.name}</span><span>·</span><span>{post.readMin} min</span><span>·</span><span>{post.category}</span></div>
      </div>
      <div className="text-meta text-muted-foreground hidden flex-col items-end gap-1 md:flex">
        <span>{post.author.name} · {post.readMin} min</span>
        <span className="text-meta-xs tracking-widest uppercase opacity-70">{post.category}</span>
      </div>
    </a>
  </motion.li>
);

const EmptyBlog = () => (
  <>
    <motion.section variants={container} initial="hidden" animate="visible" className="hero-padding relative overflow-hidden pb-5 md:pb-7 lg:pb-8">
      <DottedBackdrop />
      <div className="relative container">
        <motion.div variants={fadeUp} className="text-meta text-muted-foreground flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-3">
          <span className="text-foreground flex items-center gap-2"><span className="bg-foreground size-1.5 animate-pulse rounded-full" />§ BLOG</span>
          <span>VOL. 01 · № 000</span><span className="hidden md:inline">NOTES FROM ELIVATE</span><span className="ml-auto">0 PUBLISHED</span>
        </motion.div>
        <motion.h1 variants={fadeUp} className="font-display mt-10 flex flex-wrap items-baseline gap-x-4 tracking-tighter md:mt-14 md:gap-x-10 lg:mt-20" style={{ fontSize: "clamp(5rem, 14vw, 14rem)", lineHeight: 0.85 }}><span>Wallet</span><em className="text-muted-foreground">notes.</em></motion.h1>
        <motion.p variants={fadeUp} className="text-muted-foreground mt-8 max-w-2xl text-base leading-relaxed md:mt-10 md:text-lg">Practical writing on clearer financial records, growing member networks, and what we’re learning as Elivate Wallet evolves.</motion.p>
        <motion.dl variants={fadeUp} className="mt-10 grid grid-cols-3 border-y md:mt-14 lg:mt-20"><div className="py-5 pr-4 md:py-7 md:pr-6"><dt className="text-meta text-muted-foreground">Published</dt><dd className="font-display mt-2 text-4xl leading-none tracking-tighter md:text-5xl">0</dd></div><div className="border-l px-4 py-5 md:px-6 md:py-7"><dt className="text-meta text-muted-foreground">Topics</dt><dd className="font-display mt-2 text-4xl leading-none tracking-tighter md:text-5xl">0</dd></div><div className="border-l py-5 pl-4 md:py-7 md:pl-6"><dt className="text-meta text-muted-foreground">Since</dt><dd className="font-display mt-2 text-4xl leading-none tracking-tighter md:text-5xl">2026</dd></div></motion.dl>
      </div>
    </motion.section>
    <section className="section-padding container">
      <div className="text-meta text-muted-foreground flex items-baseline justify-between border-b pb-4"><span>§ ARCHIVE</span><span>ALL 0 ARTICLES</span></div>
      <div className="grid min-h-[22rem] place-items-center border-b py-16 text-center md:min-h-[28rem]"><div className="max-w-xl"><p className="font-display text-4xl leading-tight tracking-tighter md:text-5xl">No articles published yet.</p><p className="text-muted-foreground mt-5 text-base leading-relaxed md:text-lg">Published notes from Elivate Wallet will appear here.</p></div></div>
      <div className="text-meta text-muted-foreground mt-5 flex items-baseline justify-between"><span>§ END OF ARCHIVE</span><span>ALL 0 ARTICLES</span></div>
    </section>
  </>
);

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export default BlogMagazine;
