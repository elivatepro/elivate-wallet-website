const TIMELINE = [
  { time: "03:14", event: "deploy orders-v2 (eu-west)" },
  { time: "03:17", event: "budget burn crossed 0.4" },
  { time: "03:18", event: "paged @yass" },
  { time: "03:20", event: "rollback initiated" },
  { time: "03:24", event: "resolved" },
] as const;

const ACTIONS = [
  "Rate-limit retry jitter path",
  "Alert on cross-region deploy",
  "Backfill runbook entry",
] as const;

const PostMortem = () => (
  <div className="border-foreground/15 bg-card/80 overflow-hidden rounded-sm border shadow-2xl backdrop-blur-xl select-none">
    <div className="border-foreground/10 flex items-center justify-between border-b px-5 py-3">
      <span className="text-meta text-muted-foreground">
        linear/MRD-217 · auto-drafted
      </span>
      <span className="text-meta border-foreground/15 bg-foreground/5 rounded border px-2 py-0.5">
        Draft
      </span>
    </div>
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <div className="text-meta text-muted-foreground">§ Post-mortem</div>
        <h3 className="font-display mt-2 text-2xl leading-tight tracking-tight md:text-3xl">
          queue.orders ·{" "}
          <em className="text-muted-foreground">cross-region backoff spike</em>
        </h3>
      </div>

      <dl className="border-foreground/10 grid grid-cols-3 gap-4 border-y py-4 font-mono text-xs">
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground text-[0.625rem] tracking-widest uppercase">
            Severity
          </dt>
          <dd className="text-destructive">SEV-2</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground text-[0.625rem] tracking-widest uppercase">
            Duration
          </dt>
          <dd>6m 29s</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground text-[0.625rem] tracking-widest uppercase">
            Impact
          </dt>
          <dd>p99 → 124 ms</dd>
        </div>
      </dl>

      <div>
        <div className="text-meta text-muted-foreground">Timeline</div>
        <ul className="mt-3 space-y-2 font-mono text-xs">
          {TIMELINE.map((t) => (
            <li key={t.time} className="flex items-baseline gap-3">
              <span className="text-muted-foreground w-12 shrink-0 tabular-nums">
                {t.time}
              </span>
              <span className="text-muted-foreground">·</span>
              <span>{t.event}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="text-meta text-muted-foreground">Action items</div>
        <ul className="mt-3 space-y-2 text-sm">
          {ACTIONS.map((a) => (
            <li key={a} className="flex items-start gap-2.5">
              <span className="border-foreground/30 mt-1 size-3 shrink-0 border" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default PostMortem;
