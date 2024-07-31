/* empty css                                         */
import { c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CWjZw3JT.mjs';
import 'kleur/colors';
import { a as $$PropertySearch, $ as $$Icon } from '../chunks/Footer_C2ptFNbc.mjs';
import { $ as $$Split } from '../chunks/Split_D-431LXF.mjs';
import { $ as $$Section } from '../chunks/Section_BLNnwPBI.mjs';
import { $ as $$Container } from '../chunks/Logo_CJ3dG8od.mjs';
export { renderers } from '../renderers.mjs';

const $$Properties = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Split, { "title": "Properties" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main id="Properties"> <!--Properties--> ${renderComponent($$result2, "Section", $$Section, { "gray": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Container", $$Container, {}, { "default": ($$result4) => renderTemplate` <div class="max-w-3xl mx-auto mb-24"> <div class="pt-16 pb-6"> <h1 class="text-5xl font-sans text-muted-900 font-light text-center mb-2">Explore Vacation</h1> <h2 class="text-xl text-muted-500 leading-5 text-center">We help you find the perfect space for you and your family.</h2> </div> <!-- search --> ${renderComponent($$result4, "PropertySearch", $$PropertySearch, {})} </div> <div class="flex items-center"> <div class="relative"> <h2 class="text-3xl font-sans text-muted-900">Available properties</h2> <h4 class="text-base text-muted-500 leading-5">We found 345 matching properties</h4> </div> <div class="hidden md:flex items-center justify-end ms-auto"> <div class="relative"> <input type="text" class="w-full peer outline-none focus:outline-none p-3 ps-12 border-muted-200 hover:border-muted-300 text-muted-600 placeholder:text-muted-200 transition-all duration-300 rounded h-12 text-base" placeholder="Filter..."> <div class="peer-focus:[&>svg]:text-primary-500 absolute start-0 top-0 grid place-items-center h-12 w-12"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "size-5 text-muted-300 stroke-[1.6px] transition-all duration-300", "name": "lucide:search" })} </div> </div> </div> </div>  <div class="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <!-- {properties.map((property) => <PropertyCard {...property} />)} --> </div>  <div class="py-12"> <nav class="flex flex-wrap justify-center md:justify-between items-center text-base gap-2" role="navigation"> <a class="flex-1 md:flex-initial order-1 md:order-2 min-w-[40px] min-h-[40px] transition-all duration-300 hover:border-primary hover:text-primary-500 border border-muted-200 bg-white items-center justify-center inline-flex p-2 rounded cursor-pointer"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "h-4", "name": "lucide:arrow-left" })} </a> <a class="flex-1 md:flex-initial order-2 md:order-3 min-w-[40px] min-h-[40px] transition-all duration-300 hover:border-primary hover:text-primary-500 border border-muted-200 bg-white justify-center items-center inline-flex p-2 rounded cursor-pointer"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "h-4", "name": "lucide:arrow-right" })} </a> <ul class="flex-grow flex-shrink flex justify-center md:justify-start items-center gap-1 list-none w-full md:w-auto order-3 md:order-1"> <li> <a class="min-w-10 cursor-pointer rounded text-muted-900 border border-muted-200 bg-white shrink-0 justify-center inline-flex p-2 text-base" aria-label="Goto page 1">1</a> </li> <li> <span class="pagination-ellipsis text-muted-400 text-base p-2 justify-center flex">&hellip;</span> </li> <li> <a class="min-w-10 cursor-pointer rounded text-muted-900 border border-muted-200 bg-white shrink-0 justify-center inline-flex p-2 text-base" aria-label="Goto page 45">45</a> </li> <li> <a class="min-w-10 cursor-pointer rounded text-white border bg-primary-500 shrink-0 justify-center inline-flex p-2 text-base shadow-lg shadow-primary-500/20" aria-label="Page 46" aria-current="page">46</a> </li> <li> <a class="min-w-10 cursor-pointer rounded text-muted-900 border border-muted-200 bg-white shrink-0 justify-center inline-flex p-2 text-base" aria-label="Goto page 47">47</a> </li> <li> <span class="pagination-ellipsis text-muted-400 text-base p-2 justify-center flex">&hellip;</span> </li> <li> <a class="min-w-10 cursor-pointer rounded text-muted-900 border border-muted-200 bg-white shrink-0 justify-center inline-flex p-2 text-base" aria-label="Goto page 86">86</a> </li> </ul> </nav> </div> ` })} ` })} </main> ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/pages/properties.astro", void 0);

const $$file = "/home/adam-noah/Desktop/lp_web/src/pages/properties.astro";
const $$url = "/properties";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Properties,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
