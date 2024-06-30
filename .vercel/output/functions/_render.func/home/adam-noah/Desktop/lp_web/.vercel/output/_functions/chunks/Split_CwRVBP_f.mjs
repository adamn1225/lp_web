import { k as createComponent, l as renderTemplate, m as maybeRenderHead, p as renderComponent, n as addAttribute, q as renderSlot, t as renderHead, o as createAstro } from './astro/server_CYlBBrQa.mjs';
import 'kleur/colors';
import { a as $$Logo, s as setTitle, b as setDescription, c as $$SEO, d as $$GoogleFontsOptimizer, e as $$ScrollTop } from './Logo_PkC5nJxB.mjs';
import { $ as $$Icon } from './Icon_CdD2IFHX.mjs';
import { a as $$AccountMenu, b as $$MegaMenu, c as $$Footer } from './Footer_DzQfm9nJ.mjs';
/* empty css                           */

const $$NavbarSplit = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="HeaderWrapper" x-data="navbar" x-on:scroll.window="scroll()" x-on:mouseleave="megamenuOpened = false" role="navigation" aria-label="main navigation" class="fixed top-0 start-0 w-full z-50 bg-slate-50 shadow-lg border-slate-100"> <div id="header" :class="scrolled || megamenuOpened || mobileOpen  ? 'bg-white border-b border-muted-200 dark:border-muted-800 dark:bg-muted-950 shadow-lg shadow-muted-300/30 dark:shadow-muted-800/20': 'lg:bg-transparent' "> <header id="MainHeader" class=" min-h-[70px] w-full max-w-full px-3 mx-auto flex justify-start items-stretch gap-3 shadow lg:shadow-none lg:px-8"> <div class="flex justify-between lg:justify-start items-center w-full lg:w-auto min-h-[3.25rem]"> <a href="/" class="flex gap-4 items-center py-2"> ${renderComponent($$result, "Logo", $$Logo, { "class": "size-8 aspect-square" })} <p style="width:max-content" class="font-medium text-2xl font-sans text-muted-900 dark:text-white"></p> </a> <div class="flex items-stretch gap-3"> <button id="MenuToggle" class="lg:hidden" @click="mobileOpen = !mobileOpen"> ${renderComponent($$result, "Icon", $$Icon, { "id": "OpenIcon", "x-show": "!mobileOpen", "name": "lucide:menu", "class": "pointer-events-none text-muted-500 dark:text-white size-6 aspect-auto" })} ${renderComponent($$result, "Icon", $$Icon, { "id": "CloseIcon", "x-show": "mobileOpen", "name": "lucide:x", "class": "pointer-events-none text-muted-500 dark:text-white size-6 aspect-auto" })} </button> <template x-if="$store.app.isLoggedIn"> <div class="lg:hidden flex items-center justify-center"> ${renderComponent($$result, "AccountMenu", $$AccountMenu, {})} </div> </template> </div> </div> <nav aria-label="Main Navigation" x-cloak class="absolute top-full bg-white lg:bg-transparent start-0 w-full lg:static px-3 lg:px-0 lg:flex-grow items-stretch justify-between" :class="mobileOpen ? 'block pt-5 pb-8 lg:p-0 -translate-y-px border-b border-muted-200 dark:border-muted-800 dark:bg-muted-950 shadow-lg shadow-muted-300/30 dark:shadow-muted-800/20': 'hidden lg:flex'"> <ul id="LeftLinks" class="flex flex-col lg:flex-row items-stretch [&>li>a]:h-full"> <!-- <li>
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
          </li> --> </ul> <ul id="RightLinks" class="flex flex-col lg:flex-row items-stretch gap-6 [&>li>a]:h-full [&>li>a]:grid [&>li>a]:place-items-center"> <li> <a href="/#" class="hover:text-cyan-600 py-2 px-3 leading-6 grid place-items-center text-base text-muted-500 dark:text-muted-400  dark:hover:text-white transition-all duration-300"> <span>Properties</span> </a> </li> <li> <a href="/about" class="hover:text-cyan-600 py-2 px-3 leading-6 grid place-items-center text-base text-muted-500 dark:text-muted-400  dark:hover:text-white transition-all duration-300"> <span>How We Work</span> </a> </li> <li> <a href="/contact" class="hover:text-cyan-600 py-2 px-3 leading-6 group text-base text-muted-500 dark:text-muted-400  dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-1"> <span>Contact Us</span> </a> </li> <template x-if="$store.app.isLoggedIn === false"> <li> <a href="/login" class="hover:text-cyan-600 py-2 leading-6 text-base text-muted-500 dark:text-muted-400 dark:hover:text-white transition-all duration-300"> <span>Sign In</span> </a> </li> </template> <!-- search --> <!-- <li class="search lg:ps-6 hidden lg:block" :class="scrolled  ||  megamenuOpened ? 'border-muted-200 dark:border-muted-800': 'border-transparent',{'lg:border-l':!$store.app.isLoggedIn}">
            <a href="#" class="inline-block text-base text-muted-500 dark:text-muted-400 hover:text-muted-600 dark:hover:text-white transition-all duration-300">
              <Icon name="lucide:search" class="size-4" />
            </a>
          </li> --> <!-- whishlist --> <li class="hidden lg:block"> <a href="/wishlist" class="inline-block text-base text-muted-500 dark:text-muted-400 hover:text-muted-600 dark:hover:text-white transition-all duration-300"> ${renderComponent($$result, "Icon", $$Icon, { "name": "lucide:heart", "class": "hover:text-cyan-600 size-4 aspect-auto" })} </a> </li> <!-- dark/light mode switch --> <!-- <li class="flex justify-center items-center">
            <button
              class="darkToggle relative overflow-hidden size-9 aspect-square rounded-full border [&>svg]:text-yellow-400 border-muted-200 bg-white dark:bg-muted-900 dark:border-muted-800"
              @click="$store.app.toggleTheme()"
            > --> <!-- sun --> <!-- <Icon
                name="lucide:sun"
                class="lightIcon start-1/2 aspect-auto absolute top-1/2 [&>*]:fill-current transition-all duration-300"
                :class="$store.app.isDark ? 'opacity-0 -translate-x-[45%] translate-y-[150%]' : 'opacity-100  -translate-x-1/2 -translate-y-1/2' "
              /> --> <!-- moon --> <!-- <Icon
                name="lucide:moon"
                class="darkIcon start-1/2 aspect-auto absolute top-1/2 [&>*]:fill-current transition-all duration-300"
                :class="$store.app.isDark ? 'opacity-100  -translate-x-[45%] -translate-y-1/2' : 'opacity-0 -translate-x-[45%] -translate-y-[150%]' "
              /> --> <template x-if="$store.app.isLoggedIn === false"> <!-- register --> <li class="w-full md:w-3/5 mx-auto lg:mx-0 lg:w-auto flex items-center justify-center"> <a href="/signup" class="!h-[46px] bg-cyan-600 w-full lg:w-auto min-w-[120px] font-medium text-sm leading-6 px-3.5 py-1.5 flex justify-center items-center transition-all duration-300 rounded text-white" :class="{'shadow-lg shadow-primary-500/30': scrolled}">Register</a> </li> </template> <template x-if="$store.app.isLoggedIn"> <div class="hidden lg:flex items-center justify-center"> ${renderComponent($$result, "AccountMenu", $$AccountMenu, {})} </div> </template> </ul> </nav> </header> </div> ${renderComponent($$result, "MegaMenu", $$MegaMenu, {})} </div> `;
}, "/home/adam-noah/Desktop/lp_web/src/components/NavbarSplit.astro", void 0);

const $$Astro = createAstro();
const $$Split = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Split;
  const { title = "", description = "", ...props } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/images/logo/logo.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}>${renderComponent($$result, "SEO", $$SEO, { "title": setTitle(title), "description": setDescription(description), ...props })}${renderComponent($$result, "GoogleFontsOptimizer", $$GoogleFontsOptimizer, { "url": [
    "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,300;8..144,400;8..144,500;8..144,600",
    "https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;600;700&display=swap"
  ] })}${renderSlot($$result, $$slots["head"])}${renderHead()}</head> <body> <div id="Top"></div> ${renderComponent($$result, "NavbarSplit", $$NavbarSplit, {})} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "ScrollTop", $$ScrollTop, {})} ${renderComponent($$result, "Footer", $$Footer, {})}   </body> </html>`;
}, "/home/adam-noah/Desktop/lp_web/src/layouts/Split.astro", void 0);

export { $$Split as $ };
