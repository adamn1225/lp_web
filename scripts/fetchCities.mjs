import fetch from 'node-fetch';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config();

const BATCH_SIZE = 100;
const CONCURRENCY_LIMIT = 5;
const RATE_LIMIT_INTERVAL = 7500;
const cache = new NodeCache({ stdTTL: 3600 });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RATE_LIMIT_INTERVAL;
            console.log(`Rate limited. Retrying after ${delayMs} ms`);
            await delay(delayMs);
        } else if (response.status === 401) {
            throw new Error('Not Authorized');
        } else if (response.ok) {
            return response;
        } else {
            console.error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
    }
    throw new Error('Max retries reached');
};

const fetchListingsInBatches = async (baseUrl, queryParams, totalListings) => {
    const results = [];
    const fetchBatch = async (skip) => {
        const url = `${baseUrl}?limit=${BATCH_SIZE}&skip=${skip}&${queryParams.toString()}`;
        console.log(`Fetching listings from URL: ${url}`);
        const response = await fetchWithRetry(url, {
            headers: {
                'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Guesty API error: ${errorText}`);
            throw new Error(`Guesty API error: ${errorText}`);
        }

        const data = await response.json();
        results.push(...data.results);

        if (results.length >= totalListings) {
            return;
        }

        await delay(RATE_LIMIT_INTERVAL);
    };

    const promises = [];
    for (let skip = 0; skip < totalListings; skip += BATCH_SIZE) {
        promises.push(fetchBatch(skip));
        if (promises.length >= CONCURRENCY_LIMIT) {
            await Promise.all(promises);
            promises.length = 0;
        }
    }
    await Promise.all(promises);
    return results;
};

export const handler = async (event, context) => {
    try {
        const baseUrl = 'https://open-api.guesty.com/v1/listings';
        const queryParams = new URLSearchParams();
        const totalListings = 400; // Adjust as needed

        const listings = await fetchListingsInBatches(baseUrl, queryParams, totalListings);
        const uniqueCities = Array.from(new Set(listings.map(listing => listing.address.city)));

        console.log(`Fetched unique cities: ${uniqueCities.length} cities`);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ results: uniqueCities })
        };
    } catch (error) {
        console.error(`Error fetching cities: ${error.message}`);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};