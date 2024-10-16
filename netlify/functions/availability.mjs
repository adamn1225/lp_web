import fetch from 'node-fetch';

export const handler = async (event, context) => {
  // console.log('Received event:', event);

  const { checkIn, checkOut, minOccupancy, tags } = event.queryStringParameters;

  if (!checkIn || !checkOut || !minOccupancy) {
    console.error('Missing required query parameters:', { checkIn, checkOut, minOccupancy });
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Missing required query parameters: checkIn, checkOut, minOccupancy' })
    };
  }

  // Construct the API URL with the required parameters
  let apiUrl = `https://open-api.guesty.com/v1/listings?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&minOccupancy=${encodeURIComponent(minOccupancy)}`;

  // Append tags to the API URL if they exist
  if (tags) {
    const tagsArray = Array.isArray(tags) ? tags : [tags];
    const tagsQuery = tagsArray.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
    apiUrl += `&${tagsQuery}`;
  }

  try {
    const startTime = Date.now();
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    const endTime = Date.now();
    // console.log(`API request took ${endTime - startTime} ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Guesty API error: ${errorText}`);
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: errorText })
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
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