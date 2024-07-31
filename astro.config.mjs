import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import vercel from '@astrojs/vercel/serverless';
import react from '@astrojs/react';

export default defineConfig({
  vite: {
    // Add any Vite-specific configuration here if needed
  },
  output: 'server',
  adapter: vercel({
    isr: true,
  }),
  integrations: [
    tailwind(),
    icon(),
    alpinejs(),
    react(),
  ],
});