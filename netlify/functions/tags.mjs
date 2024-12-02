import fetch from 'node-fetch';

let lastRequestTime = 0;
const RATE_LIMIT_INTERVAL = 1000; // 1 second

export const handler = async (event, context) => {
    const { tags } = event.queryStringParameters || {};
    const apiUrl = tags
        ? `https://open-api.guesty.com/v1/listings?tags=${tags}&limit=100&skip=0`
        : 'https://open-api.guesty.com/v1/listings/tags';

    const currentTime = Date.now();
    // Comment out the rate limiting logic for testing
    // if (currentTime - lastRequestTime < RATE_LIMIT_INTERVAL) {
    //     return {
    //         statusCode: 429,
    //         headers: {
    //             'Access-Control-Allow-Origin': '*',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ error: 'Too many requests' })
    //     };
    // }

    lastRequestTime = currentTime;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Guesty API error: ${errorText}`);
            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: errorText })
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};