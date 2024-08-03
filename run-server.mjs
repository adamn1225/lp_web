import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { handler as ssrHandler } from './dist/server/entry.mjs';

dotenv.config();

const app = express();
const base = '/availability';

// Middleware to set the Authorization header
app.use((req, res, next) => {
  if (req.url.startsWith(base)) {
    res.setHeader('Authorization', `Bearer ${process.env.VITE_API_KEY}`);
  }
  next();
});

// Handler to fetch listings from the remote API
async function fetchListings(req, res) {
  const { checkIn, checkOut } = req.query;
  const apiUrl = `https://open-api.guesty.com/v1/listings?checkIn=${checkIn}&checkOut=${checkOut}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.VITE_API_KEY}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}

app.use(base, express.static('dist/client/'));
app.get('/api/listings', fetchListings);
app.use(ssrHandler);

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});