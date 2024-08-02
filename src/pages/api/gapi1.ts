const apiToken = import.meta.env.VITE_API_TOKEN;

async function fetchListings() {
  try {
    const response = await fetch('https://open-api.guesty.com/v1/listings?limit=60', {
      headers: {
        accept: 'application/json; charset=utf-8',
        'Authorization': `Bearer ${apiToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const listings1 = await fetchListings();
export default listings1;