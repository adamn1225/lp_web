import { k as createComponent, l as renderTemplate, m as maybeRenderHead, n as addAttribute, p as renderComponent, o as createAstro } from './astro/server_CYlBBrQa.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CdD2IFHX.mjs';
/* empty css                           */

const $$Astro = createAstro();
const $$SelectBox = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SelectBox;
  const { id = "", options, placeholder = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(id + "Select", "id")} data-open="false" aria-label="Select Box" class="select relative w-full md:w-max min-w-[250px]" data-astro-cid-d7fyo2io> <!-- options --> ${options.length > 0 && renderTemplate`<div aria-label="Select Option" class="options bg-white dark:bg-muted-900 shadow-sm border transition-all duration-200 z-20 border-muted-300 dark:border-muted-800 text-muted-600 rounded-lg mt-2 p-2 absolute top-full start-0 w-full overflow-hidden" data-astro-cid-d7fyo2io> ${options.map((option) => renderTemplate`<div class="option py-2 px-3 rounded-md hover:bg-muted-100 dark:hover:bg-muted-800 text-muted-400 hover:text-muted-700 dark:hover:text-muted-100 cursor-pointer"${addAttribute(option, "data-option")} data-astro-cid-d7fyo2io> ${option} </div>`)} </div>`} <div class="flex justify-between items-center gap-2 bg-white dark:bg-muted-900 px-4 py-4 rounded-lg cursor-pointer w-full h-full relative z-20" data-astro-cid-d7fyo2io> ${renderComponent($$result, "Icon", $$Icon, { "name": "lucide:home", "class": "size-4 text-muted-400", "data-astro-cid-d7fyo2io": true })} <!-- input --> <input aria-label="Select Input"${addAttribute(id, "id")}${addAttribute(id, "name")} type="text" class="peer focus:outline-none cursor-pointer dark:bg-muted-900 text-muted-700 dark:text-muted-300 placeholder:text-muted-300 dark:placeholder:text-muted-600 flex-1"${addAttribute(placeholder, "placeholder")} readonly data-astro-cid-d7fyo2io> ${renderComponent($$result, "Icon", $$Icon, { "name": "lucide:chevron-down", "class": "size-4 text-muted-400 transition-all duration-200", "data-astro-cid-d7fyo2io": true })} </div> </div>  `;
}, "/home/adam-noah/Desktop/lp_web/src/components/ui/SelectBox.astro", void 0);

const $$PropertySearch = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<form action=""> <!-- tabs --> <!-- <ul aria-label="Tabs" class="flex relative z-10">
    <li aria-label="Tab">
      <BoxedTab label="Buy" selected={true} />
    </li>
    <li aria-label="Tab">
      <BoxedTab label="Rent" />
    </li>
  </ul> --> <div class="p-3 bg-white dark:bg-muted-900 relative -mt-px z-[5] flex justify-between flex-col md:flex-row gap-2 items-center lg:w-max border border-muted-200 dark:border-muted-800"> <!-- select --> ${renderComponent($$result, "SelectBox", $$SelectBox, { "placeholder": "Property Type", "options": ["Private residence", "Private house", "Apartment", "Mansion"], "id": "PropertyType" })} <!-- search input --> <div class="flex items-center h-full md:border-s w-full md:w-max border-muted-200 dark:border-muted-800 flex-row-reverse"> <input type="text" placeholder="Search by location" class="peer focus:outline-none h-16 w-full bg-white dark:bg-muted-900 text-muted-700 dark:text-muted-300 placeholder:text-muted-300 dark:placeholder:text-muted-600"> <!-- icon --> <div class="size-16 text-muted-400 peer-focus:text-primary-500 flex justify-center items-center"> ${renderComponent($$result, "Icon", $$Icon, { "name": "lucide:search", "class": "size-4" })} </div> </div> <button type="submit" class="h-16 min-w-40 w-full md:w-max font-medium text-lg px-4 py-2 rounded flex justify-center items-center transition-all duration-300 bg-cyan-600 text-white hover:shadow-lg hover:shadow-primary-500/30">Search</button> </div> <!-- only new --> <!-- <div class="mt-6">
    <label for="new-properties" class="inline-flex relative items-center cursor-pointer">
      <input id="new-properties" type="checkbox" class="appearance-none peer" />
      <div
        class="relative inline-block w-[48px] h-[28px] bg-muted-100 dark:bg-muted-900 border border-muted-200 dark:border-muted-800 peer-focus:outline-none after:border rounded-full peer-checked:bg-primary-500 transition-all duration-300 ease-linear before:content-[''] before:absolute before:w-[42px] before:h-[22px] before:dark:bg-muted-900 before:rounded-full before:bg-muted-100 before:[transform:translate3d(2px,2px,0)_scale3d(1,1,1)] before:transition-all before:duration-[0.25s] before:ease-linear after:content-[''] after:absolute after:w-[22px] after:h-[22px] after:bg-white after:rounded-full after:shadow-md after:[transform:translate3d(2px,2px,0)] peer-checked:before:[transform:translate3d(18px,2px,0)_scale3d(0,0,0)] peer-checked:after:[transform:translate3d(22px,2px,0)] after:transition-all after:duration-[0.2s] after:ease-in-out"
      >
      </div>
      <span class="ms-3 text-sm font-medium text-muted-400">Only include new properties</span>
    </label>
  </div> --> <!-- <Switch /> --> </form>`;
}, "/home/adam-noah/Desktop/lp_web/src/components/ui/PropertySearch.astro", void 0);

export { $$PropertySearch as $ };
