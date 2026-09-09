import { cn } from "@/lib/utils";

const LINES = [
  { time: "03:17:42", msg: "slo.burn 0.03 → 0.41", level: "warn" },
  { time: "03:17:42", msg: "room.open #sev-2-payments", level: "info" },
  { time: "03:17:44", msg: "page.dispatch on-call:@yass", level: "alert" },
  { time: "03:17:48", msg: "suspects.collect (12 services)", level: "info" },
  { time: "03:17:48", msg: "commits.fetch last_3", level: "info" },
  { time: "03:18:02", msg: "draft.init post-mortem MRD-217", level: "info" },
  { time: "03:18:07", msg: "match queue.orders · backoff", level: "info" },
  { time: "03:20:33", msg: "@yass rollback.confirm", level: "ok" },
  { time: "03:24:11", msg: "slo.burn 0.41 → 0.08", level: "ok" },
  { time: "03:24:11", msg: "room.close files:linear/MRD-217", level: "info" },
] as const;

const LogStream = () => (
  <div className="border-foreground/15 bg-card/80 overflow-hidden rounded-sm border shadow-2xl backdrop-blur-xl select-none">
    <div className="border-foreground/10 flex items-center justify-between border-b px-4 py-3">
      <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
        <span className="bg-destructive size-2 animate-pulse rounded-full" />
        <span className="hidden sm:inline">elivate/log · </span>
        api.payments · sev-2
      </div>
      <span className="text-meta border-foreground/15 text-muted-foreground rounded border px-2 py-0.5">
        Live
      </span>
    </div>
    <div className="divide-foreground/5 divide-y font-mono text-xs">
      {LINES.map((l, i) => (
        <div
          key={i}
          className="grid grid-cols-[5rem_auto_1fr] items-center gap-3 px-4 py-2 md:gap-4"
        >
          <span className="text-muted-foreground tabular-nums">{l.time}</span>
          <span
            className={cn(
              l.level === "alert" && "text-destructive",
              l.level === "warn" && "text-foreground",
              l.level === "ok" && "text-foreground/60",
              l.level === "info" && "text-muted-foreground",
            )}
          >
            ▸
          </span>
          <span
            className={cn(
              "truncate",
              l.level === "alert" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {l.msg}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default LogStream;
