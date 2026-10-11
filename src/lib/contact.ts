// Shared between the contact form (browser) and the Worker that sends it,
// so options and limits can't drift apart.

export const CONTACT_EMAIL = "hello@elivatewallet.com";

export const CONTACT_INQUIRY_TYPES = [
  {
    value: "sales",
    label: "Sales",
    hint: "Evaluating Elivate Wallet for your network",
  },
  {
    value: "support",
    label: "Support",
    hint: "Help with an existing account",
  },
  { value: "general", label: "General", hint: "Anything else" },
] as const;

export type ContactInquiry = (typeof CONTACT_INQUIRY_TYPES)[number]["value"];

export const CONTACT_NETWORK_SIZES = [
  "Up to 400 members",
  "400–1,000 members",
  "1,000–1,500 members",
  "1,500+ members",
  "Not sure yet",
] as const;

export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  organization: 160,
  message: 5000,
} as const;

export type ContactPayload = {
  inquiry: ContactInquiry;
  name: string;
  email: string;
  organization: string;
  networkSize: string;
  message: string;
};
