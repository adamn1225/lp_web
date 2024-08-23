import type { MiddlewareHandler } from "astro";

// Define cache types
type Path = string;
interface ICachedResponse {
  response: Response;
}

// Initialize an in-memory cache using a JavaScript Map.
// It will store the path as the key and the cached response as the value.
const cache = new Map<Path, ICachedResponse>();

export const onRequest: MiddlewareHandler = async (req, next) => {
  console.log("[Middleware] onRequest", req.url.pathname);

  // Attempt to retrieve a cached response for the current request path.
  const cached = cache.get(req.url.pathname);

  // If a cached response exists, return a clone of the response.
  if (cached) return cached.response.clone();

  // If there is no cached response, continue processing the request.
  const response = await next();

  // Cache the new response by cloning it and storing it in the cache.
  cache.set(req.url.pathname, { response: response.clone() });

  // Return the original response to the client.
  return response;
}