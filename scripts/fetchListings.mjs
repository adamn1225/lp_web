import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const BATCH_SIZE = 100;
const MAX_RESULTS = 300; // Adjust as needed

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fetchListings = async () => {
    const results = [];
    const baseUrl = 'https://open-api.guesty.com/v1/listings';
    const headers = {
        'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
        'Accept': 'application/json'
    };

    for (let skip = 0; skip < MAX_RESULTS; skip += BATCH_SIZE) {
        const url = `${baseUrl}?limit=${BATCH_SIZE}&skip=${skip}`;
        console.log(`Fetching listings from URL: ${url}`);
        const response = await fetch(url, { headers });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Guesty API error: ${errorText}`);
            throw new Error(`Guesty API error: ${errorText}`);
        }

        const data = await response.json();
        results.push(...data.results);

        if (results.length >= MAX_RESULTS) {
            break;
        }
    }

    return results;
};

const saveListingsToFile = async () => {
    try {
        const listings = await fetchListings();
        const filePath = path.join(__dirname, '../public/data/listings.json');
        fs.writeFileSync(filePath, JSON.stringify(listings, null, 2));
        console.log(`Listings saved to ${filePath}`);
    } catch (error) {
        console.error('Error fetching or saving listings:', error);
    }
};

saveListingsToFile();