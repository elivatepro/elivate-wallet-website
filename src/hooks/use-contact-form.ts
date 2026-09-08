"use client";

import { type FormEvent, useState } from "react";

export type ContactFormStatus = "idle" | "submitting" | "success";

const SUBMIT_DELAY = 720;
const SUCCESS_HOLD = 2800;

export function useContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<ContactFormStatus>("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    if (!email.includes("@") || !name.trim() || !message.trim()) return;
    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("success");
      window.setTimeout(() => {
        setStatus("idle");
        setName("");
        setEmail("");
        setMessage("");
      }, SUCCESS_HOLD);
    }, SUBMIT_DELAY);
  };

  return {
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    status,
    submit,
  };
}
