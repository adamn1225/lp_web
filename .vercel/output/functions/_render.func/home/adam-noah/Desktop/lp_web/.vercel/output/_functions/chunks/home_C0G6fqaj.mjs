/* empty css                         */
import { k as createComponent, l as renderTemplate, m as maybeRenderHead, p as renderComponent, n as addAttribute, o as createAstro } from './astro/server_CYlBBrQa.mjs';
import 'kleur/colors';
import { $ as $$Split } from './Split_CwRVBP_f.mjs';
import { $ as $$Section } from './Footer_DzQfm9nJ.mjs';
import { $ as $$Container } from './Logo_PkC5nJxB.mjs';
import { $ as $$Icon } from './Icon_CdD2IFHX.mjs';
/* empty css                        */
import { p as projects } from './properties_CnBi_q5f.mjs';
import 'clsx';
import { $ as $$SideFeatureOne, a as $$SideFeatureTwo } from './SideFeatureTwo_BNk-7H5Q.mjs';
import { $ as $$Testimonials, a as $$BoxedCta } from './Testimonials_CDh6Jle8.mjs';
import Autoplay from 'swiper';

const $$HeaderCarousel = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="relative" x-data="homeSwiper" data-astro-cid-y2i4addu> <div class="swiper-container relative max-h-[520px] overflow-hidden" x-ref="container" data-astro-cid-y2i4addu> <div class="swiper-caption bg-white dark:bg-muted-900 absolute bottom-8 end-8 max-w-[380px] z-[2]" data-astro-cid-y2i4addu> <div class="swiper-caption-inner hidden md:block relative w-full h-full p-8" data-astro-cid-y2i4addu> <h3 class="dark:text-white text-2xl font-sans text-muted-900 mb-2" data-astro-cid-y2i4addu>High-end properties</h3> <p class="text-sm mb-3 text-muted-400" data-astro-cid-y2i4addu>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non enim quaero quid verum, sed quid cuique dicendum sit.</p> <div class="flex items-center justify-between" data-astro-cid-y2i4addu> <a href="#" class="text-sm underline-offset-4 hover:underline text-primary-500" data-astro-cid-y2i4addu>Learn More</a> <div class="carousel-controls flex justify-end" data-astro-cid-y2i4addu> <button @click="swiper.slidePrev()" class="flex items-center justify-center outline-none size-8 aspect-square text-lg rounded-md cursor-pointer transition-colors duration-300 text-muted-500 hover:text-muted-900 dark:hover:text-white hover:bg-semi-white-1 hover:dark:bg-dark-purple-3" data-astro-cid-y2i4addu> ${renderComponent($$result, "Icon", $$Icon, { "name": "lucide:arrow-left", "class": "size-4 aspect-auto", "data-astro-cid-y2i4addu": true })} </button> <button @click="swiper.slideNext()" class="flex items-center justify-center outline-none size-8 aspect-square text-lg rounded-md cursor-pointer transition-colors duration-300 text-muted-500 hover:text-muted-900 dark:hover:text-white hover:bg-semi-white-1 hover:dark:bg-dark-purple-3" data-astro-cid-y2i4addu> ${renderComponent($$result, "Icon", $$Icon, { "name": "lucide:arrow-right", "class": "size-4 aspect-auto", "data-astro-cid-y2i4addu": true })} </button> </div> </div> </div> </div> <div class="carousel-pagination absolute top-1/2 start-4 -translate-y-1/2 rotate-90 z-[3]" data-astro-cid-y2i4addu></div> <div class="swiper-wrapper" data-astro-cid-y2i4addu> <!-- Slides --> ${["/images/photo/buildings/4.webp", "/images/photo/buildings/3.webp", "/images/photo/buildings/1.webp", "/images/photo/buildings/2.webp"].map((url) => renderTemplate`<div class="swiper-slide" data-astro-cid-y2i4addu> <div class="slide-inner" data-astro-cid-y2i4addu> <div class="slide-content" data-astro-cid-y2i4addu> <img class="w-full object-cover h-[280px] md:h-[500px] lg:h-auto"${addAttribute(url, "src")} alt="Slide Image" data-astro-cid-y2i4addu> </div> </div> </div>`)} </div> </div> </div> `;
}, "/home/adam-noah/Desktop/lp_web/src/components/ui/carousel/HeaderCarousel.astro", void 0);

const $$HeroCarousel = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Section", $$Section, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-4 lg:gap-12 pt-24 pb-8"> <h1 class="font-sans text-muted-900 dark:text-white font-normal text-4xl md:text-5xl text-start md:leading-none">The home of excellence in the construction industry</h1> <p class="mb-3 text-base text-muted-500 dark:text-muted-400">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non enim quaero quid verum, sed quid cuique dicendum sit. Quid affers, cur Thorius, cur Caius.
</p> </div> ${renderComponent($$result3, "HeaderCarousel", $$HeaderCarousel, {})} ` })} ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/components/sections/HeroCarousel.astro", void 0);

