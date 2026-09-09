"use client";

import { Fragment, useState } from "react";

import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", active: true },
  { label: "Analytics" },
  { label: "Customers" },
  { label: "Products" },
  { label: "Settings" },
];

const METRICS = [
  { label: "Total revenue", value: "$45,231", change: "+20.1%", up: true },
  { label: "Subscriptions", value: "2,350", change: "+12.2%", up: true },
  { label: "Active users", value: "18,942", change: "+5.4%", up: true },
  { label: "Churn rate", value: "1.2%", change: "-0.3%", up: false },
];

const REVENUE_DATA = [
  { month: "Jan", value: 18 },
  { month: "Feb", value: 22 },
  { month: "Mar", value: 19 },
  { month: "Apr", value: 28 },
  { month: "May", value: 32 },
  { month: "Jun", value: 26 },
  { month: "Jul", value: 34 },
  { month: "Aug", value: 38 },
  { month: "Sep", value: 42 },
  { month: "Oct", value: 36 },
  { month: "Nov", value: 48 },
  { month: "Dec", value: 52 },
];

const RECENT_SALES = [
  { name: "Olivia Martin", email: "olivia@email.com", amount: "+$1,999.00" },
  { name: "Jackson Lee", email: "jackson@email.com", amount: "+$39.00" },
  { name: "Isabella Nguyen", email: "isabella@email.com", amount: "+$299.00" },
  { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
  { name: "Sofia Davis", email: "sofia@email.com", amount: "+$149.00" },
];

const SIDEBAR_ITEMS = [
  { icon: "◫", label: "Dashboard", active: true },
  { icon: "⊞", label: "Projects" },
  { icon: "⊡", label: "Team" },
  { icon: "◇", label: "Reports" },
  { icon: "⚙", label: "Settings" },
];

const TRAFFIC_DATA = [
  12, 18, 14, 22, 19, 26, 24, 31, 28, 35, 32, 38, 36, 42, 39, 45, 41, 48, 44,
  52, 49, 55, 51, 58,
];

const TABLE_ROWS = [
  {
    id: "INV-001",
    customer: "Olivia Martin",
    status: "Paid",
    method: "Credit Card",
    amount: "$1,999.00",
    date: "2025-01-15",
  },
  {
    id: "INV-002",
    customer: "Jackson Lee",
    status: "Pending",
    method: "PayPal",
    amount: "$39.00",
    date: "2025-01-14",
  },
  {
    id: "INV-003",
    customer: "Isabella Nguyen",
    status: "Paid",
    method: "Bank Transfer",
    amount: "$299.00",
    date: "2025-01-13",
  },
  {
    id: "INV-004",
    customer: "William Kim",
    status: "Failed",
    method: "Credit Card",
    amount: "$99.00",
    date: "2025-01-12",
  },
  {
    id: "INV-005",
    customer: "Sofia Davis",
    status: "Paid",
    method: "Credit Card",
    amount: "$149.00",
    date: "2025-01-11",
  },
  {
    id: "INV-006",
    customer: "Liam Johnson",
    status: "Paid",
    method: "PayPal",
    amount: "$499.00",
    date: "2025-01-10",
  },
  {
    id: "INV-007",
    customer: "Emma Wilson",
    status: "Pending",
    method: "Bank Transfer",
    amount: "$799.00",
    date: "2025-01-09",
  },
  {
    id: "INV-008",
    customer: "Noah Brown",
    status: "Paid",
    method: "Credit Card",
    amount: "$249.00",
    date: "2025-01-08",
  },
];

const ACTIVITY = [
  { user: "Olivia M.", action: "upgraded to Pro plan", time: "2m ago" },
  { user: "Jackson L.", action: 'created project "Atlas"', time: "8m ago" },
  { user: "Isabella N.", action: "invited 3 team members", time: "14m ago" },
  { user: "William K.", action: "deployed to production", time: "22m ago" },
  { user: "Sofia D.", action: "completed onboarding", time: "31m ago" },
  { user: "Liam J.", action: "updated billing info", time: "45m ago" },
];

const TOP_PAGES = [
  { page: "/dashboard", views: "12,847", uniques: "8,421", bounce: "24%" },
  { page: "/pricing", views: "8,392", uniques: "6,103", bounce: "32%" },
  {
    page: "/docs/getting-started",
    views: "6,219",
    uniques: "4,887",
    bounce: "18%",
  },
  {
    page: "/blog/announcement",
    views: "4,102",
    uniques: "3,654",
    bounce: "41%",
  },
  { page: "/changelog", views: "3,847", uniques: "2,912", bounce: "29%" },
];

const PROGRESS_ITEMS = [
  { label: "United States", value: 42 },
  { label: "United Kingdom", value: 18 },
  { label: "Germany", value: 14 },
  { label: "Canada", value: 11 },
  { label: "Australia", value: 8 },
  { label: "Other", value: 7 },
];

const Dashboard = () => {
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-sm border border-neutral-700 bg-neutral-900 shadow-2xl select-none">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-neutral-700" />
          <span className="size-2.5 rounded-full bg-neutral-700" />
          <span className="size-2.5 rounded-full bg-neutral-700" />
          <span className="ml-4 hidden font-mono text-xs text-neutral-500 sm:inline">
            acme &middot; dashboard
          </span>
        </div>
        <div className="text-meta flex items-center gap-2 text-neutral-500">
          <span className="hidden rounded border border-neutral-700 px-2 py-0.5 sm:inline">
            ⌘K
          </span>
          <span className="size-5 rounded-full border border-neutral-700 bg-neutral-800" />
        </div>
      </div>

      <div className="grid grid-cols-1 text-left md:grid-cols-[160px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r border-neutral-800 py-4 md:block">
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2">
              <span
      aria-hidden="true"
      className="flex size-6 items-center justify-center rounded bg-neutral-100 text-[0.65rem] font-semibold text-neutral-900"
    >
      E
    </span>
              <span className="text-xs font-medium text-neutral-100">
                Acme Inc
              </span>
            </div>
          </div>
          <nav className="space-y-0.5 text-sm">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className={cn(
                  "flex w-full items-center gap-2.5 border-l-2 px-4 py-1.5 text-left text-xs transition-colors",
                  item.active
                    ? "border-neutral-300 bg-neutral-800 font-medium text-neutral-100"
                    : "border-transparent text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-100",
                )}
              >
                <span className="text-[0.65rem] opacity-60">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-6 border-t border-neutral-800 px-4 pt-4">
            <div className="text-meta text-neutral-500">Plan</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xs font-medium text-neutral-100">Pro</span>
              <span className="font-mono text-[0.55rem] text-neutral-500">
                · 14d left
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-800">
              <div className="h-full bg-neutral-400" style={{ width: "53%" }} />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="p-4 md:p-5">
          {/* Tab bar */}
          <div className="flex items-center gap-4 border-b border-neutral-800 pb-3">
            {NAV.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(tab.label)}
                className={cn(
                  "text-meta pb-1 transition-colors",
                  activeTab === tab.label
                    ? "border-b border-neutral-300 text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-100",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Metrics grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                onMouseEnter={() => setHoveredMetric(i)}
                onMouseLeave={() => setHoveredMetric(null)}
                className={cn(
                  "cursor-default border border-neutral-800 p-2.5 transition-colors md:p-3",
                  hoveredMetric === i && "border-neutral-700 bg-neutral-900/50",
                )}
              >
                <div className="text-meta text-neutral-500">{m.label}</div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-display text-base tracking-tight text-neutral-100 md:text-xl">
                    {m.value}
                  </span>
                </div>
                <span className="mt-0.5 inline-block font-mono text-[0.55rem] text-neutral-500">
                  {m.change} from last month
                </span>
              </div>
            ))}
          </div>

          {/* Chart + Sales */}
          <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1fr]">
            {/* Revenue chart */}
            <div className="border border-neutral-800 p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-meta text-neutral-500">
                    Revenue &middot; 2025
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-display text-2xl tracking-tight text-neutral-100 md:text-3xl">
                      $45.2K
                    </span>
                    <span className="font-mono text-[0.55rem] text-neutral-500">
                      +20.1% YoY
                    </span>
                  </div>
                </div>
                <div className="text-meta flex items-center gap-1 text-neutral-500">
                  <span className="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5">
                    Monthly
                  </span>
                  <span className="rounded border border-neutral-800 px-1.5 py-0.5">
                    Weekly
                  </span>
                </div>
              </div>
              <div className="mt-4 h-28 text-neutral-100 md:h-36">
                <BarChart
                  data={REVENUE_DATA}
                  hoveredBar={hoveredBar}
                  onHover={setHoveredBar}
                />
              </div>
            </div>

            {/* Recent sales */}
            <div className="border border-neutral-800 p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div className="text-meta text-neutral-500">Recent sales</div>
                <span className="rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 font-mono text-[0.55rem] text-neutral-500">
                  {RECENT_SALES.length} today
                </span>
              </div>
              <ul className="mt-3 space-y-3">
                {RECENT_SALES.map((sale) => (
                  <li
                    key={sale.email}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-6 items-center justify-center rounded-full bg-neutral-800 font-mono text-[0.55rem] text-neutral-100">
                        {sale.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <div>
                        <div className="text-xs leading-tight font-medium text-neutral-100">
                          {sale.name}
                        </div>
                        <div className="font-mono text-[0.55rem] text-neutral-500">
                          {sale.email}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-neutral-100 tabular-nums">
                      {sale.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Traffic area chart + Geography */}
          <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1fr]">
            <div className="border border-neutral-800 p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-meta text-neutral-500">
                    Traffic &middot; last 24h
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-display text-2xl tracking-tight text-neutral-100 md:text-3xl">
                      24.8K
                    </span>
                    <span className="font-mono text-[0.55rem] text-neutral-500">
                      visits
                    </span>
                  </div>
                </div>
                <div className="text-meta flex items-center gap-1 text-neutral-500">
                  <span className="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5">
                    24h
                  </span>
                  <span className="rounded border border-neutral-800 px-1.5 py-0.5">
                    7d
                  </span>
                  <span className="rounded border border-neutral-800 px-1.5 py-0.5">
                    30d
                  </span>
                </div>
              </div>
              <div className="mt-4 h-28 text-neutral-100 md:h-36">
                <AreaChart data={TRAFFIC_DATA} />
              </div>
            </div>

            <div className="border border-neutral-800 p-3 md:p-4">
              <div className="text-meta text-neutral-500">Top regions</div>
              <ul className="mt-4 space-y-3">
                {PROGRESS_ITEMS.map((item) => (
                  <li key={item.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-100">{item.label}</span>
                      <span className="font-mono text-neutral-500">
                        {item.value}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-neutral-800">
                      <div
                        className="h-full bg-neutral-600"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top pages */}
          <div className="mt-4 border border-neutral-800 p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="text-meta text-neutral-500">Top pages</div>
              <span className="text-meta text-neutral-500">Last 30 days</span>
            </div>
            <div className="mt-3 overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-6 gap-y-0 text-xs">
                <div className="text-meta border-b border-neutral-800 py-2 text-neutral-500">
                  Page
                </div>
                <div className="text-meta border-b border-neutral-800 py-2 text-right text-neutral-500">
                  Views
                </div>
                <div className="text-meta border-b border-neutral-800 py-2 text-right text-neutral-500">
                  Uniques
                </div>
                <div className="text-meta border-b border-neutral-800 py-2 text-right text-neutral-500">
                  Bounce
                </div>
                {TOP_PAGES.map((row) => (
                  <Fragment key={row.page}>
                    <div className="border-b border-neutral-800/50 py-2.5 font-mono text-[0.65rem] text-neutral-100">
                      {row.page}
                    </div>
                    <div className="border-b border-neutral-800/50 py-2.5 text-right font-mono text-[0.65rem] text-neutral-100 tabular-nums">
                      {row.views}
                    </div>
                    <div className="border-b border-neutral-800/50 py-2.5 text-right font-mono text-[0.65rem] text-neutral-500 tabular-nums">
                      {row.uniques}
                    </div>
                    <div className="border-b border-neutral-800/50 py-2.5 text-right font-mono text-[0.65rem] text-neutral-500 tabular-nums">
                      {row.bounce}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions table */}
          <div className="mt-4 border border-neutral-800 p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="text-meta text-neutral-500">
                Recent transactions
              </div>
              <span className="rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 font-mono text-[0.55rem] text-neutral-500">
                {TABLE_ROWS.length} records
              </span>
            </div>
            <div className="mt-3 overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-4 gap-y-0 text-xs">
                <div className="text-meta border-b border-neutral-800 py-2 text-neutral-500">
                  Invoice
                </div>
                <div className="text-meta border-b border-neutral-800 py-2 text-neutral-500">
                  Customer
                </div>
                <div className="text-meta border-b border-neutral-800 py-2 text-neutral-500">
                  Status
                </div>
                <div className="text-meta border-b border-neutral-800 py-2 text-neutral-500">
                  Method
                </div>
                <div className="text-meta border-b border-neutral-800 py-2 text-right text-neutral-500">
                  Amount
                </div>
                <div className="text-meta border-b border-neutral-800 py-2 text-right text-neutral-500">
                  Date
                </div>
                {TABLE_ROWS.map((row) => (
                  <Fragment key={row.id}>
                    <div className="border-b border-neutral-800/50 py-2.5 font-mono text-[0.65rem] text-neutral-500">
                      {row.id}
                    </div>
                    <div className="border-b border-neutral-800/50 py-2.5 text-xs text-neutral-100">
                      {row.customer}
                    </div>
                    <div className="border-b border-neutral-800/50 py-2.5">
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 font-mono text-[0.55rem]",
                          row.status === "Paid" &&
                            "bg-neutral-800 text-neutral-300",
                          row.status === "Pending" &&
                            "bg-amber-950 text-amber-400",
                          row.status === "Failed" && "bg-red-950 text-red-400",
                        )}
                      >
                        {row.status}
                      </span>
                    </div>
                    <div className="border-b border-neutral-800/50 py-2.5 font-mono text-[0.65rem] text-neutral-500">
                      {row.method}
                    </div>
                    <div className="border-b border-neutral-800/50 py-2.5 text-right font-mono text-[0.65rem] text-neutral-100 tabular-nums">
                      {row.amount}
                    </div>
                    <div className="border-b border-neutral-800/50 py-2.5 text-right font-mono text-[0.65rem] text-neutral-500 tabular-nums">
                      {row.date}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Activity feed + Quick stats */}
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr]">
            <div className="border border-neutral-800 p-3 md:p-4">
              <div className="text-meta text-neutral-500">Activity feed</div>
              <ul className="mt-3 space-y-0">
                {ACTIVITY.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 border-b border-neutral-800/50 py-3 last:border-0"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-800 font-mono text-[0.45rem] text-neutral-100">
                      {item.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs">
                        <span className="font-medium text-neutral-100">
                          {item.user}
                        </span>{" "}
                        <span className="text-neutral-500">{item.action}</span>
                      </div>
                      <div className="mt-0.5 font-mono text-[0.55rem] text-neutral-600">
                        {item.time}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <div className="border border-neutral-800 p-3 md:p-4">
                <div className="text-meta text-neutral-500">
                  Conversion rate
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl tracking-tight text-neutral-100">
                    3.24%
                  </span>
                  <span className="font-mono text-[0.55rem] text-neutral-500">
                    +0.4% from last week
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-7 gap-1">
                  {[2.8, 3.1, 2.9, 3.4, 3.2, 3.0, 3.24].map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="relative h-12 w-full overflow-hidden rounded-[1px] bg-neutral-800">
                        <div
                          className="absolute inset-x-0 bottom-0 bg-neutral-600"
                          style={{ height: `${(v / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-[0.45rem] text-neutral-600">
                        {["M", "T", "W", "T", "F", "S", "S"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-neutral-800 p-3 md:p-4">
                <div className="text-meta text-neutral-500">Server uptime</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl tracking-tight text-neutral-100">
                    99.98%
                  </span>
                  <span className="font-mono text-[0.55rem] text-neutral-500">
                    last 90 days
                  </span>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-4 flex-1 rounded-[1px]",
                        i === 17 ? "bg-neutral-400" : "bg-neutral-800/60",
                      )}
                    />
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between text-[0.45rem] text-neutral-600">
                  <span>30d ago</span>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BarChart = ({
  data,
  hoveredBar,
  onHover,
}: {
  data: typeof REVENUE_DATA;
  hoveredBar: number | null;
  onHover: (i: number | null) => void;
}) => {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex h-full items-end gap-1">
      {data.map((d, i) => {
        const height = `${(d.value / max) * 100}%`;
        return (
          <div
            key={d.month}
            className="group flex flex-1 flex-col items-center gap-1"
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
          >
            <div className="relative flex w-full flex-1 items-end">
              {hoveredBar === i && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded border border-neutral-700 bg-neutral-900 px-1.5 py-0.5 font-mono text-[0.5rem] whitespace-nowrap text-neutral-100 shadow-lg">
                  ${d.value}K
                </div>
              )}
              <div
                className={cn(
                  "w-full rounded-[1px] transition-all duration-200",
                  hoveredBar === i ? "bg-neutral-300" : "bg-neutral-700",
                )}
                style={{ height }}
              />
            </div>
            <span
              className={cn(
                "text-[0.45rem] transition-colors",
                hoveredBar === i ? "text-neutral-100" : "text-neutral-600",
              )}
            >
              {d.month}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const AreaChart = ({ data }: { data: number[] }) => {
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
        <linearGradient id="dash-area-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
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
        fill="url(#dash-area-fill)"
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

export default Dashboard;
