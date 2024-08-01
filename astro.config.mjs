import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import netlify from '@astrojs/netlify/static';
import react from '@astrojs/react';

export default defineConfig({
  vite: {
    // Add any Vite-specific configuration here if needed
  },
  output: 'static',
  adapter: netlify(),
  integrations: [
    tailwind(),
    icon(),
    alpinejs(),
    react(),
  ],
});