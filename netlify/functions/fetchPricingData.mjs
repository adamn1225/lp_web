import fetch from 'node-fetch';

export const handler = async (event, context) => {
    const { listingId } = event.queryStringParameters;

    if (!listingId) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Missing required query parameter: listingId' })
        };
    }

    const apiUrl = `https://open-api.guesty.com/v1/listings/${listingId}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Extract only the necessary pricing data
        const pricingData = {
            monthlyPriceFactor: data.prices.monthlyPriceFactor,
            weeklyPriceFactor: data.prices.weeklyPriceFactor,
            currency: data.prices.currency,
            basePrice: data.prices.basePrice,
            weekendDays: data.prices.weekendDays,
            securityDepositFee: data.prices.securityDepositFee,
            guestsIncludedInRegularFee: data.prices.guestsIncludedInRegularFee,
            extraPersonFee: data.prices.extraPersonFee,
            cleaningFee: data.prices.cleaningFee,
            weekendBasePrice: data.prices.weekendBasePrice,
            petFee: data.prices.petFee
        };

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pricingData)
        };
    } catch (error) {
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