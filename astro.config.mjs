import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import markdoc from "@astrojs/markdoc";
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        external: ['sharp']
      }
    }
  },
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [tailwind(), icon(), alpinejs(), react(), markdoc()]
});