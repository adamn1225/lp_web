import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const RATE_LIMIT_INTERVAL = 1000; // 1 second
const CONCURRENCY_LIMIT = 5; // Adjust as needed

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
      console.error(`Error fetching data: ${response.status} ${response.statusText}`);
    }
  }
  throw new Error('Max retries reached');
};

const fetchAvailability = async (listingId, checkIn, checkOut) => {
  const apiUrl = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${encodeURIComponent(listingId)}?startDate=${encodeURIComponent(checkIn)}&endDate=${encodeURIComponent(checkOut)}&ignoreInactiveChildAllotment=true&ignoreUnlistedChildAllotment=true`;

  console.log(`Fetching availability for listing ${listingId} from URL: ${apiUrl}`);

  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    console.error(`Error fetching availability data for listing ${listingId}: ${response.status} ${response.statusText}`);
    throw new Error(`Error fetching availability data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.data || !Array.isArray(data.data.days)) {
    console.error(`Invalid data structure for listing ${listingId}`);
    throw new Error('Invalid data structure');
  }

  const availabilityData = data.data.days.map(day => ({
    date: day.date,
    status: day.status,
    price: day.price
  }));

  console.log(`Availability data for listing ${listingId}: ${JSON.stringify(availabilityData)}`);

  return availabilityData;
};

const fetchAllListings = async (url) => {
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

const fetchListingsInBatches = async (urls) => {
  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY_LIMIT) {
    const batch = urls.slice(i, i + CONCURRENCY_LIMIT);
    const batchResults = await Promise.all(batch.map(url => fetchAllListings(url)));
    results.push(...batchResults.flatMap(result => result.results));
    await delay(RATE_LIMIT_INTERVAL); // Delay between batches to avoid rate limiting
  }
  return results;
};

export const handler = async (event, context) => {
  const { checkIn, checkOut, minOccupancy, location, bedroomAmount, city, fetchCities, fetchBedrooms, fetchBookedDates, listingId } = event.queryStringParameters;

  console.log(`Received query parameters: ${JSON.stringify({ checkIn, checkOut, minOccupancy, location, bedroomAmount, city, fetchCities, fetchBedrooms, fetchBookedDates, listingId })}`);

  if (fetchCities) {
    try {
      const urls = [
        'https://open-api.guesty.com/v1/listings?limit=100&skip=0',
        'https://open-api.guesty.com/v1/listings?limit=100&skip=100',
        'https://open-api.guesty.com/v1/listings?limit=100&skip=200'
      ];

      const listings = await fetchListingsInBatches(urls);
      const uniqueCities = Array.from(new Set(listings.map(listing => listing.address.city)));

      console.log(`Fetched unique cities: ${JSON.stringify(uniqueCities)}`);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ results: uniqueCities })
      };
    } catch (error) {
      console.error(`Error fetching cities: ${error.message}`);
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
      const urls = [
        'https://open-api.guesty.com/v1/listings?limit=100&skip=0',
        'https://open-api.guesty.com/v1/listings?limit=100&skip=100',
        'https://open-api.guesty.com/v1/listings?limit=100&skip=200'
      ];

      const listings = await fetchListingsInBatches(urls);
      const uniqueBedrooms = Array.from(new Set(listings.map(listing => listing.bedrooms))).sort((a, b) => a - b);

      console.log(`Fetched unique bedrooms: ${JSON.stringify(uniqueBedrooms)}`);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ results: uniqueBedrooms })
      };
    } catch (error) {
      console.error(`Error fetching bedrooms: ${error.message}`);
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
      const availabilityData = await fetchAvailability(listingId, checkIn, checkOut);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ availabilityData })
      };
    } catch (error) {
      console.error(`Error fetching booked dates: ${error.message}`);
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
      console.log(`Fetching listings from URL: ${url}`);

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

    const data = await fetchListings();

    console.log(`Fetched listings: ${JSON.stringify(data.results)}`);

    // Filter by bedroom amount if specified
    let combinedResults = data.results;
    if (bedroomAmount) {
      combinedResults = combinedResults.filter(listing => listing.bedrooms === Number(bedroomAmount));
    }

    console.log(`Listings after filtering by bedroom amount: ${JSON.stringify(combinedResults)}`);

    // Fetch availability for each listing and filter out booked listings
    const availableListings = [];
    for (const listing of combinedResults) {
      try {
        const availabilityData = await fetchAvailability(listing._id, checkIn, checkOut);
        const bookedDates = availabilityData.filter(day => day.status === 'booked').map(day => day.date);
        const prices = availabilityData.map(day => ({ date: day.date, price: day.price }));

        if (bookedDates.length === 0) {
          availableListings.push({ ...listing, prices });
        } else {
          console.log(`Listing ${listing._id} is booked for dates: ${JSON.stringify(bookedDates)}`);
        }
      } catch (error) {
        console.error(`Error fetching availability for listing ${listing._id}: ${error.message}`);
      }
    }

    console.log(`Available listings: ${JSON.stringify(availableListings)}`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ results: availableListings })
    };
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
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