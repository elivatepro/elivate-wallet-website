"use client";

import { type FormEvent, useRef, useState } from "react";

import {
  AnimatePresence,
  cubicBezier,
  motion,
  type MotionValue,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FOOTER_NAV, SOCIAL } from "@/lib/constants";

const EASE = cubicBezier(0.16, 1, 0.3, 1);
const DURATION = { base: 0.6 } as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

const LOGO_TEXT = "Elivate.";

const SCATTER = [
  { x: "-180%", y: "-80%", r: -16 },
  { x: "200%", y: "120%", r: 12 },
  { x: "-100%", y: "150%", r: -8 },
  { x: "220%", y: "-60%", r: 18 },
  { x: "-240%", y: "50%", r: -14 },
  { x: "150%", y: "-160%", r: 10 },
  { x: "-160%", y: "-130%", r: -12 },
  { x: "260%", y: "90%", r: 16 },
  { x: "-50%", y: "180%", r: -5 },
] as const;

const LETTER_STAGGER = 0.04;
const LETTER_SPAN = 0.7;

const Letter = ({
  char,
  i,
  progress,
}: {
  char: string;
  i: number;
  progress: MotionValue<number>;
}) => {
  const scatter = SCATTER[i];
  const start = i * LETTER_STAGGER;
  const end = Math.min(start + LETTER_SPAN, 1);
  const range = [start, end];

  const x = useTransform(progress, range, [scatter.x, "0%"], { ease: EASE });
  const y = useTransform(progress, range, [scatter.y, "0%"], { ease: EASE });
  const rotate = useTransform(progress, range, [scatter.r, 0], { ease: EASE });
  const scale = useTransform(progress, range, [0.4, 1], { ease: EASE });
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <motion.span
      style={{ x, y, rotate, scale, opacity }}
      aria-hidden
      className="inline-block will-change-transform"
    >
      {char}
    </motion.span>
  );
};

type FormState = "idle" | "submitting" | "success";

const Footer = ({ copyrightYear }: { copyrightYear: number }) => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const logoRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: logoRef,
    offset: ["start end", "end center"],
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("submitting");
    setTimeout(() => {
      setState("success");
      setTimeout(() => {
        setState("idle");
        setEmail("");
      }, 2500);
    }, 550);
  };

  return (
    <motion.footer
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="dark bg-background text-foreground relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="from-foreground/12 pointer-events-none absolute inset-0 bg-radial-[ellipse_at_50%_55%] to-transparent to-65%"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 35%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 35%, black 100%)",
        }}
      />
      <div className="section-padding relative container">
        <motion.div
          variants={fadeUp}
          className="text-meta text-muted-foreground flex flex-wrap items-baseline gap-4 border-b pb-4"
        >
          <span className="flex flex-1 items-center gap-2">
            <span className="bg-foreground size-1.5 animate-pulse rounded-full" />
            End of dispatch
          </span>
          <span className="hidden md:inline">
            Built for growing networks
          </span>
          <span className="flex-1 text-end">2026.04</span>
        </motion.div>

        <h2
          ref={logoRef}
          aria-label={LOGO_TEXT}
          className="font-display mt-16 text-center leading-[0.9] tracking-tighter md:mt-24"
          style={{ fontSize: "clamp(6rem, 22vw, 22rem)" }}
        >
          {LOGO_TEXT.split("").map((char, i) => (
            <Letter key={i} i={i} char={char} progress={scrollYProgress} />
          ))}
        </h2>

        <motion.p
          variants={fadeUp}
          className="text-muted-foreground mx-auto mt-12 max-w-xl text-center text-base leading-relaxed md:text-lg"
        >
          Elivate Wallet gives growing networks a clearer way to manage member
          balances, transactions, withdrawals, and financial records.
        </motion.p>

        <motion.form
          variants={fadeUp}
          onSubmit={onSubmit}
          className="mx-auto mt-10 flex w-full max-w-lg flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-3"
        >
          <Input
            id="footer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state !== "idle"}
            autoComplete="email"
            placeholder="Work email"
            aria-label="Work email"
            className="bg-background/30 focus-visible:bg-background/50 backdrop-blur-md sm:flex-1"
          />

          <Button type="submit" disabled={state !== "idle"} aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {state === "idle" && (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, filter: "blur(6px)", y: 4 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(6px)", y: -4 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                >
                  Subscribe
                </motion.span>
              )}
              {state === "submitting" && (
                <motion.span
                  key="submitting"
                  initial={{ opacity: 0, filter: "blur(6px)", y: 4 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(6px)", y: -4 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="inline-flex items-center gap-2"
                >
                  <span className="inline-block size-2 animate-pulse rounded-full bg-current" />
                  Sending
                </motion.span>
              )}
              {state === "success" && (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, filter: "blur(6px)", y: 4 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(6px)", y: -4 }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  className="inline-flex items-center gap-2"
                >
                  Subscribed
                  <span aria-hidden>✓</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.form>

        <motion.p
          variants={fadeUp}
          className="text-meta-xs text-muted-foreground mx-auto mt-4 max-w-md text-center sm:mt-3"
        >
          Product notes and practical updates from Elivate
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="text-meta mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-y py-6 md:grid-cols-3"
        >
          {Object.entries(FOOTER_NAV).map(([group, items]) => (
            <div key={group} className="flex flex-col gap-1.5">
              <span className="text-muted-foreground/60">{group}</span>
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="text-meta text-muted-foreground mx-auto mt-10 flex max-w-3xl flex-wrap items-baseline gap-4"
        >
          <span className="flex-1">© {copyrightYear} Elivate.</span>
          <span>elivatewallet.com</span>
          <div className="flex flex-1 items-center justify-end gap-4">
            {SOCIAL.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;