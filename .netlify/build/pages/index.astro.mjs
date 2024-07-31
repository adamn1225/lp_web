/* empty css                                         */
import { c as createComponent, r as renderTemplate, m as maybeRenderHead, a as addAttribute, b as createAstro, d as renderComponent } from '../chunks/astro/server_CWjZw3JT.mjs';
import 'kleur/colors';
import { $ as $$Split } from '../chunks/Split_D-431LXF.mjs';
import { $ as $$Section } from '../chunks/Section_BLNnwPBI.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$GuestyListings = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$GuestyListings;
  const apiToken = "your_old_bearer_token";
  const response = await fetch("https://open-api.guesty.com/v1/listings?limit=20&skip=21", {
    headers: {
      "Authorization": `Bearer ${apiToken}`
    }
  });
  const data = await response.json();
  const listings = data.results;
  const pages = [
    {
      slug: listings._id,
      id: listings.title
    }
  ];
  const { slug } = Astro2.params;
  const page = pages.find((page2) => page2.slug === slug);
  if (!page) return Astro2.redirect("/404");
  return renderTemplate`${listings.map(
    ({ bedrooms, picture, pictures, title, address, bathrooms, prices, _id, results }) => renderTemplate`${maybeRenderHead()}<a${addAttribute(_id, "href")}><article class="flex flex-col bg-white shadow-lg shadow-muted-300/30 h-full border border-muted-200"><div class="bg-muted-100"><img class="w-full h-48 object-cover" id="string"${addAttribute(pictures[0].original, "src")} height="300px" width="300px"></div><div class="p-5 bg-white flex flex-col justify-start h-2/6"><div class=""><h4 class="font-sans font-bold text-xl text-muted-900">${title}</h4><h3 class="font-sans font-bold text-xl text-muted-900">
$${prices.basePrice}/ Day
</h3><p class="text-sm text-muted-400">${address.city}, ${address.state}</p></div><hr class="border-t border-muted-200 dark:border-muted-800 my-5"><div class="h-max grid grid-cols-2 flex-row justify-center items-center"><!-- bedroom --><div class="flex flex-col items-center"><div class="flex items-center gap-2 text-muted-900 dark:text-white"><svg class="size-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><path d="M12 4v6"></path><path d="M2 18h20"></path></svg><p class="text-xl font-bold">${bedrooms}</p></div><p class="text-md text-muted-400">Bedrooms</p></div><!-- bathroom --><div class="flex flex-col items-center"><div class="flex items-center gap-2 text-muted-900 dark:text-white"><svg class="size-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path><line x1="10" y1="5" x2="8" y2="7"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="7" y1="19" x2="7" y2="21"></line><line x1="17" y1="19" x2="17" y2="21"></line></svg><p class="text-xl font-bold">${bathrooms}</p></div><p class="text-md text-muted-400">Bathroom</p></div></div></div></article></a>`
  )}`;
}, "/home/adam-noah/Desktop/lp_web/src/components/GuestyListings.astro", void 0);

const $$Page2 = createComponent(async ($$result, $$props, $$slots) => {
  const apiToken = "your_old_bearer_token";
  const response = await fetch("https://open-api.guesty.com/v1/listings?limit=20", {
    headers: {
      "Authorization": `Bearer ${apiToken}`
    }
  });
  const data = await response.json();
  const listings = data.results;
  return renderTemplate`${listings.map(
    ({ bedrooms, picture, pictures, title, address, bathrooms, prices, accommodates, _id, results }) => renderTemplate`${maybeRenderHead()}<a${addAttribute(_id, "href")}><article class="flex flex-col bg-white shadow-lg shadow-muted-300/30 h-full border border-muted-200"><div class="bg-muted-100 dark:bg-muted-800 "><img class="w-full h-48 object-cover" id="string"${addAttribute(pictures[0].original, "src")}></div><div class="p-5 bg-white flex flex-col justify-evenly h-full"><div class=""><h4 class="font-sans font-bold text-xl text-muted-900">${title}</h4><h3 class="font-sans font-bold text-xl text-muted-900">
$${prices.basePrice}/ Day
</h3><p class="text-sm text-muted-400">${address.city}, ${address.state}</p></div><hr class="border-t border-muted-200 dark:border-muted-800 my-5"><div class="h-max grid grid-cols-2 flex-row justify-center items-center"><!-- bedroom --><div class="flex flex-col items-center"><div class="flex items-center gap-2 text-muted-900 dark:text-white"><svg class="size-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><path d="M12 4v6"></path><path d="M2 18h20"></path></svg><p class="text-xl font-bold">${bedrooms}</p></div><p class="text-md text-muted-400">Bedrooms</p></div><!-- bathroom --><div class="flex flex-col items-center"><div class="flex items-center gap-2 text-muted-900 dark:text-white"><svg class="size-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path><line x1="10" y1="5" x2="8" y2="7"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="7" y1="19" x2="7" y2="21"></line><line x1="17" y1="19" x2="17" y2="21"></line></svg><p class="text-xl font-bold">${bathrooms}</p></div><p class="text-md text-muted-400">Bathroom</p></div></div></div></article></a>`
  )}`;
}, "/home/adam-noah/Desktop/lp_web/src/components/Page2.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Split, { "title": "Properties" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main id="Properties"> <!--Properties--> ${renderComponent($$result2, "Section", $$Section, {}, { "default": ($$result3) => renderTemplate` <div class="px-36 mt-36"> <div class="py-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"> ${renderComponent($$result3, "GuestyListings", $$GuestyListings, {})} </div> <span id="listing2" class="hidden py-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"> ${renderComponent($$result3, "Page2", $$Page2, {})} </span> <span class="flex justify-center align-center mb-4"> <button id="showHide" class="bg-cyan-600 px-6 py-2 shadow-md shadow-cyan-500/30 rounded-3xl text-white"> Show More </button> </span> </div> ` })} </main> ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/pages/index.astro", void 0);

const $$file = "/home/adam-noah/Desktop/lp_web/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
