import { c as createComponent, r as renderTemplate, m as maybeRenderHead, d as renderComponent, e as renderSlot, f as renderHead, a as addAttribute, b as createAstro } from './astro/server_CWjZw3JT.mjs';
import 'kleur/colors';
import { a as $$Logo, c as $$ScrollTop, b as $$GoogleFontsOptimizer } from './Logo_CJ3dG8od.mjs';
import { $ as $$Icon, b as $$AccountMenu, a as $$PropertySearch, c as $$MegaMenu, d as $$Footer } from './Footer_C2ptFNbc.mjs';
/* empty css                                 */

const $$NavbarSplit = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="HeaderWrapper" x-data="navbar" x-on:scroll.window="scroll()" x-on:mouseleave="megamenuOpened = false" role="navigation" aria-label="main navigation" class="fixed top-0 start-0 w-full z-50 bg-slate-50 border-slate-100"> <div id="header" :class="flex flex-row justify-center scrolled || megamenuOpened || mobileOpen  ? 'bg-white border-b border-muted-200 shadow-muted-300/30 : 'lg:bg-transparent' "> <header id="MainHeader" class=" min-h-[70px] w-full max-w-full px-3 mx-auto flex justify-between items-stretch gap-3 shadow lg:shadow-md lg:px-8"> <div class="flex justify-between lg:justify-start items-center w-full lg:w-auto min-h-[3.25rem]"> <a href="/" class="flex gap-4 items-center py-2"> ${renderComponent($$result, "Logo", $$Logo, { "class": "size-8 aspect-square" })} </a> <div class="flex items-stretch gap-3"> <button id="MenuToggle" class="lg:hidden" @click="mobileOpen = !mobileOpen"> ${renderComponent($$result, "Icon", $$Icon, { "id": "OpenIcon", "x-show": "!mobileOpen", "name": "lucide:menu", "class": "pointer-events-none text-muted-500 dark:text-white size-6 aspect-auto" })} ${renderComponent($$result, "Icon", $$Icon, { "id": "CloseIcon", "x-show": "mobileOpen", "name": "lucide:x", "class": "pointer-events-none text-muted-500 dark:text-white size-6 aspect-auto" })} </button> <template x-if="$store.app.isLoggedIn"> <div class="lg:hidden flex items-center justify-center"> ${renderComponent($$result, "AccountMenu", $$AccountMenu, {})} </div> </template> </div> </div> <div class="xs:hidden sm:hidden md:hidden lg:flex items-center"> ${renderComponent($$result, "PropertySearch", $$PropertySearch, {})} </div> <nav aria-label="Main Navigation" x-cloak class="absolute top-full bg-white lg:bg-transparent start-0 lg:static px-3 lg:px-0 items-stretch justify-between" :class="mobileOpen ? 'block pt-5 pb-8 lg:p-0 -translate-y-px border-b border-muted-200 dark:border-muted-800 dark:bg-muted-950 shadow-lg shadow-muted-300/30 dark:shadow-muted-800/20': 'hidden lg:flex'"> <ul id="LeftLinks" class="flex flex-col lg:flex-row items-stretch [&>li>a]:h-full"> <!-- <li>
            <a href="#" class="py-2 px-3 leading-6 group text-base text-muted-500 dark:text-muted-400 hover:text-muted-600 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-1">
              <span>Rentals</span>
              <Icon name="lucide:chevron-down" class="size-4 group-hover:rotate-180 transition-transform duration-300" />
            </a>
          </li>

            <a
              href="#"
              x-on:mouseover="megamenuOpened = true, openedMegamenu = 'megamenu-2'"
              @click="megamenuOpened = true, openedMegamenu = 'megamenu-2'"
              class="py-2 px-3 leading-6 group text-base text-muted-500 dark:text-muted-400 hover:text-muted-600 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-1"
            >
              <span>Rentals</span>
              <Icon name="lucide:chevron-down" class="size-4 group-hover:rotate-180 transition-transform duration-300" />
            </a>
         </li>
          <li>
            <a href="/about" class="py-2 px-3 leading-6 grid place-items-center text-base text-muted-500 dark:text-muted-400 hover:text-muted-600 dark:hover:text-white transition-all duration-300">
              <span>About</span>
            </a>
          </li> --> </ul> <ul id="RightLinks" class="flex flex-col lg:flex-row items-stretch gap-6 [&>li>a]:h-full [&>li>a]:grid [&>li>a]:place-items-center"> <!-- <li>
            <a href="/about" class="hover:text-cyan-600 py-2 px-3 leading-6 group text-base text-muted-500 dark:text-muted-400  dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-1">
              <span>About</span>
            </a>
            </li>
          <li> --> <a href="/contact" class="hover:text-cyan-600 py-2 px-3 leading-6 group text-base text-muted-500 dark:text-muted-400  dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-1"> <span>Contact Us</span> </a> <template x-if="$store.app.isLoggedIn === false"> <li> <a href="/login" class="hover:text-cyan-600 py-2 leading-6 text-base text-muted-500 dark:text-muted-400 dark:hover:text-white transition-all duration-300"> <span>Sign In</span> </a> </li> </template> <!-- search --> <!-- <li class="search lg:ps-6 hidden lg:block" :class="scrolled  ||  megamenuOpened ? 'border-muted-200 dark:border-muted-800': 'border-transparent',{'lg:border-l':!$store.app.isLoggedIn}">
            <a href="#" class="inline-block text-base text-muted-500 dark:text-muted-400 hover:text-muted-600 dark:hover:text-white transition-all duration-300">
              <Icon name="lucide:search" class="size-4" />
            </a>
          </li> --> <!-- whishlist --> <!-- <li class="hidden lg:block">
            <a href="/wishlist" class="inline-block text-base text-muted-500 dark:text-muted-400 hover:text-muted-600 dark:hover:text-white transition-all duration-300">
              <Icon name="lucide:heart" class="hover:text-cyan-600 size-4 aspect-auto" />
            </a>
          </li> --> <template x-if="$store.app.isLoggedIn === false"> <!-- register --> <li class="w-full md:w-3/5 mx-auto lg:mx-0 lg:w-auto flex items-center justify-center"> <a href="/signup" class="!h-[46px] bg-cyan-600 w-full lg:w-auto min-w-[120px] font-medium text-sm leading-6 px-3.5 py-1.5 flex justify-center items-center transition-all duration-300 shadow-md shadow-cyan-500/30 rounded-3xl text-white" :class="{'shadow-lg shadow-cyan-500/30': scrolled}">Register</a> </li> </template> <template x-if="$store.app.isLoggedIn"> <div class="hidden lg:flex items-center justify-center"> ${renderComponent($$result, "AccountMenu", $$AccountMenu, {})} </div> </template> </ul> </nav> </header> </div> ${renderComponent($$result, "MegaMenu", $$MegaMenu, {})} <!-- <div class="flex justify-center w-full mt-4"><PropertySearch /></div> --> <div class="py-6 border-b shadow border-muted-100 flex gap-6 flex justify-center flex-wrap"> <button class=" inline-block whitespace-nowrap leading-[2.5] px-3 rounded-full text-md bg-muted-200 text-muted-900 shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] text-md shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] shadow-cyan-500/50 hover:bg-cyan-600 hover:text-cyan-50 active:bg-cyan-600 active:text-cyan-50 focus:bg-cyan-600 focus:text-cyan-50">House
