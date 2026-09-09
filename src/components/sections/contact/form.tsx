"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/use-contact-form";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = { base: 0.8 } as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

const ROWS = [
  { num: "I", label: "Your name" },
  { num: "II", label: "Email" },
  { num: "III", label: "Message" },
] as const;

const ContactForm = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    status,
    submit,
  } = useContactForm();
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      id="contact-form"
      className="scroll-mt-24"
    >
      <div className="section-padding container">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <motion.div
            variants={fadeUp}
            className="lg:col-span-4 lg:pr-12 xl:pr-16"
          >
            <span className="text-meta text-muted-foreground">Contact</span>
            <h2 className="mt-3 text-4xl leading-[1.1] tracking-tight text-balance md:text-5xl">
              <em className="text-muted-foreground">Tell us</em> what you need.
            </h2>
            <p className="text-muted-foreground mt-6 max-w-sm text-base leading-relaxed md:mt-8 md:text-lg">
              Share your network size, how you currently manage member balances
              and transactions, and the problem you want to solve. That gives us
              the context to understand the right next step.
            </p>
          </motion.div>

          <motion.form
            variants={fadeUp}
            onSubmit={submit}
            className="mt-12 lg:col-span-8 lg:mt-0"
          >
            <div
              aria-hidden
              className="bg-foreground/15 relative h-1 overflow-hidden"
            >
              {!reduceMotion && (
                <motion.span
                  className="via-foreground absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 24,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              )}
            </div>
            <div className="divide-foreground/15 divide-y">
              <ContactRow
                num={ROWS[0].num}
                label={ROWS[0].label}
                htmlFor="ct-name"
              >
                <Input
                  id="ct-name"
                  type="text"
                  value={name}
                  autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                  disabled={status !== "idle"}
                  placeholder="Your name"
                  className="border-foreground/25 bg-foreground/5 focus-visible:border-foreground h-12 text-base focus-visible:ring-0"
                />
              </ContactRow>
              <ContactRow
                num={ROWS[1].num}
                label={ROWS[1].label}
                htmlFor="ct-email"
              >
                <Input
                  id="ct-email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status !== "idle"}
                  placeholder="you@example.com"
                  className="border-foreground/25 bg-foreground/5 focus-visible:border-foreground h-12 text-base focus-visible:ring-0"
                />
              </ContactRow>
              <ContactRow
                num={ROWS[2].num}
                label={ROWS[2].label}
                htmlFor="ct-message"
              >
                <Textarea
                  id="ct-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={status !== "idle"}
                  placeholder="Tell us about your network and what you want to improve."
                  rows={6}
                  className="border-foreground/25 bg-foreground/5 focus-visible:border-foreground resize-y text-base focus-visible:ring-0"
                />
              </ContactRow>
            </div>

            <div className="mt-6 flex justify-end px-2 md:mt-8 md:px-4">
              <button
                type="submit"
                disabled={status !== "idle"}
                aria-live="polite"
                className={cn(
                  "border-foreground bg-foreground text-background inline-flex items-center gap-4 border-2 px-5 py-3 transition-opacity disabled:opacity-60",
                  status === "idle" && "hover:opacity-95",
                )}
              >
                <span className="font-display text-base leading-tight tracking-tight md:text-lg">
                  {status === "success"
                    ? "Message received ✓"
                    : status === "submitting"
                      ? "Sending…"
                      : "Send message"}
                </span>
                <span className="text-meta-xs opacity-70">↵ enter</span>
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
};

const ContactRow = ({
  num,
  label,
  htmlFor,
  children,
}: {
  num: string;
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 px-2 py-4 md:grid-cols-[5rem_1fr] md:px-4 md:py-5">
    <Label
      htmlFor={htmlFor}
      className="font-display text-foreground text-2xl leading-tight tracking-tighter md:text-3xl"
    >
      {num}
    </Label>
    <div>
      <div className="text-meta text-muted-foreground">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  </div>
);

export default ContactForm;