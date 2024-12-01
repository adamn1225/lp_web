import fetch from 'node-fetch';

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

        const allResults = await Promise.all(urls.map(url => fetch(url, {
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

  try {
    const fetchListings = async (tag) => {
      const url = `https://open-api.guesty.com/v1/listings?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&minOccupancy=${encodeURIComponent(minOccupancy)}${tag ? `&tags=${encodeURIComponent(tag)}` : ''}&city=${encodeURIComponent(city)}`;
      console.log(`Fetching listings for tag: ${tag} from URL: ${url}`);

      const response = await fetch(url, {
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