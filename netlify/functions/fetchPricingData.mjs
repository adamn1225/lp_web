import fetch from 'node-fetch';

const MAX_RETRIES = 3;
const RATE_LIMIT_INTERVAL = 2000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RATE_LIMIT_INTERVAL;
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
            fetchWithRetry(apiUrl1, {
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                    'Accept': 'application/json'
                }
            }),
            fetchWithRetry(apiUrl2, {
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                    'Accept': 'application/json'
                }
            }),
            fetchWithRetry(manUrl, {
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                    'Accept': 'application/json'
                }
            })
        ]);

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

        const basePrice = data2.data.days.length > 0 ? Math.round(data2.data.days[0].price) : 0;

        const unavailableDates = data2.data.days
            .filter(day => day.status === 'unavailable')
            .map(day => {
                const date = new Date(day.date);
                date.setHours(0, 0, 0, 0);
                return date.toISOString().split('T')[0];
            });

        const bookedDates = data2.data.days
            .filter(day => day.status === 'booked')
            .flatMap(day => {
                const blockRefs = day.blockRefs || [];
                return blockRefs.flatMap(blockRef => {
                    if (blockRef.reservation && blockRef.reservation.checkInDateLocalized && blockRef.reservation.checkOutDateLocalized) {
                        const checkInDate = new Date(blockRef.reservation.checkInDateLocalized);
                        const checkOutDate = new Date(blockRef.reservation.checkOutDateLocalized);
                        const dates = [];
                        let currentDate = new Date(checkInDate);
                        const endDate = new Date(checkOutDate);
                        while (currentDate <= endDate) {
                            currentDate.setHours(0, 0, 0, 0);
                            dates.push(currentDate.toISOString().split('T')[0]);
                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                        return dates;
                    }
                    return [];
                });
            });

        const allUnavailableDates = [...new Set([...unavailableDates, ...bookedDates])];

        const accommodates = data1.accommodates || 2;

        const accountTaxes = data1.accountTaxes || [];
        const localTax = accountTaxes.length > 0 ? accountTaxes[0].amount : 0;
        const cityTax = accountTaxes.length > 1 ? accountTaxes[1].amount : 0;

        const { prices, amenities, terms } = data1;
        const { weeklyPriceFactor, monthlyPriceFactor, cleaningFee } = prices;
        const minNights = terms.minNights || 2;

        const datePrices = data2.data.days.reduce((acc, day) => {
            acc[day.date] = Math.round(day.price);
            return acc;
        }, {});

        const managementFeePercentage = 5;

        const petFee = data3.find(fee => fee.type === 'PET')?.value || 0;

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                unavailableDates: allUnavailableDates,
                bookedDates,
                basePrice,
                weeklyPriceFactor,
                monthlyPriceFactor,
                cleaningFee,
                petFee,
                datePrices,
                accountTaxes,
                localTax,
                cityTax,
                accommodates,
                managementFeePercentage,
                amenities,
                minNights
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