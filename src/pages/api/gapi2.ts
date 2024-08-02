const apiToken = import.meta.env.VITE_API_TOKEN;

if (!apiToken) {
  throw new Error('API token is not set. Please check your environment variables.');
}

try {
  const response = await fetch('https://open-api.guesty.com/v1/listings?limit=60', {
    headers: {
      accept: 'application/json; charset=utf-8',
      Authorization: `Bearer ${apiToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const listings2 = data.results;

  export default listings2;
} catch (error) {
  console.error('Error fetching listings:', error);
  throw new Error('Failed to fetch listings');
}