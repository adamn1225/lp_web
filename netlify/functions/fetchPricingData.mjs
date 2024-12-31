import fetch from 'node-fetch';
import { createClient } from 'redis';
import { promisify } from 'util';

const redisClient = createClient({
    url: `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('ready', () => {
    console.log('Redis client ready');
});

redisClient.on('end', () => {
    console.log('Redis client disconnected');
});

const ensureRedisConnection = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

export const handler = async (event, context) => {
    const { listingId, startDate, endDate } = event.queryStringParameters;

    if (!listingId || !startDate || !endDate) {
        console.error('Missing required query parameters:', { listingId, startDate, endDate });
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Missing required query parameters: listingId, startDate, endDate' })
        };
    }

    const manUrl = `https://open-api.guesty.com/v1/additional-fees/account/`;
    const apiUrl1 = `https://open-api.guesty.com/v1/listings/${listingId}`;
    const apiUrl2 = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${startDate}&endDate=${endDate}`;

    try {
        const [response1, response2, response3] = await Promise.all([
            fetch(apiUrl1, {
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                    'Accept': 'application/json'
                }
            }),
            fetch(apiUrl2, {
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                    'Accept': 'application/json'
                }
            }),
            fetch(manUrl, {
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                    'Accept': 'application/json'
                }
            }),
        ]);

        if (!response1.ok) {
            throw new Error(`Error fetching data from first endpoint: ${response1.status} ${response1.statusText}`);
        }

        if (!response2.ok) {
            throw new Error(`Error fetching data from second endpoint: ${response2.status} ${response2.statusText}`);
        }

        if (!response3.ok) {
            throw new Error(`Error fetching data from third endpoint: ${response3.status} ${response3.statusText}`);
        }

        const data1 = await response1.json();
        const data2 = await response2.json();
        const data3 = await response3.json();

        if (!data2.data || !Array.isArray(data2.data.days)) {
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Invalid data structure' })
            };
        }

        // Extract unavailable dates
        const unavailableDates = data2.data.days
            .filter(day => day.status === 'unavailable')
            .map(day => day.date);

        // Extract booked dates and include the day before the check-out date
        const bookedDates = data2.data.days
            .filter(day => day.status === 'booked')
            .map(day => day.date);

        // Helper function to add a day to a date
        const addDays = (date, days) => {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
        };

        // Include the day before the check-out date as unavailable
        const adjustedUnavailableDates = bookedDates.map(date => addDays(date, -1));

        // Combine unavailable dates and adjusted unavailable dates
        const allUnavailableDates = [...new Set([...unavailableDates, ...adjustedUnavailableDates])];

        // Extract date-specific prices
        const datePrices = data2.data.days.reduce((acc, day) => {
            acc[day.date] = day.price;
            return acc;
        }, {});

        const { prices, accountTaxes } = data1;
        const { monthlyPriceFactor, weeklyPriceFactor, cleaningFee, petFee, securityDepositFee, guestsIncludedInRegularFee, extraPersonFee } = prices;

        // Extract local and city taxes
        const localTax = accountTaxes.find(tax => tax.type === 'LOCAL_TAX')?.amount || 0;
        const cityTax = accountTaxes.find(tax => tax.type === 'CITY_TAX')?.amount || 0;

        // Extract the management fee percentage
        const managementFeePercentage = data3.find(fee => fee.name === 'Management')?.sourcesConfigurations[0]?.value || 0;

        // Log the management fee percentage
        console.log('Management Fee Percentage:', managementFeePercentage);

        // Store unavailable dates in Redis
        await ensureRedisConnection();
        const redisKey = `unavailableDates:${listingId}:${startDate}:${endDate}`;
        await setAsync(redisKey, JSON.stringify(allUnavailableDates), 'EX', 60 * 60 * 24); // Cache for 24 hours

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                unavailableDates: allUnavailableDates,
                bookedDates,
                datePrices,
                monthlyPriceFactor,
                weeklyPriceFactor,
                cleaningFee,
                petFee,
                securityDepositFee,
                guestsIncludedInRegularFee,
                extraPersonFee,
                localTax,
                cityTax,
                managementFeePercentage,
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};