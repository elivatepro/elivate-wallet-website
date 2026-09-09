// Elivate console mockup — main product surface, used across sections

const SIDEBAR_SERVICES = [
  { name: "api.payments", status: "warn" },
  { name: "edge.cdn", status: "ok" },
  { name: "worker.billing", status: "ok" },
  { name: "queue.orders", status: "ok" },
  { name: "store.pg", status: "ok" },
];

const SIDEBAR_SLOS = [
  { name: "payments api", value: "99.997%" },
  { name: "checkout flow", value: "99.991%" },
  { name: "search edge", value: "99.983%" },
];

const TILES = [
  { label: "p50", value: "4.2", unit: "ms" },
  { label: "p95", value: "18.7", unit: "ms" },
  { label: "errors", value: "0.02", unit: "%" },
  { label: "rps", value: "42.1K", unit: "rps" },
];

const INCIDENTS = [
  {
    severity: "SEV-2",
    title: "Degraded tail latency",
    service: "api.payments · us-east-1",
    time: "12m",
    destructive: true,
  },
  {
    severity: "SEV-3",
    title: "DB pool near capacity",
    service: "store.pg-primary",
    time: "02h",
    destructive: false,
  },
];

const CHART = [
  4, 4.2, 4.1, 4.4, 4.3, 4.5, 4.2, 4.6, 4.9, 5.4, 6.2, 7.6, 9.4, 11.8, 14.2,
  16.5, 18.1, 18.6, 18.7, 18.4, 17.9, 17.2, 16.8, 16.4,
];

const Console = () => (
  <div className="border-foreground/15 bg-card/80 overflow-hidden rounded-sm border shadow-2xl backdrop-blur-xl select-none">
    {/* Window chrome */}
    <div className="border-foreground/10 flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="bg-foreground/20 size-2.5 rounded-full" />
        <span className="bg-foreground/20 size-2.5 rounded-full" />
        <span className="bg-foreground/20 size-2.5 rounded-full" />
        <span className="text-muted-foreground ml-4 hidden font-mono text-xs sm:inline">
          elivate &middot; api.payments &middot; us-east-1
        </span>
      </div>
      <div className="text-meta text-muted-foreground flex items-center gap-2">
        <span className="border-foreground/15 hidden rounded border px-2 py-0.5 sm:inline">
          ⌘K
        </span>
        <span>14:32 UTC</span>
      </div>
    </div>

    <div className="grid grid-cols-1 text-left md:grid-cols-[180px_1fr_240px]">
      <aside className="border-foreground/10 hidden border-r py-5 md:block">
        <div className="text-meta text-muted-foreground px-4">Services</div>
        <ul className="mt-3 space-y-0.5 text-sm">
          {SIDEBAR_SERVICES.map((s, i) => (
            <li
              key={s.name}
              className={
                i === 0
                  ? "border-foreground bg-foreground/10 flex items-center justify-between border-l-2 px-4 py-1.5 font-medium"
                  : "text-muted-foreground flex items-center justify-between border-l-2 border-transparent px-4 py-1.5"
              }
            >
              <span className="font-mono text-xs">{s.name}</span>
              <span
                className={
                  s.status === "warn"
                    ? "bg-foreground size-1.5 rounded-full"
                    : "bg-muted-foreground/40 size-1.5 rounded-full"
                }
              />
            </li>
          ))}
        </ul>

        <div className="text-meta text-muted-foreground mt-6 px-4">
          SLOs &middot; 30d
        </div>
        <ul className="mt-3 space-y-2.5 px-4 text-xs">
          {SIDEBAR_SLOS.map((s) => (
            <li
              key={s.name}
              className="text-muted-foreground flex items-center justify-between"
            >
              <span>{s.name}</span>
              <span className="text-foreground font-mono">{s.value}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-meta text-muted-foreground">
              P95 latency &middot; last 24h
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-4xl leading-none tracking-tight md:text-5xl">
                18.7
              </span>
              <span className="text-muted-foreground text-sm">ms</span>
              <span className="text-muted-foreground ml-2 font-mono text-xs">
                &#9662; 2.3ms
              </span>
            </div>
          </div>
          <div className="text-meta text-muted-foreground flex items-center gap-1">
            <span className="border-foreground/20 bg-foreground/5 rounded border px-2 py-1">
              24h
            </span>
            <span className="border-foreground/10 rounded border px-2 py-1">
              7d
            </span>
            <span className="border-foreground/10 rounded border px-2 py-1">
              30d
            </span>
          </div>
        </div>

        <div className="text-foreground mt-4 h-24 md:mt-5 md:h-40">
          <LatencyChart data={CHART} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 md:mt-5">
          {TILES.map((t) => (
            <div
              key={t.label}
              className="border-foreground/10 border p-2 md:p-3"
            >
              <div className="text-meta text-muted-foreground">{t.label}</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-base tracking-tight md:text-xl">
                  {t.value}
                </span>
                <span className="text-muted-foreground font-mono text-[0.625rem] uppercase">
                  {t.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="border-foreground/10 hidden border-l p-4 md:block">
        <div className="flex items-center justify-between">
          <span className="text-meta text-muted-foreground">Active rooms</span>
          <span className="border-foreground/15 bg-foreground/5 text-muted-foreground rounded border px-1.5 py-0.5 font-mono text-[0.625rem]">
            {INCIDENTS.length}
          </span>
        </div>

        <ul className="mt-3 space-y-4">
          {INCIDENTS.map((inc, i) => (
            <li key={i} className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={
                    inc.destructive
                      ? "bg-destructive size-1.5 rounded-full"
                      : "bg-foreground size-1.5 rounded-full"
                  }
                />
                <span className="text-meta text-muted-foreground">
                  {inc.severity}
                </span>
                <span className="text-muted-foreground ml-auto font-mono text-[0.625rem]">
                  {inc.time}
                </span>
              </div>
              <div className="text-xs leading-snug">{inc.title}</div>
              <div className="text-muted-foreground font-mono text-[0.625rem]">
                {inc.service}
              </div>
            </li>
          ))}
        </ul>

        <div className="border-foreground/10 mt-6 border-t pt-4">
          <div className="text-meta text-muted-foreground">Budget burn</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-2xl tracking-tight">0.08</span>
            <span className="text-muted-foreground font-mono text-[0.625rem]">
              of 1.00
            </span>
          </div>
          <div className="bg-foreground/10 mt-2 h-1 overflow-hidden rounded-full">
            <div className="bg-foreground h-full" style={{ width: "8%" }} />
          </div>
        </div>
      </aside>
    </div>
  </div>
);

const LatencyChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 100;
  const H = 100;
  const pt = (v: number, i: number) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * 78 - 10;
    return { x, y };
  };
  const points = data.map((v, i) => pt(v, i));
  const lineStr = points.map((p) => `${p.x},${p.y}`).join(" ");
  const tip = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="console-chart-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 50, 75].map((y) => (
        <line
          key={y}
          x1={0}
          x2={W}
          y1={y}
          y2={y}
          stroke="currentColor"
          strokeOpacity={0.08}
          strokeDasharray="1 2"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <polyline
        points={`0,${H} ${lineStr} ${W},${H}`}
        fill="url(#console-chart-fill)"
      />
      <polyline
        points={lineStr}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={tip.x}
        cy={tip.y}
        r="1.2"
        fill="currentColor"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={tip.x}
        cy={tip.y}
        r="2.5"
        fill="currentColor"
        fillOpacity="0.18"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default Console;
