export const NAV = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
] as const;

export const FOOTER_NAV = {
  product: [
    { label: "Console", href: "/product#brief-console" },
    { label: "Log stream", href: "/product#brief-log" },
    { label: "Watch alert", href: "/product#brief-watch" },
  ],
  resources: [
    { label: "Docs", href: "/docs" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
  ],
  legal: [
    { label: "Terms", href: "/legal/terms" },
    { label: "Privacy", href: "/legal/privacy" },
  ],
} as const;

export const SOCIAL = [
  {
    label: "Twitter",
    href: "https://twitter.com/",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    external: true,
  },
  { label: "RSS", href: "/rss.xml", external: false },
] as const;

export const CONTACT_EMAIL = "talk@meridian.systems";

export const INTRO_ANIMATION = {
  /** Set to `false` to skip the homepage intro animation entirely. */
  enabled: false,
  /**
   * Cookie name used to remember that the visitor has already watched the
   * intro. Written when the animation completes; checked on every load so
   * refreshes and subsequent visits do not replay it.
   */
  cookieName: "meridian-intro-seen",
} as const;
