"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

export type Surface = "dark" | "light";
export type ElivateTheme = "chrome" | "silver" | "red" | "platinum";

export type ElivateConfig = {
  /** Global animation speed multiplier (0 = paused). */
  speed?: number;
  /** Speed variance (0 = uniform, higher = more reversals / accelerations). */
  warpAmount?: number;
  /** Noise pattern zoom. */
  patternScale?: number;
  /** Base drift rate along the ring. */
  driftSpeed?: number;
  /** Rainbow gate threshold — higher = rarer bursts. */
  rainbowRarity?: number;
  /** Max rainbow blend when burst fires. */
  rainbowIntensity?: number;
  /** Specular highlight brightness. */
  specBrightness?: number;
  /** Specular highlight band width. */
  specWidth?: number;
  /** Chrome dark↔bright separation. */
  chromeContrast?: number;
  /** Rainbow hue rotation rate. */
  hueShiftRate?: number;
  /** Ring thickness in px. */
  borderWidth?: number;
};

export type ElivateThemeConfig = {
  chromeDark: readonly [number, number, number];
  chromeBright: readonly [number, number, number];
  rainbowScale: number;
  fallbackClass: string | null;
};

// Two shader tunings — the dark orb feels glassy and deep, the light one
// feels flowy and bright. Both are `Required<ElivateConfig>` so any field the
// user doesn't override still has a concrete value.
export const ELIVATE_DEFAULTS: Record<Surface, Required<ElivateConfig>> = {
  dark: {
    speed: 1.4,
    warpAmount: 0.5,
    patternScale: 3.2,
    driftSpeed: 0.4,
    rainbowRarity: 0.1,
    rainbowIntensity: 1.4,
    specBrightness: 0.3,
    specWidth: 0.22,
    chromeContrast: 1.5,
    hueShiftRate: 0.22,
    borderWidth: 2,
  },
  light: {
    speed: 2,
    warpAmount: 1,
    patternScale: 2.2,
    driftSpeed: 0.7,
    rainbowRarity: 0.22,
    rainbowIntensity: 0.9,
    specBrightness: 0.12,
    specWidth: 0.15,
    chromeContrast: 1,
    hueShiftRate: 0.3,
    borderWidth: 1.5,
  },
};

export const ELIVATE_THEMES: Record<
  Surface,
  Record<ElivateTheme, ElivateThemeConfig>
