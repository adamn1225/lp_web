import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import markdoc from "@astrojs/markdoc";
import image from "@astrojs/image";
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://line-properties.com',
  integrations: [sitemap()],
  output: 'server',
  adapter: netlify(),
  integrations: [tailwind(), alpinejs(), icon(), react(), markdoc(), image()],
  vite: {
    server: {
      middlewareMode: false,
    },
  },
});