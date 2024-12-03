import fetch from 'node-fetch';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config();

const cache = new NodeCache({ stdTTL: 60 * 60 }); // Cache for 1 hour
const RATE_LIMIT_INTERVAL = 1000; // 1 second

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RATE_LIMIT_INTERVAL;
      await delay(delayMs);
    } else {
      return response;
    }
  }
  throw new Error('Max retries reached');
};

export const handler = async (event, context) => {
  const { checkIn, checkOut, minOccupancy, tags, location, bedroomAmount, city, fetchCities } = event.queryStringParameters;

  if (fetchCities) {
    try {
      const fetchAllListings = async () => {
        const urls = [
          'https://open-api.guesty.com/v1/listings?limit=100&skip=0',
          'https://open-api.guesty.com/v1/listings?limit=100&skip=100',
          'https://open-api.guesty.com/v1/listings?limit=100&skip=200'
        ];

        const allResults = await Promise.all(urls.map(url => fetchWithRetry(url, {
          headers: {
            'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
            'Accept': 'application/json'
          }
        }).then(response => response.json())));

        return allResults.flatMap(result => result.results);
      };

      const listings = await fetchAllListings();
      const uniqueCities = Array.from(new Set(listings.map(listing => listing.address.city)));

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ results: uniqueCities })
      };
    } catch (error) {
      console.error('Error fetching cities:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Internal Server Error' })
      };
    }
  }

  if (!checkIn || !checkOut || !minOccupancy) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Missing required query parameters: checkIn, checkOut, minOccupancy' })
    };
  }

  const tagsArray = tags ? tags.split(',') : [];
  if (location) tagsArray.push(location);
  if (bedroomAmount) tagsArray.push(bedroomAmount);

  const cacheKey = `${checkIn}-${checkOut}-${minOccupancy}-${tags}-${location}-${bedroomAmount}-${city}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cachedData)
    };
  }

  try {
    const fetchListings = async (tag) => {
      let url = `https://open-api.guesty.com/v1/listings?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&minOccupancy=${encodeURIComponent(minOccupancy)}`;
      if (tag) {
        url += `&tags=${encodeURIComponent(tag)}`;
      }
      if (city) {
        url += `&city=${encodeURIComponent(city)}`;
      }
      console.log(`Fetching listings for tag: ${tag} from URL: ${url}`);

      const response = await fetchWithRetry(url, {
        headers: {
          'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Guesty API error: ${errorText}`);
        throw new Error(`Guesty API error: ${errorText}`);
      }

      return response.json();
    };

    const allResults = await Promise.all(tagsArray.map(tag => fetchListings(tag)));

    // Combine results to find listings that match all selected tags
    const combinedResults = allResults.reduce((acc, result) => {
      if (acc.length === 0) return result.results;
      return acc.filter(listing => result.results.some(r => r._id === listing._id));
    }, []);

    cache.set(cacheKey, { results: combinedResults }); // Cache the response data

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ results: combinedResults })
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};