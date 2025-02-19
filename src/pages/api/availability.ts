import fetch, { Response } from 'node-fetch';
import type { RequestInit } from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import { IncomingMessage, ServerResponse } from 'http';

dotenv.config();

const apiToken = import.meta.env.VITE_API_TOKEN;

const RATE_LIMIT_INTERVAL = 5000; // Increased rate limit interval to 10 seconds
const CONCURRENCY_LIMIT = 5;
const MAX_RESULTS = 300;
const BATCH_SIZE = 100; // Set batch size to 100

const cache = new NodeCache({ stdTTL: 3600 }); // Cache with 1-hour TTL

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3): Promise<Response> => {
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

const fetchAvailability = async (listingIds: string[], checkIn: string, checkOut: string) => {
    const apiUrl = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings?listingIds=${encodeURIComponent(listingIds.join(','))}&startDate=${encodeURIComponent(checkIn)}&endDate=${encodeURIComponent(checkOut)}&includeAllotment=true&ignoreInactiveChildAllotment=true&ignoreUnlistedChildAllotment=true`;

    console.log(`Fetching availability for listings ${listingIds.join(', ')} from URL: ${apiUrl}`);

    const response = await fetchWithRetry(apiUrl, {
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        console.error(`Error fetching availability data for listings ${listingIds.join(', ')}: ${response.status} ${response.statusText}`);
        throw new Error(`Error fetching availability data: ${response.status} ${response.statusText}`);
    }

    const data: any = await response.json();
    if (!data || !data.data || !Array.isArray(data.data.days)) {
        console.error(`Invalid data structure for listings ${listingIds.join(', ')}`);
        throw new Error('Invalid data structure');
    }

    const availabilityData = data.data.days.map((day: any) => ({
        listingId: day.listingId,
        date: day.date,
        status: day.status,
        price: day.price
    }));

    console.log(`Availability data for listings ${listingIds.join(', ')}: ${availabilityData.length} days available`);

    return availabilityData;
};

const calculateAveragePrice = (availabilityData: any[]) => {
    const total = availabilityData.reduce((sum, day) => sum + day.price, 0);
    return total / availabilityData.length;
};

const readListingsFromFile = () => {
    const filePath = path.resolve('./public/data/listings.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

const handler = async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const query = Object.fromEntries(url.searchParams.entries());

    const { checkIn, checkOut, minOccupancy, bedroomAmount, city, fetchCities, fetchBedrooms, fetchBookedDates, listingId, page = 1, limit = 100 } = query;

    console.log(`Received query parameters: ${JSON.stringify({ checkIn, checkOut, minOccupancy, bedroomAmount, city, fetchCities, fetchBedrooms, fetchBookedDates, listingId, page, limit })}`);

    const listings = readListingsFromFile();

    if (fetchCities) {
        try {
            const uniqueCities = Array.from(new Set(listings.map((listing: any) => listing.address.city)));
            console.log(`Fetched unique cities: ${uniqueCities.length} cities`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ results: uniqueCities }));
            return;
        } catch (error) {
            console.error(`Error fetching cities: ${error.message}`);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }
    }

    if (fetchBedrooms) {
        try {
            const uniqueBedrooms = Array.from(new Set(listings.map((listing: any) => Number(listing.bedrooms)))).sort((a: number, b: number) => a - b);
            console.log(`Fetched unique bedrooms: ${uniqueBedrooms.length} bedroom options`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ results: uniqueBedrooms }));
            return;
        } catch (error) {
            console.error(`Error fetching bedrooms: ${error.message}`);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }
    }

    if (fetchBookedDates) {
        if (!listingId || !checkIn || !checkOut) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required query parameters: listingId, checkIn, checkOut' }));
            return;
        }

        try {
            const availabilityData = await fetchAvailability([listingId as string], checkIn as string, checkOut as string);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ availabilityData }));
            return;
        } catch (error) {
            console.error(`Error fetching booked dates: ${error.message}`);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
            return;
        }
    }

    if (!checkIn || !checkOut || !minOccupancy) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required query parameters: checkIn, checkOut, minOccupancy' }));
        return;
    }

    try {
        let filteredListings = listings;

        if (city && city !== 'All') {
            filteredListings = filteredListings.filter((listing: any) => listing.address.city === city);
        }

        if (bedroomAmount) {
            filteredListings = filteredListings.filter((listing: any) => listing.bedrooms === Number(bedroomAmount));
        }

        filteredListings = filteredListings.filter((listing: any) => listing.accommodates >= Number(minOccupancy));

        console.log(`Filtered listings: ${filteredListings.length} listings`);

        const availableListings: any[] = [];
        for (let i = 0; i < filteredListings.length; i += BATCH_SIZE) {
            if (availableListings.length >= MAX_RESULTS) {
                break;
            }
            const batch = filteredListings.slice(i, i + BATCH_SIZE).map((listing: any) => listing._id);
            try {
                const availabilityData = await fetchAvailability(batch, checkIn as string, checkOut as string);
                const availableListingsBatch = filteredListings.slice(i, i + BATCH_SIZE).filter((listing: any) => {
                    const listingAvailability = availabilityData.filter((day: any) => day.listingId === listing._id);
                    const availableDates = listingAvailability.filter((day: any) => day.status === 'available').map((day: any) => day.date);
                    const prices = listingAvailability.filter((day: any) => day.status === 'available').map((day: any) => ({
                        listingId: day.listingId,
                        date: day.date,
                        status: day.status,
                        price: day.price
                    }));

                    if (availableDates.length > 0) {
                        listing.prices = prices;
                        listing.averagePrice = calculateAveragePrice(prices); // Calculate and add the average price
                        return true;
                    } else {
                        console.log(`Listing ${listing._id} is not available for dates: ${availableDates.length} days`);
                        return false;
                    }
                });

                availableListings.push(...availableListingsBatch);
            } catch (error) {
                console.error(`Error fetching availability for listings ${batch.join(', ')}: ${error.message}`);
            }
        }

        console.log(`Available listings: ${availableListings.length} listings`);

        const cityOrder = ['North Myrtle Beach', 'Little River', 'Myrtle Beach', 'Surfside Beach', 'Murrells Inlet'];

        availableListings.sort((a, b) => {
            const cityA = a.address.city;
            const cityB = b.address.city;
            return cityOrder.indexOf(cityA) - cityOrder.indexOf(cityB);
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: availableListings.slice(0, MAX_RESULTS), partial: false }));
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
};

export default handler;