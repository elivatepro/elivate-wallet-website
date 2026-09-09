# Elivate Wallet Website

Public marketing website for **Elivate Wallet**, built with Astro, React, TypeScript, Tailwind CSS, and Motion.

## Production

- Website: `https://elivatewallet.com`
- Application: `https://app.elivatewallet.com`
- Hosting: Cloudflare Pages
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`

## Local development

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Project structure

- `src/pages` — Astro routes
- `src/components` — shared React/Astro UI and page sections
- `src/content` — local content collections
- `src/styles` — global and Elivate Wallet brand styles
- `public` — static assets

## Brand and content

The public product name is **Elivate Wallet** and the company name is **Elivate**. The project uses the purchased template's layout and interaction patterns as a structural foundation while the product identity, copy, metadata, and visual system are Elivate Wallet's.

Project website decisions and approved content are governed by the Elivate Wallet project documentation in Notion.

## Intro animation

The homepage intro is controlled by `INTRO_ANIMATION` in `src/lib/constants.ts`. It is currently disabled. If re-enabled, the animation should use Elivate Wallet branding and the `elivate-intro-seen` cookie key.

## License

This repository contains a customized implementation of a commercially purchased Shadcnblocks template. See `LICENSE` for the original template license terms.