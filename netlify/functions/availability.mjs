import fetch from 'node-fetch';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config();

const RATE_LIMIT_INTERVAL = 7500; // Increased rate limit interval to 10 seconds
const CONCURRENCY_LIMIT = 5;
const MAX_RESULTS = 200;
const BATCH_SIZE = 50; // Set batch size to 100

const cache = new NodeCache({ stdTTL: 3600 }); // Cache with 1-hour TTL

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RATE_LIMIT_INTERVAL;
      console.log(`Rate limited. Retrying after ${delayMs} ms`);
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

const fetchAvailability = async (listingIds, checkIn, checkOut) => {
  const apiUrl = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings?listingIds=${encodeURIComponent(listingIds.join(','))}&startDate=${encodeURIComponent(checkIn)}&endDate=${encodeURIComponent(checkOut)}&includeAllotment=true&ignoreInactiveChildAllotment=true&ignoreUnlistedChildAllotment=true`;

  console.log(`Fetching availability for listings ${listingIds.join(', ')} from URL: ${apiUrl}`);

  const response = await fetchWithRetry(apiUrl, {
    headers: {
      'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    console.error(`Error fetching availability data for listings ${listingIds.join(', ')}: ${response.status} ${response.statusText}`);
    throw new Error(`Error fetching availability data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.data || !Array.isArray(data.data.days)) {
    console.error(`Invalid data structure for listings ${listingIds.join(', ')}`);
    throw new Error('Invalid data structure');
  }

  const availabilityData = data.data.days.map(day => ({
    listingId: day.listingId,
    date: day.date,
    status: day.status,
    price: day.price
  }));

  console.log(`Availability data for listings ${listingIds.join(', ')}: ${availabilityData.length} days available`);

  return availabilityData;
};

const calculateAveragePrice = (availabilityData) => {
  const total = availabilityData.reduce((sum, day) => sum + day.price, 0);
  return total / availabilityData.length;
};

const fetchListingsInBatches = async (baseUrl, queryParams, totalListings) => {
  const results = [];
  for (let skip = 0; skip < totalListings; skip += BATCH_SIZE) {
    const url = `${baseUrl}?limit=${BATCH_SIZE}&skip=${skip}&${queryParams.toString()}`;
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

    const data = await response.json();
    results.push(...data.results);

    if (results.length >= MAX_RESULTS) {
      break;
    }

    await delay(RATE_LIMIT_INTERVAL);
  }
  return results;
};

export const handler = async (event, context) => {
  const { checkIn, checkOut, minOccupancy, bedroomAmount, city, fetchCities, fetchBedrooms, fetchBookedDates, listingId, page = 1, limit = 100 } = event.queryStringParameters;

  console.log(`Received query parameters: ${JSON.stringify({ checkIn, checkOut, minOccupancy, bedroomAmount, city, fetchCities, fetchBedrooms, fetchBookedDates, listingId, page, limit })}`);

  if (fetchCities) {
    try {
      const baseUrl = 'https://open-api.guesty.com/v1/listings';
      const queryParams = new URLSearchParams();
      const totalListings = 400; // Adjust as needed

      const listings = await fetchListingsInBatches(baseUrl, queryParams, totalListings);
      const uniqueCities = Array.from(new Set(listings.map(listing => listing.address.city)));

      console.log(`Fetched unique cities: ${uniqueCities.length} cities`);

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
      const baseUrl = 'https://open-api.guesty.com/v1/listings';
      const queryParams = new URLSearchParams();
      const totalListings = 400; // Adjust as needed

      const listings = await fetchListingsInBatches(baseUrl, queryParams, totalListings);
      const uniqueBedrooms = Array.from(new Set(listings.map(listing => listing.bedrooms))).sort((a, b) => a - b);

      console.log(`Fetched unique bedrooms: ${uniqueBedrooms.length} bedroom options`);

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
      const availabilityData = await fetchAvailability([listingId], checkIn, checkOut);

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
    const baseUrl = 'https://open-api.guesty.com/v1/listings';
    const queryParams = new URLSearchParams({
      checkIn: checkIn,
      checkOut: checkOut,
      minOccupancy: minOccupancy
    });
    if (city && city !== 'All') {
      queryParams.append('city', city);
    }
    const totalListings = 400;

    const listings = await fetchListingsInBatches(baseUrl, queryParams, totalListings);

    console.log(`Fetched listings: ${listings.length} listings`);

    let combinedResults = listings;
    if (bedroomAmount) {
      combinedResults = combinedResults.filter(listing => listing.bedrooms === Number(bedroomAmount));
    }

    console.log(`Listings after filtering by bedroom amount: ${combinedResults.length} listings`);

    const availableListings = [];
    for (let i = 0; i < combinedResults.length; i += BATCH_SIZE) {
      if (availableListings.length >= MAX_RESULTS) {
        break;
      }
      const batch = combinedResults.slice(i, i + BATCH_SIZE).map(listing => listing._id);
      try {
        const availabilityData = await fetchAvailability(batch, checkIn, checkOut);
        const availableListingsBatch = combinedResults.slice(i, i + BATCH_SIZE).filter(listing => {
          const listingAvailability = availabilityData.filter(day => day.listingId === listing._id);
          const availableDates = listingAvailability.filter(day => day.status === 'available').map(day => day.date);
          const prices = listingAvailability.filter(day => day.status === 'available').map(day => ({ date: day.date, price: day.price }));

          if (availableDates.length > 0) {
            listing.prices = prices;
            listing.averagePrice = calculateAveragePrice(prices); // Calculate and add the average price
            return true;
          } else {
            console.log(`Listing ${listing._id} is not available for dates: ${availableDates.length} days`);
            return false;
          }
        });

        availableListings.push(...availableListingsBatch);
      } catch (error) {
        console.error(`Error fetching availability for listings ${batch.join(', ')}: ${error.message}`);
      }
    }

    console.log(`Available listings: ${availableListings.length} listings`);

    const cityOrder = ['North Myrtle Beach', 'Little River', 'Myrtle Beach', 'Surfside Beach', 'Murrells Inlet'];

    availableListings.sort((a, b) => {
      const cityA = a.address.city;
      const cityB = b.address.city;
      return cityOrder.indexOf(cityA) - cityOrder.indexOf(cityB);
    });

    // Cache static data
    availableListings.forEach(listing => {
      cache.set(listing._id, {
        address: listing.address,
        pictures: listing.pictures,
        title: listing.title,
        propertyType: listing.propertyType
      });
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ results: availableListings.slice(0, MAX_RESULTS), partial: false })
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