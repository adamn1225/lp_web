import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { connectRedis, setAsync } from './redisClient.mjs'; // Corrected import statement

dotenv.config();

const fetchAllListings = async () => {
    const apiUrl = 'https://open-api.guesty.com/v1/listings?limit=0&skip=100';
    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching listings: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid data structure');
    }

    return data.results.map(listing => listing._id);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3, backoff = 3000) => {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : backoff;
            console.warn(`Rate limited. Retrying after ${delayMs}ms...`);
            await delay(delayMs);
            backoff *= 2; // Exponential backoff
        } else if (response.ok) {
            return response;
        } else {
            throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
    }
    throw new Error('Max retries reached');
};

const fetchUnavailableDates = async (listingId, startDate, endDate) => {
    const apiUrl = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${startDate}&endDate=${endDate}`;
    const options = {
        headers: {
            'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
            'Accept': 'application/json'
        }
    };

    const response = await fetchWithRetry(apiUrl, options);

    const data = await response.json();
    if (!data.data || !Array.isArray(data.data.days)) {
        throw new Error('Invalid data structure');
    }

    const unavailableDates = data.data.days
        .filter(day => day.status === 'unavailable')
        .map(day => day.date);

    const bookedDates = data.data.days
        .filter(day => day.status === 'booked')
        .map(day => day.date);

    console.log(`Fetched unavailable dates for listing ${listingId}: ${unavailableDates.length}`); // Log the number of unavailable dates fetched

    return { unavailableDates, bookedDates };
};

const fetchAndStoreUnavailableDates = async () => {
    await connectRedis(); // Ensure Redis client is connected
    const listings = await fetchAllListings();
    console.log(`Fetched listings: ${listings.length}`); // Log the number of listings fetched
    const startDate = '2023-01-01'; // Set your desired start date
    const endDate = '2027-12-31'; // Set your desired end date

    const promises = listings.map(async (listing) => {
        try {
            const { unavailableDates, bookedDates } = await fetchUnavailableDates(listing, startDate, endDate);
            const cacheKey = `unavailableDates:${listing}:${startDate}:${endDate}`;
            await setAsync(cacheKey, JSON.stringify({ unavailableDates, bookedDates }), 'EX', 60 * 60 * 24); // Cache for 24 hours
            console.log(`Stored unavailable dates for listing ${listing} in Redis`); // Log the storage operation
        } catch (error) {
            console.error(`Error fetching/storing unavailable dates for listing ${listing}:`, error);
        }
    });

    await Promise.all(promises);
};

fetchAndStoreUnavailableDates().catch(console.error);