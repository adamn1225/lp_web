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
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    tailwind(),
    icon(),
    alpinejs(),
    react(),
  ],
});