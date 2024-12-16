import fetch from 'node-fetch';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import fs from 'fs';
import path from 'path';

dotenv.config();

const cache = new NodeCache({ stdTTL: 60 * 60 }); // Cache for 1 hour
const RATE_LIMIT_INTERVAL = 1000; // 1 second

const logFilePath = path.join(__dirname, 'availability_log.txt');

const logToFile = (message) => {
  fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RATE_LIMIT_INTERVAL;
      await delay(delayMs);
    } else if (response.status === 401) {
      throw new Error('Not Authorized');
    } else if (response.ok) {
      return response;
    } else {
      logToFile(`Error fetching data: ${response.status} ${response.statusText}`);
    }
  }
  throw new Error('Max retries reached');
};

const fetchAvailability = async (listingId, checkIn, checkOut) => {
  const apiUrl = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${encodeURIComponent(listingId)}?startDate=${encodeURIComponent(checkIn)}&endDate=${encodeURIComponent(checkOut)}`;

  logToFile(`Fetching availability for listing ${listingId} from URL: ${apiUrl}`);

  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    logToFile(`Error fetching availability data for listing ${listingId}: ${response.status} ${response.statusText}`);
    throw new Error(`Error fetching availability data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.data || !Array.isArray(data.data.days)) {
    logToFile(`Invalid data structure for listing ${listingId}`);
    throw new Error('Invalid data structure');
  }

  const bookedDates = data.data.days
    .filter(day => day.status === 'booked')
    .map(day => day.date);

  logToFile(`Booked dates for listing ${listingId}: ${JSON.stringify(bookedDates)}`);

  return bookedDates;
};

export const handler = async (event, context) => {
  const { checkIn, checkOut, minOccupancy, location, bedroomAmount, city, fetchCities, fetchBedrooms, fetchBookedDates, listingId } = event.queryStringParameters;

  logToFile(`Received query parameters: ${JSON.stringify({ checkIn, checkOut, minOccupancy, location, bedroomAmount, city, fetchCities, fetchBedrooms, fetchBookedDates, listingId })}`);

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

      logToFile(`Fetched unique cities: ${JSON.stringify(uniqueCities)}`);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ results: uniqueCities })
      };
    } catch (error) {
      logToFile(`Error fetching cities: ${error.message}`);
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

  if (fetchBedrooms) {
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
      const uniqueBedrooms = Array.from(new Set(listings.map(listing => listing.bedrooms))).sort((a, b) => a - b);

      logToFile(`Fetched unique bedrooms: ${JSON.stringify(uniqueBedrooms)}`);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ results: uniqueBedrooms })
      };
    } catch (error) {
      logToFile(`Error fetching bedrooms: ${error.message}`);
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

  if (fetchBookedDates) {
    if (!listingId || !checkIn || !checkOut) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required query parameters: listingId, checkIn, checkOut' })
      };
    }

    try {
      const bookedDates = await fetchAvailability(listingId, checkIn, checkOut);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookedDates })
      };
    } catch (error) {
      logToFile(`Error fetching booked dates: ${error.message}`);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: error.message })
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

  const cacheKey = `${checkIn}-${checkOut}-${minOccupancy}-${location}-${bedroomAmount}-${city}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logToFile(`Returning cached data for key: ${cacheKey}`);
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
    const fetchListings = async () => {
      let url = `https://open-api.guesty.com/v1/listings?limit=100&skip=0`;
      const queryParams = new URLSearchParams({
        checkIn: checkIn,
        checkOut: checkOut,
        minOccupancy: minOccupancy
      });
      if (location) {
        queryParams.append('location', location);
      }
      if (city) {
        queryParams.append('city', city);
      }
      url += `&${queryParams.toString()}`;
      logToFile(`Fetching listings from URL: ${url}`);

      const response = await fetchWithRetry(url, {
        headers: {
          'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        logToFile(`Guesty API error: ${errorText}`);
        throw new Error(`Guesty API error: ${errorText}`);
      }

      return response.json();
    };

    const data = await fetchListings();

    logToFile(`Fetched listings: ${JSON.stringify(data.results)}`);

    // Filter by bedroom amount if specified
    let combinedResults = data.results;
    if (bedroomAmount) {
      combinedResults = combinedResults.filter(listing => listing.bedrooms === Number(bedroomAmount));
    }

    logToFile(`Listings after filtering by bedroom amount: ${JSON.stringify(combinedResults)}`);

    // Fetch availability for each listing and filter out booked listings
    const availableListings = [];
    for (const listing of combinedResults) {
      try {
        const bookedDates = await fetchAvailability(listing._id, checkIn, checkOut);
        if (bookedDates.length === 0) {
          availableListings.push(listing);
        } else {
          logToFile(`Listing ${listing._id} is booked for dates: ${JSON.stringify(bookedDates)}`);
        }
      } catch (error) {
        logToFile(`Error fetching availability for listing ${listing._id}: ${error.message}`);
      }
    }

    logToFile(`Available listings: ${JSON.stringify(availableListings)}`);

    cache.set(cacheKey, { results: availableListings }); // Cache the response data

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ results: availableListings })
    };
  } catch (error) {
    logToFile(`Error fetching data: ${error.message}`);
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