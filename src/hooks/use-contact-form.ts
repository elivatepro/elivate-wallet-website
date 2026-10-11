"use client";

import { type FormEvent, useState } from "react";

import { CONTACT_EMAIL, type ContactPayload } from "@/lib/contact";

export type ContactFormStatus = "idle" | "submitting" | "success" | "error";

const INITIAL: ContactPayload = {
  inquiry: "sales",
  name: "",
  email: "",
  organization: "",
  networkSize: "",
  message: "",
};

export function useContactForm() {
  const [values, setValues] = useState<ContactPayload>(INITIAL);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  // Turnstile tokens are single-use; bumping this asks the widget for a new one.
  const [tokenResetKey, setTokenResetKey] = useState(0);

  const setField = <K extends keyof ContactPayload>(
    key: K,
    value: ContactPayload[K],
  ) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (status === "error") setStatus("idle");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    if (!token) {
      setStatus("error");
      setError("Please complete the verification check above the button.");
      return;
    }

    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: token }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok: boolean;
        error?: string;
      } | null;
      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.error ??
            `Something went wrong. Please email ${CONTACT_EMAIL} directly.`,
        );
      }
      // The token was spent on this submission; a later message needs a new one.
      setToken(null);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : `We couldn't reach the server. Please email ${CONTACT_EMAIL} directly.`,
      );
      setTokenResetKey((k) => k + 1);
    }
  };

  const reset = () => {
    setValues((v) => ({ ...INITIAL, inquiry: v.inquiry }));
    setStatus("idle");
    setError(null);
    setTokenResetKey((k) => k + 1);
  };

  return {
    values,
    setField,
    setToken,
    tokenResetKey,
    status,
    error,
    submit,
    reset,
  };
}
