"use client";

import { useEffect } from "react";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { Turnstile } from "@/components/turnstile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/use-contact-form";
import {
  CONTACT_EMAIL,
  CONTACT_INQUIRY_TYPES,
  CONTACT_LIMITS,
  CONTACT_NETWORK_SIZES,
  type ContactInquiry,
} from "@/lib/contact";
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

const FIELD =
  "border-foreground/25 bg-foreground/5 focus-visible:border-foreground h-12 text-base focus-visible:ring-0";

const MESSAGE_PLACEHOLDER: Record<ContactInquiry, string> = {
  sales:
    "How many offices and members you have, how you track balances and withdrawals today, and what you want to improve.",
  support:
    "What you were trying to do, what happened instead, and which office or member it affects.",
  general: "How can we help?",
};

const INTRO: Record<ContactInquiry, string> = {
  sales:
    "Share your network size, how you currently manage member balances and transactions, and the problem you want to solve. We'll reply with the right next step.",
  support:
    "Tell us what you were doing and what went wrong. Include the office or member involved so we can look into it quickly.",
  general:
    "Questions, partnerships, or anything else — send it over and the right person will get back to you.",
};

const isInquiry = (value: string | null): value is ContactInquiry =>
  CONTACT_INQUIRY_TYPES.some((t) => t.value === value);

const ContactForm = () => {
  const {
    values,
    setField,
    setToken,
    tokenResetKey,
    status,
    error,
    submit,
    reset,
  } = useContactForm();
  const reduceMotion = useReducedMotion();
  const busy = status === "submitting";

  // Deep links such as /contact?topic=support#contact-form preselect a topic.
  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get("topic");
    if (isInquiry(topic)) setField("inquiry", topic);
  }, []);

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
              {INTRO[values.inquiry]}
            </p>

            <dl className="mt-10 space-y-6 md:mt-12">
              <div>
                <dt className="text-meta text-muted-foreground">
                  Prefer email?
                </dt>
                <dd className="mt-1 text-lg">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="decoration-foreground/30 hover:decoration-foreground underline underline-offset-4 transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-meta text-muted-foreground">
                  Already a customer?
                </dt>
                <dd className="text-muted-foreground mt-1 max-w-sm text-base leading-relaxed">
                  Most how-to questions are answered in the{" "}
                  <a
                    href="/docs"
                    className="text-foreground decoration-foreground/30 hover:decoration-foreground underline underline-offset-4"
                  >
                    Docs
                  </a>
                  .
                </dd>
              </div>
            </dl>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 lg:col-span-8 lg:mt-0">
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
                    duration: busy ? 1.2 : 24,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              )}
            </div>

            {status === "success" ? (
              <SuccessPanel email={values.email} onReset={reset} />
            ) : (
              <form onSubmit={submit}>
                <fieldset disabled={busy} className="divide-foreground/15 divide-y">
                  <ContactRow num="I" label="What's this about?">
                    <div
                      role="radiogroup"
                      aria-label="What's this about?"
                      className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                    >
                      {CONTACT_INQUIRY_TYPES.map((type) => {
                        const active = values.inquiry === type.value;
                        return (
                          <label
                            key={type.value}
                            className={cn(
                              "border-foreground/25 has-focus-visible:border-foreground flex cursor-pointer flex-col border px-4 py-3 transition-colors",
                              active
                                ? "border-foreground bg-foreground text-background"
                                : "bg-foreground/5 hover:border-foreground/60",
                            )}
                          >
                            <input
                              type="radio"
                              name="inquiry"
                              value={type.value}
                              checked={active}
                              onChange={() => setField("inquiry", type.value)}
                              className="sr-only"
                            />
                            <span className="font-display text-base tracking-tight">
                              {type.label}
                            </span>
                            <span
                              className={cn(
                                "text-sm leading-snug",
                                active
                                  ? "text-background/70"
                                  : "text-muted-foreground",
                              )}
                            >
                              {type.hint}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </ContactRow>

                  <ContactRow num="II" label="You">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FieldLabel htmlFor="ct-name" text="Name">
                        <Input
                          id="ct-name"
                          type="text"
                          required
                          maxLength={CONTACT_LIMITS.name}
                          value={values.name}
                          autoComplete="name"
                          onChange={(e) => setField("name", e.target.value)}
                          placeholder="Your name"
                          className={FIELD}
                        />
                      </FieldLabel>
                      <FieldLabel htmlFor="ct-email" text="Email">
                        <Input
                          id="ct-email"
                          type="email"
                          required
                          maxLength={CONTACT_LIMITS.email}
                          value={values.email}
                          autoComplete="email"
                          onChange={(e) => setField("email", e.target.value)}
                          placeholder="you@example.com"
                          className={FIELD}
                        />
                      </FieldLabel>
                    </div>
                  </ContactRow>

                  <ContactRow num="III" label="Your network" optional>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FieldLabel htmlFor="ct-org" text="Organization">
                        <Input
                          id="ct-org"
                          type="text"
                          maxLength={CONTACT_LIMITS.organization}
                          value={values.organization}
                          autoComplete="organization"
                          onChange={(e) =>
                            setField("organization", e.target.value)
                          }
                          placeholder="Network or company name"
                          className={FIELD}
                        />
                      </FieldLabel>
                      <FieldLabel htmlFor="ct-size" text="Network size">
                        <select
                          id="ct-size"
                          value={values.networkSize}
                          onChange={(e) =>
                            setField("networkSize", e.target.value)
                          }
                          className={cn(
                            FIELD,
                            "w-full appearance-none rounded-md border bg-[length:12px] bg-[right_1rem_center] bg-no-repeat px-3 pr-10 outline-none disabled:opacity-50",
                            "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='%23888' stroke-width='1.5'%3E%3Cpath d='M1 1.5l5 5 5-5'/%3E%3C/svg%3E\")]",
                            !values.networkSize && "text-muted-foreground",
                          )}
                        >
                          <option value="">Select a range</option>
                          {CONTACT_NETWORK_SIZES.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </FieldLabel>
                    </div>
                  </ContactRow>

                  <ContactRow num="IV" label="Message">
                    <Label htmlFor="ct-message" className="sr-only">
                      Message
                    </Label>
                    <Textarea
                      id="ct-message"
                      required
                      maxLength={CONTACT_LIMITS.message}
                      value={values.message}
                      onChange={(e) => setField("message", e.target.value)}
                      placeholder={MESSAGE_PLACEHOLDER[values.inquiry]}
                      rows={6}
                      className="border-foreground/25 bg-foreground/5 focus-visible:border-foreground resize-y text-base focus-visible:ring-0"
                    />
                  </ContactRow>
                </fieldset>

                <div className="mt-6 flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between md:mt-8 md:px-4">
                  <Turnstile
                    onToken={setToken}
                    resetKey={tokenResetKey}
                    className="w-full max-w-[300px] sm:w-[300px]"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className={cn(
                      "border-foreground bg-foreground text-background inline-flex items-center justify-center gap-4 self-end border-2 px-5 py-3 transition-opacity disabled:opacity-60 sm:self-auto",
                      !busy && "hover:opacity-95",
                    )}
                  >
                    <span className="font-display text-base leading-tight tracking-tight md:text-lg">
                      {busy ? "Sending…" : "Send message"}
                    </span>
                    <span className="text-meta-xs opacity-70">↵ enter</span>
                  </button>
                </div>

                <p
                  role="alert"
                  aria-live="assertive"
                  className={cn(
                    "text-destructive mt-4 px-2 text-sm md:px-4 sm:text-right",
                    !error && "sr-only",
                  )}
                >
                  {status === "error" ? error : ""}
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const SuccessPanel = ({
  email,
  onReset,
}: {
  email: string;
  onReset: () => void;
}) => (
  <div role="status" className="px-2 py-12 md:px-4 md:py-16">
    <span className="text-meta text-muted-foreground">Message sent</span>
    <p className="font-display mt-3 text-3xl leading-tight tracking-tight md:text-4xl">
      Thanks — we&rsquo;ve got it.
    </p>
    <p className="text-muted-foreground mt-4 max-w-md text-base leading-relaxed md:text-lg">
      We&rsquo;ll reply to <span className="text-foreground">{email}</span> as
      soon as we can.
    </p>
    <button
      type="button"
      onClick={onReset}
      className="decoration-foreground/30 hover:decoration-foreground mt-8 text-base underline underline-offset-4"
    >
      Send another message
    </button>
  </div>
);

const ContactRow = ({
  num,
  label,
  optional,
  children,
}: {
  num: string;
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 px-2 py-4 md:grid-cols-[5rem_1fr] md:px-4 md:py-5">
    <span
      aria-hidden
      className="font-display text-foreground text-2xl leading-tight tracking-tighter md:text-3xl"
    >
      {num}
    </span>
    <div>
      <div className="text-meta text-muted-foreground">
        {label}
        {optional && <span className="opacity-60"> · optional</span>}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  </div>
);

const FieldLabel = ({
  htmlFor,
  text,
  children,
}: {
  htmlFor: string;
  text: string;
  children: React.ReactNode;
}) => (
  <div>
    <Label
      htmlFor={htmlFor}
      className="text-muted-foreground mb-1.5 block text-sm font-normal"
    >
      {text}
    </Label>
    {children}
  </div>
);

export default ContactForm;
