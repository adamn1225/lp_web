import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from '@astrojs/alpinejs';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel/static';
import react from '@astrojs/react';
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  build: {
    outDir: 'dist'
  },
  vite: {
    // Add any Vite-specific configuration here if needed
  },
  output: 'hybrid',
  adapter: vercel(),
  integrations: [tailwind(), icon(), alpinejs(), react()]
});