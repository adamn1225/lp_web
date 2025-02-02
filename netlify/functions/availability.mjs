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

  const availableDates = availabilityData.filter(day => day.status === 'available');
  if (availableDates.length > 0) {
    console.log(`Availability data for listing ${listingId}: ${JSON.stringify(availableDates)}`);
  } else {
    console.log(`Listing ${listingId} has no available dates.`);
  }

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

const prefetchOtherCities = async (currentCity, checkIn, checkOut, minOccupancy, bedroomAmount, allowedTags) => {
  const citiesToPrefetch = ['North Myrtle Beach', 'Myrtle Beach', 'Little River', 'Surfside Beach', 'Murrells Inlet'].filter(city => city !== currentCity);

  for (const city of citiesToPrefetch) {
    const cacheKey = `${checkIn}-${checkOut}-${minOccupancy}-${city}-${bedroomAmount}-${allowedTags.join(',')}`;
    if (!cache[cacheKey]) {
      try {
        let url = `https://open-api.guesty.com/v1/listings?limit=100&skip=0&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}&city=${encodeURIComponent(city)}`;
        if (bedroomAmount) {
          url += `&bedroomAmount=${encodeURIComponent(bedroomAmount)}`;
        }
        if (allowedTags.length > 0) {
          url += `&tags=${encodeURIComponent(allowedTags.join(','))}`;
        }
        const response = await fetchWithRetry(url, {
          headers: {
            'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          cache[cacheKey] = data.results;
        }
      } catch (error) {
        console.error(`Error prefetching data for city ${city}:`, error);
      }
    }
  }
};

export const handler = async (event, context) => {
  const { checkIn, checkOut, minOccupancy, location, bedroomAmount, city, fetchCities, fetchBedrooms, fetchBookedDates, listingId } = event.queryStringParameters;

  console.log(`Received query parameters: ${JSON.stringify({ checkIn, checkOut, minOccupancy, location, bedroomAmount, city, fetchCities, fetchBedrooms, fetchBookedDates, listingId })}`);

  if (fetchCities) {
    try {
      const urls = [
        'https://open-api.guesty.com/v1/listings?limit=100&skip=0',
        'https://open-api.guesty.com/v1/listings?limit=100&skip=100',
        'https://open-api.guesty.com/v1/listings?limit=100&skip=200',
        'https://open-api.guesty.com/v1/listings?limit=100&skip=300'
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
        'https://open-api.guesty.com/v1/listings?limit=100&skip=200',
        'https://open-api.guesty.com/v1/listings?limit=100&skip=300'
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
        body: JSON.stringify({ error: 'Internal Server Error' })
      };
    }
  }

  if (!checkIn || !checkOut || !minOccupancy || !city) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Missing required query parameters: checkIn, checkOut, minOccupancy, city' })
    };
  }

  try {
    const fetchListings = async () => {
      let allListings = [];
      let skip = 0;
      let hasMore = true;

      while (hasMore) {
        let url = `https://open-api.guesty.com/v1/listings?limit=100&skip=${skip}`;
        const queryParams = new URLSearchParams({
          checkIn: checkIn,
          checkOut: checkOut,
          minOccupancy: minOccupancy,
          city: city
        });
        if (location) {
          queryParams.append('location', location);
        }
        if (bedroomAmount) {
          queryParams.append('bedroomAmount', bedroomAmount);
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

        const data = await response.json();
        allListings.push(...data.results);

        if (data.results.length < 100) {
          hasMore = false;
        } else {
          skip += 100;
        }
      }

      return allListings;
    };

    const data = await fetchListings();

    console.log(`Fetched listings: ${JSON.stringify(data)}`);

    // Filter by bedroom amount if specified
    let combinedResults = data;
    if (bedroomAmount) {
      combinedResults = combinedResults.filter(listing => listing.bedrooms === Number(bedroomAmount));
    }

    console.log(`Listings after filtering by bedroom amount: ${JSON.stringify(combinedResults)}`);

    // Fetch availability for each listing and filter out unavailable listings
    const availableListings = [];
    for (const listing of combinedResults) {
      try {
        const availabilityData = await fetchAvailability(listing._id, checkIn, checkOut);
        const availableDates = availabilityData.filter(day => day.status === 'available').map(day => day.date);
        const prices = availabilityData.map(day => ({ date: day.date, price: day.price }));

        if (availableDates.length > 0) {
          availableListings.push({ ...listing, prices });
        } else {
          console.log(`Listing ${listing._id} has no available dates: ${JSON.stringify(availableDates)}`);
        }
      } catch (error) {
        console.error(`Error fetching availability for listing ${listing._id}: ${error.message}`);
      }
    }

    console.log(`Available listings: ${JSON.stringify(availableListings)}`);

    // Prefetch availability data for other cities
    prefetchOtherCities(city, checkIn, checkOut, minOccupancy, bedroomAmount, allowedTags);

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