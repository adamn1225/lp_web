import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import markdoc from "@astrojs/markdoc";

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [tailwind(), alpinejs(), icon(), react(), markdoc()],
  vite: {
    server: {
      middlewareMode: false, // Ensure this is set correctly
    },
  },
});