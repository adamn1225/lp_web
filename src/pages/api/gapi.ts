const apiToken = import.meta.env.VITE_API_TOKEN;

const response = await fetch('https://open-api.guesty.com/v1/listings?limit=100', {
  headers: {
    accept: 'application/json; charset=utf-8',
    Authorization: `Bearer ${apiToken}`
  }
});

if (!response.ok) {
  throw new Error(`Failed to fetch listings: ${response.statusText}`);
}

const data = await response.json();
const listings = data.results;

export default listings;