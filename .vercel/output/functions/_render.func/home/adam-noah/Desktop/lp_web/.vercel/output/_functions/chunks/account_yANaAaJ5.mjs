/* empty css                         */
import { k as createComponent, l as renderTemplate, p as renderComponent, m as maybeRenderHead, n as addAttribute } from './astro/server_CYlBBrQa.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CdD2IFHX.mjs';
import { $ as $$Split } from './Split_CwRVBP_f.mjs';
import { $ as $$Section } from './Footer_DzQfm9nJ.mjs';
import { $ as $$Container } from './Logo_PkC5nJxB.mjs';

const $$Account = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Split, { "title": "Account" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main id="Account" class="bg-white dark:bg-muted-900 py-12"> ${renderComponent($$result2, "Section", $$Section, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Container", $$Container, {}, { "default": ($$result4) => renderTemplate`  <div class="flex flex-col md:flex-row items-center pt-16 gap-4"> <img${addAttribute(280, "height")}${addAttribute(280, "width")} class="size-16 rounded-full block shrink-0" src="/images/avatars/4.webp" alt="avatar"> <!-- header-meta --> <div class="relative"> <h2 class="dark:text-white font-sans text-center md:text-start text-muted-900 font-semibold text-2xl">Account</h2> <h4 class="text-muted-500 dark:text-muted-400 text-lg text-center md:text-start">Welcome back, Henry M.</h4> </div> </div>  <div class="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <a href="/settings" class="border border-muted-200 dark:border-muted-800 bg-white dark:bg-muted-950 dark:hover:border-primary-500 hover:border-primary-500 block hover:shadow-lg hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 transition-all duration-300"> <div class="p-6"> <div class="relative mb-2"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "size-6 text-rose-500", "name": "ph:heartbeat-duotone" })} </div> <h3 class="dark:text-white text-muted-900 font-light font-sans text-lg mb-2"> <span class="font-semibold flex items-center"> <span>Personal Info</span> </span> </h3> <p class="text-sm text-muted-500 dark:text-muted-400">We want to know more about you. Let us know about all of your personal details and how we can reach out to you.</p> </div> </a> <a href="/settings" class="border border-muted-200 dark:border-muted-800 bg-white dark:bg-muted-950 dark:hover:border-primary-500 hover:border-primary-500 block hover:shadow-lg hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 transition-all duration-300"> <div class="p-6"> <div class="relative mb-2"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "size-6 text-emerald-500", "name": "ph:shield-check-duotone" })} </div> <h3 class="dark:text-white text-muted-900 font-light font-sans text-lg mb-2"> <span class="font-semibold flex items-center"> <span>Account & Security</span> </span> </h3> <p class="text-sm text-muted-500 dark:text-muted-400">Update your password and secure your account. You can also enable two-factor authentication.</p> </div> </a> <a href="/settings" class="border border-muted-200 dark:border-muted-800 bg-white dark:bg-muted-950 dark:hover:border-primary-500 hover:border-primary-500 block hover:shadow-lg hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 transition-all duration-300"> <div class="p-6"> <div class="relative mb-2"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "size-6 text-sky-500", "name": "ph:credit-card-duotone" })} </div> <h3 class="dark:text-white text-muted-900 font-light font-sans text-lg mb-2"> <span class="font-semibold flex items-center"> <span>Payments</span> </span> </h3> <p class="text-sm text-muted-500 dark:text-muted-400">View your payments and your transactions. Also view coupon codes, gift cards and tax reports.</p> </div> </a> <a href="/settings" class="border border-muted-200 dark:border-muted-800 bg-white dark:bg-muted-950 dark:hover:border-primary-500 hover:border-primary-500 block hover:shadow-lg hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 transition-all duration-300"> <div class="p-6"> <div class="relative mb-2"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "size-6 text-yellow-400", "name": "ph:bell-ringing-duotone" })} </div> <h3 class="dark:text-white text-muted-900 font-light font-sans text-lg mb-2"> <span class="font-semibold flex items-center"> <span>Notifications</span> </span> </h3> <p class="text-sm text-muted-500 dark:text-muted-400">Decide of your notification preferences and the different ways that people should use to reach out to you.</p> </div> </a> <a href="/settings" class="border border-muted-200 dark:border-muted-800 bg-white dark:bg-muted-950 dark:hover:border-primary-500 hover:border-primary-500 block hover:shadow-lg hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 transition-all duration-300"> <div class="p-6"> <div class="relative mb-2"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "size-6 text-primary-500", "name": "ph:lock-duotone" })} </div> <h3 class="dark:text-white text-muted-900 font-light font-sans text-lg mb-2"> <span class="font-semibold flex items-center"> <span>Privacy</span> </span> </h3> <p class="text-sm text-muted-500 dark:text-muted-400">Control all your connected apps and how they access your information. Control what you share and who has access.</p> </div> </a> <a href="/settings" class="border border-muted-200 dark:border-muted-800 bg-white dark:bg-muted-950 dark:hover:border-primary-500 hover:border-primary-500 block hover:shadow-lg hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 transition-all duration-300"> <div class="p-6"> <div class="relative mb-2"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "size-6 text-violet-500", "name": "ph:gear-six-duotone" })} </div> <h3 class="dark:text-white text-muted-900 font-light font-sans text-lg mb-2"> <span class="font-semibold flex items-center"> <span>Global Settings</span> </span> </h3> <p class="text-sm text-muted-500 dark:text-muted-400">Select your timezone, your main currency for payments and your default language. You can change this whenever you want.</p> </div> </a> <a href="/settings" class="border border-muted-200 dark:border-muted-800 bg-white dark:bg-muted-950 dark:hover:border-primary-500 hover:border-primary-500 block hover:shadow-lg hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 transition-all duration-300"> <div class="p-6"> <div class="relative mb-2"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "size-6 text-lime-500", "name": "ph:buildings-duotone" })} </div> <h3 class="dark:text-white text-muted-900 font-light font-sans text-lg mb-2"> <span class="font-semibold flex items-center"> <span>Dashboard</span> </span> </h3> <p class="text-sm text-muted-500 dark:text-muted-400">Use our professional tools to manage your houses, your residences and the transactions you offer on our platform.</p> </div> </a> <a href="/settings" class="border border-muted-200 dark:border-muted-800 bg-white dark:bg-muted-950 dark:hover:border-primary-500 hover:border-primary-500 block hover:shadow-lg hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 transition-all duration-300"> <div class="p-6"> <div class="relative mb-2"> ${renderComponent($$result4, "Icon", $$Icon, { "class": "size-6 text-yellow-400", "name": "ph:crown-duotone" })} </div> <h3 class="dark:text-white text-muted-900 font-light font-sans text-lg mb-2"> <span class="font-semibold flex items-center"> <span>Houseo Premium</span> </span> </h3> <p class="text-sm text-muted-500 dark:text-muted-400">Add a professional email account so you can start benefiting from pro offers and business oriented housing.</p> </div> </a> </div> <div class="py-12 flex flex-col items-center"> <p class="text-sm text-muted-500 dark:text-muted-400 mb-2">Need yo disable your account?</p> <a href="#" class="underline-offset-4 hover:underline text-sm text-primary-500 text-center">Disable Account</a> </div> ` })} ` })} </main> ` })}`;
}, "/home/adam-noah/Desktop/lp_web/src/pages/account.astro", void 0);

const $$file = "/home/adam-noah/Desktop/lp_web/src/pages/account.astro";
const $$url = "/account";

export { $$Account as default, $$file as file, $$url as url };