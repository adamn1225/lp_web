/* empty css                                         */
import { c as createComponent, r as renderTemplate, d as renderComponent, b as createAstro, m as maybeRenderHead } from '../chunks/astro/server_CWjZw3JT.mjs';
import 'kleur/colors';
import { $ as $$Split } from '../chunks/Split_D-431LXF.mjs';
import { $ as $$Container, a as $$Logo } from '../chunks/Logo_CJ3dG8od.mjs';
import { $ as $$Icon } from '../chunks/Footer_C2ptFNbc.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  return renderTemplate`${renderComponent($$result, "Layout", $$Split, { "title": "Login", "data-astro-cid-sgpqyurt": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main id="Login" class="bg-muted-50 relative" data-astro-cid-sgpqyurt> <header class="absolute top-0 start-0 z-[5] w-full px-3" data-astro-cid-sgpqyurt> ${renderComponent($$result2, "Container", $$Container, { "data-astro-cid-sgpqyurt": true }, { "default": ($$result3) => renderTemplate` <div class="flex justify-between items-center gap-3 min-h-[4.5rem]" data-astro-cid-sgpqyurt> <a href="/" class="flex gap-4 items-center" data-astro-cid-sgpqyurt> ${renderComponent($$result3, "Logo", $$Logo, { "class": "size-8", "data-astro-cid-sgpqyurt": true })} <p class="font-medium text-2xl font-sans text-muted-900" data-astro-cid-sgpqyurt></p> </a> </div> ` })} </header> <section class="min-h-screen relative flex flex-col justify-between items-stretch" data-astro-cid-sgpqyurt> <div class="flex items-center py-12 px-6 md:px-12 flex-grow" data-astro-cid-sgpqyurt> ${renderComponent($$result2, "Container", $$Container, { "data-astro-cid-sgpqyurt": true }, { "default": ($$result3) => renderTemplate` <form action="/api/auth/signin" method="post" data-astro-cid-sgpqyurt> <div class="flex flex-col lg:flex-row justify-center items-center" data-astro-cid-sgpqyurt> <div class="column p-3" data-astro-cid-sgpqyurt> <div class="max-w-md mb-6" data-astro-cid-sgpqyurt> <h1 class="text-center text-4xl mb-2 font-medium font-sans text-muted-900" data-astro-cid-sgpqyurt>Sign In</h1> <p class="text-muted-500 text-center text-base" data-astro-cid-sgpqyurt>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Verum hoc idem saepe faciamus.</p> </div> <div data-astro-cid-sgpqyurt> <label class="text-sm text-muted-500" data-astro-cid-sgpqyurt>Email Address</label> <div class="relative" data-astro-cid-sgpqyurt> <input type="email" name="email" class="w-full peer outline-none focus:outline-none p-3 ps-12 border border-muted-200 hover:border-muted-300  text-muted-600 placeholder:text-muted-200 transition-all duration-300 rounded h-12 text-base" placeholder="Enter your email" id="email" data-astro-cid-sgpqyurt> <div class="peer-focus:[&>svg]:text-cyan-600 absolute start-0 top-0 grid place-items-center h-12 w-12" data-astro-cid-sgpqyurt> ${renderComponent($$result3, "Icon", $$Icon, { "class": "h-4 w-4 text-muted-300 stroke-[1.6px] transition-all duration-300", "name": "lucide:mail", "data-astro-cid-sgpqyurt": true })} </div> </div> </div> <div data-astro-cid-sgpqyurt> <label class="text-sm text-muted-500" data-astro-cid-sgpqyurt>Password</label> <div class="relative" data-astro-cid-sgpqyurt> <input type="password" name="password" class="w-full peer outline-none focus:outline-none p-3 ps-12 border border-muted-200 hover:border-muted-300  text-muted-600 placeholder:text-muted-200 transition-all duration-300 rounded h-12 text-base" placeholder="Enter your password" id="password" data-astro-cid-sgpqyurt> <div class="peer-focus:[&>svg]:text-cyan-600 absolute start-0 top-0 grid place-items-center h-12 w-12" data-astro-cid-sgpqyurt> ${renderComponent($$result3, "Icon", $$Icon, { "class": "h-4 w-4 text-muted-300 stroke-[1.6px] transition-all duration-300", "name": "lucide:lock", "data-astro-cid-sgpqyurt": true })} </div> </div> </div> <div data-astro-cid-sgpqyurt> <div class="flex items-center gap-2 py-2" data-astro-cid-sgpqyurt> <label for="remember-me" class="inline-flex relative items-center cursor-pointer" data-astro-cid-sgpqyurt> <input id="remember-me" type="checkbox" class="appearance-none peer" data-astro-cid-sgpqyurt> <div class="relative inline-block w-[48px] h-[28px] bg-muted-100 border border-muted-200 peer-focus:outline-none after:border rounded-full peer-checked:bg-cyan-600 transition-all duration-300 ease-linear before:content-[''] before:absolute before:w-[42px] before:h-[22px] before:before:rounded-full before:bg-muted-100 before:[transform:translate3d(2px,2px,0)_scale3d(1,1,1)] before:transition-all before:duration-[0.25s] before:ease-linear after:content-[''] after:absolute after:w-[22px] after:h-[22px] after:bg-white after:rounded-full after:shadow-md after:[transform:translate3d(2px,2px,0)] peer-checked:before:[transform:translate3d(18px,2px,0)_scale3d(0,0,0)] peer-checked:after:[transform:translate3d(22px,2px,0)] after:transition-all after:duration-[0.2s] after:ease-in-out" data-astro-cid-sgpqyurt></div> <span class="ms-3 text-sm font-medium text-muted-400" data-astro-cid-sgpqyurt>Remember me</span> </label> </div> </div> <div data-astro-cid-sgpqyurt> <div class="mt-4 mb-3" data-astro-cid-sgpqyurt> <button type="submit" class="min-h-12 bg-cyan-600 rounded font-medium text-sm w-full px-4 py-2 flex justify-center items-center text-white transition-all duration-300" :class="{'is-loading': isLoading }" data-astro-cid-sgpqyurt>
Login
</button> </div> <div class="mt-4 mb-3" data-astro-cid-sgpqyurt> <button class="min-h-12 bg-cyan-600 rounded font-medium text-sm w-full px-4 py-2 flex justify-center items-center text-white transition-all duration-300" id="google" data-astro-cid-sgpqyurt>Sign in with Google</button> </div> <div class="text-center" data-astro-cid-sgpqyurt> <a href="/forgot" class="underline-offset-4 hover:underline hover:text-cyan-600 transition-colors duration-300 text-sm text-muted-400" data-astro-cid-sgpqyurt>Forgot Password?</a> </div> </div> </div> </div></form> ` })} </div> </section> </main>  ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/pages/login.astro", void 0);

const $$file = "/home/adam-noah/Desktop/lp_web/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };