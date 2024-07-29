

// Define the expected response structure
interface RefreshTokenResponse {
  accessToken?: string;
}

async function refreshAccessToken(): Promise<string> {
  const response = await fetch('https://lp-web-xi.vercel.app/api/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REFRESH_TOKEN}`
    },
  });

  // Check if the response status is not okay
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to refresh access token: ${errorText}`);
  }

  // Parse JSON response and assert the type
  const data: RefreshTokenResponse = await response.json();

  // Ensure the accessToken property exists
  if (!data.accessToken) {
    throw new Error('Failed to refresh access token');
  }

  return data.accessToken;
}

async function fetchListings() {
  let accessToken = process.env.ACCESS_TOKEN;  // Assume you have an initial access token
  
  // Refresh token if needed (e.g., access token expired)
  if (!accessToken) {
    accessToken = await refreshAccessToken();
    process.env.ACCESS_TOKEN = accessToken;  // Update the environment variable or use another secure storage
  }
  
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${accessToken}`,
    },
  };
  
  const listings = await fetch('https://open-api.guesty.com/v1/listings?limit=100', options);
  
  if (!listings.ok) {
    const errorText = await listings.text();
    throw new Error(`Failed to fetch listings: ${errorText}`);
  }
  
  const data = await listings.json();
  const listings1 = data.results;
  
  return listings1;
}

export default fetchListings;
