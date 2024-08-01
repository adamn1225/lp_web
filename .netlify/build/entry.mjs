import { renderers } from './renderers.mjs';
import { manifest } from './manifest_BHRwuykw.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/account.astro.mjs');
const _page4 = () => import('./pages/api/localdev.astro.mjs');
const _page5 = () => import('./pages/contact.astro.mjs');
const _page6 = () => import('./pages/dashboard.astro.mjs');
const _page7 = () => import('./pages/landing.astro.mjs');
const _page8 = () => import('./pages/listing-page.astro.mjs');
const _page9 = () => import('./pages/listings.json.astro.mjs');
const _page10 = () => import('./pages/login.astro.mjs');
const _page11 = () => import('./pages/properties.astro.mjs');
const _page12 = () => import('./pages/quote.astro.mjs');
const _page13 = () => import('./pages/settings.astro.mjs');
const _page14 = () => import('./pages/signup.astro.mjs');
const _page15 = () => import('./pages/_listingpage_.astro.mjs');
const _page16 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/.pnpm/astro@4.12.3_@types+node@22.0.2_sass@1.77.8_typescript@5.5.4/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/account.astro", _page3],
    ["src/pages/api/localdev.ts", _page4],
    ["src/pages/contact.astro", _page5],
    ["src/pages/dashboard.astro", _page6],
    ["src/pages/landing.astro", _page7],
    ["src/pages/listing-page.astro", _page8],
    ["src/pages/listings.json.ts", _page9],
    ["src/pages/login.astro", _page10],
    ["src/pages/properties.astro", _page11],
    ["src/pages/quote.astro", _page12],
    ["src/pages/settings.astro", _page13],
    ["src/pages/signup.astro", _page14],
    ["src/pages/[listingPage].astro", _page15],
    ["src/pages/index.astro", _page16]
]);
const serverIslandMap = new Map();

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "fb5de871-10e1-4f89-9316-654573280656"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
