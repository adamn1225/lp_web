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

    const apiUrl1 = `https://open-api.guesty.com/v1/listings/${listingId}`;
    const apiUrl2 = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${startDate}&endDate=${endDate}`;

    try {
        const [response1, response2] = await Promise.all([
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
            })
        ]);

        if (!response1.ok) {
            throw new Error(`Error fetching data from first endpoint: ${response1.status} ${response1.statusText}`);
        }

        if (!response2.ok) {
            throw new Error(`Error fetching data from second endpoint: ${response2.status} ${response2.statusText}`);
        }

        const data1 = await response1.json();
        const data2 = await response2.json();

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

        // Extract booked dates
        const bookedDates = data2.data.days
            .filter(day => day.status === 'booked')
            .map(day => day.date);

        // Extract available dates
        const availableDates = data2.data.days
            .filter(day => day.status === 'available')
            .map(day => day.date);

        const accommodates = data1.accommodates || 2;

        const accountTaxes = data1.accountTaxes || [];
        const localTax = accountTaxes.length > 0 ? accountTaxes[0].amount : 0;
        const cityTax = accountTaxes.length > 1 ? accountTaxes[1].amount : 0;

        const { prices } = data1;
        const { basePrice, weeklyPriceFactor, monthlyPriceFactor, cleaningFee, petFee } = prices;

        // Extract date-specific prices
        const datePrices = data2.data.days.reduce((acc, day) => {
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
                unavailableDates,
                bookedDates,
                availableDates,
                basePrice,
                weeklyPriceFactor,
                monthlyPriceFactor,
                cleaningFee,
                petFee,
                datePrices,
                accountTaxes,
                localTax,
                cityTax,
                accommodates
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