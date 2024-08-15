import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

export async function handler(event) {
  console.log('Received event:', event);

  let start, end;
  try {
    ({ start, end } = JSON.parse(event.body));
  } catch (parseError) {
    console.error('Error parsing event body:', parseError.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  console.log('Parsed start date:', start);
  console.log('Parsed end date:', end);

  const url = `https://open-api.guesty.com/v1/reservations?start=${start}&end=${end}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${process.env.VITE_API_TOKEN}`
    }
  };

  console.log('Request URL:', url);
  console.log('Request Options:', options) ;

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers.raw());
    console.log('Response Data:', data);

    if (!response.ok) {
      console.error('API Error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Fetch Error:', error.message);
    console.error('Fetch Error Stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
}