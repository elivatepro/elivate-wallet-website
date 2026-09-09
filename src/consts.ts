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
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Elivate Wallet",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};