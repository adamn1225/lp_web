import { defineConfig } from 'astro/config';
import markdoc from "@astrojs/markdoc";
import image from "@astrojs/image";
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://line-properties.com',
  output: 'server',
  adapter: netlify(),
  integrations: [
    tailwind(),
    alpinejs(),
    icon(),
    react(),
    markdoc(),
    image(),
    sitemap(),
  ],
  vite: {
    server: {
      middlewareMode: false,
    },
  },
});