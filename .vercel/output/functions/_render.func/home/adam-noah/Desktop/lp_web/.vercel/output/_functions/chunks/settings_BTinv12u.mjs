/* empty css                         */
import { k as createComponent, l as renderTemplate, p as renderComponent, m as maybeRenderHead, n as addAttribute } from './astro/server_CYlBBrQa.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CdD2IFHX.mjs';
import { $ as $$Split } from './Split_CwRVBP_f.mjs';
import { $ as $$Section } from './Footer_DzQfm9nJ.mjs';
import { $ as $$Container } from './Logo_PkC5nJxB.mjs';

const $$Settings = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Split, { "title": "Settings" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main id="Settings" class="bg-white dark:bg-muted-900 py-12"> ${renderComponent($$result2, "Section", $$Section, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Container", $$Container, {}, { "default": ($$result4) => renderTemplate`  <div class="flex flex-col md:flex-row items-center pt-16 gap-4"> <img${addAttribute(280, "height")}${addAttribute(280, "width")} class="size-16 rounded-full block shrink-0" src="/images/avatars/4.webp" alt="avatar"> <!-- header-meta --> <div class="relative"> <h2 class="dark:text-white font-sans text-center md:text-start text-muted-900 font-semibold text-2xl">Personal Info</h2> <h4 class="text-muted-500 dark:text-muted-400 text-lg text-center md:text-start">Edit your personal details</h4> </div> </div> <div class="py-12 flex md:flex-row flex-col gap-12 md:gap-0 md:justify-between"> <div class="w-full md:w-[58%]"> <div class="relative"> <div class="mb-12"> <h2 class="text-muted-900 dark:text-white font-semibold font-sans text-2xl">General</h2> <h4 class="text-muted-500 dark:text-muted-400">Your general information and details</h4> </div> <!--Setting block--> <article class="media flex items-center gap-4 [&+.media]:mt-4 [&+.media]:pt-4 [&+.media]:border-t [&+.media]:border-muted-200 dark:[&+.media]:border-muted-800"> <div class="flex-1"> <span class="block text-muted-400 text-base">Full Name</span> <span class="block text-muted-900 dark:text-white">Henry Miller</span> </div> <div class="relative"> <a href="#" class="flex items-center gap-1 text-primary-500 font-medium underline-offset-4 hover:underline"> ${renderComponent($$result4, "Icon", $$Icon, { "name": "lucide:edit-3", "class": "size-4" })} <span>Edit</span> </a> </div> </article> <!--Setting block--> <article class="media flex items-center gap-4 [&+.media]:mt-4 [&+.media]:pt-4 [&+.media]:border-t [&+.media]:border-muted-200 dark:[&+.media]:border-muted-800"> <div class="flex-1"> <span class="block text-muted-400 text-base">Gender</span> <span class="block text-muted-900 dark:text-white">Male</span> </div> <div class="relative"> <a href="#" class="flex items-center gap-1 text-primary-500 font-medium underline-offset-4 hover:underline"> ${renderComponent($$result4, "Icon", $$Icon, { "name": "lucide:edit-3", "class": "size-4" })} <span>Edit</span> </a> </div> </article> <!--Setting block--> <article class="media flex items-center gap-4 [&+.media]:mt-4 [&+.media]:pt-4 [&+.media]:border-t [&+.media]:border-muted-200 dark:[&+.media]:border-muted-800"> <div class="flex-1"> <span class="block text-muted-400 text-base">Email Address</span> <span class="block text-muted-900 dark:text-white">henrymiller@gmail.com</span> </div> <div class="relative"> <a href="#" class="flex items-center gap-1 text-primary-500 font-medium underline-offset-4 hover:underline"> ${renderComponent($$result4, "Icon", $$Icon, { "name": "lucide:edit-3", "class": "size-4" })} <span>Edit</span> </a> </div> </article> <!--Setting block--> <article class="media flex items-center gap-4 [&+.media]:mt-4 [&+.media]:pt-4 [&+.media]:border-t [&+.media]:border-muted-200 dark:[&+.media]:border-muted-800"> <div class="flex-1"> <span class="block text-muted-400 text-base">Birthdate</span> <span class="block text-muted-900 dark:text-white">August 24, 1984</span> </div> <div class="relative"> <a href="#" class="flex items-center gap-1 text-primary-500 font-medium underline-offset-4 hover:underline"> ${renderComponent($$result4, "Icon", $$Icon, { "name": "lucide:edit-3", "class": "size-4" })} <span>Edit</span> </a> </div> </article> </div> <!-- account block --> <div class="pt-14 mt-14 border-t border-muted-200 dark:border-muted-800"> <div class="mb-12"> <h2 class="text-muted-900 dark:text-white font-semibold font-sans text-2xl">Additional Info</h2> <h4 class="text-muted-500 dark:text-muted-400">some additional details that we need</h4> </div> <!--Setting block--> <article class="media flex items-center gap-4 [&+.media]:mt-4 [&+.media]:pt-4 [&+.media]:border-t [&+.media]:border-muted-200 dark:[&+.media]:border-muted-800"> <div class="flex-1"> <span class="block text-muted-400 text-base">Phone Number</span> <span class="block text-muted-900 dark:text-white">(+1) 555 551 54984</span> </div> <div class="relative"> <a href="#" class="flex items-center gap-1 text-primary-500 font-medium underline-offset-4 hover:underline"> ${renderComponent($$result4, "Icon", $$Icon, { "name": "lucide:edit-3", "class": "size-4" })} <span>Edit</span> </a> </div> </article> <!--Setting block--> <article class="media flex items-center gap-4 [&+.media]:mt-4 [&+.media]:pt-4 [&+.media]:border-t [&+.media]:border-muted-200 dark:[&+.media]:border-muted-800"> <div class="flex-1"> <span class="block text-muted-400 text-base">ID Document</span> <span class="block text-muted-900 dark:text-white">Successfully uploaded</span> </div> <div class="relative"> <a href="#" class="flex items-center gap-1 text-primary-500 font-medium underline-offset-4 hover:underline"> ${renderComponent($$result4, "Icon", $$Icon, { "name": "lucide:edit-3", "class": "size-4" })} <span>Edit</span> </a> </div> </article> <!--Setting block--> <article class="media flex items-center gap-4 [&+.media]:mt-4 [&+.media]:pt-4 [&+.media]:border-t [&+.media]:border-muted-200 dark:[&+.media]:border-muted-800"> <div class="flex-1"> <span class="block text-muted-400 text-base">Location</span> <span class="block text-muted-900 dark:text-white">San Francisco, CA</span> </div> <div class="relative"> <a href="#" class="flex items-center gap-1 text-primary-500 font-medium underline-offset-4 hover:underline"> ${renderComponent($$result4, "Icon", $$Icon, { "name": "lucide:edit-3", "class": "size-4" })} <span>Edit</span> </a> </div> </article> <!--Setting block--> <article class="media flex items-center gap-4 [&+.media]:mt-4 [&+.media]:pt-4 [&+.media]:border-t [&+.media]:border-muted-200 dark:[&+.media]:border-muted-800"> <div class="flex-1"> <span class="block text-muted-400 text-base">Emergency</span> <span class="block text-muted-900 dark:text-white">Your emergency infos</span> </div> <div class="relative"> <a href="#" class="flex items-center gap-1 text-primary-500 font-medium underline-offset-4 hover:underline"> ${renderComponent($$result4, "Icon", $$Icon, { "name": "lucide:edit-3", "class": "size-4" })} <span>Edit</span> </a> </div> </article> </div> </div> <!--Categories--> <div class="w-full md:w-1/3"> <div class="flex flex-col gap-6"> <a href="/account" class="border border-muted-200 dark:border-muted-800 bg-white dark:bg-muted-950 dark:hover:border-primary-500 hover:border-primary-500 block hover:shadow-lg hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 transition-all duration-300"> <div class="p-6"> <div class="relative mb-2"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "size-6 text-emerald-500", "name": "ph:shield-check-duotone" })} </div> <h3 class="dark:text-white text-muted-900 font-light font-sans text-lg mb-2"> <span class="font-semibold flex items-center"> <span>Account & Security</span> </span> </h3> <p class="text-sm text-muted-500 dark:text-muted-400">Update your password and secure your account. You can also enable two-factor authentication.</p> </div> </a> <a href="/account" class="border border-muted-200 dark:border-muted-800 bg-white dark:bg-muted-950 dark:hover:border-primary-500 hover:border-primary-500 block hover:shadow-lg hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 transition-all duration-300"> <div class="p-6"> <div class="relative mb-2"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "size-6 text-yellow-400", "name": "ph:bell-ringing-duotone" })} </div> <h3 class="dark:text-white text-muted-900 font-light font-sans text-lg mb-2"> <span class="font-semibold flex items-center"> <span>Notifications</span> </span> </h3> <p class="text-sm text-muted-500 dark:text-muted-400">Decide of your notification preferences and the different ways that people should use to reach out to you.</p> </div> </a> </div> </div> </div> ` })} ` })} </main> ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/pages/settings.astro", void 0);

const $$file = "/home/adam-noah/Desktop/lp_web/src/pages/settings.astro";
const $$url = "/settings";

export { $$Settings as default, $$file as file, $$url as url };