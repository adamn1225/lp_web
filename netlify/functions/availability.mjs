import fetch from 'node-fetch';

export const handler = async (event, context) => {
  const { checkIn, checkOut, minOccupancy, tags } = event.queryStringParameters;

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

  try {
    const fetchListings = async (tag) => {
      const url = `https://open-api.guesty.com/v1/listings?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&minOccupancy=${encodeURIComponent(minOccupancy)}&tags=${encodeURIComponent(tag)}`;
      console.log(`Fetching listings for tag: ${tag} from URL: ${url}`);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
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