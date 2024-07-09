import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
//import image from "@astrojs/image";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import vercelServerless from "@astrojs/vercel/serverless";
import node from "@astrojs/node";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  vite: {
  },
  output: 'hybrid',
  adapter: vercelServerless({
    mode: "hybrid"
  }),
  build: {
    format: "file",
  },
  integrations: [
    tailwind(),
  // image({
  // serviceEntryPoint: "@astrojs/image/sharp",
  // }),
  icon(), 
  alpinejs(),
  pagefind(),
]
});