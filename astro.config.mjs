import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
// import image from "@astrojs/image";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  vite: {
    ssr: {
      noExternal: ["astro-google-fonts-optimizer", "plyr"],
    },
  },
  integrations: [
    tailwind(),
    // image({
      // serviceEntryPoint: "@astrojs/image/sharp",
    // }),
    icon(),
    alpinejs(),
  ],
});
