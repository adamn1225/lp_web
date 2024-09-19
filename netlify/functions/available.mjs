import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

// Function to get Bearer token
async function getBearerToken() {
  if (process.env.NODE_ENV === 'development') {
    const TOKEN_FILE_PATH = path.resolve(process.cwd(), 'guesty_token.json');
    try {
      const tokenData = await fs.readFile(TOKEN_FILE_PATH, 'utf-8');
      const { token } = JSON.parse(tokenData);
      return token;
    } catch (error) {
      console.error('Error reading token file:', error);
      throw new Error('Failed to read token file');
    }
  } else {
    const token = process.env.VITE_API_TOKEN;
    if (!token) {
      throw new Error('VITE_API_TOKEN is not set');
    }
    return token;
  }
}

const apiUrl = `https://open-api.guesty.com/v1/listings?limit=100&skip=101`;

export async function handler(event, context) {
  try {
    const token = await getBearerToken();
    const response = await fetch(apiUrl, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `HTTP error! status: ${response.status}` })
      };
    }
    const data = await response.json();
    console.log('Fetched data:', JSON.stringify(data, null, 2)); // Log the fetched data in a readable format
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(`Error fetching listings:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch listings' })
    };
  }
}