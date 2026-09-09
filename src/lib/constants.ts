export const NAV = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
] as const;

export const FOOTER_NAV = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [{ label: "Blog", href: "/blog" }],
} as const;

// Public social profiles are intentionally omitted until Elivate confirms them.
export const SOCIAL = [] as const;

export const INTRO_ANIMATION = {
  /** Set to `false` to skip the homepage intro animation entirely. */
  enabled: false,
  /**
   * Cookie name used to remember that the visitor has already watched the
   * intro. Written when the animation completes; checked on every load so
   * refreshes and subsequent visits do not replay it.
   */
  cookieName: "elivate-intro-seen",
} as const;