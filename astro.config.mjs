import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import markdoc from "@astrojs/markdoc";

export default defineConfig({
  output: 'server',
  adapter: netlify({
    edgeFunctions: true, // Enable edge functions for ISR
  }),
  integrations: [tailwind(), alpinejs(), icon(), react(), markdoc()],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'instant-booking': ['./src/components/InstantBooking.tsx'],
            // Add other chunks as needed
          }
        }
      },
      chunkSizeWarningLimit: 1000 // Adjust the limit as needed
    },
    server: {
      middlewareMode: false,
    },
  },
});