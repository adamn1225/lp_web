import { c as createComponent, r as renderTemplate, d as renderComponent, b as createAstro, u as unescapeHTML, F as Fragment, m as maybeRenderHead, a as addAttribute, e as renderSlot } from './astro/server_CWjZw3JT.mjs';
import 'kleur/colors';
import 'clsx';

const userAgents = [
  // this must always be the first element here!
  {
    name: "woff",
    ua: "Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko"
  },
  // from: https://github.com/fontsource/google-font-metadata/blob/main/data/user-agents.json
  {
    name: "woff2",
    ua: 'Mozilla/5.0 (Windows NT 6.3; rv:39.0) Gecko/20100101 Firefox/44.0"'
  }
];
function downloadFontCSS(url) {
  const fontDownloads = Promise.all(
    userAgents.map((entry) => {
      return fetch(url, { headers: { "User-Agent": entry.ua } }).then((res) => res.text()).then(
        (t) => t.replace(/  +/g, "").replace(/\t+/g, "").replace(/\n+/g, "")
      );
    })
  );
  return fontDownloads.then((contents) => contents.join(" "));
}

const $$Astro$2 = createAstro();
const $$GoogleFontsOptimizer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$GoogleFontsOptimizer;
  const props = Astro2.props;
  const urls = Array.isArray(props.url) ? props.url : [props.url];
  const contents = await Promise.all(urls.map((url) => downloadFontCSS(url)));
  return renderTemplate`${contents.length > 0 && renderTemplate`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">`}${contents.map(
    (styles) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`<style type="text/css">${unescapeHTML(styles)}</style>` })}`
  )}`;
}, "/home/adam-noah/Desktop/lp_web/node_modules/.pnpm/astro-google-fonts-optimizer@0.2.2/node_modules/astro-google-fonts-optimizer/GoogleFontsOptimizer.astro", void 0);

const $$ScrollTop = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="progress-wrap group fixed end-8 bottom-8 h-12 w-12 cursor-pointer block rounded-full shadow-lg z-[1000] opacity-0 translate-y-4 transition-all duration-200 ease-linear" x-ref="progressWrap" x-data="scrolltop" @scroll.window="scroll()" :class="scrolled ? 'active-progress opacity-100 visible translate-y-0' : 'invisible'" @click="scrollTop()"> <svg class="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102"> <path x-ref="progressPath" class="fill-none stroke-cyan-600 stroke-[4] transition-all duration-200 ease-linear" d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"></path> </svg> <svg class="inner-arrow group-hover:opacity-60 absolute font-extrabold text-center leading-6 text-base text-cyan-600 start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 cursor-pointer block z-[1] transition-all duration-200 ease-linear" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <line x1="12" y1="19" x2="12" y2="5"></line> <polyline points="5 12 12 5 19 12"></polyline> </svg> </div> `;
}, "/home/adam-noah/Desktop/lp_web/src/components/ui/ScrollTop.astro", void 0);

const $$Astro$1 = createAstro();
const $$Container = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Container;
  const { fluid = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["w-full mx-auto", [
    fluid ? "" : "max-w-full px-8"
  ]], "class:list")}> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/home/adam-noah/Desktop/lp_web/src/components/Container.astro", void 0);

