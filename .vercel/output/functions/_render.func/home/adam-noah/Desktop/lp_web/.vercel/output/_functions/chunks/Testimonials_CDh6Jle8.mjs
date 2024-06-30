import { k as createComponent, l as renderTemplate, p as renderComponent, m as maybeRenderHead, o as createAstro, n as addAttribute } from './astro/server_CYlBBrQa.mjs';
import 'kleur/colors';
import { $ as $$Section } from './Footer_DzQfm9nJ.mjs';
import { $ as $$Container } from './Logo_PkC5nJxB.mjs';
import 'clsx';

const $$BoxedCta = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Section", $$Section, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="max-w-8xl drop-shadow-lg relative mb-4 mx-auto py-20 px-8 bg-cover bg-no-repeat" style="background-image: url('/images/photo/cta.webp');"> <div class="relative z-[2] w-full h-full flex flex-col justify-center items-center text-white"> <h2 class="max-w-md text-3xl leading-9 font-sans text-center">Engage with our company and invest in our projects</h2> <div class="flex flex-col w-full md:w-max md:flex-row items-center mt-6 gap-2 mb-2"> <button class="hover:bg-white text-sm w-full md:w-max hover:text-cyan-600 transition-all px-4 py-2 min-w-32 min-h-12 rounded border-2 border-white">Invest Now</button> <button class="hover:bg-white text-sm w-full md:w-max hover:text-cyan-600 transition-all px-4 py-2 min-w-32 min-h-12 rounded border-2 border-white">Learn More</button> </div> </div> <!-- overlay --> <div class="overlay absolute inset-0 bg-primary-500/80 z-0"></div> </div> ` })} ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/components/sections/BoxedCta.astro", void 0);

const $$Astro$1 = createAstro();
const $$Testimonial = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Testimonial;
  const { name, address, review } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section aria-label="Testimonial" class="p-[30px] bg-white dark:bg-muted-950 shadow-lg shadow-muted-300/30 dark:shadow-muted-800/20 border border-muted-200 dark:border-muted-800"> <p class="text-muted-500 dark:text-muted-400 text-[15px] leading-[22px] mt-2 mb-4"> ${review} </p> <div class="flex items-center gap-2"> <div class="flex flex-col"> <span class="text-sm text-muted-900 dark:text-white font-semibold">${name}</span> <small class="text-sm text-muted-400">${address}</small> </div> </div> </section>`;
}, "/home/adam-noah/Desktop/lp_web/src/components/ui/Testimonial.astro", void 0);

const $$Astro = createAstro();
const $$Testimonials = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Testimonials;
  const { centerText = false } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Section", $$Section, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="w-full flex flex-col"> <div${addAttribute(["mb-8", { "flex flex-col items-center": centerText }], "class:list")}> <h2 class="font-sans text-4xl font-medium leading-9 text-slate-900 dark:text-white">What Our Valued Vacationers Say</h2> ${centerText && renderTemplate`<p class="mt-2 text-xl text-muted-400 text-center">Yeah, we know... Lots of happy people</p>`} </div> <!--Grid--> <div class="py-8 flex flex-col lg:flex-row gap-6 bg-no-repeat" style="background-image: url('/images/shapes/1.svg');"> <!-- column 1 --> <div class="flex flex-col md:flex-row lg:flex-col w-full lg:w-1/3 gap-6 lg:mb-6"> ${renderComponent($$result3, "Testimonial", $$Testimonial, { "name": "Nicole James", "address": "Los Angeles, CA", "review": `
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Confecta res esset.
              Aliter homines, aliter philosophos loqui putas oportere? Mihi, inquam, qui
              te id ipsum rogavi? Frater et T. Erat enim res aperta.
            ` })} ${renderComponent($$result3, "Testimonial", $$Testimonial, { "name": "MarK Coleo", "address": "San Francisco, CA", "review": `Lorem ipsum dolor sit amet, consectetur adipiscing elit. At enim hic etiam dolore. Quis negat. ` })} </div> <!-- column 2 --> <div class="flex flex-col md:flex-row lg:flex-col w-full lg:w-1/3 gap-6 mt-5 lg:mb-6"> ${renderComponent($$result3, "Testimonial", $$Testimonial, { "name": "Martha Stewart", "address": "San Bernardo, CA", "review": `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis negat? Atqui reperies, inquit, in hoc quidem pertinacem; Id Sextilius factum negabat. ` })} ${renderComponent($$result3, "Testimonial", $$Testimonial, { "name": "Brian Welmingg", "address": "Los Angeles, CA", "review": `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hanc ergo intuens debet institutum illud quasi signum absolvere. Satis est ad hoc responsum. Nos commodius agimus. ` })} </div> <!-- column 3 --> <div class="flex flex-col md:flex-row lg:flex-col w-full lg:w-1/3 gap-6 mt-8 lg:mb-6"> ${renderComponent($$result3, "Testimonial", $$Testimonial, { "name": "Chris Stappler", "address": "Barton Inc.", "review": `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hanc ergo intuens debet institutum illud quasi signum absolvere. Satis est ad hoc responsum. Nos commodius agimus. ` })} ${renderComponent($$result3, "Testimonial", $$Testimonial, { "name": "Nicole James", "address": "Los Angeles, CA", "review": `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scisse enim. ` })} </div> </div> </div> ` })} ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/components/sections/Testimonials.astro", void 0);

export { $$Testimonials as $, $$BoxedCta as a };
