const apiToken = import.meta.env.VITE_API_TOKEN;

// Fetch the data inside getStaticPaths
const response = await fetch('https://open-api.guesty.com/v1/listings?limit=20@skip=20', {
  headers: {
    'Authorization': `Bearer ${apiToken}`
  }
});

if (!response.ok) {
  throw new Error(`Failed to fetch listings: ${response.statusText}`);
}

const data = await response.json();
const listings2 = data.results;

export default listings2