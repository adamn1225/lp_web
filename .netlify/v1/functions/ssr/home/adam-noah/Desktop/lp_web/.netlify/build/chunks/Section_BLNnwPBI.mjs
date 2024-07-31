import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as addAttribute, e as renderSlot, b as createAstro } from './astro/server_CWjZw3JT.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro();
const $$Section = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Section;
  const { oveflow = false, gray = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(["pt-16 overflow-hidden md:overflow-auto", [
    oveflow ? "" : "overflow-hidden",
    gray ? "bg-muted-50 dark:bg-muted-900" : "bg-white dark:bg-muted-900 "
  ]], "class:list")}> ${renderSlot($$result, $$slots["default"])} </section>`;
}, "/home/adam-noah/Desktop/lp_web/src/components/Section.astro", void 0);

export { $$Section as $ };
