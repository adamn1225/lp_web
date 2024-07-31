/* empty css                                         */
import { c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CWjZw3JT.mjs';
import 'kleur/colors';
import { $ as $$Minimal } from '../chunks/Minimal_BZ7_hblr.mjs';
import { $ as $$Container, a as $$Logo } from '../chunks/Logo_CJ3dG8od.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Minimal, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main id="Error" class="min-h-screen flex flex-col items-stretch justify-between bg-muted-50 relative"> <header class="absolute top-0 start-0 z-[5] w-full px-3"> ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` <div class="flex justify-between items-center gap-3 min-h-[4.5rem]"> <a href="/" class="flex gap-4 items-center"> ${renderComponent($$result3, "Logo", $$Logo, { "class": "h-8 aspect-square" })} </a> </div> ` })} </header> <div class="flex items-center flex-grow px-6 md:px-12"> ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` <div class="relative overflow-hidden flex items-center flex-col justify-center py-12"> <div class="relative w-full"> <div class="relative z-[1]"> <img class="mx-auto w-full block" src="/images/illustrations/404.svg" alt="Error image"> <img class="hidden max-w-[580px] mx-auto w-full" src="/images/illustrations/404-dark.svg" alt="Error image"> </div> <div class="mt-4 text-center"> <h2 class="text-3xl font-semibold leading-[1.125] font-sans text-muted-900 mb-2"> <span>Page Not Found</span> </h2> <p class="text-base md:text-[1.15rem] mx-auto max-w-[27.5rem] text-muted-500 mb-4">
Oops, something went wrong and we couldn't find that page. Please try again later.
</p> <div class="flex justify-center items-center gap-2 mb-1"> <a href="/home-3" class="min-h-11 min-w-32 bg-primary-500 text-sm font-medium text-white rounded cursor-pointer flex justify-center items-center px-4 py-2 text-center hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300">Homepage</a> <a class="min-h-11 min-w-32 text-sm rounded cursor-pointer flex justify-center items-center px-4 py-2 text-muted-900 text-center bg-white borderborder-muted-200">Back</a> </div> </div> </div> </div> ` })} </div> </main> ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/pages/404.astro", void 0);

const $$file = "/home/adam-noah/Desktop/lp_web/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