> = {
  dark: {
    chrome: {
      chromeDark: [0.12, 0.14, 0.18],
      chromeBright: [0.96, 0.98, 1.0],
      rainbowScale: 1,
      fallbackClass: "elivate-fallback-silver",
    },
    silver: {
      chromeDark: [0.4, 0.43, 0.5],
      chromeBright: [0.99, 1.0, 1.0],
      rainbowScale: 0,
      fallbackClass: "elivate-fallback-silver",
    },
    red: {
      chromeDark: [0.55, 0.14, 0.14],
      chromeBright: [1.0, 0.92, 0.92],
      rainbowScale: 0,
      fallbackClass: "elivate-fallback-red",
    },
    platinum: {
      chromeDark: [0.78, 0.8, 0.85],
      chromeBright: [1.0, 1.0, 1.0],
      rainbowScale: 0.35,
      fallbackClass: "elivate-fallback-silver",
    },
  },
  light: {
    chrome: {
      chromeDark: [0.32, 0.36, 0.44],
      chromeBright: [0.99, 1.0, 1.0],
      rainbowScale: 1,
      fallbackClass: "elivate-fallback-silver",
    },
    silver: {
      chromeDark: [0.4, 0.43, 0.5],
      chromeBright: [0.99, 1.0, 1.0],
      rainbowScale: 0,
      fallbackClass: "elivate-fallback-silver",
    },
    red: {
      chromeDark: [0.55, 0.14, 0.14],
      chromeBright: [1.0, 0.92, 0.92],
      rainbowScale: 0,
      fallbackClass: "elivate-fallback-red",
    },
    platinum: {
      chromeDark: [0.78, 0.8, 0.85],
      chromeBright: [1.0, 1.0, 1.0],
      rainbowScale: 0.35,
      fallbackClass: "elivate-fallback-silver",
    },
  },
};

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uWarpAmount;
  uniform float uPatternScale;
  uniform float uDriftSpeed;
  uniform float uRainbowRarity;
  uniform float uRainbowIntensity;
  uniform float uSpecBrightness;
  uniform float uSpecWidth;
  uniform float uChromeContrast;
  uniform float uHueShiftRate;
  uniform vec3 uChromeDark;
  uniform vec3 uChromeBright;
  uniform float uRainbowScale;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = m * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    float t = uTime;

    float warpedT = t * uDriftSpeed
      + sin(t * 0.14 + 0.3) * 1.8 * uWarpAmount
      + sin(t * 0.37 + 2.7) * 0.9 * uWarpAmount
      + sin(t * 0.89 + 5.2) * 0.4 * uWarpAmount;

    vec2 p = vec2(uv.x * aspect, uv.y) * uPatternScale;
    p.x -= warpedT;
    p.y += sin(t * 0.2) * 0.3;

    vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
    vec2 r = vec2(
      fbm(p + 2.0 * q + vec2(1.7, 9.2)),
      fbm(p + 2.0 * q + vec2(8.3, 2.8))
    );
    float f = fbm(p + 2.0 * r);

    float lo = 0.5 - 0.3 * uChromeContrast;
    float hi = 0.5 + 0.3 * uChromeContrast;
    vec3 chrome = mix(uChromeDark, uChromeBright, smoothstep(lo, hi, f));

    float specPos = fract(warpedT * 0.08 + 0.3);
    float spec = smoothstep(uSpecWidth, 0.0, abs(uv.x - specPos));
    chrome += spec * uSpecBrightness;

    float flow = length(q - 0.5);
    float spatial = smoothstep(0.28, 0.42, flow);
    float gate = fbm(vec2(t * 0.5 + 3.7, 0.0));
    float globalBurst = smoothstep(uRainbowRarity, uRainbowRarity + 0.16, gate);
    float fringe = spatial * globalBurst * uRainbowScale;

    float hue = r.x * 2.2 + r.y * 1.3 + t * uHueShiftRate + fbm(vec2(t * 0.4, 7.3)) * 1.5;
    vec3 rainbow = 0.5 + 0.5 * cos(6.2831 * (hue + vec3(0.0, 0.33, 0.67)));

    vec3 color = mix(chrome, rainbow, fringe * uRainbowIntensity);

    float sheen = smoothstep(0.55, 0.9, fbm(p * 0.55 + t * 0.25));
    color += sheen * 0.08;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  if (gl.isContextLost()) return null;
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    if (log) console.error(log);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const MAX_WEBGL_CONTEXTS = 16;
let activeWebGLContexts = 0;

export type UseElivateCanvasOptions = {
  surface: Surface;
  theme: ElivateTheme;
  elivate?: ElivateConfig;
  fallback?: boolean;
};

/**
 * Drives a chrome-shader animation on the given canvas. Returns whether
 * WebGL failed so the caller can render its CSS fallback.
 */
