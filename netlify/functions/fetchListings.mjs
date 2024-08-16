import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const apiToken = process.env.VITE_API_TOKEN;
const baseUrl = process.env.BASE_URL;

if (!apiToken) {
  throw new Error('API token is not set. Please check your environment variables.');
}

if (!baseUrl) {
  throw new Error('Base URL is not set. Please check your environment variables.');
}

async function fetchFromNetlifyFunction(endpoint) {
  const response = await fetch(`${baseUrl}/.netlify/functions/${endpoint}`, {
    headers: {
      accept: 'application/json; charset=utf-8',
      Authorization: `Bearer ${apiToken}`
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${endpoint}: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

// Specific function to fetch listings
async function fetchFeaturedListings() {
  const data = await fetchFromNetlifyFunction('listings?limit=5&skip=100');
  return data.results; // Return the listings
}

async function fetchOneHundred() {
  const data = await fetchFromNetlifyFunction('listings?limit=100');
  return data.results; // Return the reservations
}

async function fetchTwoHundred() {
  const data = await fetchFromNetlifyFunction('listings?limit=100&skip=100');
  return data.results; // Return the reservations
}

async function fetchThreeHundred() {
  const data = await fetchFromNetlifyFunction('listings?limit=100&skip=200');
  return data.results; // Return the reservations
}

export async function handler(event, context) {
  try {
    const { type } = event.queryStringParameters;

    let data;
    switch (type) {
      case 'featured':
        data = await fetchFeaturedListings();
        break;
      case 'oneHundred':
        data = await fetchOneHundred();
        break;
      case 'twoHundred':
        data = await fetchTwoHundred();
        break;
      case 'threeHundred':
        data = await fetchThreeHundred();
        break;
      default:
        throw new Error('Invalid type parameter');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}