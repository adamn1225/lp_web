const apiToken = import.meta.env.VITE_API_TOKEN;

if (!apiToken) {
    throw new Error('API token is not set. Please check your environment variables.');
}

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
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // Parse the JSON response
    } catch (error) {
        console.error(`Error fetching from ${url}:`, error);
        throw new Error(`Failed to fetch from ${url}`);
    }
}

export default async function fetchReviews() {
    const response = await fetchFromApi('https://open-api.guesty.com/v1/reviews?');
    return response.data; // Return the reviews array
}