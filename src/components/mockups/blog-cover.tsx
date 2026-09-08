"use client";

import { useEffect, useRef, useState } from "react";

import { motion } from "motion/react";

import { useMediaQuery } from "@/hooks/use-media-query";
import type { BlogEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const TICKER_ITEMS = [
  "№ 014 · 03:14:11",
  "L3 · 5.6 mag · billing-core",
  "№ 013 · 09:00:42",
  "delete · 217 graphs",
  "№ 012 · 11:42:08",
  "rotation · auth-mesh",
  "№ 011 · 08:15:33",
  "fewer charts · more sleep",
  "№ 010 · 14:00:00",
  "annotate the gap",
  "★ live tape ★",
] as const;

const BlogCover = ({ entry }: { entry: BlogEntry }) => (
  <div className="border-foreground relative aspect-[3/4] w-full overflow-hidden border bg-zinc-950 text-white shadow-2xl md:aspect-auto md:h-full md:min-h-[480px]">
    <ChromeShader className="absolute inset-0 -z-0 opacity-[0.55]" />

    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 via-30% to-black/55"
    />
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage: "radial-gradient(white 1px, transparent 1px)",
        backgroundSize: "5px 5px",
      }}
    />
    <span
      aria-hidden
      className="pointer-events-none absolute inset-3 border border-white/15"
    />

    <ConicHalo />

    <div className="text-meta-xs absolute top-5 right-5 left-5 flex items-baseline justify-between tracking-widest text-white/70 uppercase">
      <span>FIG · 1</span>
      <span>{entry.date}</span>
    </div>

    <div className="text-meta-xs absolute right-5 bottom-5 left-5 flex items-baseline justify-between tracking-widest text-white/70 uppercase">
      <span>L3 · 5.6 mag</span>
      <span>billing-core</span>
    </div>

    <span className="text-meta-xs absolute top-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 tracking-widest text-white/80 uppercase">
      <span className="size-1.5 animate-pulse rounded-full bg-white" />
      live
    </span>

    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
      <span className="text-meta-xs tracking-[0.3em] text-white/55 uppercase">
        A page at
      </span>
      <motion.span
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
        className="font-display mt-3 leading-[0.85] tracking-tighter tabular-nums"
        style={{ fontSize: "clamp(4.5rem, 18vw, 9rem)" }}
      >
        <motion.span
          animate={{ opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          {entry.time}
        </motion.span>
      </motion.span>
      <span className="text-meta mt-2 tracking-[0.3em] text-white/65 uppercase">
        UTC
      </span>

      <div className="mt-10 w-3/4">
        <LiveSeismograph />
      </div>
    </div>

    <Ticker />
  </div>
);

const ConicHalo = () => (
  <motion.div
    aria-hidden
    className="pointer-events-none absolute -inset-4 hidden bg-conic from-white/0 via-white/15 to-white/0 mix-blend-screen blur-xl md:block"
    animate={{ rotate: 360 }}
    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
  />
);

const LiveSeismograph = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const { isAtMost } = useMediaQuery();
  const isMobile = isAtMost("sm");

  useEffect(() => {
    if (isMobile) {
      const SAMPLES = 90;
      const W = 300;
      const BASE = 35;
      const stepX = W / (SAMPLES - 1);
      const d = Array.from({ length: SAMPLES }, (_, i) => {
        const t = i * 0.18;
        const v = Math.sin(t * 0.9) * 2.6 + Math.sin(t * 1.7) * 1.6;
        const x = i * stepX;
        const y = BASE - v;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(2)}`;
      }).join(" ");
      pathRef.current?.setAttribute("d", d);
      return;
    }

    let raf = 0;
    let frame = 0;
    let lastSpike = 0;
    let visible = true;
    const SAMPLES = 90;
    const samples: number[] = Array(SAMPLES).fill(0);

    const tick = () => {
      if (!visible) return;
      frame++;
      if (frame % 2 === 0) {
        const t = frame * 0.06;
        const noise =
          Math.sin(t * 0.9) * 2.6 +
          Math.sin(t * 1.7) * 1.6 +
          Math.sin(t * 0.4) * 1.0 +
          (Math.random() - 0.5) * 1.2;
        let val = noise;

        if (frame - lastSpike > 30 && Math.random() < 0.09) {
          val = 18 + Math.random() * 26;
          lastSpike = frame;
        }

        samples.shift();
        samples.push(val);

        const W = 300;
        const BASE = 35;
        const stepX = W / (SAMPLES - 1);
        const d = samples
          .map((s, i) => {
            const x = i * stepX;
            const y = BASE - s;
            return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(2)}`;
          })
          .join(" ");

        pathRef.current?.setAttribute("d", d);
      }

      raf = requestAnimationFrame(tick);
    };

    const path = pathRef.current;
    const observer = path
      ? new IntersectionObserver(
          ([entry]) => {
            const next = entry?.isIntersecting ?? true;
            if (next === visible) return;
            visible = next;
            if (visible) raf = requestAnimationFrame(tick);
            else cancelAnimationFrame(raf);
          },
          { rootMargin: "200px" },
        )
      : null;
    if (path && observer) observer.observe(path);

    raf = requestAnimationFrame(tick);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  return (
    <svg
      aria-hidden
      viewBox="0 0 300 60"
      preserveAspectRatio="none"
      className="h-12 w-full text-white/85"
    >
      <line
        x1="0"
        y1="35"
        x2="300"
        y2="35"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 6"
        vectorEffect="non-scaling-stroke"
        opacity="0.35"
      />
      <path
        ref={pathRef}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const Ticker = () => (
  <div className="absolute right-0 bottom-14 left-0 overflow-hidden border-t border-b border-white/15 bg-white/[0.03] py-1.5">
    <motion.div
      className="text-meta-xs flex shrink-0 gap-6 tracking-widest whitespace-nowrap text-white/75 uppercase"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
    >
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span key={i} className="flex items-center gap-6">
          <span>{item}</span>
          <span aria-hidden className="text-white/30">
            ✦
          </span>
        </span>
      ))}
    </motion.div>
  </div>
);

