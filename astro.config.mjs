import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
// import image from "@astrojs/image";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";

import vercelServerless from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelServerless(),
  integrations: [tailwind(),
  // image({
  // serviceEntryPoint: "@astrojs/image/sharp",
  // }),
  icon(), alpinejs()],
});