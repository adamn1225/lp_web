import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';

export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        external: ['sharp']
      }
    }
  },
  output: 'server',
  adapter: netlify(),
  integrations: [
    tailwind(),
    icon(),
    alpinejs(),
    react(),
  ],
});