const $$Astro = createAstro();
const $$NumberBox = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$NumberBox;
  const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sic, et quidem
      diligentius saepiusque ista loquemur inter nos agemusque communiter. Quid
      enim necesse est, tamquam meretricem .`;
  const { number, title, text = sampleText } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="bg-white dark:bg-muted-950 dark:border-muted-800 border border-muted-200 relative flex flex-col z-10 shadow-lg shadow-muted-300/30 dark:shadow-muted-800/20"> <div class="p-8 pb-3"> <span class="text-lg text-muted-700 dark:text-muted-500">${number}</span> </div> <div class="px-8 before:absolute before:w-[5px] before:bg-primary-500 before:h-full relative before:start-0 before:top-0"> <h3 class="dark:text-white font-sans text-muted-900 font-semibold text-2xl"> ${title} </h3> </div> <div class="p-8 pt-3"> <p class="text-base text-muted-500 dark:text-muted-400">${text}</p> </div> <div class="mt-auto p-8 pt-0"> <a href="#" class="inline-flex group items-center text-primary-500 relative after:content-[''] after:absolute after:h-[2px] after:bg-primary-500 after:transition-['width'] after:duration-300 after:w-0 after:hover:w-full after:-bottom-[0.15rem] after:start-0"> <span class="whitespace-nowrap me-1">Learn More</span> ${renderComponent($$result, "Icon", $$Icon, { "name": "lucide:arrow-right", "class": "group-hover:translate-x-1 transition-transform duration-300 h-5 aspect-auto text-primary-500 fill-primary" })} </a> </div> </div>`;
}, "/home/adam-noah/Desktop/lp_web/src/components/ui/number-boxes/NumberBox.astro", void 0);

const $$Process = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Section", $$Section, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="lg:max-w-4xl"> <h2 class="font-sans text-muted-900 dark:text-white text-3xl leading-9 text-start md:leading-8">
We make sure our lovely customers are always involved so, every transaction flow process in our company is a must for them.
</h2> </div> <div class="py-8"> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <div class="column py-3 relative before:content-[''] before:absolute before:top-0 before:rounded-[100rem] before:bg-primary-500 before:opacity-[0.07] before:h-[125%] before:w-40 before:z-0 before:rotate-45 before:-translate-y-16 before:translate-x-10"> ${renderComponent($$result3, "NumberBox", $$NumberBox, { "title": "Process #1", "number": "01" })} </div> <div class="column py-3 relative before:content-[''] before:absolute before:top-0 before:rounded-[100rem] before:bg-primary-500 before:opacity-[0.07] before:h-[125%] before:w-40 before:z-0 before:rotate-45 before:-translate-y-[8rem] before:translate-x-20"> ${renderComponent($$result3, "NumberBox", $$NumberBox, { "title": "Process #2", "number": "02" })} </div> <div class="column py-3 relative before:content-[''] before:absolute before:top-0 before:rounded-[100rem] before:bg-primary-500 before:opacity-[0.07] before:h-[125%] before:w-40 before:z-0 before:rotate-45 before:translate-x-full"> ${renderComponent($$result3, "NumberBox", $$NumberBox, { "title": "Process #3", "number": "03" })} </div> </div> </div> ` })} ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/components/sections/Process.astro", void 0);

const $$PolkaDots = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="polka-dots relative w-[100px] aspect-square flex justify-center items-center flex-wrap"> ${[...new Array(16)].map((dot) => renderTemplate`<span class="flex items-center justify-center w-6 aspect-square transition-all duration-[.25s] ease-in-out after:content-[''] after:relative after:w-1.5 after:aspect-square after:rounded-full after:opacity-[.55] after:transition-all after:duration-[.25s] after:ease-in-out after:bg-muted-300 after:dark:opacity-20"></span>`)} </div>`;
}, "/home/adam-noah/Desktop/lp_web/src/components/ui/PolkaDots.astro", void 0);

