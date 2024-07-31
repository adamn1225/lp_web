/* empty css                                         */
import { c as createComponent, r as renderTemplate, m as maybeRenderHead, d as renderComponent, e as renderSlot, f as renderHead, a as addAttribute, b as createAstro } from '../chunks/astro/server_CWjZw3JT.mjs';
import 'kleur/colors';
import { $ as $$Icon, b as $$AccountMenu, c as $$MegaMenu, d as $$Footer, a as $$PropertySearch } from '../chunks/Footer_C2ptFNbc.mjs';
import { a as $$Logo, c as $$ScrollTop, b as $$GoogleFontsOptimizer } from '../chunks/Logo_CJ3dG8od.mjs';
/* empty css                                         */
/* empty css                                         */
import { $ as $$Section } from '../chunks/Section_BLNnwPBI.mjs';
export { renderers } from '../renderers.mjs';

const apiToken = "your_old_bearer_token";
const response = await fetch("https://open-api.guesty.com/v1/listings?limit=20&skip=21", {
  headers: {
    "Authorization": `Bearer ${apiToken}`
  }
});
const data = await response.json();
const listings = data.results;
function processListing(title, _id) {
  return title === "" ? listings.title : title, _id === "" ? listings._id : _id;
}

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="HeaderWrapper" x-data="navbar" x-on:scroll.window="scroll()" x-on:mouseleave="megamenuOpened = false" role="navigation" aria-label="main navigation" class="fixed top-0 start-0 w-full z-50 bg-slate-50 border-slate-100"> <div id="header" :class="flex flex-row justify-center scrolled || megamenuOpened || mobileOpen  ? 'bg-white border-b border-muted-200 shadow-muted-300/30 : 'lg:bg-transparent' "> <header id="MainHeader" class=" min-h-[70px] w-full max-w-full px-3 mx-auto flex justify-between items-stretch gap-3 shadow lg:shadow-md lg:px-8"> <div class="flex justify-between lg:justify-start items-center w-full lg:w-auto min-h-[3.25rem]"> <a href="/" class="flex gap-4 items-center py-2"> ${renderComponent($$result, "Logo", $$Logo, { "class": "size-8 aspect-square" })} </a> <div class="flex items-stretch gap-3"> <button id="MenuToggle" class="lg:hidden" @click="mobileOpen = !mobileOpen"> ${renderComponent($$result, "Icon", $$Icon, { "id": "OpenIcon", "x-show": "!mobileOpen", "name": "lucide:menu", "class": "pointer-events-none text-muted-500 dark:text-white size-6 aspect-auto" })} ${renderComponent($$result, "Icon", $$Icon, { "id": "CloseIcon", "x-show": "mobileOpen", "name": "lucide:x", "class": "pointer-events-none text-muted-500 dark:text-white size-6 aspect-auto" })} </button> <template x-if="$store.app.isLoggedIn"> <div class="lg:hidden flex items-center justify-center"> ${renderComponent($$result, "AccountMenu", $$AccountMenu, {})} </div> </template> </div> </div> <nav aria-label="Main Navigation" x-cloak class="absolute top-full bg-white lg:bg-transparent start-0 lg:static px-3 lg:px-0 items-stretch justify-between" :class="mobileOpen ? 'block pt-5 pb-8 lg:p-0 -translate-y-px border-b border-muted-200 dark:border-muted-800 dark:bg-muted-950 shadow-lg shadow-muted-300/30 dark:shadow-muted-800/20': 'hidden lg:flex'"> <ul id="LeftLinks" class="flex flex-col lg:flex-row items-stretch [&>li>a]:h-full"> <!-- <li>
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
          </li> --> <template x-if="$store.app.isLoggedIn === false"> <!-- register --> <li class="w-full md:w-3/5 mx-auto lg:mx-0 lg:w-auto flex items-center justify-center"> <a href="/signup" class="!h-[46px] bg-cyan-600 w-full lg:w-auto min-w-[120px] font-medium text-sm leading-6 px-3.5 py-1.5 flex justify-center items-center transition-all duration-300 shadow-md shadow-cyan-500/30 rounded-3xl text-white" :class="{'shadow-lg shadow-cyan-500/30': scrolled}">Register</a> </li> </template> <template x-if="$store.app.isLoggedIn"> <div class="hidden lg:flex items-center justify-center"> ${renderComponent($$result, "AccountMenu", $$AccountMenu, {})} </div> </template> </ul> </nav> </header> </div> ${renderComponent($$result, "MegaMenu", $$MegaMenu, {})} </div> `;
}, "/home/adam-noah/Desktop/lp_web/src/components/Navbar.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$2 = createAstro();
const $$Default = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Default;
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-jwirc66j> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/images/logo/logo.svg"><meta name="generator"', ">", "", "", '</head> <body data-astro-cid-jwirc66j> <div id="Top" data-astro-cid-jwirc66j></div> ', " ", " ", " ", `   <script>
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
  ], "data-astro-cid-jwirc66j": true }), renderSlot($$result, $$slots["head"]), renderHead(), renderComponent($$result, "NavbarSplit", $$Navbar, { "data-astro-cid-jwirc66j": true }), renderSlot($$result, $$slots["default"]), renderComponent($$result, "ScrollTop", $$ScrollTop, { "data-astro-cid-jwirc66j": true }), renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-jwirc66j": true }));
}, "/home/adam-noah/Desktop/lp_web/src/layouts/Default.astro", void 0);

