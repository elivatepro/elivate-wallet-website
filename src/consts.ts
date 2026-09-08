export const SITE_TITLE =
  "Meridian — one quiet console for logs, metrics, and traces";
export const SITE_DESCRIPTION =
  "OTLP-native observability that pages on error budget burn, not on noise — and auto-drafts the post-mortem before you open the laptop.";

export const SITE_METADATA = {
  title: {
    default: SITE_TITLE,
    template: "%s · Meridian",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Astro",
    "React",
    "TypeScript",
    "TailwindCSS",
    "Template",
    "Shadcn/UI",
    "Landing Page",
    "SaaS",
    "Developer Tools",
    "Observability",
  ],
  authors: [{ name: "Meridian - Shadcnblocks.com" }],
  creator: "Meridian - Shadcnblocks.com",
  publisher: "Meridian",
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
    siteName: "Meridian",
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
    creator: "@shadcnblocks",
  },
};
