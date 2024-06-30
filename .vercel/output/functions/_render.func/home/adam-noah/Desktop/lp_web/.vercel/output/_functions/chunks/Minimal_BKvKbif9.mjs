import { k as createComponent, l as renderTemplate, n as addAttribute, p as renderComponent, q as renderSlot, t as renderHead, o as createAstro } from './astro/server_CYlBBrQa.mjs';
import 'kleur/colors';
import { s as setTitle, b as setDescription, c as $$SEO, d as $$GoogleFontsOptimizer, e as $$ScrollTop } from './Logo_PkC5nJxB.mjs';
/* empty css                           */

const $$Astro = createAstro();
const $$Minimal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Minimal;
  const { title = "", description = "", ...props } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/images/logo/logo.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}>${renderComponent($$result, "SEO", $$SEO, { "title": setTitle(title), "description": setDescription(description), ...props })}${renderComponent($$result, "GoogleFontsOptimizer", $$GoogleFontsOptimizer, { "url": [
    "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,300;8..144,400;8..144,500;8..144,600",
    "https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;600;700&display=swap"
  ] })}${renderSlot($$result, $$slots["head"])}${renderHead()}</head> <body x-data :class="{'dark':$store.app.isDark}"> <div id="Top"></div> ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "ScrollTop", $$ScrollTop, {})}  </body> </html>`;
}, "/home/adam-noah/Desktop/lp_web/src/layouts/Minimal.astro", void 0);

export { $$Minimal as $ };