const $$ProjectCarousel = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="relative"> <!-- Polka dots --> <div class="absolute top-3 -start-11">${renderComponent($$result, "PolkaDots", $$PolkaDots, {})}</div> <div class="absolute -bottom-10 -end-11">${renderComponent($$result, "PolkaDots", $$PolkaDots, {})}</div> <div x-data="projectsSwiper" class="relative z-[2]"> <div class="flex justify-end mb-6"> <button @click="swiper.slidePrev()" class="flex justify-center items-center outline-none h-8 aspect-square text-lg rounded-md cursor-pointer transition-colors duration-300 bg-none hover:bg-muted-100 hover:dark:bg-muted-800 group"> ${renderComponent($$result, "Icon", $$Icon, { "class": "text-muted-500 group-hover:text-muted-900 pointer-events-none dark:group-hover:text-white size-4 aspect-auto", "name": "lucide:arrow-left" })} </button> <button @click="swiper.slideNext()" class="flex justify-center items-center outline-none h-8 aspect-square text-lg rounded-md cursor-pointer transition-colors duration-300 bg-none hover:bg-muted-100 hover:dark:bg-muted-800 group"> ${renderComponent($$result, "Icon", $$Icon, { "class": "text-muted-500 group-hover:text-muted-900 pointer-events-none dark:group-hover:text-white size-4 aspect-auto", "name": "lucide:arrow-right" })} </button> </div> <div class="overflow-hidden" x-ref="container"> <div class="swiper-wrapper"> <!-- Slides --> ${[...projects, ...projects].map((project) => renderTemplate`<div class="swiper-slide"> <a> <div class="relative"> <img class="h-[352px] lg:h-[390px] w-full object-cover"${addAttribute(project.image, "src")}${addAttribute(project.title, "alt")}> <div class="hover:opacity-100 absolute top-0 h-full w-full opacity-0 transition-opacity duration-300 start-0"> <div class="absolute top-0 h-full w-full bg-gradient-to-t from-muted-900 z-0 start-0"> <div class="relative h-full w-full flex flex-col justify-end"> <div class="p-6"> <h3 class="font-sans text-white font-medium text-xl">${project.title}</h3> <p class="opacity-70 text-muted-200 text-sm">${project.location}</p> </div> </div> </div> </div> </div> </a> </div>`)} </div> </div> </div> </div>`;
}, "/home/adam-noah/Desktop/lp_web/src/components/ui/carousel/ProjectCarousel.astro", void 0);

const $$RecentProjects = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Section", $$Section, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="lg:max-w-4xl"> <h2 class="font-sans text-4xl text-center md:text-start md:leading-tight text-muted-900 dark:text-white">Some of our vacation properties</h2> </div> ${renderComponent($$result3, "ProjectCarousel", $$ProjectCarousel, {})} ` })} ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/components/sections/RecentProjects.astro", void 0);

const $$Home = createComponent(($$result, $$props, $$slots) => {
  document.addEventListener("alpine:init", () => {
    Alpine.data("homeSwiper", () => ({
      swiper: null,
      init() {
        this.swiper = new Swiper(this.$refs.container, {
          modules: [Autoplay],
          loop: true,
          autoplay: {
            delay: 5e3
          },
          slidesPerView: 1,
          spaceBetween: 0,
          effect: "fade",
          fadeEffect: {
            crossFade: true
          },
          pagination: {
            el: ".carousel-pagination",
            type: "bullets"
          },
          breakpoints: {
            640: {
              slidesPerView: 1,
              spaceBetween: 0
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 0
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 0
            }
          }
        });
      }
    }));
    Alpine.data("projectsSwiper", () => ({
      swiper: null,
      init() {
        this.swiper = new Swiper(this.$refs.container, {
          modules: [Autoplay],
          loop: true,
          autoplay: {
            delay: 5e3,
            disableOnInteraction: false
          },
          slidesPerView: 4,
          spaceBetween: 20,
          pagination: {
            el: ".carousel-pagination",
            type: "bullets"
          },
          breakpoints: {
            340: {
              slidesPerView: 1.5,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20
            }
          }
        });
      }
    }));
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Split, { "title": "Home" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main id="Home"> <!--Header --> ${renderComponent($$result2, "HeroCarousel", $$HeroCarousel, {})} <!--Process section--> ${renderComponent($$result2, "Process", $$Process, {})} <!--Recent projects carousel--> ${renderComponent($$result2, "RecentProjects", $$RecentProjects, {})} <!--Side Feature--> ${renderComponent($$result2, "SideFeatureOne", $$SideFeatureOne, {})} <!--Side Feature--> ${renderComponent($$result2, "SideFeatureTwo", $$SideFeatureTwo, {})} <!--Testimonials--> ${renderComponent($$result2, "Testimonials", $$Testimonials, {})} <!-- ENGAGE/CTA--> ${renderComponent($$result2, "BoxedCta", $$BoxedCta, {})} </main> ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/pages/home.astro", void 0);

const $$file = "/home/adam-noah/Desktop/lp_web/src/pages/home.astro";
const $$url = "/home";

export { $$Home as default, $$file as file, $$url as url };
