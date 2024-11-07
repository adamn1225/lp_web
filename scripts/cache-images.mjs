import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const apiToken = process.env.VITE_API_TOKEN;

if (!apiToken) {
    console.error('VITE_API_TOKEN is not set');
    process.exit(1);
}

async function fetchFromApi(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'accept': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${apiToken}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch from ${url}: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data.results; // Return the listings
    } catch (error) {
        console.error(`Error fetching from ${url}:`, error);
        throw new Error(`Failed to fetch from ${url}`);
    }
}

async function cacheListings() {
    try {
        const [featuredListings, oneHundred, twoHundred, threeHundred] = await Promise.all([
            fetchFromApi('https://open-api.guesty.com/v1/listings?limit=5&skip=80'),
            fetchFromApi('https://open-api.guesty.com/v1/listings?limit=100&skip=0'),
            fetchFromApi('https://open-api.guesty.com/v1/listings?limit=100&skip=100'),
            fetchFromApi('https://open-api.guesty.com/v1/listings?limit=95&skip=201')
        ]);

        const allListings = [
            ...featuredListings,
            ...oneHundred,
            ...twoHundred,
            ...threeHundred
        ];

        fs.writeFileSync('src/data/listings.json', JSON.stringify(allListings, null, 2), 'utf-8');
        console.log('Listings cached successfully');
    } catch (error) {
        console.error('Error caching listings:', error);
    }
}

cacheListings();