const $$Astro$1 = createAstro();
const $$ListingPageDetail = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ListingPageDetail;
  const { title, address, description, beds, bathrooms, pictures = [], propertyType } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Default, { "title": "Property Details" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main id="PropertyDetails"> ${renderComponent($$result2, "Section", $$Section, {}, { "default": ($$result3) => renderTemplate` <div class="w-full mx-auto max-w-full px-8 xs:px-4"> <div class="pb-12 mb-12"> <section class="relative border-b border-muted-200 pb-12"> <!-- breadcrumb --> <nav class="mt-12 mb-6" aria-label="breadcrumbs"> <ul class="flex items-center xs:justify-center"> <li class="flex items-center"> <a href="/" class="hover:text-primary-500 pe-3 text-muted-400"> ${renderComponent($$result3, "Icon", $$Icon, { "class": "h-4 aspect-square", "name": "lucide:home" })} </a> </li> <li class="flex items-center before:content-['/'] before:text-muted-400"> <a href="/" class="hover:text-primary-500 px-3 text-muted-400">Properties</a> </li> <li class="is-active flex items-center before:content-['/'] before:text-muted-400"> <a href="#" class="px-3 text-muted-400" href="#" aria-current="page">Details</a> </li> </ul> </nav> <!-- property details title --> <div class="flex flex-col md:flex-row items-end justify-between mb-6"> <!-- left --> <div class="left mb-8 md:m-0"> <h2 class="leading-9 text-3xl font-light font-sans text-muted-900 mb-2 xs:text-center">${title}</h2> <div class="flex xs:justify-center gap-4 text-base text-muted-900"> <a href="#" class="flex items-center font-medium relative underline-offset-4 hover:underline"></a> </div> </div> <!-- right --> <div class="right flex xs:justify-center xs:items-center xs:w-full gap-4"> <a href="#" class="gap-1 flex items-center font-medium text-muted-900 hover:text-primary-500 underline-offset-4 hover:underline"> ${renderComponent($$result3, "Icon", $$Icon, { "class": "h-4 aspect-square", "name": "lucide:share-2" })} <span class="relative">Share</span> </a> <a href="#" class="gap-1 flex items-center font-medium text-muted-900 hover:text-primary-500 underline-offset-4 hover:underline"> ${renderComponent($$result3, "Icon", $$Icon, { "class": "h-4 aspect-square", "name": "lucide:heart" })} <span class="relative">Save</span> </a> </div> </div> <!-- property details --> <div class="flex flex-col lg:flex-row items-stretch gap-8"> <!-- left --> <div class="flex-grow-[2]"> <!-- property images --> <div class="flex flex-col md:flex-row items-stretch gap-4 mb-4"> <div class="main-image md:flex-grow-[2]"> <img class="block object-cover min-h-[450px]"${addAttribute(pictures[0].original, "src")} alt="Main image"${addAttribute(2e3, "width")}${addAttribute(1333, "height")} data-zoom> </div> <div class="flex flex-row md:flex-col xs:flex-wrap gap-4 max-w-full md:max-w-[180px] md:w-full"> <img class="object-cover w-1/3 md:w-auto flex-1"${addAttribute(pictures[1].original, "src")} alt="Sub image"${addAttribute(2e3, "width")}${addAttribute(1333, "height")} data-zoom> <img class="object-cover w-1/3 md:w-auto flex-1"${addAttribute(pictures[2].original, "src")} alt="Sub image"${addAttribute(2e3, "width")}${addAttribute(1333, "height")} data-zoom> <img class="object-cover w-1/3 md:w-auto flex-1"${addAttribute(pictures[3].original, "src")} alt="Sub image"${addAttribute(2e3, "width")}${addAttribute(1333, "height")} data-zoom> </div> </div> <!-- property content --> <div class="relative" x-data="{ activeTab: 'tab-1' }"> <div class="tabs mb-6 flex text-base justify-between overflow-hidden overflow-x-auto"> <ul class="flex items-center flex-grow border-b dark:border-muted-800 border-muted-200 list-none"> <li :class="activeTab === 'tab-1' && 'is-active [&>a]:border-b-2 [&>a]:border-primary-500 [&>a]:text-muted-900 dark:[&>a]:text-white'"> <a @click.prevent="activeTab = 'tab-1'" class="flex justify-center items-center py-2 px-4 border-b border-transparent text-muted-400 cursor-pointer no-underline -mb-px">Description</a> </li> <li :class="activeTab === 'tab-2' && 'is-active [&>a]:border-b-2 [&>a]:border-primary-500 [&>a]:text-muted-900 dark:[&>a]:text-white'"> <a @click.prevent="activeTab = 'tab-2'" class="flex justify-center items-center py-2 px-4 border-b border-transparent text-muted-400 cursor-pointer no-underline -mb-px">Amenities</a> </li> <li :class="activeTab === 'tab-3' && 'is-active [&>a]:border-b-2 [&>a]:border-primary-500 [&>a]:text-muted-900 dark:[&>a]:text-white'"> <a @click.prevent="activeTab = 'tab-3'" class="flex justify-center items-center py-2 px-4 border-b border-transparent text-muted-400 cursor-pointer no-underline -mb-px">Comments</a> </li> </ul> </div> <div x-cloak x-show="activeTab === 'tab-1'" class="relative"> <p class="text-muted-500 text-base xs:text-center"></p> <p class="text-muted-500 dark:text-muted-400 text-base mt-4"></p> </div> <div x-cloak x-show="activeTab === 'tab-2'" class="relative"> <div class="boxed-amenities flex justify-center gap-3"> <!-- Amenity --> <div class="dark:border-muted-800 text-center p-5 border border-muted-200 dark:bg-muted-950 bg-white"> <div class="font-bold gap-2 flex justify-center items-center text-muted-900"> <svg class="h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><path d="M12 4v6"></path><path d="M2 18h20"></path> </svg> <span>${propertyType}</span> </div> <div class="amenity-content text-center"> <p class="text-sm text-muted-400">Property Type</p> </div> </div> <!-- Amenity --> <div class="dark:border-muted-800 text-center p-5 border border-muted-200 dark:bg-muted-950 bg-white"> <div class="font-bold gap-2 flex justify-center items-center text-muted-900"> <svg class="h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path><line x1="10" y1="5" x2="8" y2="7"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="7" y1="19" x2="7" y2="21"></line><line x1="17" y1="19" x2="17" y2="21"></line> </svg> <span>${bathrooms}</span> </div> <div class="amenity-content text-center"> <p class="text-sm text-muted-400">Bathrooms</p> </div> </div> <!-- Amenity --> <div class="dark:border-muted-800 text-center p-5 border border-muted-200 dark:bg-muted-950 bg-white"> <div class="font-bold gap-2 flex justify-center items-center text-muted-900"> ${renderComponent($$result3, "Icon", $$Icon, { "class": "text-2xl h-6", "name": "lucide:car" })} <span>2</span> </div> <div class="amenity-content text-center"> <p class="text-sm text-muted-400">Parking spots</p> </div> </div> <!-- Amenity --> <div class="dark:border-muted-800 text-center p-5 border border-muted-200 dark:bg-muted-950 bg-white"> <div class="font-bold gap-2 flex justify-center items-center text-muted-900"> ${renderComponent($$result3, "Icon", $$Icon, { "class": "text-2xl h-6", "name": "lucide:webcam" })} <span></span> </div> <div class="amenity-content text-center"> <p class="text-sm text-muted-400">WiFi</p> </div> </div> </div> </div> <div x-cloak x-show="activeTab === 'tab-3'" class="relative"> <div class="relative"> <div class="grid grid-cols-2 gap-6 max-w-xl"> <!--Review--> <div class="relative"> <div class="flex items-center justify-between max-w-xl"> <div class="text-base text-muted-700 dark:text-muted-200"> <span>Cleanliness</span> </div> <div class="flex items-center flex-grow-[2] max-w-[140px]"> <progress class="[&::-webkit-progress-value]:bg-primary-500 [&::-webkit-progress-bar]:bg-muted-300 dark:[&::-webkit-progress-bar]:bg-muted-600 hidden lg:block w-full h-1" value="95" max="100">
98%
</progress> <span class="ms-3 font-medium text-base text-muted-900">4.8</span> </div> </div> </div> <!--Review--> <div class="relative"> <div class="flex items-center justify-between max-w-xl"> <div class="text-base text-muted-700 dark:text-muted-200"> <span>Amenities</span> </div> <div class="flex items-center flex-grow-[2] max-w-[140px]"> <progress class="[&::-webkit-progress-value]:bg-primary-500 [&::-webkit-progress-bar]:bg-muted-300 dark:[&::-webkit-progress-bar]:bg-muted-600 hidden lg:block w-full h-1" value="88" max="100">
90%
</progress> <span class="ms-3 font-medium text-base text-muted-900">4.5</span> </div> </div> </div> <!--Review--> <div class="relative"> <div class="flex items-center justify-between max-w-xl"> <div class="text-base text-muted-700 dark:text-muted-200"> <span>Service</span> </div> <div class="flex items-center flex-grow-[2] max-w-[140px]"> <progress class="[&::-webkit-progress-value]:bg-primary-500 [&::-webkit-progress-bar]:bg-muted-300 dark:[&::-webkit-progress-bar]:bg-muted-600 hidden lg:block w-full h-1" value="94" max="100">
94%
</progress> <span class="ms-3 font-medium text-base text-muted-900">4.7</span> </div> </div> </div> <!--Review--> <div class="relative"> <div class="flex items-center justify-between max-w-xl"> <div class="text-base text-muted-700 dark:text-muted-200"> <span>Location</span> </div> <div class="flex items-center flex-grow-[2] max-w-[140px]"> <progress class="[&::-webkit-progress-value]:bg-primary-500 [&::-webkit-progress-bar]:bg-muted-300 dark:[&::-webkit-progress-bar]:bg-muted-600 hidden lg:block w-full h-1" value="90" max="100">
90%
</progress> <span class="ms-3 font-medium text-base text-muted-900">4.6</span> </div> </div> </div> <!--Review--> <div class="relative"> <div class="flex items-center justify-between max-w-xl"> <div class="text-base text-muted-700 dark:text-muted-200"> <span>Price</span> </div> <div class="flex items-center flex-grow-[2] max-w-[140px]"> <progress class="[&::-webkit-progress-value]:bg-primary-500 [&::-webkit-progress-bar]:bg-muted-300 dark:[&::-webkit-progress-bar]:bg-muted-600 hidden lg:block w-full h-1" value="94" max="100">
94%
</progress> <span class="ms-3 font-medium text-base text-muted-900">4.7</span> </div> </div> </div> </div> <div class="pt-16"> <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6"> <!--Comment--> <div class="relative"> <div class="gap-4 mb-6 flex items-center"> <div class="meta"> <h4 class="text-base font-semibold font-sans text-muted-900">Adam</h4> <span class="text-base text-muted-400">3 days ago</span> </div> </div> <p class="text-muted-700 dark:text-muted-200 text-sm">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maximus dolor, inquit, brevis est. Comprehensum, quod cognitum non habet? Si longus, levis dictata sunt. Non risu
                              potius quam oratione eiciendum? Istic sum, inquit. Ita prorsus, inquam.
</p> </div> <!--Comment--> <div class="relative"> <div class="gap-4 mb-6 flex items-center"> <div class="meta"> <h4 class="text-base font-semibold font-sans text-muted-900">Moshe</h4> <span class="text-base text-muted-400">5 days ago</span> </div> </div> <p class="text-muted-700 dark:text-muted-200 text-sm">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maximus dolor, inquit, brevis est. Comprehensum, quod cognitum non habet? Si longus, levis dictata sunt.
</p> </div> <!--Comment--> <div class="relative"> <div class="gap-4 mb-6 flex items-center"> <div class="meta"> <h4 class="text-base font-semibold font-sans text-muted-900">Sharon</h4> <span class="text-base text-muted-400">a week ago</span> </div> </div> <p class="text-muted-700 dark:text-muted-200 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maximus dolor, inquit, brevis est.</p> </div> <!--Comment--> <div class="relative"> <div class="gap-4 mb-6 flex items-center"> <div class="meta"> <h4 class="text-base font-semibold font-sans text-muted-900">Molly</h4> <span class="text-base text-muted-400">2 weeks ago</span> </div> </div> <p class="text-muted-700 dark:text-muted-200 text-sm">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maximus dolor, inquit, brevis est. Comprehensum, quod cognitum non habet? Si longus, levis dictata sunt. Non risu
                              potius quam oratione eiciendum? Istic sum, inquit.
</p> </div> <!--Comment--> <div class="relative"> <div class="gap-4 mb-6 flex items-center"> <div class="meta"> <h4 class="text-base font-semibold font-sans text-muted-900">Rivka</h4> <span class="text-base text-muted-400">2 weeks ago</span> </div> </div> <p class="text-muted-700 dark:text-muted-200 text-sm">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maximus dolor, inquit, brevis est. Comprehensum, quod cognitum non habet? Si longus, levis dictata sunt.
</p> </div> <!--Comment--> <div class="relative"> <div class="gap-4 mb-6 flex items-center"> <div class="meta"> <h4 class="text-base font-semibold font-sans text-muted-900">Noah</h4> <span class="text-base text-muted-400">2 weeks ago</span> </div> </div> <p class="text-muted-700 dark:text-muted-200 text-sm">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maximus dolor, inquit, brevis est. Comprehensum, quod cognitum non habet? Si longus, levis dictata sunt.
</p> </div> </div> <div class="relatives-action mt-8"> <button class="h-11 transition-all duration-300 text-sm rounded text-slate-100 bg-cyan-600 dark:bg-muted-950 border border-muted-200 dark:border-muted-800 px-4 py-2 flex justify-center items-center dark:text-muted-400">See all comments</button> </div> </div> </div> </div> </div> </div> <!-- right --> <div class="min-w-[300px]"> <h4 class="text-xl mb-6 font-light font-sans text-muted-900">Amenities</h4> <div class="mb-6 grid grid-cols-2 justify-items-center"> <!-- bedroom --> <div class="flex flex-col"> <div class="flex items-center gap-2 text-muted-900 dark:text-white"> <svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><path d="M12 4v6"></path><path d="M2 18h20"></path> </svg> <p class="text-lg font-bold">${beds}</p> </div> <p class="text-sm text-muted-400">Beds</p> </div> <!-- bathroom --> <div class="flex flex-col"> <div class="flex items-center gap-2 text-muted-900 dark:text-white"> <svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path><line x1="10" y1="5" x2="8" y2="7"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="7" y1="19" x2="7" y2="21"></line><line x1="17" y1="19" x2="17" y2="21"></line> </svg> <p class="text-lg font-bold">3</p> </div> <p class="text-sm text-muted-400">Bathrooms</p> </div> </div> <div class="pb-6 mb-6 border-b border-muted-200 dark:border-muted-800 flex xs:justify-center xs:align-center gap-2 flex-wrap"> <span class="dark:bg-muted-950 dark:text-muted-400 inline-block whitespace-nowrap leading-[2.5] px-3 rounded text-xs bg-muted-100 text-muted-900">Guest toilet</span> <span class="dark:bg-muted-950 dark:text-muted-400 inline-block whitespace-nowrap leading-[2.5] px-3 rounded text-xs bg-muted-100 text-muted-900">Open kitchen</span> <span class="dark:bg-muted-950 dark:text-muted-400 inline-block whitespace-nowrap leading-[2.5] px-3 rounded text-xs bg-muted-100 text-muted-900">Swimming Pool</span> <span class="dark:bg-muted-950 dark:text-muted-400 inline-block whitespace-nowrap leading-[2.5] px-3 rounded text-xs bg-muted-100 text-muted-900">Garden sharing</span> <span class="dark:bg-muted-950 dark:text-muted-400 inline-block whitespace-nowrap leading-[2.5] px-3 rounded text-xs bg-muted-100 text-muted-900">Kids playground</span> </div> <div class="flex flex-col gap-4 pb-6 mb-6 border-b border-muted-200 dark:border-muted-800"> <div class="flex items-center justify-between text-sm"> <p class="text-muted-400">Type</p> <p class="text-muted-900">${propertyType}</p> </div> <div class="flex items-center justify-between text-sm"> <p class="text-muted-400">Status</p> <p class="text-muted-900">Available</p> </div> </div> <div class="mb-2"> ${renderComponent($$result3, "PropertySearch", $$PropertySearch, {})} </div> <button class="bg-cyan-600 mb-2 font-bold text-sm text-white rounded h-11 transition-all duration-300 py-2 px-4 flex items-center justify-center cursor-pointer w-full hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300">
Reserve
</button> <button class="bg-cyan-600 mb-6 font-bold text-sm text-white rounded h-11 transition-all duration-300 py-2 px-4 flex items-center justify-center cursor-pointer w-full hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg> <span class="pl-2">Inquire about this listing</span> </button> <!-- map --> <iframe class="min-h-[220px] w-full" marginheight="0" marginwidth="0" title="map" scrolling="no" src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Myrtle%20Beach,%20SC+(Line%20Properties%20Inc)&t=&z=12&ie=UTF8&iwloc=B&output=embed" style="filter: grayscale(1) contrast(1.2) opacity(0.6)" frameborder="0"></iframe> </div> </div> </section> <!-- cards --> <div class="mt-12"> <div class="flex flex-col"> <h2 class="font-sans text-2xl text-muted-900 dark:text-white xs:text-center">You might also like</h2> <p class="text-muted-500 dark:text-muted-400 text-base leading-6 xs:text-center">Based on your previous matches</p> </div> <div class="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <!-- {properties.slice(0, 3).map((property) => <PropertyCard {...property} />)} --> </div> </div> </div> </div> ` })} </main> ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/components/ListingPageDetail.astro", void 0);

const $$Astro = createAstro();
async function getStaticPaths() {
  const apiToken = "your_old_bearer_token";
  const response = await fetch("https://open-api.guesty.com/v1/listings?limit=100", {
    headers: {
      "Authorization": `Bearer ${apiToken}`
    }
  });
  const data = await response.json();
  const listings = data.results;
  const paths = listings.map((listings2) => ({
    params: {
      listingPage: processListing(listings2.title, listings2._id)
    },
    props: {
      listings: listings2,
      _id: listings2._id,
      title: listings2.title,
      address: listings2.address,
      description: listings2.Description,
      propertyType: listings2.PropertyType,
      bathrooms: listings2.bathrooms,
      pictures: listings2.pictures,
      beds: listings2.beds
    }
  }));
  return paths;
}
const $$listingPage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$listingPage;
  const { description, title, address, beds, propertyType, bathrooms, pictures, lineListing = [], _id } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "ListingPageDetail", $$ListingPageDetail, { "lineListing": lineListing, "title": title, "_id": _id, "address": address, "description": description, "PropertyType": propertyType, "bathrooms": bathrooms, "pictures": pictures, "beds": beds })}`;
}, "/home/adam-noah/Desktop/lp_web/src/pages/[listingPage].astro", void 0);
const $$file = "/home/adam-noah/Desktop/lp_web/src/pages/[listingPage].astro";
const $$url = "/[listingPage]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$listingPage,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
