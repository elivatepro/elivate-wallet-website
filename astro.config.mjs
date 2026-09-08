// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://meridian-astro-template.vercel.app',
  integrations: [mdx(), sitemap(), react()],

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'DM Sans',
      cssVariable: '--font-family-sans',
      weights: ['400', '500', '600', '700'],
    },
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-family-display',
      weights: ['400', '500', '600', '700'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-family-mono',
      weights: ['400', '500', '600'],
    },
  ],

  markdown: {
    syntaxHighlight: false,
  },

  vite: {
    // @ts-expect-error – two vite copies exist in node_modules (one in astro/, one top-level); their Plugin types diverge but the plugin works at runtime.
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    ssr: {
      noExternal: ['radix-ui', /^@radix-ui\//, 'motion'],
    },
  },
});