const CHROME_VERTEX = `
  attribute vec2 aPosition;
  void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

const CHROME_FRAGMENT = `
  precision mediump float;
  uniform float uTime;
  uniform vec2 uResolution;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 3; i++) { v += a * noise(p); p = m * p * 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    float t = uTime;

    float warpedT = t * 0.45 + sin(t * 0.14) * 1.6 + sin(t * 0.37) * 0.8;

    vec2 p = vec2(uv.x * aspect, uv.y) * 2.6;
    p.x -= warpedT;

    vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
    float f = fbm(p + 2.0 * q);

    vec3 dark = vec3(0.04, 0.05, 0.07);
    vec3 bright = vec3(0.55, 0.62, 0.74);
    vec3 chrome = mix(dark, bright, smoothstep(0.32, 0.68, f));

    float specPos = fract(warpedT * 0.08 + 0.3);
    float spec = smoothstep(0.18, 0.0, abs(uv.x - specPos));
    chrome += spec * 0.18;

    float flow = length(q - 0.5);
    float fringe = smoothstep(0.28, 0.42, flow) * 0.45;

    float hue = q.x * 2.2 + q.y * 1.3 + t * 0.18;
    vec3 rainbow = 0.5 + 0.5 * cos(6.2831 * (hue + vec3(0.0, 0.33, 0.67)));

    vec3 color = mix(chrome, rainbow * 0.55, fringe * 0.7);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const compileShader = (
  gl: WebGLRenderingContext,
  type: number,
  src: string,
) => {
  if (gl.isContextLost()) return null;
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const ChromeShader = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const { isAtMost, ready } = useMediaQuery();
  const isMobile = isAtMost("sm");

  useEffect(() => {
    if (!ready || isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      premultipliedAlpha: false,
    }) as WebGLRenderingContext | null;
    if (!gl) {
      setFailed(true);
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, CHROME_VERTEX);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, CHROME_FRAGMENT);
    const program = vs && fs ? gl.createProgram() : null;

    const release = () => {
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };

    if (!vs || !fs || !program) {
      release();
      setFailed(true);
      return;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      release();
      setFailed(true);
      return;
    }

    const aPosition = gl.getAttribLocation(program, "aPosition");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uResolution = gl.getUniformLocation(program, "uResolution");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let lastNow = performance.now();
    let contextLost = false;
    let visible = true;
    let shaderT = reduceMotion ? 7.3 : 0;

    const onLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(raf);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = entry?.isIntersecting ?? true;
        if (next === visible) return;
        visible = next;
        if (visible) {
          lastNow = performance.now();
          raf = requestAnimationFrame(renderFrame);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(canvas);

    const renderFrame = (now: number) => {
      if (contextLost || !visible) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }

      if (!reduceMotion) {
        const dt = (now - lastNow) / 1000;
        shaderT += dt * 0.4;
      }
      lastNow = now;

      gl.useProgram(program);
      gl.uniform1f(uTime, shaderT);
      gl.uniform2f(uResolution, w, h);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(renderFrame);
    };
    raf = requestAnimationFrame(renderFrame);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (buffer) gl.deleteBuffer(buffer);
      release();
    };
  }, [ready, isMobile]);

  if (ready && (isMobile || failed)) {
    return (
      <div
        aria-hidden
        className={cn(
          "animate-spin bg-conic from-zinc-950 via-zinc-600 to-zinc-950",
          className,
        )}
        style={{ animationDuration: "30s" }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none", className)}
    />
  );
};

export default BlogCover;
