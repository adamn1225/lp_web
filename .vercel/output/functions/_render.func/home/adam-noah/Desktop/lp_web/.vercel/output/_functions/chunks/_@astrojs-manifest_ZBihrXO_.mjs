import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './astro/server_CYlBBrQa.mjs';
import 'clsx';
import 'html-escaper';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.D2SnfUU8.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CQRcd9Ph.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CQRcd9Ph.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/account","isIndex":false,"type":"page","pattern":"^\\/account\\/?$","segments":[[{"content":"account","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/account.astro","pathname":"/account","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[],"routeData":{"route":"/api/auth/register","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/register\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/register.ts","pathname":"/api/auth/register","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[],"routeData":{"route":"/api/auth/signin","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/signin\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/signin.ts","pathname":"/api/auth/signin","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[],"routeData":{"route":"/api/auth/signout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/signout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/signout.ts","pathname":"/api/auth/signout","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.D2SnfUU8.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CQRcd9Ph.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/dashboard","isIndex":false,"type":"page","pattern":"^\\/dashboard\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard.astro","pathname":"/dashboard","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CQRcd9Ph.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"external","src":"/_astro/home.Dxlv5gGY.css"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/home","isIndex":false,"type":"page","pattern":"^\\/home\\/?$","segments":[[{"content":"home","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/home.astro","pathname":"/home","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CfbdAIS6.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"inline","content":"[data-astro-cid-d7fyo2io][data-open=false] .options[data-astro-cid-d7fyo2io]{max-height:0px;opacity:0}[data-astro-cid-d7fyo2io][data-open=true] .options[data-astro-cid-d7fyo2io]{max-height:200px;opacity:1}[data-astro-cid-d7fyo2io][data-open=true] svg[data-astro-cid-d7fyo2io]:last-child{--tw-rotate: 180deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}\n"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"},{"type":"inline","content":".playBtn[data-astro-cid-7djmnydp][data-is-playing=true]{opacity:0}.playBtn[data-astro-cid-7djmnydp][data-is-playing=false]{opacity:1}\n"}],"routeData":{"route":"/landing","isIndex":false,"type":"page","pattern":"^\\/landing\\/?$","segments":[[{"content":"landing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/landing.astro","pathname":"/landing","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.L0Tfmg8o.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"},{"type":"inline","content":".is-loading[data-astro-cid-sgpqyurt]{pointer-events:none;position:relative;color:transparent}.is-loading[data-astro-cid-sgpqyurt]:after{position:absolute;inset-inline-start:calc(50% - .5rem);top:calc(50% - .5rem);display:block;height:1rem;content:var(--tw-content);width:1rem}@keyframes spinAround{0%{content:var(--tw-content);transform:rotate(0)}to{content:var(--tw-content);transform:rotate(360deg)}}.is-loading[data-astro-cid-sgpqyurt]:after{animation:spinAround .5s infinite linear;border-radius:9999px;border-width:2px;--tw-border-opacity: 1;border-color:rgb(229 231 235 / var(--tw-border-opacity));border-top-color:transparent;border-right-color:transparent;--tw-content: \"\";content:var(--tw-content)}\n"}],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.UmK3OKvV.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"inline","content":"[data-astro-cid-d7fyo2io][data-open=false] .options[data-astro-cid-d7fyo2io]{max-height:0px;opacity:0}[data-astro-cid-d7fyo2io][data-open=true] .options[data-astro-cid-d7fyo2io]{max-height:200px;opacity:1}[data-astro-cid-d7fyo2io][data-open=true] svg[data-astro-cid-d7fyo2io]:last-child{--tw-rotate: 180deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}\n"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/properties","isIndex":false,"type":"page","pattern":"^\\/properties\\/?$","segments":[[{"content":"properties","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/properties.astro","pathname":"/properties","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.UmK3OKvV.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"inline","content":"[data-astro-cid-d7fyo2io][data-open=false] .options[data-astro-cid-d7fyo2io]{max-height:0px;opacity:0}[data-astro-cid-d7fyo2io][data-open=true] .options[data-astro-cid-d7fyo2io]{max-height:200px;opacity:1}[data-astro-cid-d7fyo2io][data-open=true] svg[data-astro-cid-d7fyo2io]:last-child{--tw-rotate: 180deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}\n"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/properties-alt","isIndex":false,"type":"page","pattern":"^\\/properties-alt\\/?$","segments":[[{"content":"properties-alt","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/properties-alt.astro","pathname":"/properties-alt","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CQRcd9Ph.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/property-details","isIndex":false,"type":"page","pattern":"^\\/property-details\\/?$","segments":[[{"content":"property-details","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/property-details.astro","pathname":"/property-details","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.DLgoNVXg.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"inline","content":".is-loading[data-astro-cid-b2aj2baa]{pointer-events:none;position:relative;color:transparent}.is-loading[data-astro-cid-b2aj2baa]:after{position:absolute;inset-inline-start:calc(50% - .5rem);top:calc(50% - .5rem);display:block;height:1rem;content:var(--tw-content);width:1rem}@keyframes spinAround{0%{content:var(--tw-content);transform:rotate(0)}to{content:var(--tw-content);transform:rotate(360deg)}}.is-loading[data-astro-cid-b2aj2baa]:after{animation:spinAround .5s infinite linear;border-radius:9999px;border-width:2px;--tw-border-opacity: 1;border-color:rgb(229 231 235 / var(--tw-border-opacity));border-top-color:transparent;border-right-color:transparent;--tw-content: \"\";content:var(--tw-content)}\n"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/quote","isIndex":false,"type":"page","pattern":"^\\/quote\\/?$","segments":[[{"content":"quote","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/quote.astro","pathname":"/quote","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CQRcd9Ph.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/settings","isIndex":false,"type":"page","pattern":"^\\/settings\\/?$","segments":[[{"content":"settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/settings.astro","pathname":"/settings","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.D2SnfUU8.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/signup","isIndex":false,"type":"page","pattern":"^\\/signup\\/?$","segments":[[{"content":"signup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/signup.astro","pathname":"/signup","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CQRcd9Ph.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/wishlist","isIndex":false,"type":"page","pattern":"^\\/wishlist\\/?$","segments":[[{"content":"wishlist","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/wishlist.astro","pathname":"/wishlist","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.UmK3OKvV.js"},{"type":"external","value":"/_astro/page.BA34ORVw.js"}],"styles":[{"type":"external","src":"/_astro/about.Cr5eNFHv.css"},{"type":"inline","content":"[data-astro-cid-d7fyo2io][data-open=false] .options[data-astro-cid-d7fyo2io]{max-height:0px;opacity:0}[data-astro-cid-d7fyo2io][data-open=true] .options[data-astro-cid-d7fyo2io]{max-height:200px;opacity:1}[data-astro-cid-d7fyo2io][data-open=true] svg[data-astro-cid-d7fyo2io]:last-child{--tw-rotate: 180deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}\n"},{"type":"external","src":"/_astro/landing.-ABcae_Z.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/adam-noah/Desktop/lp_web/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/login.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/signup.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/account.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/dashboard.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/home.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/properties-alt.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/properties.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/property-details.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/quote.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/settings.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/wishlist.astro",{"propagation":"none","containsHead":true}],["/home/adam-noah/Desktop/lp_web/src/pages/landing.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/account@_@astro":"pages/account.astro.mjs","\u0000@astro-page:src/pages/api/auth/register@_@ts":"pages/api/auth/register.astro.mjs","\u0000@astro-page:src/pages/api/auth/signin@_@ts":"pages/api/auth/signin.astro.mjs","\u0000@astro-page:src/pages/api/auth/signout@_@ts":"pages/api/auth/signout.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/dashboard@_@astro":"pages/dashboard.astro.mjs","\u0000@astro-page:src/pages/home@_@astro":"pages/home.astro.mjs","\u0000@astro-page:src/pages/landing@_@astro":"pages/landing.astro.mjs","\u0000@astro-page:src/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/properties@_@astro":"pages/properties.astro.mjs","\u0000@astro-page:src/pages/properties-alt@_@astro":"pages/properties-alt.astro.mjs","\u0000@astro-page:src/pages/property-details@_@astro":"pages/property-details.astro.mjs","\u0000@astro-page:src/pages/quote@_@astro":"pages/quote.astro.mjs","\u0000@astro-page:src/pages/settings@_@astro":"pages/settings.astro.mjs","\u0000@astro-page:src/pages/signup@_@astro":"pages/signup.astro.mjs","\u0000@astro-page:src/pages/wishlist@_@astro":"pages/wishlist.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-renderers":"renderers.mjs","/home/adam-noah/Desktop/lp_web/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/generic_DwQwy0UO.mjs","/src/pages/404.astro":"chunks/404_D1vjmr3-.mjs","/src/pages/about.astro":"chunks/about_EuujhfGS.mjs","/src/pages/account.astro":"chunks/account_C4zMzxN7.mjs","/src/pages/api/auth/register.ts":"chunks/register_Bo72sj2L.mjs","/src/pages/api/auth/signin.ts":"chunks/signin_D0teyOyC.mjs","/src/pages/api/auth/signout.ts":"chunks/signout_jc2UQXlS.mjs","/src/pages/contact.astro":"chunks/contact_DyOGct_u.mjs","/src/pages/dashboard.astro":"chunks/dashboard_B8EolYr4.mjs","/src/pages/home.astro":"chunks/home_C36OCmK0.mjs","/src/pages/landing.astro":"chunks/landing_YqTiOrd9.mjs","/src/pages/login.astro":"chunks/login_DLvPuDCi.mjs","/src/pages/properties.astro":"chunks/properties_B1tfKXn-.mjs","/src/pages/properties-alt.astro":"chunks/properties-alt_Cb2kh2XJ.mjs","/src/pages/property-details.astro":"chunks/property-details_CrkyQ9Iy.mjs","/src/pages/quote.astro":"chunks/quote_sP87Nqqz.mjs","/src/pages/settings.astro":"chunks/settings_DIyzmL6f.mjs","/src/pages/signup.astro":"chunks/signup_CmsJje3E.mjs","/src/pages/wishlist.astro":"chunks/wishlist_D5UCsMRk.mjs","/src/pages/index.astro":"chunks/index_Dpzp34h6.mjs","\u0000@astrojs-manifest":"manifest__ayoks7Q.mjs","/astro/hoisted.js?q=4":"_astro/hoisted.UmK3OKvV.js","/astro/hoisted.js?q=1":"_astro/hoisted.DLgoNVXg.js","/astro/hoisted.js?q=5":"_astro/hoisted.CfbdAIS6.js","/astro/hoisted.js?q=2":"_astro/hoisted.D2SnfUU8.js","/astro/hoisted.js?q=3":"_astro/hoisted.CQRcd9Ph.js","astro:scripts/page.js":"_astro/page.BA34ORVw.js","/astro/hoisted.js?q=0":"_astro/hoisted.L0Tfmg8o.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/about.Cr5eNFHv.css","/_astro/home.Dxlv5gGY.css","/_astro/landing.-ABcae_Z.css","/favicon.svg","/_astro/AccountMenu.astro_astro_type_script_index_0_lang.tBs7_o8W.js","/_astro/ScrollTop.astro_astro_type_script_index_0_lang.DH7G6I9Z.js","/_astro/SelectBox.astro_astro_type_script_index_0_lang.D4EaebiV.js","/_astro/hoisted.CQRcd9Ph.js","/_astro/hoisted.CfbdAIS6.js","/_astro/hoisted.D2SnfUU8.js","/_astro/hoisted.DLgoNVXg.js","/_astro/hoisted.L0Tfmg8o.js","/_astro/hoisted.UmK3OKvV.js","/_astro/page.BA34ORVw.js","/images/favicon.png","/images/hero.jpg","/images/demo/masonry-mockup-1-dark.png","/images/demo/masonry-mockup-1.png","/images/avatars/1.webp","/images/avatars/10.webp","/images/avatars/11.webp","/images/avatars/2.webp","/images/avatars/3.webp","/images/avatars/4.webp","/images/avatars/5.webp","/images/avatars/6.webp","/images/avatars/7.webp","/images/avatars/8.webp","/images/avatars/9.webp","/images/flags/australia.svg","/images/flags/canada.svg","/images/flags/china.svg","/images/flags/dominican-republic.svg","/images/flags/england.svg","/images/flags/france.svg","/images/flags/germany.svg","/images/flags/mexico.svg","/images/flags/new-zealand.svg","/images/flags/south-africa.svg","/images/flags/spain.svg","/images/flags/thailand.svg","/images/flags/united-states-of-america.svg","/images/illustrations/404-dark.svg","/images/illustrations/404.svg","/images/illustrations/cityline.svg","/images/illustrations/cityscape.svg","/images/illustrations/feature-1-next.svg","/images/illustrations/feature-2-next.svg","/images/illustrations/feature-3-next.svg","/images/illustrations/hero-next.svg","/images/illustrations/placeholder.svg","/images/illustrations/signup.svg","/images/icons/f1-dark.svg","/images/icons/f1.svg","/images/icons/f10-dark.svg","/images/icons/f10.svg","/images/icons/f11-dark.svg","/images/icons/f11.svg","/images/icons/f12-dark.svg","/images/icons/f12.svg","/images/icons/f13-dark.svg","/images/icons/f13.svg","/images/icons/f14-dark.svg","/images/icons/f14.svg","/images/icons/f15-dark.svg","/images/icons/f15.svg","/images/icons/f16-dark.svg","/images/icons/f16.svg","/images/icons/f17-dark.svg","/images/icons/f17.svg","/images/icons/f2-dark.svg","/images/icons/f2.svg","/images/icons/f3-dark.svg","/images/icons/f3.svg","/images/icons/f4-dark.svg","/images/icons/f4.svg","/images/icons/f5-dark.svg","/images/icons/f5.svg","/images/icons/f6-dark.svg","/images/icons/f6.svg","/images/icons/f7-dark.svg","/images/icons/f7.svg","/images/icons/f8-dark.svg","/images/icons/f8.svg","/images/icons/f9-dark.svg","/images/icons/f9.svg","/images/logo/cssninja-white.svg","/images/logo/cssninja.svg","/images/logo/logo.svg","/images/logos/alpinejs.svg","/images/logos/asuna.svg","/images/logos/bobcot.svg","/images/logos/grubspot.svg","/images/logos/gutwork.svg","/images/logos/hewitt.svg","/images/logos/html5.svg","/images/logos/infinite.svg","/images/logos/kromo.svg","/images/logos/natchpay.svg","/images/logos/phasekit.svg","/images/logos/proactive.svg","/images/logos/tailwindcss.svg","/images/logos/tribe.svg","/images/logos/vitejs.svg","/images/logos/vonmo.svg","/images/photo/architect.webp","/images/photo/building-clip-2.webp","/images/photo/building-clip.webp","/images/photo/cta.webp","/images/photo/person-clip.webp","/images/screenshots/404-dark.png","/images/screenshots/404.png","/images/screenshots/about-dark.png","/images/screenshots/about.png","/images/screenshots/account-dark.png","/images/screenshots/account.png","/images/screenshots/contact-dark.png","/images/screenshots/contact.png","/images/screenshots/home-dark.png","/images/screenshots/home.png","/images/screenshots/landing-dark.png","/images/screenshots/landing.png","/images/screenshots/login-dark.png","/images/screenshots/login.png","/images/screenshots/properties-alt-dark.png","/images/screenshots/properties-alt.png","/images/screenshots/properties-dark.png","/images/screenshots/properties.png","/images/screenshots/property-dark.png","/images/screenshots/property.png","/images/screenshots/quote-dark.png","/images/screenshots/quote.png","/images/screenshots/settings-dark.png","/images/screenshots/settings.png","/images/screenshots/signup-dark.png","/images/screenshots/signup.png","/images/screenshots/wishlist-dark.png","/images/screenshots/wishlist.png","/images/shapes/1.svg","/images/stacks/alpinejs-light.svg","/images/stacks/bulma-light.svg","/images/stacks/gulp.svg","/images/stacks/html5-light.svg","/images/stacks/html5.svg","/images/stacks/sass-light.svg","/images/video/hands.mp4","/images/video/hands.ogv","/images/video/hands.webm","/images/video/hands.webp","/images/video/poster-1.webp","/images/video/poster-1b.webp","/images/video/poster-2.webp","/images/video/poster-2b.webp","/images/video/poster-2c.webp","/images/video/poster-3.webp","/images/video/poster-square-2.webp","/images/video/poster-square.webp","/images/logo/brands/bitbreaker-dark.svg","/images/logo/brands/bitbreaker-light.svg","/images/logo/brands/bitbreaker.svg","/images/logo/brands/covenant-dark.svg","/images/logo/brands/covenant-light.svg","/images/logo/brands/covenant.svg","/images/logo/brands/evently.svg","/images/logo/brands/grubspot-dark.svg","/images/logo/brands/grubspot-light.svg","/images/logo/brands/grubspot.svg","/images/logo/brands/gutwork-light.svg","/images/logo/brands/gutwork.svg","/images/logo/brands/infinite-dark.svg","/images/logo/brands/infinite-light.svg","/images/logo/brands/infinite.svg","/images/logo/brands/kromo-dark.svg","/images/logo/brands/kromo-light.svg","/images/logo/brands/kromo.svg","/images/logo/brands/livetalk-dark.svg","/images/logo/brands/livetalk-light.svg","/images/logo/brands/livetalk.svg","/images/logo/brands/metamovies.svg","/images/logo/brands/phasekit-dark.svg","/images/logo/brands/phasekit-light.svg","/images/logo/brands/phasekit.svg","/images/logo/brands/powerball.svg","/images/logo/brands/proactive-dark.svg","/images/logo/brands/proactive-light.svg","/images/logo/brands/proactive.svg","/images/logo/brands/systek.svg","/images/logo/brands/taskbot.svg","/images/logo/brands/tower.svg","/images/logo/brands/transfuseio.svg","/images/logo/brands/tribe-dark.svg","/images/logo/brands/tribe-light.svg","/images/logo/brands/tribe.svg","/images/photo/buildings/1.webp","/images/photo/buildings/10.webp","/images/photo/buildings/11.webp","/images/photo/buildings/12.webp","/images/photo/buildings/13.webp","/images/photo/buildings/14.webp","/images/photo/buildings/2.webp","/images/photo/buildings/3.webp","/images/photo/buildings/4.webp","/images/photo/buildings/5.webp","/images/photo/buildings/6.webp","/images/photo/buildings/7.webp","/images/photo/buildings/8.webp","/images/photo/buildings/9.webp","/images/photo/hero/1.webp","/images/photo/hero/2.webp","/images/photo/hero/3.webp","/images/photo/megamenu/1.webp","/images/photo/megamenu/2.webp","/images/photo/megamenu/3.webp","/images/photo/megamenu/4.webp","/images/photo/properties/1.webp","/images/photo/properties/10.webp","/images/photo/properties/11.webp","/images/photo/properties/12.webp","/images/photo/properties/2.webp","/images/photo/properties/3.webp","/images/photo/properties/4.webp","/images/photo/properties/5.webp","/images/photo/properties/6.webp","/images/photo/properties/7.webp","/images/photo/properties/8.webp","/images/photo/properties/9.webp","/images/photo/properties/details-1.webp","/images/photo/properties/details-2.webp","/images/photo/properties/details-3.webp","/images/photo/properties/details-4.webp","/images/photo/buildings/carousel/1.webp","/images/photo/buildings/carousel/2.webp","/images/photo/buildings/carousel/3.webp","/images/photo/buildings/carousel/4.webp","/images/photo/buildings/carousel/5.webp","/images/photo/buildings/carousel/6.webp","/_astro/page.BA34ORVw.js"],"buildFormat":"directory","checkOrigin":false,"rewritingEnabled":false,"experimentalEnvGetSecretEnabled":false});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest as m };
