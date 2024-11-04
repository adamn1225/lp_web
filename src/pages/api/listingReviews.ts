import axios from 'axios';

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

export async function fetchReviews() {
    const response = await fetchFromApi('https://open-api.guesty.com/v1/reviews');
    return response.data; // Return the reviews array
}

export async function updateReview(channelId: string) {
    const options = {
        method: 'PUT',
        url: 'https://open-api.guesty.com/v1/reviews',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${apiToken}`
        },
        data: { channelId: "airbnb2" }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating review:', error);
        throw new Error('Failed to update review');
    }
}