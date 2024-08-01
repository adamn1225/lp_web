import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  vite: {
    // Add any Vite-specific configuration here if needed
  },
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    tailwind(),
    icon(),
    alpinejs(),
    react(),
  ],
});