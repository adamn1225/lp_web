import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Function to get Bearer token
function getBearerToken() {
  if (process.env.NODE_ENV === 'development') {
    const TOKEN_FILE_PATH = path.resolve(__dirname, 'guesty_token.json');
    const tokenData = fs.readFileSync(TOKEN_FILE_PATH, 'utf-8');
    const { token } = JSON.parse(tokenData);
    return token;
  } else {
    return process.env.VITE_API_TOKEN;
  }
}

export async function handler(event, context) {
  const { checkIn, checkOut, minOccupancy } = event.queryStringParameters;
  if (!checkIn || !checkOut || !minOccupancy) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required query parameters: checkIn, checkOut, minOccupancy' })
    };
  }

  const apiUrl = `https://open-api.guesty.com/v1/listings?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&minOccupancy=${encodeURIComponent(minOccupancy)}`;
  const token = getBearerToken();

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Guesty API error: ${errorText}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Guesty API error: ${errorText}` })
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching data from Guesty API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from API' })
    };
  }
}