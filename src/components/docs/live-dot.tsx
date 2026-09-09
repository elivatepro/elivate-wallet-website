type LiveDotProps = {
  label?: string;
};

// Editorial "live edition" mark — pulsing dot followed by a mono label.
// Used in the meta header strip to give the page an alive heartbeat
// without resorting to busywork animation elsewhere.
export const LiveDot = ({ label = "Live edition" }: LiveDotProps) => (
  <span className="text-meta-xs text-muted-foreground inline-flex items-center gap-2">
    <span className="relative inline-flex size-1.5">
      <span
        aria-hidden
        className="elivate-pulse bg-foreground absolute inset-0 rounded-full"
      />
    </span>
    <span className="text-foreground/80">{label}</span>
  </span>
);