</button><button class=" inline-block whitespace-nowrap leading-[2.5] px-3 rounded-full text-md bg-muted-200 text-muted-900 shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] text-md shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] shadow-cyan-500/50 hover:bg-cyan-600 hover:text-cyan-50 active:bg-cyan-600 active:text-cyan-50 focus:bg-cyan-600 focus:text-cyan-50">Mansion</button> <button class=" inline-block whitespace-nowrap leading-[2.5] px-3 rounded-full text-md bg-muted-200 text-muted-900 shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] text-md shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] shadow-cyan-500/50 hover:bg-cyan-600 hover:text-cyan-50 active:bg-cyan-600 active:text-cyan-50 focus:bg-cyan-600 focus:text-cyan-50">Condo</button> <button class=" inline-block whitespace-nowrap leading-[2.5] px-3 rounded-full text-md bg-muted-200 text-muted-900 shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] text-md shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] shadow-cyan-500/50 hover:bg-cyan-600 hover:text-cyan-50 active:bg-cyan-600 active:text-cyan-50 focus:bg-cyan-600 focus:text-cyan-50">Studio</button> <button class=" inline-block whitespace-nowrap leading-[2.5] px-3 rounded-full text-md bg-muted-200 text-muted-900 shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] text-md shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] shadow-cyan-500/50 hover:bg-cyan-600 hover:text-cyan-50 active:bg-cyan-600 active:text-cyan-50 focus:bg-cyan-600 focus:text-cyan-50">Swimming Pool</button> <button class=" inline-block whitespace-nowrap leading-[2.5] px-3 rounded-full text-md bg-muted-200 text-muted-900 shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] text-md shadow-[rgba(0,0,15,0.5)_0px_0px_5px_1px] shadow-cyan-500/50 hover:bg-cyan-600 hover:text-cyan-50 active:bg-cyan-600 active:text-cyan-50 focus:bg-cyan-600 focus:text-cyan-50">Beachfront</button> </div> </div> `;
}, "/home/adam-noah/Desktop/lp_web/src/components/NavbarSplit.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Split = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Split;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/images/logo/logo.svg"><meta name="generator"', ">", "", "", '</head> <body> <div id="Top"></div> ', " ", " ", " ", `  <!-- <script src="../pages/api/guestyAvailable.ts"><\/script> -->  <script>
document.getElementById("showHide").onclick = function() {
    var theDiv = document.getElementById("listing2");
    if (theDiv.style.display == 'none') {
        theDiv.style.display = 'grid';
        this.innerHTML = 'Show Less';
    } else {
        theDiv.style.display = 'none';
        this.innerHTML = 'Show More';
    }
}
<\/script> <script src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js"><\/script> </body> </html>`])), addAttribute(Astro2.generator, "content"), renderComponent($$result, "GoogleFontsOptimizer", $$GoogleFontsOptimizer, { "url": [
    "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,300;8..144,400;8..144,500;8..144,600",
    "https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;600;700&display=swap"
  ] }), renderSlot($$result, $$slots["head"]), renderHead(), renderComponent($$result, "NavbarSplit", $$NavbarSplit, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "ScrollTop", $$ScrollTop, {}), renderComponent($$result, "Footer", $$Footer, {}));
}, "/home/adam-noah/Desktop/lp_web/src/layouts/Split.astro", void 0);

export { $$Split as $ };
