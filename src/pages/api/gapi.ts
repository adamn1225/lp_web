const apiToken = import.meta.env.VITE_API_TOKEN;
const guestyApi = import.meta.env.GUESTY_BOOKING_API;
if (!apiToken) {
  throw new Error('API token is not set. Please check your environment variables.');
}

// Generic fetch function
async function fetchFromApi(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json; charset=utf-8',
        Authorization: `Bearer ${apiToken}`
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the data

  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw new Error(`Failed to fetch from ${url}`);
  }
}

// Specific function to fetch listings
async function fetchFeaturedListings() {
  const data = await fetchFromApi('https://open-api.guesty.com/v1/listings?limit=5&skip=200');
  return data.results; // Return the listings
}

// Specific function to fetch another endpoint, e.g., reservations
async function fetchListings() {
  const data = await fetchFromApi('https://open-api.guesty.com/v1/listings?limit=20&skip=5');
  return data.results; // Return the reservations
}

async function fetchOneHundred() {
  const data = await fetchFromApi('https://open-api.guesty.com/v1/listings?limit=100');
  return data.results; // Return the reservations
}

async function fetchTwoHundred() {
  const data = await fetchFromApi('https://open-api.guesty.com/v1/listings?limit=100&skip=100');
  return data.results; // Return the reservations
}

async function fetchThreeHundred() {
  const data = await fetchFromApi('https://open-api.guesty.com/v1/listings?limit=100&skip=200');
  return data.results; // Return the reservations
}

export { fetchFeaturedListings, fetchListings, fetchOneHundred, fetchTwoHundred, fetchThreeHundred };