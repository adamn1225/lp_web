/* empty css                                         */
import { c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CWjZw3JT.mjs';
import 'kleur/colors';
import { $ as $$Minimal } from '../chunks/Minimal_BZ7_hblr.mjs';
import { $ as $$Container, a as $$Logo } from '../chunks/Logo_CJ3dG8od.mjs';
export { renderers } from '../renderers.mjs';

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Minimal, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main id="Contact" class="relative"> <!-- embed map --> <div class="absolute top-0 start-0 px-4 z-[3] w-full h-[70px] flex items-center"> ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` <a href="/" class="flex gap-4 items-center"> ${renderComponent($$result3, "Logo", $$Logo, { "class": "h-10 aspect-square" })} <p class="font-medium text-2xl font-sans text-muted-900"></p> </a> ` })} </div> <div id="hero-map" class="min-h-screen flex items-stretch flex-col justify-between relative z-[2]"> <div class="flex items-center flex-grow md:p-12 relative z-[2]"> ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` <div class="flex flex-col-reverse md:flex-row items-center"> <div class="p-3 md:w-1/2"></div> <div class="p-3 md:w-1/2"> <div class="p-12 max-w-[440px] mx-auto shadow-lg shadow-muted-300/30bg-white border border-muted-200 rounded relative"> <div class="relative"> <h2 class="mb-6 text-xl font-semibold font-sans text-muted-900">Wondering about something? Feel free to write us a message.</h2> <form class="flex flex-col gap-3"> <div class="relative"> <div class="relative"> <input type="text" class="w-full peer outline-none focus:outline-none p-3 border border-muted-200 hover:border-muted-300 text-muted-600 placeholder:text-muted-200 transition-all duration-300 rounded h-12 text-base" placeholder="Full Name"> </div> </div> <div class="relative"> <div class="relative"> <input type="text" class="w-full peer outline-none focus:outline-none p-3 border border-muted-200 hover:border-muted-300 text-muted-600 placeholder:text-muted-200 transition-all duration-300 rounded h-12 text-base" placeholder="Email Address"> </div> </div> <div class="relative"> <div class="relative"> <textarea class="max-h-[40em] min-h-[8em] w-full peer outline-none focus:outline-none p-3 border border-muted-200 hover:border-muted-300 text-muted-600 placeholder:text-muted-200 transition-all duration-300 rounded text-base" placeholder="Your message..."></textarea> </div> </div> <div class="relative"> <div class="relative"> <a class="min-h-12 bg-primary-500 rounded font-medium text-sm w-full px-4 py-2 flex justify-center items-center text-white transition-all duration-300">Send Message</a> </div> </div> <a href="#" class="text-xs font-medium text-primary-500 mx-auto cursor-pointer">We always reply!</a> </form> </div> </div> </div> </div> ` })} </div> </div> </main> ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/pages/contact.astro", void 0);

const $$file = "/home/adam-noah/Desktop/lp_web/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };