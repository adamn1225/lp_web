import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import vercel from '@astrojs/vercel/static';
import react from '@astrojs/react';

// https://astro.build/config
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
    // Uncomment and configure if you need image support
    // image({
    //   serviceEntryPoint: "@astrojs/image/sharp",
    // }),
  ],

});