const $$Astro = createAstro();
const $$Logo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Logo;
  Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="2.61849in" height="0.79037in" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 11098.5 3640.38" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs> <font id="FontID0" horiz-adv-x="549" font-variant="normal" style="fill-rule:nonzero" font-weight="400"> ${renderComponent($$result, "font-face", "font-face", { "font-family": "Swis721 Cn BT" }, { "default": () => renderTemplate` ${renderComponent($$result, "font-face-src", "font-face-src", {}, { "default": () => renderTemplate` ${renderComponent($$result, "font-face-name", "font-face-name", { "name": "Swis721 Cn BT Roman" })} ` })} ` })} ${renderComponent($$result, "missing-glyph", "missing-glyph", {}, { "default": () => renderTemplate`<path d="M0 0z"></path>` })} <glyph unicode="L" horiz-adv-x="475" d="M67.0014 0l0 751.999 83.9966 0 0 -670.998 300.002 0 0 -81.0008 -383.998 0z"></glyph> <glyph unicode="P" horiz-adv-x="529" d="M150.998 392.002l110.17 0c50.8305,0 87.9983,12.1647 112,36.3303 23.8332,24.3339 35.8339,62.5033 35.8339,114.499 0,47.8347 -12.0008,82.5031 -36.1663,104.001 -24.0016,21.5021 -62.9997,32.169 -117.003,32.169l-104.834 0 0 -286.999zm-83.9966 -392.002l0 751.999 192.832 0c81.9979,0 141.833,-16.8312 179.498,-50.4981 37.837,-33.6669 56.6669,-86.8328 56.6669,-159.502 0,-74.4997 -19.663,-130.83 -58.9979,-168.831 -39.4989,-38.1694 -97.3357,-57.1677 -173.834,-57.1677l-112.168 0 0 -316 -83.9966 0z"></glyph> <glyph unicode="e" horiz-adv-x="440" d="M125.002 340.999l190.998 0 0 15.1694c0,52.0004 -7.49827,91.1669 -22.6676,117.331 -15.1649,26.3326 -37.8326,39.4989 -68.1669,39.4989 -33.8309,0 -58.9979,-14.1634 -75.4968,-42.3307 -16.5033,-28.3357 -24.6663,-71.4995 -24.6663,-129.669zm191.999 -150.998l76.9991 0c-0.669172,-66.3322 -15.8341,-117.167 -45.6677,-152.332 -29.6651,-35.1692 -72.1642,-52.6696 -127.165,-52.6696 -60.5002,0 -105.166,23.6692 -134.003,70.8347 -28.832,47.1655 -43.1638,120.167 -43.1638,219.001 0,104.834 14.3318,181.501 43.1638,230.164 28.8364,48.6679 74.1673,73.0018 136.001,73.0018 58.3332,0 101.665,-20.669 130.165,-62.0026 28.4996,-41.4975 42.6675,-104.497 42.6675,-189.163 0,-13.3347 0,-23.5008 -0.163969,-30.3343 -0.168401,-6.83353 -0.500771,-13.0023 -0.833141,-18.5019l-270 -0.500771 0 -24.8303c0,-70.17 8.16301,-121.333 24.4979,-153.502 16.1665,-32.1646 42.1667,-48.1671 77.6683,-48.1671 27.6665,0 49.4966,12.1692 65.6631,36.3347 16.0025,24.1655 24.17,57.1677 24.17,98.8336l0 3.83334z"></glyph> <glyph unicode="i" horiz-adv-x="199" d="M58.9979 650.001l0 101.998 81.0008 0 0 -101.998 -81.0008 0zm0 -650.001l0 561.998 81.0008 0 0 -561.998 -81.0008 0z"></glyph> <glyph unicode="n" horiz-adv-x="470" d="M59.9995 0l0 561.998 73.6665 0 0 -69.6648c13.6671,27.1657 32.169,47.6663 55.6654,61.165 23.5008,13.6671 51.8365,20.5006 85.5033,20.5006 49.4966,0 84.6658,-12.4971 105.667,-37.5002 20.9969,-24.9987 31.4998,-68.1669 31.4998,-129.163l0 -407.335 -79.0022 0 0 413.167c0,30.6667 -6.50116,53.3343 -19.4991,68.3309 -13.0023,15.001 -33.0021,22.5037 -59.6671,22.5037 -35.1648,0 -63.1681,-11.0037 -83.8326,-33.1705 -20.669,-22.1624 -30.9991,-52.1644 -30.9991,-89.833l0 -380.998 -79.0022 0z"></glyph> <glyph unicode="o" horiz-adv-x="482" d="M44.0014 280.835c0,100.832 16.1665,175.5 48.4995,224.164 32.5014,48.6679 81.9979,73.0018 148.831,73.0018 67.6661,0 117.5,-24.0016 149.5,-72.1686 32.169,-48.1671 48.1671,-123.163 48.1671,-224.997 0,-101.834 -15.9981,-176.67 -47.8303,-224.337 -32.0006,-47.6663 -81.834,-71.4995 -149.837,-71.4995 -68.4993,0 -118.333,23.6692 -149.996,71.0031 -31.4998,47.3295 -47.3339,122.33 -47.3339,224.833zm83.9966 0.163969c0,-84.001 8.66821,-143.167 25.8362,-177.499 17.332,-34.3316 46.3324,-51.4997 87.4976,-51.4997 40.3364,0 69.1685,17.5004 86.5005,52.5012 17.5004,34.9964 26.1686,93.8303 26.1686,176.497 0,83.3363 -8.66821,142.166 -26.1686,176.502 -17.332,34.3316 -46.164,51.4997 -86.5005,51.4997 -40.8328,0 -69.8332,-16.9996 -87.1652,-50.9989 -17.5004,-34.0037 -26.1686,-93.0016 -26.1686,-177.003z"></glyph> <glyph unicode="p" horiz-adv-x="475" d="M136.165 283.166c0,-76.8307 9.00058,-133.666 27.3341,-170.665 18.1651,-36.9995 46.3324,-55.5014 84.5018,-55.5014 34.664,0 60.1634,17.8328 75.9976,53.5027 16.0025,35.6655 24.0016,93.498 24.0016,173.666 0,77.8322 -8.16744,134.167 -24.3339,168.831 -16.3349,34.6684 -42.4991,52.0004 -78.6654,52.0004 -39.0025,0 -67.0014,-16.9996 -83.6687,-50.9989 -16.8312,-34.1677 -25.1671,-90.9985 -25.1671,-170.834zm-76.166 -473.167l0 751.999 76.166 0 0 -70.6663c5.83642,24.3339 19.8359,44.3338 42.1667,59.9995 22.3353,15.8341 47.8347,23.6692 76.5028,23.6692 59.1663,0 103.664,-24.5023 133.498,-73.5026 29.8335,-48.8318 44.6661,-121.998 44.6661,-219.333 0,-101.165 -13.831,-175.496 -41.4975,-222.998 -27.6665,-47.4979 -70.8347,-71.1671 -129.336,-71.1671 -26.8334,0 -50.6665,6.16879 -71.6634,18.6659 -21.0014,12.5016 -37.5002,30.3343 -49.501,53.3343l0 -250 -81.0008 0z"></glyph> <glyph unicode="r" horiz-adv-x="291" d="M59.9995 0l0 561.998 72.665 0 0 -91.8317c11.336,32.8337 28.668,58.5016 51.6681,76.9991 22.836,18.5019 49.1686,27.8349 79.0022,27.8349 8.66378,0 15.4973,-0.168401 20.1638,-0.500771 4.83488,-0.33237 9.33296,-0.833141 13.5031,-1.49788l0 -83.8371c-4.17014,2.33545 -8.83662,4.00174 -13.9994,5.16725 -5.00328,1.16994 -10.6669,1.66628 -16.8357,1.66628 -40.5004,0 -71.8318,-13.3303 -94.3311,-39.9996 -22.5037,-26.665 -33.8353,-63.9968 -33.8353,-111.831l0 -344.167 -78.0006 0z"></glyph> <glyph unicode="s" horiz-adv-x="443" d="M44.9985 168.999l78.0006 0c0,-0.66474 -0.163969,-1.66628 -0.500771,-3.00019 -0.997111,-7.1659 -1.49788,-12.4971 -1.49788,-15.9981 0,-30.6667 8.66821,-53.9991 26.1642,-70.0016 17.5004,-15.9981 42.8359,-23.9971 76.002,-23.9971 30.3343,0 54.1675,8.16301 71.6679,24.4979 17.5004,16.1665 26.1642,38.3334 26.1642,66.3322 0,44.3338 -33.9993,78.333 -102.166,101.67l-1.49788 0.496339c-68.4993,23.8332 -112.833,47.3339 -133.001,70.8347 -20.1682,23.3324 -30.3343,57.3316 -30.3343,102.002 0,49.1642 14.5002,87.4976 43.3322,115 28.8364,27.4981 69.0001,41.1652 120.504,41.1652 54.6638,0 95.8334,-13.1663 123.664,-39.4989 27.6665,-26.337 41.502,-65.3351 41.502,-116.666l0 -7.83507 -75.0004 0c-1.66628,33.8309 -9.33296,58.3332 -23,73.8349 -13.4987,15.4973 -34.8324,23.164 -63.8328,23.164 -30.5027,0 -53.5027,-7.1659 -69.0001,-21.6661 -15.5017,-14.5002 -23.1684,-35.9979 -23.1684,-64.6659 0,-12.6655 1.99865,-24.0016 6.16879,-34.1677 3.99731,-9.9977 9.9977,-18.1651 17.6644,-24.3339 14.3318,-12.3332 42.8359,-25.331 85.4989,-38.9981 22.836,-7.1659 40.3364,-13.1663 52.8336,-18.1696 38.6702,-14.8326 66.3367,-33.8309 82.9995,-56.8309 16.5033,-22.8316 24.8347,-53.1659 24.8347,-90.9985 0,-56.3345 -16.1665,-99.6667 -48.6679,-130.333 -32.333,-30.5027 -78.497,-45.8361 -138.332,-45.8361 -55.0006,0 -96.6665,14.5002 -124.834,43.669 -28.1673,29.1644 -42.1667,72.0002 -42.1667,128.667l0 11.664z"></glyph> <glyph unicode="t" horiz-adv-x="246" d="M150.001 116.166c0,-23.5008 4.16571,-38.8341 12.6655,-46.164 8.49981,-7.3343 28.832,-11.0037 60.6686,-11.0037 4.32968,0 7.83064,0.168401 10.4985,0.336802 2.83179,0.163969 5.16725,0.33237 7.1659,0.66474l0.500771 -68.6677c-4.83488,-0.33237 -11.5,-0.496339 -19.6675,-0.833141 -20.1682,-0.997111 -32.9977,-1.49788 -38.6657,-1.49788 -37.1679,0 -64.8343,7.3343 -82.9995,22.1669 -18.1696,14.6642 -27.1657,36.9995 -27.1657,66.833l0 418.999 -78.0006 0 0 64.9983 78.0006 0 0 150.001 76.9991 0 0 -150.001 91.4993 0 0 -64.9983 -91.4993 0 0 -380.834z"></glyph> </font> <style type="text/css">
    <![CDATA[
     @font-face { font-family:"Swis721 Cn BT";font-variant:normal;font-weight:normal;src:url("#FontID0") format(svg)}
     .fil0 {fill:#201E1E}
     .fnt0 {font-weight:normal;font-size:999.4px;font-family:'Swis721 Cn BT'}
    ]]>
   </style> </defs> <g id="Layer_x0020_1"> <metadata id="CorelCorpID_0Corel-Layer"></metadata> <g transform="matrix(1.07295 0 0 1 -1665.54 1651.02)"> <text x="4049.24" y="1820.56" class="fil0 fnt0">Line Properties</text> </g> <path class="fil0" d="M-0 1018.96l1689.96 -1018.96 1695.06 1010.54 0 1695.04 -801.71 0 0 765.9 -926.58 0 0 -874.7 820.3 0 0 -2001.33 -792.45 -469.37 -840.11 492.95 0 2852.48 -844.47 -5.44 0 -2447.11zm2583.4 -359.46l695.25 412.54 0 1524.94 -695.25 0 0 -1937.48zm-819.91 2046.59l711.3 0 0 656.8 -711.3 0 0 -656.8zm-1025.36 -2020.15l-631.74 393.05 0 2283.87 631.74 0 0 -2676.92z"></path> </g> </svg> `;
}, "/home/adam-noah/Desktop/lp_web/src/components/ui/Logo.astro", void 0);

export { $$Container as $, $$Logo as a, $$GoogleFontsOptimizer as b, $$ScrollTop as c };
