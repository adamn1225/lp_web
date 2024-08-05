const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { checkIn, checkOut, minOccupancy } = event.queryStringParameters;

  if (!checkIn || !checkOut || !minOccupancy) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // CORS header
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Missing required query parameters: checkIn, checkOut, minOccupancy' })
    };
  }

  const apiUrl = `https://open-api.guesty.com/v1/listings?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&minOccupancy=${encodeURIComponent(minOccupancy)}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Guesty API error: ${errorText}`);
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*', // CORS header
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: `Guesty API error: ${errorText}` })
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // CORS header
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching data from Guesty API:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // CORS header
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to fetch data from API' })
    };
  }
};