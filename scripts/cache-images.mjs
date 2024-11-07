import fetch from 'node-fetch';
import fs from 'fs';

async function cacheListings() {
    const response = await fetch('https://open-api.guesty.com/v1/listings?', {
        headers: {
            'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`
        }
    });
    const data = await response.json();
    fs.writeFileSync('src/data/listings.json', JSON.stringify(data));
    console.log('Listings cached successfully');
}

cacheListings();