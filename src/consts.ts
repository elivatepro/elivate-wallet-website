export const SITE_TITLE =
  "Elivate Wallet — A Wallet That Scales With Your Network";
export const SITE_DESCRIPTION =
  "Clear balances, transaction records, withdrawal management, and organization-wide financial visibility for growing member networks.";

export const SITE_METADATA = {
  title: {
    default: SITE_TITLE,
    template: "%s · Elivate Wallet",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Elivate Wallet",
    "team financial management",
    "member balances",
    "transaction records",
    "withdrawal management",
    "financial visibility",
    "network management",
    "bookkeeping",
  ],
  authors: [{ name: "Elivate" }],
  creator: "Elivate",
  publisher: "Elivate",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Elivate Wallet",
    locale: "en_US",
    image: {
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "Elivate Wallet — A wallet that scales with your network.",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};