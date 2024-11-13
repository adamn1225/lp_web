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
                cityTax
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