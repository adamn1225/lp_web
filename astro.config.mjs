import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import markdoc from "@astrojs/markdoc";
import node from '@astrojs/node';
import fetch from 'node-fetch';

// Middleware function to proxy requests to the Guesty API
async function proxyMiddleware(req, res, next) {
  const base = '/api/available';
  if (req.url.startsWith(base)) {
    const { checkIn, checkOut, minOccupancy } = req.query;
    console.log('Received request:', req.url);
    console.log('Query parameters:', { checkIn, checkOut, minOccupancy });

    if (!checkIn || !checkOut || !minOccupancy) {
      return res.status(400).json({ error: 'Missing required query parameters: checkIn, checkOut, minOccupancy' });
    }

    const apiUrl = `https://open-api.guesty.com/v1/listings?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&minOccupancy=${encodeURIComponent(minOccupancy)}`;
    console.log('API URL:', apiUrl);

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch listings from Guesty API: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('API response data:', data);
      res.json(data);
    } catch (error) {
      console.error('Error fetching listings from Guesty API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    next();
  }
}

// https://astro.build/config
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        external: ['sharp']
      }
    },
    server: {
      watch: {
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**']
      },
      port: 4321 // Ensure the server is set to run on port 4321
    }
  },
  output: 'server',
  adapter: netlify(),
  integrations: [tailwind(), icon(), alpinejs(), react(), markdoc()],
  server: {
    middleware: [proxyMiddleware]
  }
});