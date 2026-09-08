"use client";

import type { ReactNode } from "react";

import { motion, type Variants } from "motion/react";

type AnnotationKey = "A" | "B" | "C" | "D" | "E" | "F";

export const ZONE_PARTS: Record<AnnotationKey, string> = {
  A: "Title bar",
  B: "Sidebar",
  C: "Signal",
  D: "Incidents",
  E: "Tiles",
  F: "Quiet state",
};

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

// pathLength + fast opacity flip = draw-on effect without a t=0 flash
const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
      opacity: { duration: 0.01 },
    },
  },
};

const pop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] },
  },
};

type SpecSchematicProps = {
  active: AnnotationKey | null;
  onHover: (key: AnnotationKey | null) => void;
};

const SpecSchematic = ({ active, onHover }: SpecSchematicProps) => {
  const isFActive = active === "F";

  return (
    <motion.svg
      viewBox="0 0 600 380"
      className="text-foreground h-auto w-full select-none"
      aria-hidden="true"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <defs>
        <pattern
          id="spec-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.05"
            strokeWidth="0.5"
          />
        </pattern>
        <clipPath id="spec-frame-clip">
          <rect x="120" y="70" width="360" height="240" rx="10" />
        </clipPath>
      </defs>

      <motion.rect
        width="600"
        height="380"
        fill="url(#spec-grid)"
        variants={fade}
        pointerEvents="none"
      />

      {/* Zone F visual — outer frame */}
      <motion.rect
        x="120"
        y="70"
        width="360"
        height="240"
        rx="10"
        stroke="currentColor"
        fill="none"
        strokeWidth={isFActive ? 1.5 : 1}
        pointerEvents="none"
        variants={draw}
        style={{
          strokeOpacity: isFActive ? 1 : 0.75,
          transition:
            "stroke-opacity 0.25s ease-out, stroke-width 0.25s ease-out",
        }}
      />

      {/* A — TITLE BAR */}
      <Zone
        keyAttr="A"
        wash={{ x: 120, y: 70, w: 360, h: 30 }}
        hitAreas={[
          { x: 120, y: 70, w: 360, h: 30 },
          { x: 0, y: 28, w: 235, h: 28 },
        ]}
        leaderD="M 220 85 V 40 H 100"
        text={{ x: 95, y: 44, anchor: "end", content: "A · TITLE BAR" }}
        active={active}
        onHover={onHover}
      >
        <motion.circle
          cx="135"
          cy="85"
          r="3"
          stroke="currentColor"
          fill="none"
          strokeOpacity="0.6"
          variants={pop}
        />
        <motion.circle
          cx="148"
          cy="85"
          r="3"
          stroke="currentColor"
          fill="none"
          strokeOpacity="0.6"
          variants={pop}
        />
        <motion.circle
          cx="161"
          cy="85"
          r="3"
          stroke="currentColor"
          fill="none"
          strokeOpacity="0.6"
          variants={pop}
        />
        <motion.line
          x1="200"
          y1="85"
          x2="360"
          y2="85"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeDasharray="1 3"
          variants={fade}
        />
        <motion.rect
          x="410"
          y="80"
          width="30"
          height="10"
          rx="2"
          stroke="currentColor"
          fill="none"
          strokeOpacity="0.3"
          variants={pop}
        />
        <motion.line
          x1="120"
          y1="100"
          x2="480"
          y2="100"
          stroke="currentColor"
          strokeOpacity="0.35"
          variants={draw}
        />
      </Zone>

      {/* B — SIDEBAR */}
      <Zone
        keyAttr="B"
        wash={{ x: 120, y: 100, w: 65, h: 210 }}
        hitAreas={[
          { x: 120, y: 100, w: 65, h: 210 },
          { x: 0, y: 196, w: 90, h: 18 },
        ]}
        leaderD="M 150 200 H 90"
        text={{ x: 85, y: 204, anchor: "end", content: "B · SIDEBAR" }}
        active={active}
        onHover={onHover}
      >
        <motion.line
          x1="185"
          y1="100"
          x2="185"
          y2="310"
          stroke="currentColor"
          strokeOpacity="0.35"
          variants={draw}
        />
        <motion.line
          x1="128"
          y1="112"
          x2="150"
          y2="112"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          variants={fade}
        />
        <motion.circle
          cx="132"
          cy="123"
          r="1"
          fill="currentColor"
          fillOpacity="0.85"
          variants={pop}
        />
        <motion.line
          x1="137"
          y1="123"
          x2="177"
          y2="123"
          stroke="currentColor"
          strokeOpacity="0.75"
          strokeWidth="1.5"
          variants={draw}
        />
        {[0, 1, 2, 3].map((i) => (
          <motion.line
            key={`svc-${i}`}
            x1="132"
            y1={133 + i * 8}
            x2="177"
            y2={133 + i * 8}
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="1"
            variants={draw}
          />
        ))}
        <motion.line
          x1="128"
          y1="180"
          x2="146"
          y2="180"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          variants={fade}
        />
        {[0, 1, 2].map((i) => (
          <motion.line
            key={`slo-${i}`}
            x1="132"
            y1={190 + i * 8}
            x2="177"
            y2={190 + i * 8}
            stroke="currentColor"
            strokeOpacity="0.28"
            strokeWidth="0.9"
            variants={draw}
          />
        ))}
      </Zone>

      {/* C — SIGNAL */}
      <Zone
        keyAttr="C"
        wash={{ x: 185, y: 100, w: 230, h: 165 }}
        hitAreas={[
          { x: 185, y: 100, w: 230, h: 165 },
          { x: 350, y: 28, w: 250, h: 28 },
        ]}
        leaderD="M 360 130 V 40 H 500"
        text={{ x: 505, y: 44, anchor: "start", content: "C · SIGNAL" }}
        active={active}
        onHover={onHover}
      >
        <motion.line
          x1="195"
          y1="108"
          x2="215"
          y2="108"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          variants={fade}
        />
        <motion.line
          x1="195"
          y1="120"
          x2="225"
          y2="120"
          stroke="currentColor"
          strokeOpacity="0.85"
          strokeWidth="2.5"
          variants={draw}
        />
        <motion.line
          x1="230"
          y1="120"
          x2="246"
          y2="120"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="1"
          variants={fade}
        />
        <motion.rect
          x="360"
          y="108"
          width="45"
          height="8"
          rx="1"
          stroke="currentColor"
          fill="none"
          strokeOpacity="0.35"
          variants={pop}
        />
        <motion.line
          x1="200"
          y1="255"
          x2="405"
          y2="255"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeDasharray="2 3"
          variants={fade}
        />
        <motion.line
          x1="200"
          y1="210"
          x2="405"
          y2="210"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeDasharray="2 3"
          variants={fade}
        />
        <motion.line
          x1="200"
          y1="165"
          x2="405"
          y2="165"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeDasharray="2 3"
          variants={fade}
        />
        <motion.polyline
          points="210,240 230,235 255,225 280,210 305,178 330,150 355,138 380,140 400,145"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.9"
          strokeWidth="1.25"
          variants={draw}
        />
        <motion.circle
          cx="355"
          cy="138"
          r="1.8"
          fill="currentColor"
          fillOpacity="0.9"
          variants={pop}
        />
        <motion.circle
          cx="355"
          cy="138"
          r="3.2"
          fill="currentColor"
          fillOpacity="0.18"
          variants={pop}
        />
      </Zone>

      {/* D — INCIDENTS */}
      <Zone
        keyAttr="D"
        wash={{ x: 415, y: 100, w: 65, h: 210 }}
        hitAreas={[
          { x: 415, y: 100, w: 65, h: 210 },
          { x: 505, y: 196, w: 95, h: 18 },
        ]}
        leaderD="M 445 200 H 500"
        text={{ x: 505, y: 204, anchor: "start", content: "D · INCIDENTS" }}
        active={active}
        onHover={onHover}
      >
        <motion.line
          x1="415"
          y1="100"
          x2="415"
          y2="310"
          stroke="currentColor"
          strokeOpacity="0.35"
          variants={draw}
        />
        <motion.line
          x1="422"
          y1="112"
          x2="446"
          y2="112"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          variants={fade}
        />
        <motion.rect
          x="462"
          y="108"
          width="12"
          height="8"
          rx="1"
          stroke="currentColor"
          fill="none"
          strokeOpacity="0.4"
          variants={pop}
        />
        <motion.circle
          cx="424"
          cy="128"
          r="1.5"
          fill="currentColor"
          fillOpacity="0.95"
          variants={pop}
        />
        <motion.line
          x1="430"
          y1="126"
          x2="470"
          y2="126"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="1.5"
          variants={draw}
        />
        <motion.line
          x1="430"
          y1="134"
          x2="458"
          y2="134"
          stroke="currentColor"
          strokeOpacity="0.32"
          strokeWidth="0.9"
          variants={draw}
        />
        <motion.circle
          cx="424"
          cy="152"
          r="1.5"
          stroke="currentColor"
          fill="none"
          strokeOpacity="0.6"
          variants={pop}
        />
        <motion.line
          x1="430"
          y1="150"
          x2="470"
          y2="150"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.2"
          variants={draw}
        />
        <motion.line
          x1="430"
          y1="158"
          x2="462"
          y2="158"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="0.9"
          variants={draw}
        />
        <motion.line
          x1="422"
          y1="240"
          x2="470"
          y2="240"
          stroke="currentColor"
          strokeOpacity="0.12"
          variants={fade}
        />
        <motion.line
          x1="422"
          y1="250"
          x2="440"
          y2="250"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          variants={fade}
        />
        <motion.line
          x1="422"
          y1="268"
          x2="470"
          y2="268"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={fade}
        />
        <motion.line
          x1="422"
          y1="268"
          x2="430"
          y2="268"
          stroke="currentColor"
          strokeOpacity="0.85"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={draw}
        />
      </Zone>

      {/* E — TILES */}
      <Zone
        keyAttr="E"
        wash={{ x: 185, y: 267, w: 230, h: 43 }}
        hitAreas={[
          { x: 185, y: 267, w: 230, h: 43 },
          { x: 0, y: 356, w: 100, h: 16 },
        ]}
        leaderD="M 220 300 V 360 H 100"
        text={{ x: 95, y: 364, anchor: "end", content: "E · TILES" }}
        active={active}
        onHover={onHover}
      >
        {[0, 1, 2, 3].map((i) => {
          const x = 200 + i * 52;
          return (
            <g key={i}>
              <motion.rect
                x={x}
                y={272}
                width="44"
                height="28"
                rx="3"
                stroke="currentColor"
                fill="none"
                strokeOpacity="0.4"
                variants={pop}
              />
              <motion.line
                x1={x + 4}
                y1={281}
                x2={x + 18}
                y2={281}
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="0.8"
                variants={fade}
              />
              <motion.line
                x1={x + 4}
                y1={291}
                x2={x + 28}
                y2={291}
                stroke="currentColor"
                strokeOpacity="0.85"
                strokeWidth="1.6"
                variants={draw}
              />
            </g>
          );
        })}
      </Zone>

      {/* F — CHROME (outer frame above is its visual) */}
      <Zone
        keyAttr="F"
        wash={null}
        hitAreas={[
          { x: 505, y: 356, w: 95, h: 16 },
          { x: 108, y: 58, w: 384, h: 14 },
          { x: 108, y: 308, w: 384, h: 14 },
          { x: 108, y: 72, w: 14, h: 236 },
          { x: 478, y: 72, w: 14, h: 236 },
        ]}
        leaderD="M 430 310 V 360 H 520"
        text={{ x: 525, y: 364, anchor: "start", content: "F · QUIET" }}
        active={active}
        onHover={onHover}
      />

      <motion.g
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1"
        fill="none"
        pointerEvents="none"
        variants={container}
        style={{
          opacity: active === null ? 1 : 0.25,
          transition: "opacity 0.25s ease-out",
        }}
      >
        <motion.line x1="120" y1="330" x2="480" y2="330" variants={draw} />
        <motion.line x1="120" y1="325" x2="120" y2="335" variants={draw} />
        <motion.line x1="480" y1="325" x2="480" y2="335" variants={draw} />
      </motion.g>
      {/* Dim via fill-opacity (not opacity) so entrance variants stay intact */}
      <motion.text
        x="300"
        y="345"
        textAnchor="middle"
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize="9"
        letterSpacing="0.18em"
        fill="currentColor"
        pointerEvents="none"
        variants={fade}
        style={{
          fillOpacity: active === null ? 0.6 : 0.15,
          transition: "fill-opacity 0.25s ease-out",
        }}
      >
        360 PX · 1 : 1
      </motion.text>
    </motion.svg>
  );
};

