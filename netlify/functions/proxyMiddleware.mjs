// netlify/functions/proxyMiddleware.js
import fetch from 'node-fetch';

exports.handler = async function(event, context) {
  const base = '/api/available';
  const url = event.path;

  if (url.startsWith(base)) {
    const { checkIn, checkOut, minOccupancy } = event.queryStringParameters;
    console.log('Received request:', url);
    console.log('Query parameters:', { checkIn, checkOut, minOccupancy });

    if (!checkIn || !checkOut || !minOccupancy) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required query parameters: checkIn, checkOut, minOccupancy' })
      };
    }

    const apiUrl = `https://open-api.guesty.com/v1/listings?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&minOccupancy=${encodeURIComponent(minOccupancy)}`;
    console.log('API URL:', apiUrl);

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.VITE_API_KEY}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch listings from Guesty API: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('API response data:', data);
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    } catch (error) {
      console.error('Error fetching listings from Guesty API:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
      };
    }
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not Found' })
    };
  }
};