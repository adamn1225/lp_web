
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
    if (!data.accessToken) {
      throw new Error('Failed to refresh access token');
    }

    return data.accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error; // Re-throw error to be handled by the caller
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
      process.env.ACCESS_TOKEN = accessToken;
    }

    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${accessToken}`,
      },
    };

    const response = await fetch('https://open-api.guesty.com/v1/listings?limit=100', options);

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    const data = await response.json();
    const listings1 = data.results;

    return listings1;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error; // Re-throw error to be handled by the caller
  }
}

export default fetchListings;
