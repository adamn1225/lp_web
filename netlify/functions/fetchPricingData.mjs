import fetch from 'node-fetch';

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

    const apiUrl = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${startDate}&endDate=${endDate}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching data from endpoint: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data.days)) {
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
        const unavailableDates = data.data.days
            .filter(day => day.status === 'unavailable')
            .map(day => day.date);

        // Extract booked dates and include the day before the check-out date
        const bookedDates = data.data.days
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
        const datePrices = data.data.days.reduce((acc, day) => {
            acc[day.date] = day.price;
            return acc;
        }, {});

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                unavailableDates: allUnavailableDates,
                bookedDates,
                datePrices
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