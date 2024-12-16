import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

let lastRequestTime = 0;
const RATE_LIMIT_INTERVAL = 1000; // 1 second

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RATE_LIMIT_INTERVAL;
            console.warn(`Rate limit hit, retrying after ${delayMs}ms...`);
            await delay(delayMs);
        } else if (response.ok) {
            return response;
        } else {
            console.error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
    }
    throw new Error('Max retries reached');
};

export const handler = async (event, context) => {
    const apiUrl = 'https://open-api.guesty.com/v1/listings/tags';

    const currentTime = Date.now();
    if (currentTime - lastRequestTime < RATE_LIMIT_INTERVAL) {
        return {
            statusCode: 429,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Too many requests' })
        };
    }

    lastRequestTime = currentTime;

    try {
        const response = await fetchWithRetry(apiUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Guesty API error: ${errorText}`);
            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: errorText })
            };
        }

        const data = await response.json();
        console.log('Guesty API response:', data); // Add logging to inspect the response

        const allowedTags = ["Public_pool", "Ocean_view", "web_featured", "Ocean_front", "Pets"];
        const filteredTags = data.filter((tag) => allowedTags.includes(tag));

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ results: filteredTags })
        };
    } catch (error) {
        console.error('Error fetching data:', error);
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