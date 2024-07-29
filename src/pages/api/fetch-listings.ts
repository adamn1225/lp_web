import * as dotenv from 'dotenv';

dotenv.config();

// Function to refresh the access token
async function refreshAccessToken(): Promise<string> {
  try {
    const response = await fetch('https://lp-web-xi.vercel.app/api/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REFRESH_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Refresh token response data:', data); // Log response data for debugging

    if (!data.accessToken) {
      throw new Error('Access token not found in refresh token response');
    }

    return data.accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

// Function to fetch listings
async function fetchListings() {
  try {
    let accessToken = process.env.ACCESS_TOKEN; // Assume you have an initial access token

    // Refresh token if needed (e.g., access token expired)
    if (!accessToken) {
      accessToken = await refreshAccessToken();
      // Use a more secure storage for tokens in production
      // process.env.ACCESS_TOKEN = accessToken; // Not recommended for production
    }

    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${accessToken}`,
      },
    };

    const response = await fetch('https://open-api.guesty.com/v1/listings?limit=25', options);

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Listings data:', data); // Log listings data for debugging
    const listings1 = data.results;

    return listings1;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
}

console.log('ACCESS_TOKEN:', process.env.ACCESS_TOKEN);
console.log('REFRESH_TOKEN:', process.env.REFRESH_TOKEN);


export default fetchListings;