export function useElivateCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { surface, theme, elivate = {}, fallback = false }: UseElivateCanvasOptions,
) {
  const themeConfig = ELIVATE_THEMES[surface][theme];
  const defaults = ELIVATE_DEFAULTS[surface];
  const [webglFailed, setWebglFailed] = useState(fallback);

  const speed = elivate.speed ?? defaults.speed;
  const warpAmount = elivate.warpAmount ?? defaults.warpAmount;
  const patternScale = elivate.patternScale ?? defaults.patternScale;
  const driftSpeed = elivate.driftSpeed ?? defaults.driftSpeed;
  const rainbowRarity = elivate.rainbowRarity ?? defaults.rainbowRarity;
  const rainbowIntensity =
    elivate.rainbowIntensity ?? defaults.rainbowIntensity;
  const specBrightness = elivate.specBrightness ?? defaults.specBrightness;
  const specWidth = elivate.specWidth ?? defaults.specWidth;
  const chromeContrast = elivate.chromeContrast ?? defaults.chromeContrast;
  const hueShiftRate = elivate.hueShiftRate ?? defaults.hueShiftRate;

  const cfgRef = useRef({
    speed,
    warpAmount,
    patternScale,
    driftSpeed,
    rainbowRarity,
    rainbowIntensity,
    specBrightness,
    specWidth,
    chromeContrast,
    hueShiftRate,
    themeConfig,
  });
  useEffect(() => {
    cfgRef.current = {
      speed,
      warpAmount,
      patternScale,
      driftSpeed,
      rainbowRarity,
      rainbowIntensity,
      specBrightness,
      specWidth,
      chromeContrast,
      hueShiftRate,
      themeConfig,
    };
  }, [
    speed,
    warpAmount,
    patternScale,
    driftSpeed,
    rainbowRarity,
    rainbowIntensity,
    specBrightness,
    specWidth,
    chromeContrast,
    hueShiftRate,
    themeConfig,
  ]);

  useEffect(() => {
    if (fallback) return;
    if (activeWebGLContexts >= MAX_WEBGL_CONTEXTS) {
      setWebglFailed(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      premultipliedAlpha: false,
    }) as WebGLRenderingContext | null;
    if (!gl) {
      setWebglFailed(true);
      return;
    }

    activeWebGLContexts++;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = vs && fs ? gl.createProgram() : null;

    const release = () => {
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      const loseExt = gl.getExtension("WEBGL_lose_context");
      if (loseExt) loseExt.loseContext();
      activeWebGLContexts--;
    };

    if (!vs || !fs || !program) {
      release();
      setWebglFailed(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      release();
      setWebglFailed(true);
      return;
    }

    const aPosition = gl.getAttribLocation(program, "aPosition");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uWarpAmount = gl.getUniformLocation(program, "uWarpAmount");
    const uPatternScale = gl.getUniformLocation(program, "uPatternScale");
    const uDriftSpeed = gl.getUniformLocation(program, "uDriftSpeed");
    const uRainbowRarity = gl.getUniformLocation(program, "uRainbowRarity");
    const uRainbowIntensity = gl.getUniformLocation(program, "uRainbowIntensity");
    const uSpecBrightness = gl.getUniformLocation(program, "uSpecBrightness");
    const uSpecWidth = gl.getUniformLocation(program, "uSpecWidth");
    const uChromeContrast = gl.getUniformLocation(program, "uChromeContrast");
    const uHueShiftRate = gl.getUniformLocation(program, "uHueShiftRate");
    const uChromeDark = gl.getUniformLocation(program, "uChromeDark");
    const uChromeBright = gl.getUniformLocation(program, "uChromeBright");
    const uRainbowScale = gl.getUniformLocation(program, "uRainbowScale");

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
    let shaderT = reduceMotion ? 7.3 : 0;

    const onLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(raf);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const renderFrame = (now: number) => {
      if (contextLost) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }

      const cfg = cfgRef.current;
      if (!reduceMotion) {
        const dt = (now - lastNow) / 1000;
        shaderT += dt * 0.35 * cfg.speed;
      }
      lastNow = now;

      gl.useProgram(program);
      gl.uniform1f(uTime, shaderT);
      gl.uniform2f(uResolution, w, h);
      gl.uniform1f(uWarpAmount, cfg.warpAmount);
      gl.uniform1f(uPatternScale, cfg.patternScale);
      gl.uniform1f(uDriftSpeed, cfg.driftSpeed);
      gl.uniform1f(uRainbowRarity, cfg.rainbowRarity);
      gl.uniform1f(uRainbowIntensity, cfg.rainbowIntensity);
      gl.uniform1f(uSpecBrightness, cfg.specBrightness);
      gl.uniform1f(uSpecWidth, cfg.specWidth);
      gl.uniform1f(uChromeContrast, cfg.chromeContrast);
      gl.uniform1f(uHueShiftRate, cfg.hueShiftRate);
      gl.uniform3f(
        uChromeDark,
        cfg.themeConfig.chromeDark[0],
        cfg.themeConfig.chromeDark[1],
        cfg.themeConfig.chromeDark[2],
      );
      gl.uniform3f(
        uChromeBright,
        cfg.themeConfig.chromeBright[0],
        cfg.themeConfig.chromeBright[1],
        cfg.themeConfig.chromeBright[2],
      );
      gl.uniform1f(uRainbowScale, cfg.themeConfig.rainbowScale);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(renderFrame);
    };
    raf = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (buffer) gl.deleteBuffer(buffer);
      release();
    };
  }, []);

  return webglFailed;
}