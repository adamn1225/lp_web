const apiToken = import.meta.env.VITE_API_TOKEN;

if (!apiToken) {
  throw new Error('API token is not set. Please check your environment variables.');
}

// Helper function for retrying fetch requests with exponential backoff
async function retryFetch(url: string, options: RequestInit = {}, retries: number = 5, delay: number = 1000): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        if (!response.ok) {
          throw new Error(`Failed to fetch from ${url}: ${response.status} ${response.statusText}`);
        }
        return await response.json();
      }
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error(`Failed to fetch from ${url} after ${retries} retries`);
}

// Generic fetch function
async function fetchFromApi(url: string, options: RequestInit = {}) {
  try {
    const response = await retryFetch(url, {
      headers: {
        accept: 'application/json; charset=utf-8',
        Authorization: `Bearer ${apiToken}`
      },
      ...options
    });
    return response; // Return the data
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw new Error(`Failed to fetch from ${url}`);
  }
}

// Specific function to fetch listings
async function fetchFeaturedListings() {
  const data = await fetchFromApi('https://open-api.guesty.com/v1/listings?limit=5&skip=100');
  return data.results; // Return the listings
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

export { fetchFeaturedListings, fetchOneHundred, fetchTwoHundred, fetchThreeHundred };