type Rect = { x: number; y: number; w: number; h: number };

type ZoneProps = {
  keyAttr: AnnotationKey;
  wash: Rect | null;
  hitAreas: Rect[];
  leaderD: string;
  text: {
    x: number;
    y: number;
    anchor: "start" | "end";
    content: string;
  };
  active: AnnotationKey | null;
  onHover: (key: AnnotationKey | null) => void;
  children?: ReactNode;
};

const Zone = ({
  keyAttr,
  wash,
  hitAreas,
  leaderD,
  text,
  active,
  onHover,
  children,
}: ZoneProps) => {
  const isActive = active === keyAttr;
  const isDimmed = active !== null && !isActive;

  return (
    <g
      onPointerEnter={() => onHover(keyAttr)}
      onPointerLeave={() => onHover(null)}
      style={{ cursor: "default" }}
    >
      {wash && (
        <rect
          x={wash.x}
          y={wash.y}
          width={wash.w}
          height={wash.h}
          fill="currentColor"
          rx="4"
          pointerEvents="none"
          clipPath="url(#spec-frame-clip)"
          style={{
            fillOpacity: isActive ? 0.07 : 0,
            transition: "fill-opacity 0.3s ease-out",
          }}
        />
      )}
      {wash && (
        <rect
          x={wash.x + 0.5}
          y={wash.y + 0.5}
          width={wash.w - 1}
          height={wash.h - 1}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 2"
          rx="4"
          pointerEvents="none"
          clipPath="url(#spec-frame-clip)"
          style={{
            strokeOpacity: isActive ? 0.45 : 0,
            transition: "stroke-opacity 0.3s ease-out",
          }}
        />
      )}

      {children && (
        <motion.g
          pointerEvents="none"
          initial={false}
          animate={{ opacity: isDimmed ? 0.25 : 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {children}
        </motion.g>
      )}

      {hitAreas.map((area, i) => (
        <rect
          key={i}
          x={area.x}
          y={area.y}
          width={area.w}
          height={area.h}
          fill="transparent"
          pointerEvents="all"
        />
      ))}

      <motion.path
        d={leaderD}
        stroke="currentColor"
        strokeWidth={isActive ? 1.4 : 1}
        fill="none"
        pointerEvents="none"
        variants={draw}
        style={{
          strokeOpacity: isActive ? 1 : isDimmed ? 0.12 : 0.5,
          transition:
            "stroke-opacity 0.25s ease-out, stroke-width 0.25s ease-out",
        }}
      />

      <motion.text
        x={text.x}
        y={text.y}
        textAnchor={text.anchor}
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize="9"
        letterSpacing="0.18em"
        fill="currentColor"
        pointerEvents="none"
        variants={fade}
        style={{
          fillOpacity: isActive ? 1 : isDimmed ? 0.18 : 0.75,
          transition: "fill-opacity 0.25s ease-out",
        }}
      >
        {text.content}
      </motion.text>
    </g>
  );
};

export type { AnnotationKey };
export default SpecSchematic;
