const WatchAlert = () => (
  // 280 + 7 / 320 + 7 — explicit width so absolute-positioned side-buttons (right: -7px) count toward the wrapper's BCR, otherwise GSAP centers on the bezel and the watch looks shifted right.
  <div className="relative mx-auto w-[287px] select-none md:w-[327px]">
    <div
      aria-hidden="true"
      className="bg-foreground/5 pointer-events-none absolute inset-0 -z-10 rounded-[3.5rem] blur-3xl"
    />
    <div className="border-foreground/30 bg-foreground/10 relative h-[360px] w-[280px] rounded-[3rem] border-[6px] p-2 shadow-2xl md:h-[420px] md:w-[320px]">
      <div
        aria-hidden="true"
        className="bg-foreground/40 absolute top-24 -right-[7px] h-8 w-[7px] rounded-r-md"
      />
      <div
        aria-hidden="true"
        className="bg-foreground/30 absolute top-36 -right-[5px] h-6 w-[5px] rounded-r-sm"
      />
      <div
        aria-hidden="true"
        className="bg-foreground/30 absolute -top-2 left-1/2 h-2 w-24 -translate-x-1/2 rounded-t-sm"
      />
      <div
        aria-hidden="true"
        className="bg-foreground/30 absolute -bottom-2 left-1/2 h-2 w-24 -translate-x-1/2 rounded-b-sm"
      />

      <div className="flex h-full flex-col rounded-[2.25rem] bg-black p-3 text-white md:p-4">
        <div className="text-meta flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
            03:17
          </span>
          <span className="opacity-60">100%</span>
        </div>

        <div className="mt-2 flex flex-1 flex-col items-center text-center md:mt-4">
          <span className="text-meta opacity-60">Meridian</span>
          <span className="text-meta mt-2 rounded-full bg-red-500 px-2.5 py-1">
            SEV-2
          </span>
          <span className="font-display mt-3 text-xl leading-tight tracking-tight text-balance md:mt-5">
            Tail latency
          </span>
          <span className="mt-1 font-mono text-[0.625rem] opacity-70">
            api.payments · us-east-1
          </span>

          <div className="mt-3 flex items-baseline gap-1.5 md:mt-6">
            <span className="font-display text-4xl leading-none tracking-tight tabular-nums md:text-5xl">
              0.41
            </span>
            <span className="font-mono text-[0.625rem] opacity-60">/ 1.00</span>
          </div>
          <span className="text-meta mt-1 opacity-60">Budget burn</span>

          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[41%] bg-red-500" />
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1 md:mt-4 md:gap-1.5">
          <button
            type="button"
            className="text-meta rounded-full bg-white py-1.5 text-black md:py-2"
          >
            Roll back
          </button>
          <button
            type="button"
            className="text-meta rounded-full border border-white/30 py-1.5 md:py-2"
          >
            Ack · watch
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default WatchAlert;
