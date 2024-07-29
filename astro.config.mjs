import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from '@astrojs/alpinejs';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel/static';
import react from '@astrojs/react';

export default defineConfig({
  vite: {
    // Add any Vite-specific configuration here if needed
  },
  output: 'static',
  adapter: vercel(),
  integrations: [
    tailwind(),
    icon(),
    alpinejs(),
    react(),
  ],
});
